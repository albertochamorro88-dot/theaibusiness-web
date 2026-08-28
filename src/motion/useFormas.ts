"use client";

import { useEffect } from "react";
import { gsap, registerGsap } from "./gsap";

/* Radio de influencia del puntero, en px. */
const ALCANCE = 340;
/* Empuje en el centro del alcance, en px/s². */
const EMPUJE = 15000;
/* Rozamiento: cuanto conserva de su velocidad por fotograma a 60 fps. */
const ROCE = 0.9;
/* Tiron del muelle que la devuelve a su sitio. Flojo a proposito: el
   desplazamiento se equilibra donde `MUELLE * x` iguala al empuje, asi que un
   muelle duro convierte la huida en un temblor de treinta pixeles. Con este
   la pieza puede cruzarse media zona y vuelve sola, sin prisa. */
const MUELLE = 5.5;
/* Cuanto puede asomar por fuera de la caja, en fraccion de su tamano. */
const HOLGURA = 0.45;

type Pieza = {
  el: HTMLElement;
  /** Su sitio: el centro en reposo, en coordenadas de `.formes-w`. */
  cx: number;
  cy: number;
  ancho: number;
  alto: number;
  /** Desplazamiento actual respecto de su sitio, y su velocidad. */
  x: number;
  y: number;
  vx: number;
  vy: number;
};

/**
 * El collage huye del raton.
 *
 * No es un empuje por evento sino una simulacion: cada pieza lleva posicion y
 * velocidad propias y se integra en un bucle. El puntero la repele contra su
 * posicion ACTUAL, no contra su sitio — que es lo que lo convierte en una
 * persecucion de verdad: la pieza que ya se ha apartado sigue recibiendo
 * empuje mientras la sigas, y el desplazamiento se acumula hasta el borde de
 * la zona. Un muelle flojo la trae de vuelta cuando la dejas en paz.
 *
 * Cada pieza reacciona por su cuenta, y el recorte contra la caja de
 * `.formes-w` mantiene la huida dentro de esa parte de la pagina.
 */
export function useFormas(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const zona = document.querySelector<HTMLElement>(".formes-w");
    if (!zona) return;

    // En tactil no hay puntero al que huir.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const piezas: Pieza[] = [];

    const medir = () => {
      const caja = zona.getBoundingClientRect();
      const previo = new Map(piezas.map((p) => [p.el, p]));
      piezas.length = 0;
      zona.querySelectorAll<HTMLElement>(".forma, .letra").forEach((el) => {
        const antes = previo.get(el);
        const dx = antes?.x ?? 0;
        const dy = antes?.y ?? 0;
        const r = el.getBoundingClientRect();
        piezas.push({
          el,
          // Se descuenta el desplazamiento vivo: si no, remedir a mitad de una
          // huida tomaria la posicion desplazada como si fuera su sitio.
          cx: r.left - caja.left + r.width / 2 - dx,
          cy: r.top - caja.top + r.height / 2 - dy,
          ancho: r.width,
          alto: r.height,
          x: dx, y: dy,
          vx: antes?.vx ?? 0,
          vy: antes?.vy ?? 0,
        });
      });
    };

    medir();

    /* Las piezas son imagenes `lazy`: hasta que no cargan no tienen tamano
       propio, y entonces los centros salen desviados y el empuje se calcula
       contra un sitio que no es. */
    const imgs = [...zona.querySelectorAll<HTMLImageElement>("img")];
    const alCargar = () => medir();
    imgs.forEach((im) => { if (!im.complete) im.addEventListener("load", alCargar, { once: true }); });

    /* Puntero en coordenadas de la zona. */
    let px = 0, py = 0, cerca = false;

    const mover = (ev: PointerEvent) => {
      const caja = zona.getBoundingClientRect();
      px = ev.clientX - caja.left;
      py = ev.clientY - caja.top;
      // El alcance desborda la caja a proposito: acercarse por fuera ya empuja.
      cerca = px > -ALCANCE && px < caja.width + ALCANCE
           && py > -ALCANCE && py < caja.height + ALCANCE;
    };
    const alejarse = () => { cerca = false; };

    let raf = 0;
    let anterior = performance.now();

    const paso = (ahora: number) => {
      raf = requestAnimationFrame(paso);
      // Segundos reales, con tope para que volver de otra pestana no dispare
      // la integracion de golpe.
      const dt = Math.min((ahora - anterior) / 1000, 1 / 30);
      anterior = ahora;
      if (!piezas.length) return;

      const caja = zona.getBoundingClientRect();
      // Fuera de pantalla no hace falta simular.
      if (caja.bottom < -200 || caja.top > window.innerHeight + 200) return;

      piezas.forEach((p) => {
        if (cerca) {
          const dx = p.cx + p.x - px;
          const dy = p.cy + p.y - py;
          const dist = Math.hypot(dx, dy);
          if (dist < ALCANCE) {
            // Direccion estable aunque el puntero caiga justo en el centro.
            const ux = dist > 0.5 ? dx / dist : Math.cos(p.cx + p.cy);
            const uy = dist > 0.5 ? dy / dist : Math.sin(p.cx + p.cy);
            const f = (1 - dist / ALCANCE) ** 1.4 * EMPUJE;
            p.vx += ux * f * dt;
            p.vy += uy * f * dt;
          }
        }

        // Muelle de vuelta a su sitio, y rozamiento.
        p.vx -= p.x * MUELLE * dt;
        p.vy -= p.y * MUELLE * dt;
        const roce = ROCE ** (dt * 60);
        p.vx *= roce;
        p.vy *= roce;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        /* Recorte contra la caja. Exigir que la pieza entera siga dentro no
           vale: las que nacen pegadas a un borde no tendrian recorrido hacia
           ese lado. Se les deja asomar parte de su tamano, y al topar se frena
           esa componente para que no queden vibrando contra el limite. */
        const tope = (v: number, centro: number, tam: number, caben: number) => {
          const fuera = tam * HOLGURA;
          const min = -(centro - tam / 2 + fuera);
          const max = caben - centro - tam / 2 + fuera;
          return v < min ? min : v > max ? max : v;
        };
        const tx = tope(p.x, p.cx, p.ancho, caja.width);
        const ty = tope(p.y, p.cy, p.alto, caja.height);
        if (tx !== p.x) { p.x = tx; p.vx = 0; }
        if (ty !== p.y) { p.y = ty; p.vy = 0; }

        gsap.set(p.el, { x: p.x, y: p.y });
      });
    };

    window.addEventListener("pointermove", mover, { passive: true });
    window.addEventListener("pointerleave", alejarse);
    zona.addEventListener("pointerenter", medir);
    window.addEventListener("resize", medir);
    raf = requestAnimationFrame(paso);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerleave", alejarse);
      zona.removeEventListener("pointerenter", medir);
      window.removeEventListener("resize", medir);
      imgs.forEach((im) => im.removeEventListener("load", alCargar));
      gsap.set(piezas.map((p) => p.el), { clearProps: "x,y" });
    };
  }, [ready]);
}
