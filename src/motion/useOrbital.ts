"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText, registerGsap } from "./gsap";

/**
 * Los movimientos de la direccion orbital.
 *
 * Los numeros no son inventados: salen de muestrear la referencia en 21
 * posiciones de scroll y comparar el mismo elemento entre muestras. La galeria
 * ocupa 4500 px de scroll dentro de una seccion clavada, sus piezas recorren
 * hasta 1566 px en horizontal escalando al doble, el bloque de contacto va a
 * 13-15 % y la foto al 5,57 %.
 */

const reducido = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------- galeria orbital */

/**
 * Las piezas giran sobre una elipse mientras la seccion esta clavada.
 *
 * Elipse y no circulo: una pantalla es mas ancha que alta, y sobre un circulo
 * las piezas de arriba y abajo se salian mientras sobraba sitio a los lados.
 *
 * La que pasa por delante —la que esta mas abajo en la elipse— crece hasta el
 * doble y sube al frente. Ese cambio de tamano es lo que convierte la rotacion
 * en una secuencia con protagonista, en vez de un carrusel que da vueltas.
 *
 * Por debajo de 992 px no se clava nada: robar 4500 px de scroll en un movil es
 * secuestrar la pagina.
 */
export function useOrbita(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const seccion = document.querySelector<HTMLElement>(".orb-galeria");
    const pista = document.querySelector<HTMLElement>(".orb-pista");
    if (!seccion || !pista) return;

    const piezas = [...pista.querySelectorAll<HTMLElement>(".orb-pieza")];
    if (!piezas.length) return;

    if (window.matchMedia("(max-width: 992px)").matches || reducido()) {
      piezas.forEach((p) => { p.style.position = "relative"; p.style.transform = "none"; });
      seccion.classList.add("orb-plana");
      return;
    }

    const N = piezas.length;
    const RX = () => Math.min(window.innerWidth * 0.34, 560);
    const RY = () => Math.min(window.innerHeight * 0.30, 300);

    /* `colocar` se llama en cada cuadro con el avance del scroll (0 a 1). El
       angulo de cada pieza es su reparto en la elipse mas el giro acumulado. */
    const colocar = (avance: number) => {
      const rx = RX(), ry = RY();
      piezas.forEach((p, i) => {
        const a = (i / N) * Math.PI * 2 + avance * Math.PI * 2;
        const x = Math.cos(a - Math.PI / 2) * rx;
        const y = Math.sin(a - Math.PI / 2) * ry;
        /* `frente` vale 1 cuando la pieza esta en la parte baja de la elipse,
           que es la que se lee como "delante". */
        const frente = (Math.sin(a - Math.PI / 2) + 1) / 2;
        const escala = 0.62 + frente * 1.38;          // hasta 2,0 — medido
        p.style.transform =
          `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${escala.toFixed(3)})`;
        p.style.zIndex = String(Math.round(frente * 100));
        p.style.opacity = (0.35 + frente * 0.65).toFixed(3);
      });
    };
    colocar(0);

    const st = ScrollTrigger.create({
      trigger: seccion,
      start: "top top",
      end: "+=4500",              // medido sobre la referencia
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      refreshPriority: 2,
      onUpdate: (self) => colocar(self.progress),
    });

    const remedir = () => colocar(st.progress);
    window.addEventListener("resize", remedir);

    return () => { st.kill(); window.removeEventListener("resize", remedir); };
  }, [ready]);
}

/* ------------------------------------------------------------------ paralaje */

/** Recorrido en porcentaje de la propia altura. Valor por elemento. */
export function useParalajeOrb(ready: boolean) {
  useEffect(() => {
    if (!ready || reducido()) return;
    registerGsap();
    const piezas = [...document.querySelectorAll<HTMLElement>("[data-orb-par]")];
    const tw = piezas.map((el) => {
      const pct = Number(el.dataset.orbPar) || 13;
      return gsap.fromTo(el, { yPercent: pct }, {
        yPercent: -pct, ease: "none",
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: "top bottom", end: "bottom top",
          scrub: true, invalidateOnRefresh: true,
        },
      });
    });
    return () => { tw.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); }); };
  }, [ready]);
}

/* --------------------------------------------------- marquesina por scroll */

