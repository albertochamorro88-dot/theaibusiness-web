"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, registerGsap } from "./gsap";

/**
 * Generic `[parallax]` engine, ported from the original bundle.
 *
 *   parallax-y      translate on Y   (default -60)
 *   parallax-x      translate on X   (default 0)
 *   parallax-scrub  scrub value      (default 1.5)
 *
 * A nested `[parallax-img]` gets a second, slower tween of its own; its wrapper
 * is clipped and the image over-sized to 110% so the movement never reveals an edge.
 */
export function useParallax(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const triggers: ScrollTrigger[] = [];
    const num = (el: Element, attr: string, fallback: number) =>
      parseFloat(el.getAttribute(attr) ?? "") || fallback;

    document.querySelectorAll<HTMLElement>("[parallax]").forEach((el) => {
      const y = num(el, "parallax-y", -60);
      const x = num(el, "parallax-x", 0);
      const scrub = num(el, "parallax-scrub", 1.5);
      const st = { trigger: el, start: "top bottom", end: "bottom top", scrub };

      const outer = gsap.fromTo(el, { y: 0, x: 0 }, { y, x, ease: "none", scrollTrigger: st });
      if (outer.scrollTrigger) triggers.push(outer.scrollTrigger);

      const marked = el.querySelector<HTMLElement>("[parallax-img]");
      if (!marked) return;

      let img: HTMLImageElement | null;
      let wrapper: HTMLElement | null;
      if (marked.tagName === "IMG") {
        img = marked as HTMLImageElement;
        wrapper = marked.parentElement;
      } else {
        wrapper = marked;
        img = marked.querySelector("img");
      }
      if (!img) return;

      const imgY = num(marked, "parallax-img-y", -10);
      const imgScrub = num(marked, "parallax-img-scrub", 3);
      if (wrapper) gsap.set(wrapper, { overflow: "hidden" });
      gsap.set(img, { height: "110%", width: "100%", objectFit: "cover", top: 0 });

      const inner = gsap.fromTo(
        img,
        { yPercent: 0 },
        { yPercent: imgY, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: imgScrub } },
      );
      if (inner.scrollTrigger) triggers.push(inner.scrollTrigger);
    });

    return () => {
      triggers.forEach((t) => { t.animation?.kill(); t.kill(true); });
    };
  }, [ready]);
}
