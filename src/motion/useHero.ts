"use client";

import { useEffect } from "react";
import { FluidReveal } from "./fluid";

/**
 * Arranca el hero: la simulación de fluidos sobre `.section-w` usando el
 * logotipo oficial como capa base. Al mover el cursor, la placa blanca se
 * disuelve y deja ver el degradado de marca que corre por debajo.
 */
export function useHero(ready: boolean) {
  useEffect(() => {
    if (!ready) return;

    const container = document.querySelector<HTMLElement>(".section-w");
    if (!container) return;

    const fondo = container.querySelector<HTMLVideoElement>(".video-hero-bg");
    if (fondo) {
      fondo.muted = true;
      fondo.defaultMuted = true;
      fondo.playsInline = true;
      fondo.setAttribute("playsinline", "");
      fondo.setAttribute("muted", "");
      const play = () => fondo.play()?.catch(() => {});
      play();
      fondo.addEventListener("loadeddata", play, { once: true });
      fondo.addEventListener("canplay", play, { once: true });
    }

    let fluido: FluidReveal | null = null;
    let cancelado = false;

    const arrancar = async () => {
      if (cancelado) return;
      const marca = container.querySelector<HTMLImageElement>(".marca-hero");
      try {
        /* El trazo del original es fino porque su placa es un logotipo
           estrecho; aqui la marca ocupa el hero entero y el pincel se queda
           corto. `splatRadius` es el denominador de la gaussiana del shader,
           asi que el radio va con su raiz: 6e-5 -> 3e-4 son 2,2 veces mas
           ancho. La fuerza sube en la misma proporcion para que la estela
           siga abriendose igual de lejos y no quede un trazo gordo y corto. */
        fluido = new FluidReveal(container, { splatRadius: 3e-4, splatForce: 8800 });
        await fluido.setLayers({ base: marca, baseBg: "#FFFFFF", reveal: "rgba(0,0,0,0)" });
        // El logotipo ya vive en el canvas; retiramos la copia del DOM.
        const placa = container.querySelector<HTMLElement>(".section.hero-home");
        if (placa) placa.style.visibility = "hidden";
      } catch {
        // Sin WebGL se queda la placa con el logotipo, que sigue siendo legible.
        fluido = null;
      }
    };

    // Esperamos a que el PNG del logotipo esté decodificado antes de rasterizarlo.
    const marca = container.querySelector<HTMLImageElement>(".marca-hero");
    const listo = marca && !marca.complete
      ? new Promise<void>((res) => {
          marca.addEventListener("load", () => res(), { once: true });
          marca.addEventListener("error", () => res(), { once: true });
        })
      : Promise.resolve();

    /* El solver solo corre mientras el hero se ve. Es lo mas caro de la
       pagina — veinte iteraciones de presion por fotograma — y dejandolo vivo
       le quitaba fotogramas al scroll durante el resto del recorrido. */
    const vigia = new IntersectionObserver(
      ([e]) => fluido?.setActivo(e.isIntersecting),
      { threshold: 0 },
    );

    listo.then(() => requestAnimationFrame(() => requestAnimationFrame(async () => {
      await arrancar();
      if (!cancelado && fluido) vigia.observe(container);
    })));

    return () => {
      cancelado = true;
      vigia.disconnect();
      fluido?.destroy();
      const placa = container.querySelector<HTMLElement>(".section.hero-home");
      if (placa) placa.style.visibility = "";
    };
  }, [ready]);
}
