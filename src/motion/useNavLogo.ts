"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, registerGsap } from "./gsap";

/**
 * La marca de la nav.
 *
 * Está oculta sobre el hero y aparece al bajar un 10% de la altura de
 * ventana. En reposo se lee solo el símbolo AI; al pasar el cursor se abre
 * hasta el logotipo completo y al salir vuelve a cerrarse.
 */
export function useNavLogo(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const wrap = document.querySelector<HTMLElement>(".nav-logo-wrap");
    const marca = wrap?.querySelector<HTMLElement>(".nav-marca");
    const completo = wrap?.querySelector<HTMLElement>(".nav-logo-completo");
    if (!wrap || !marca || !completo) return;

    gsap.set(marca, { autoAlpha: 1 });
    gsap.set(completo, { autoAlpha: 0, clipPath: "inset(0% 100% 0% 0%)" });
    gsap.set(wrap, { width: "2.4rem" });

    let abierto = false;
    const abrir = () => {
      if (abierto) return;
      abierto = true;
      gsap.to(wrap, { width: "13rem", duration: 0.7, ease: "power4.inOut", overwrite: "auto" });
      gsap.to(marca, { autoAlpha: 0, duration: 0.25, ease: "power2.out", overwrite: "auto" });
      gsap.to(completo, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power4.inOut", overwrite: "auto" });
    };
    const cerrar = () => {
      if (!abierto) return;
      abierto = false;
      gsap.to(wrap, { width: "2.4rem", duration: 0.7, ease: "power4.inOut", overwrite: "auto" });
      gsap.to(completo, { autoAlpha: 0, clipPath: "inset(0% 100% 0% 0%)", duration: 0.5, ease: "power4.inOut", overwrite: "auto" });
      gsap.to(marca, { autoAlpha: 1, duration: 0.3, delay: 0.15, ease: "power2.out", overwrite: "auto" });
    };

    const conHover = !window.matchMedia("(max-width: 991px)").matches;
    if (conHover) {
      wrap.addEventListener("mouseenter", abrir);
      wrap.addEventListener("mouseleave", cerrar);
    }

    /* Oculta sobre el hero, visible a partir del 10% de scroll. */
    gsap.set(wrap, { autoAlpha: 0 });
    let visible = false;
    const actualizar = () => {
      const siguiente = (window.scrollY || 0) >= window.innerHeight * 0.1;
      if (siguiente === visible) return;
      visible = siguiente;
      gsap.to(wrap, {
        autoAlpha: siguiente ? 1 : 0,
        duration: siguiente ? 0.4 : 0.3,
        ease: siguiente ? "power2.out" : "power2.in",
      });
    };
    const trigger = ScrollTrigger.create({
      start: () => window.innerHeight * 0.1,
      end: () => ScrollTrigger.maxScroll(window) + window.innerHeight,
      onToggle: actualizar,
      onRefresh: actualizar,
    });
    actualizar();

    return () => {
      wrap.removeEventListener("mouseenter", abrir);
      wrap.removeEventListener("mouseleave", cerrar);
      trigger.kill();
    };
  }, [ready]);
}
