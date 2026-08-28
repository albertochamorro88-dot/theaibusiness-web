"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, registerGsap } from "./gsap";

/**
 * The small interactions that give the site its texture:
 *  - `.link`      an underline that wipes in from the left and out to the right
 *  - `.btn.email` the "@" glyph pops to 1.2
 *  - `.btn`       the arrow shaft extends
 *  - `.footer-nothin-svg path` each letter of the wordmark reacts on its own
 */
export function useHoverFx(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const cleanups: Array<() => void> = [];

    /* ---- link underline ---- */
    document.querySelectorAll<HTMLElement>(".link").forEach((link) => {
      if (link.dataset.underlineInit === "1") return;
      link.dataset.underlineInit = "1";
      gsap.set(link, { position: "relative" });

      const bar = document.createElement("span");
      bar.className = "link-underline";
      bar.style.cssText = "position:absolute;bottom:-3px;left:0;width:0%;height:1px;background:currentColor;pointer-events:none";
      link.appendChild(bar);

      const tl = gsap.timeline({ paused: true });
      tl.fromTo(bar, { width: "0%", left: "0%" }, { width: "100%", left: "0%", duration: 0.6, ease: "power4.inOut" });
      tl.add("midway");
      tl.fromTo(bar, { width: "100%", left: "0%" }, { width: "0%", left: "100%", duration: 0.6, ease: "power4.inOut", immediateRender: false });

      const enter = () => tl.tweenFromTo(0, "midway");
      const leave = () => tl.play();
      link.addEventListener("mouseenter", enter);
      link.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        link.removeEventListener("mouseenter", enter);
        link.removeEventListener("mouseleave", leave);
        tl.kill();
        bar.remove();
        delete link.dataset.underlineInit;
      });
    });

    /* ---- "@" pop ---- */
    document.querySelectorAll<HTMLElement>(".btn.email").forEach((btn) => {
      const at = btn.querySelector<HTMLElement>(".arobase");
      if (!at) return;
      const enter = () => gsap.to(at, { scale: 1.2, duration: 0.2, ease: "power2.in", overwrite: "auto" });
      const leave = () => gsap.to(at, { scale: 1, duration: 0.2, ease: "power2.in", overwrite: "auto" });
      btn.addEventListener("mouseenter", enter);
      btn.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        btn.removeEventListener("mouseenter", enter);
        btn.removeEventListener("mouseleave", leave);
        gsap.killTweensOf(at);
      });
    });

    /* ---- arrow shaft ---- */
    document.querySelectorAll<HTMLElement>(".btn .arrow").forEach((arrow) => {
      const line = arrow.querySelector<HTMLElement>(".line-arrow");
      if (!line) return;
      const btn = arrow.closest<HTMLElement>(".btn");
      if (!btn) return;
      gsap.set(line, { transformOrigin: "0% 50%" });
      const enter = () => gsap.to(line, { scaleX: 1.6, duration: 0.35, ease: "power3.out", overwrite: "auto" });
      const leave = () => gsap.to(line, { scaleX: 1, duration: 0.35, ease: "power3.out", overwrite: "auto" });
      btn.addEventListener("mouseenter", enter);
      btn.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        btn.removeEventListener("mouseenter", enter);
        btn.removeEventListener("mouseleave", leave);
        gsap.killTweensOf(line);
      });
    });

    /* ---- logotipo del pie ----
       El original animaba letra a letra sobre un SVG; aquí la marca es un PNG,
       así que sube entera desde debajo del recorte del contenedor. */
    document.querySelectorAll<HTMLElement>(".footer-svg-w").forEach((wrap) => {
      const marca = wrap.querySelector<HTMLElement>("img");
      if (!marca) return;

      wrap.style.overflow = "hidden";
      gsap.set(marca, { yPercent: 120, autoAlpha: 1, transformOrigin: "50% 50%" });

      const reveal = ScrollTrigger.create({
        trigger: wrap,
        start: "top 95%",
        once: true,
        onEnter: () => {
          gsap.to(marca, {
            yPercent: 0, duration: 1.2, ease: "power4.inOut", delay: 0.2,
            onComplete: () => { wrap.style.overflow = "visible"; },
          });
        },
      });

      let ocupado = false;
      const enter = () => {
        if (ocupado) return;
        ocupado = true;
        gsap.timeline({ onComplete: () => { ocupado = false; } })
          .to(marca, { scale: 0.94, duration: 0.6, ease: "power2.inOut" })
          .to(marca, { scale: 1, duration: 1.8, ease: "elastic.out(1, 0.8)" });
      };
      marca.addEventListener("mouseenter", enter);

      cleanups.push(() => {
        reveal.kill();
        marca.removeEventListener("mouseenter", enter);
        gsap.killTweensOf(marca);
      });
    });

    ScrollTrigger.refresh();
    return () => cleanups.forEach((fn) => fn());
  }, [ready]);
}
