"use client";

import { useEffect } from "react";
import { gsap, registerGsap } from "./gsap";

/**
 * Nav menu. On desktop `.menu-links-w` expands while the pointer is over the
 * button or the panel; on tablet and below the button toggles the full-screen
 * `.menu_wrapper` and rotates the four dots of the icon into a cross.
 */
export function useMenu(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const menu = document.querySelector<HTMLElement>(".menu-w");
    if (!menu) return;

    const btn = menu.querySelector<HTMLElement>(".menu-btn");
    const links = menu.querySelector<HTMLElement>(".menu-links-w");
    const svg = btn?.querySelector<SVGElement>(".menu-svg");
    const rects = svg ? [...svg.querySelectorAll<SVGRectElement>("rect")] : [];
    const wrapper = document.querySelector<HTMLElement>(".menu_wrapper");
    if (!btn || !links) return;

    const isDesktop = window.matchMedia("(min-width: 992px)").matches;
    const cleanups: Array<() => void> = [];

    if (isDesktop) {
      const items = [...links.querySelectorAll<HTMLElement>(".link-boiler")];
      gsap.set(links, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(items, { yPercent: 40, autoAlpha: 0 });

      let open = false;
      const show = () => {
        if (open) return;
        open = true;
        gsap.to(links, { autoAlpha: 1, pointerEvents: "auto", duration: 0.3, ease: "power2.out", overwrite: "auto" });
        gsap.to(items, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power4.out", stagger: 0.05, overwrite: "auto" });
      };
      const hide = () => {
        if (!open) return;
        open = false;
        gsap.to(items, { yPercent: 40, autoAlpha: 0, duration: 0.3, ease: "power3.in", stagger: { each: 0.04, from: "end" }, overwrite: "auto" });
        gsap.to(links, { autoAlpha: 0, pointerEvents: "none", duration: 0.3, delay: 0.1, ease: "power2.in", overwrite: "auto" });
      };

      [btn, links].forEach((el) => {
        el.addEventListener("mouseenter", show);
        el.addEventListener("mouseleave", hide);
        cleanups.push(() => {
          el.removeEventListener("mouseenter", show);
          el.removeEventListener("mouseleave", hide);
        });
      });

      links.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", hide);
        cleanups.push(() => a.removeEventListener("click", hide));
      });
    } else if (wrapper) {
      const label = btn.querySelector<HTMLElement>(".menu-btn-text");
      gsap.set(wrapper, { autoAlpha: 0, pointerEvents: "none" });

      let open = false;
      const close = () => {
        if (!open) return;
        open = false;
        if (label) label.textContent = "menu";
        gsap.to(wrapper, { autoAlpha: 0, pointerEvents: "none", duration: 0.5, ease: "power4.inOut" });
        if (rects.length === 4) {
          gsap.to(rects, { rotation: 0, x: 0, y: 0, duration: 0.5, ease: "power4.inOut", transformOrigin: "50% 50%" });
        }
        document.documentElement.style.overflow = "";
      };
      const toggle = () => {
        if (open) return close();
        open = true;
        if (label) label.textContent = "close";
        gsap.to(wrapper, { autoAlpha: 1, pointerEvents: "auto", duration: 0.5, ease: "power4.inOut" });
        if (rects.length === 4) {
          gsap.to(rects, { rotation: 45, duration: 0.5, ease: "power4.inOut", transformOrigin: "50% 50%" });
        }
        document.documentElement.style.overflow = "hidden";
      };

      btn.addEventListener("click", toggle);
      cleanups.push(() => { btn.removeEventListener("click", toggle); document.documentElement.style.overflow = ""; });

      wrapper.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", close);
        cleanups.push(() => a.removeEventListener("click", close));
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, [ready]);
}
