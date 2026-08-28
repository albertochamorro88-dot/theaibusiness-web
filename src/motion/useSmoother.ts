"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { ScrollTrigger, registerGsap } from "./gsap";
import { HERO_REVEALED } from "./useLoader";

/**
 * Smooth scrolling, matching the original exactly.
 *
 * The site uses **Lenis**, not ScrollSmoother — which matters structurally:
 * Lenis drives the real window scroll, so `position: sticky` (the works
 * wordmark, the glitch text) and ScrollTrigger pinning keep working. A
 * ScrollSmoother-style transformed wrapper would break both.
 *
 * Config lifted from the bundle: duration 1.2 with an exponential-out easing,
 * vertical only, no touch smoothing.
 */
export function useSmoother(enabled: boolean) {
  const ref = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) return;
    registerGsap();

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 2,
    });
    ref.current = lenis;

    // Keep ScrollTrigger in step with Lenis rather than the native scroll event.
    lenis.on("scroll", ScrollTrigger.update);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Held still until the loader has finished uncovering the hero.
    const start = () => { lenis.start(); ScrollTrigger.refresh(); };

    if ((window as unknown as Record<string, boolean>)[HERO_REVEALED]) {
      // El loader ya termino antes de que montaramos: arrancar sin esperar el
      // evento, que ya se emitio y no se va a repetir.
      ScrollTrigger.refresh();
    } else {
      lenis.stop();
      window.scrollTo(0, 0);
      window.addEventListener("loader:hero-revealed", start);
    }

    /* Con una ventana de caso abierta el fondo no debe moverse. `overflow:
       hidden` en el documento no basta: Lenis intercepta la rueda y sigue
       desplazando por su cuenta, asi que hay que pararlo a el. */
    const parar = () => lenis.stop();
    const seguir = () => lenis.start();
    window.addEventListener("ventana:abierta", parar);
    window.addEventListener("ventana:cerrada", seguir);

    return () => {
      window.removeEventListener("ventana:abierta", parar);
      window.removeEventListener("ventana:cerrada", seguir);
      window.removeEventListener("loader:hero-revealed", start);
      cancelAnimationFrame(raf);
      lenis.destroy();
      ref.current = null;
    };
  }, [enabled]);

  return ref;
}
