"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, registerGsap } from "./gsap";

/** Lo que tarda una cifra en subir hasta su valor. */
const CONTEO = 1.4;
/** Retardo entre una cifra y la siguiente. */
const ESCALON = 0.12;

/**
 * Descompone "+2,1 M€" en signo, numero y cola.
 *
 * Se anima solo el numero: el signo y la unidad son fijos, y verlos parpadear
 * mientras sube el contador queda sucio. El separador decimal es la coma, asi
 * que hay que cambiarlo por punto para parsear y devolverlo al pintar.
 */
const trocear = (texto: string) => {
  const m = texto.match(/^([+−-]?)\s*([\d.,]+)(.*)$/);
  if (!m) return null;
  const [, signo, numero, cola] = m;
  const decimales = numero.includes(",") ? numero.split(",")[1].length : 0;
  const valor = parseFloat(numero.replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(valor)) return null;
  // Los miles se separan con punto en espanol; solo hacen falta a partir de 10.000.
  const miles = numero.includes(".");
  return { signo, valor, decimales, cola, miles };
};

const pintar = (n: number, decimales: number, miles: boolean) =>
  n.toLocaleString("es-ES", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
    useGrouping: miles,
  });

/**
 * Las cifras de la ficha suben al entrar en pantalla.
 *
 * Sin esto el bloque de resultados —que es la prueba que sostiene el caso—
 * aparecia igual que un parrafo cualquiera. Cada cifra entra desde abajo y
 * cuenta hasta su valor, escalonada con la anterior.
 *
 * Con `prefers-reduced-motion` se pinta el valor final y no se anima nada, que
 * es lo que pide el checklist de lanzamiento.
 */
export function useCifras(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const datos = [...document.querySelectorAll<HTMLElement>(".caso-cifra-dato")];
    if (!datos.length) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* El valor se lee de `data-cifra`, NO del texto del elemento. El contador
       reescribe ese texto, y en desarrollo React monta el efecto dos veces: la
       segunda pasada parseaba el "0" que habia dejado la primera y todas las
       cifras se quedaban a cero. */
    const piezas = datos.map((el) => ({ el, t: trocear(el.dataset.cifra ?? el.textContent ?? "") }));

    if (quieto) {
      piezas.forEach(({ el }) => gsap.set(el, { autoAlpha: 1 }));
      return;
    }

    // El valor de partida se escribe ya, antes del primer fotograma: si se
    // deja el texto final puesto se lee un instante y luego salta a cero.
    piezas.forEach(({ el, t }) => {
      if (t) el.textContent = `${t.signo}${pintar(0, t.decimales, t.miles)}${t.cola}`;
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: datos[0].closest(".caso-cifras"), start: "top 78%", once: true },
      });

      piezas.forEach(({ el, t }, i) => {
        const cuando = i * ESCALON;
        tl.fromTo(el.parentElement ?? el,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, cuando);

        if (!t) return;
        const contador = { n: 0 };
        tl.to(contador, {
          n: t.valor,
          duration: CONTEO,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${t.signo}${pintar(contador.n, t.decimales, t.miles)}${t.cola}`;
          },
        }, cuando);
      });
    });

    return () => {
      ctx.revert();
      // `revert` deshace los estilos, pero el texto lo escribimos nosotros.
      piezas.forEach(({ el }) => { if (el.dataset.cifra) el.textContent = el.dataset.cifra; });
      ScrollTrigger.refresh();
    };
  }, [ready]);
}
