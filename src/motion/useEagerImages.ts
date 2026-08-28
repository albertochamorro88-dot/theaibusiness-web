"use client";

import { useEffect } from "react";
import { ScrollTrigger, registerGsap } from "./gsap";

/**
 * Webflow ships every image as `loading="lazy"`. An unloaded lazy image
 * measures 0px tall, which collapses the sections that are sized by their
 * imagery — the glitch section ends up with no height at all and every
 * ScrollTrigger below it lands in the wrong place.
 *
 * The original bundle handles this by flipping them all to eager and then
 * refreshing ScrollTrigger as they land; this does the same.
 */
export function useEagerImages(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    let pending: number | undefined;
    const refresh = () => {
      window.clearTimeout(pending);
      pending = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };

    const images = [...document.querySelectorAll<HTMLImageElement>("img")];
    images.forEach((img) => {
      if (img.loading === "lazy") img.loading = "eager";
      if (!img.complete) {
        img.addEventListener("load", refresh, { once: true });
        img.addEventListener("error", refresh, { once: true });
      }
    });

    document.querySelectorAll<HTMLVideoElement>("video").forEach((v) => {
      if (v.readyState < 1) v.addEventListener("loadedmetadata", refresh, { once: true });
    });

    document.fonts.ready.then(refresh);
    requestAnimationFrame(() => requestAnimationFrame(refresh));

    return () => window.clearTimeout(pending);
  }, [ready]);
}
