"use client";

import { useEffect } from "react";

/** Margen alrededor del viewport en el que un video ya se considera "en uso". */
const MARGEN = "200px 0px 200px 0px";

/**
 * Solo reproduce los videos que se estan viendo.
 *
 * La portada monta ocho videos y todos llevaban `autoplay`: el del hero, el del
 * manifiesto, los dos de la sala de juntas y los de las fichas de caso. Chrome
 * limita cuantos decodificadores de video puede tener a la vez, asi que a
 * partir de cierto punto los ultimos en pedir turno se quedan congelados en el
 * primer fotograma — que era justo lo que les pasaba a los casos — y los que si
 * decodifican se comen la CPU aunque esten a cuatro pantallas de distancia, que
 * es de donde venia el tiron al hacer scroll.
 *
 * Con esto solo hay decodificando lo que esta en pantalla: los casos vuelven a
 * moverse y el scroll deja de competir con siete decodificadores de fondo.
 */
export function useVideos(ready: boolean) {
  useEffect(() => {
    if (!ready) return;

    const videos = [...document.querySelectorAll<HTMLVideoElement>("video")];
    if (!videos.length) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) {
            // `play()` devuelve una promesa que rechaza si el elemento se sale
            // antes de arrancar; no es un error que haya que propagar.
            v.play().catch(() => {});
          } else if (!v.paused) {
            v.pause();
          }
        });
      },
      { rootMargin: MARGEN, threshold: 0 },
    );

    videos.forEach((v) => {
      // Sin esto el navegador se descarga los ocho a la vez nada mas entrar.
      if (!v.preload || v.preload === "auto") v.preload = "metadata";
      v.muted = true;
      v.playsInline = true;
      observador.observe(v);
    });

    return () => observador.disconnect();
  }, [ready]);
}