/**
 * El titular que se desplaza en horizontal segun se baja.
 *
 * Atado al scroll, no a un reloj: en la referencia recorre 1584 px y se detiene
 * si el lector se detiene. Es la diferencia con una cinta normal, y se nota:
 * esta obedece, la otra desfila sola.
 */
export function useCintaScroll(ready: boolean) {
  useEffect(() => {
    if (!ready || reducido()) return;
    registerGsap();
    const piezas = [...document.querySelectorAll<HTMLElement>("[data-orb-cinta]")];
    const tw = piezas.map((el) => {
      const d = Number(el.dataset.orbCinta) || 1584;   // medido
      return gsap.fromTo(el, { x: d / 2 }, {
        x: -d / 2, ease: "none",
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: "top bottom", end: "bottom top",
          scrub: true, invalidateOnRefresh: true,
        },
      });
    });
    return () => { tw.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); }); };
  }, [ready]);
}

/* ---------------------------------------------------------------- tapado */

/**
 * La seccion siguiente sube y tapa al encabezado.
 *
 * El encabezado se queda pegado arriba y la seccion de debajo, que va en una
 * capa superior con fondo propio, se le echa encima. No hay que mover nada: lo
 * hace `position:sticky` con el orden de capas. Lo que si se anima es la
 * despedida —el encabezado se aleja un poco y se apaga mientras lo cubren—,
 * porque sin eso parece que la pagina se ha roto y hay dos cosas superpuestas.
 *
 * Se anima el CONTENIDO del encabezado, no el encabezado entero: escalar el
 * contenedor escalaria tambien el lienzo WebGL, que tiene su propia resolucion
 * y saldria borroso.
 */
export function useTapado(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const hero = document.querySelector<HTMLElement>(".orb-hero");
    const tapa = document.querySelector<HTMLElement>(".orb-premisa");
    if (!hero || !tapa) return;
    if (reducido()) return;

    const dentro = hero.querySelectorAll<HTMLElement>(".orb-lienzo, .orb-hero-copy, .orb-hero-pie");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: tapa,
        start: "top bottom",
        end: "top top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    /* El encabezado RETROCEDE, no desaparece. Apagarlo a 0,35 contra una tapa
       del mismo negro dejaba nada que ver siendo cubierto: parecia una pagina
       oscura con una franja arriba. Se queda al 0,7 y se aleja un poco, que es
       lo que da la sensacion de profundidad. */
    tl.to(dentro, { scale: 0.94, yPercent: -6, opacity: 0.7, ease: "none" }, 0);

    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, [ready]);
}

/* ---------------------------------------------------------------- letras */

/**
 * Los titulares entran letra a letra desde debajo de su linea.
 *
 * Cada linea se envuelve en una mascara con `overflow:hidden` y las letras
 * suben desde fuera: el texto no aparece, ASOMA. Es la diferencia entre un
 * fundido y un movimiento, y es de donde sale el impacto.
 *
 * Entrada de una vez (`once`) en lugar de atada al scroll con `scrub`: un
 * titular que se rehace cada vez que pasas por delante cansa, y a media
 * animacion se lee a medias. Aqui el scroll DISPARA, no gobierna.
 *
 * `revert()` al desmontar: sin eso, cada remontaje volvia a partir un texto ya
 * partido y las letras se anidaban unas dentro de otras.
 */
export function useLetras(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const dianas = [...document.querySelectorAll<HTMLElement>("[data-letras]")];
    if (!dianas.length) return;

    if (reducido()) {
      dianas.forEach((el) => { el.style.opacity = "1"; });
      return;
    }

    const partidos: SplitText[] = [];
    const tweens: gsap.core.Tween[] = [];

    dianas.forEach((el) => {
      el.style.opacity = "1";
      const sp = new SplitText(el, {
        type: "lines,chars",
        linesClass: "orb-linea",
      });
      partidos.push(sp);
      tweens.push(
        gsap.from(sp.chars, {
          yPercent: 118,
          duration: 0.85,
          ease: "power3.out",
          stagger: { each: 0.014, from: "start" },
          scrollTrigger: {
            trigger: el,
            start: "top 84%",
            once: true,
          },
        }),
      );
    });

    return () => {
      tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
      partidos.forEach((sp) => sp.revert());
    };
  }, [ready]);
}
