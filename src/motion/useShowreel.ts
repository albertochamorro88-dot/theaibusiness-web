"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, registerGsap } from "./gsap";

/** Cuanto encoge el video al final del recorrido. */
const ESCALA_FINAL = 0.46;
/** Redondeo de la ficha ya encogida, en rem. */
const RADIO = 0.375;

/**
 * El video del manifiesto se retira a una esquina.
 *
 * Entra a sangre, ocupando el bloque entero, y segun se recorre la seccion se
 * encoge hacia abajo a la derecha hasta quedarse en una ficha. El anclaje es
 * `transform-origin: 100% 100%`, que es lo que hace que se retire en diagonal
 * en vez de menguar por el centro, y deja libre la mitad izquierda para el
 * texto de apoyo, que hasta entonces se leia encima del video.
 *
 * Va con `scrub`, no con una duracion: el movimiento lo marca el scroll.
 */
export function useShowreel(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const seccion = document.querySelector<HTMLElement>(".section.showreel");
    const bloque = seccion?.querySelector<HTMLElement>(".video-showreel-w");
    const caja = seccion?.querySelector<HTMLElement>(".video-showreel-full-w");
    const texto = seccion?.querySelector<HTMLElement>(".video-showreel-flip");
    if (!seccion || !bloque || !caja) return;

    // Por debajo de 992px la seccion se apila en vertical y el texto ya va
    // debajo del video: no hay esquina a la que retirarse.
    if (!window.matchMedia("(min-width: 992px)").matches) return;

    const triggers: ScrollTrigger[] = [];

    const encoge = gsap.fromTo(caja,
      { scale: 1, borderRadius: 0 },
      {
        scale: ESCALA_FINAL,
        borderRadius: `${RADIO}rem`,
        ease: "none",
        transformOrigin: "100% 100%",
        scrollTrigger: {
          /* Se ancla el bloque mientras dura el encogido. Sin `pin` el video
             se encoge, si, pero a la vez sube con el scroll y se ha ido de la
             pantalla antes de que el texto llegue a su sitio: se veia el final
             del movimiento con el hueco de la izquierda ya vacio. Anclado, los
             dos se quedan quietos y lo unico que se mueve es el encogido. */
          trigger: bloque,
          start: "top top",
          end: "+=110%",
          pin: bloque,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
          /* Este `pin` mete ~765 px de espaciador en mitad de la pagina, asi
             que todo lo que va por debajo se desplaza. GSAP refresca los
             ScrollTrigger por `refreshPriority` de mayor a menor, y la sala de
             juntas — que tambien lleva pin — esta en 1: sin declarar nada aqui
             se quedaba en 0 y calculaba sus marcas ANTES de que este espaciador
             existiera, con lo que su zoom arrancaba desplazado y llegaba al
             final a un cuarto del recorrido. Al ir este primero, el de abajo
             mide ya sobre la pagina definitiva. */
          refreshPriority: 2,
        },
      },
    );
    if (encoge.scrollTrigger) triggers.push(encoge.scrollTrigger);

    /* El texto espera a que el video le haya dejado sitio. Sin esto se lee
       sobre el video durante la primera mitad del recorrido. */
    if (texto) {
      const aparece = gsap.fromTo(texto,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1, y: 0, ease: "power2.out",
          scrollTrigger: {
            trigger: bloque,
            start: "top top",
            end: "+=55%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        },
      );
      if (aparece.scrollTrigger) triggers.push(aparece.scrollTrigger);
    }

    return () => {
      triggers.forEach((t) => { t.animation?.kill(); t.kill(true); });
      gsap.set([caja, texto].filter(Boolean) as HTMLElement[], { clearProps: "all" });
    };
  }, [ready]);
}
