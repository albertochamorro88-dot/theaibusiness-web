"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, registerGsap } from "./gsap";

/* Exact values read out of the original bundle. */
const VIDEO_SCALE_FROM = 1.4;
// Reencuadrado sobre la nueva sala: 0.35 dejaba la pantalla flotando pequena
// en mitad del panel negro; 0.44 la asienta dentro del muro con margen.
const VIDEO_SCALE_TO = 0.40;
const VIDEO_SCRUB = 1;
const BG_SCALE_FROM = 1.8;
const BG_SCALE_TO = 1;
const BG_SCRUB = 1;
const SOUND_FADE = 0.35;

/**
 * The museum shot: `.musee-w` pins, and as you scroll the screen retreats into
 * the room — the video scales 1.4 -> 0.35 while the room itself relaxes 1.8 -> 1.
 * Desktop only; on smaller screens the section just plays inline.
 */
export function useMusee(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const wrappers = [...document.querySelectorAll<HTMLElement>(".musee-w")];
    if (!wrappers.length) return;

    const isDesktop = window.matchMedia("(min-width: 992px)").matches;
    const triggers: ScrollTrigger[] = [];
    const cleanups: Array<() => void> = [];

    wrappers.forEach((wrap) => {
      const videoWrap = wrap.querySelector<HTMLElement>(".video-w");
      if (!videoWrap) return;
      const bg = wrap.querySelector<HTMLElement>(".musee-bg");
      const section = wrap.closest<HTMLElement>(".section") ?? wrap.parentElement;
      const soundBtn = wrap.querySelector<HTMLElement>(".btn-sound") ?? section?.querySelector<HTMLElement>(".btn-sound") ?? null;
      const tick = soundBtn?.querySelector<HTMLElement>(".tick-sound") ?? null;

      const videos = [...videoWrap.querySelectorAll("video")];
      // Seed a frame so the first paint is never a black box.
      videos.forEach((v) => {
        try {
          v.pause();
          if (v.readyState >= 1) v.currentTime = 0.001;
          else {
            if (v.networkState !== HTMLMediaElement.NETWORK_LOADING) v.load();
            v.addEventListener("loadedmetadata", () => { try { v.currentTime = 0.001; } catch {} }, { once: true });
          }
        } catch {}
      });

      /* ---- el reflejo del suelo va pegado a la pantalla ---- */
      /* Son dos elementos `<video>` distintos con el mismo metraje, y cada uno
         arranca a decodificar cuando le toca: sin ataduras se separan medio
         segundo largo y el reflejo va enseñando un fotograma que en la pantalla
         ya ha pasado. Se le lleva el tiempo del principal, corrigiendo solo
         cuando la deriva se nota — reasignar `currentTime` en cada fotograma
         obliga a un salto de decodificacion y da tirones. */
      const pantalla = videoWrap.querySelector<HTMLVideoElement>(".video-sticky");
      const reflejo = videoWrap.querySelector<HTMLVideoElement>(".video-reflet");
      let sync = 0;

      if (pantalla && reflejo) {
        const DERIVA = 0.08; // segundos que se toleran antes de recolocar
        const seguir = () => {
          sync = requestAnimationFrame(seguir);
          if (pantalla.paused || pantalla.readyState < 2 || reflejo.readyState < 1) return;
          if (Math.abs(reflejo.currentTime - pantalla.currentTime) > DERIVA) {
            reflejo.currentTime = pantalla.currentTime;
          }
          // Que uno se pare por lo que sea no debe dejar al otro corriendo.
          if (reflejo.paused) reflejo.play()?.catch(() => {});
        };
        sync = requestAnimationFrame(seguir);
        cleanups.push(() => cancelAnimationFrame(sync));
      }

      /* ---- sound toggle: cross-fade volume rather than hard-cutting ---- */
      const audible = videos.find((v) => v.classList.contains("video-sticky")) ?? videos[0];
      let on = false;
      let fade: gsap.core.Tween | null = null;

      const setSound = (next: boolean, delay = 0) => {
        if (!audible) return;
        fade?.kill();
        if (next) {
          audible.muted = false;
          audible.volume = 0;
          audible.play()?.catch(() => {});
          fade = gsap.to(audible, { volume: 1, duration: SOUND_FADE, delay, ease: "power1.out" });
        } else {
          fade = gsap.to(audible, {
            volume: 0, duration: SOUND_FADE, delay, ease: "power1.out",
            onComplete: () => { try { audible.muted = true; audible.volume = 1; } catch {} },
          });
        }
      };

      const toggle = () => {
        on = !on;
        soundBtn?.classList.toggle("is-on", on);
        if (tick) gsap.to(tick, { xPercent: on ? 100 : 0, duration: 0.25, ease: "power2.out" });
        setSound(on);
      };

      if (soundBtn) {
        soundBtn.addEventListener("click", toggle);
        cleanups.push(() => soundBtn.removeEventListener("click", toggle));
      }

      // Leaving the section always silences it.
      const enter = () => { videos.forEach((v) => v.play()?.catch(() => {})); };
      const leave = () => {
        if (on) {
          on = false;
          soundBtn?.classList.remove("is-on");
          if (tick) gsap.to(tick, { xPercent: 0, duration: 0.25, ease: "power2.out" });
          setSound(false);
        }
      };

      if (isDesktop) {
        const zoom = gsap.fromTo(videoWrap, { scale: VIDEO_SCALE_FROM }, {
          scale: VIDEO_SCALE_TO, ease: "none",
          scrollTrigger: {
            trigger: wrap, start: "top top", end: "bottom top",
            pin: wrap, pinSpacing: true, scrub: VIDEO_SCRUB,
            invalidateOnRefresh: true, refreshPriority: 1,
            onEnter: enter, onEnterBack: enter, onLeave: leave, onLeaveBack: leave,
          },
        });
        if (zoom.scrollTrigger) triggers.push(zoom.scrollTrigger);

        if (bg) {
          const room = gsap.fromTo(bg, { scale: BG_SCALE_FROM }, {
            scale: BG_SCALE_TO, ease: "none",
            scrollTrigger: { trigger: wrap, start: "top top", end: "bottom top", scrub: BG_SCRUB, invalidateOnRefresh: true },
          });
          if (room.scrollTrigger) triggers.push(room.scrollTrigger);
        }
      } else {
        triggers.push(ScrollTrigger.create({
          trigger: wrap, start: "top top", end: "bottom top",
          onEnter: enter, onEnterBack: enter, onLeave: leave, onLeaveBack: leave,
        }));
      }
    });

    return () => {
      triggers.forEach((t) => { t.animation?.kill(); t.kill(true); });
      cleanups.forEach((fn) => fn());
      document.querySelectorAll<HTMLElement>(".musee-w").forEach((el) => gsap.set(el, { clearProps: "all" }));
      document.querySelectorAll<HTMLElement>(".musee-w .video-w, .musee-w .musee-bg").forEach((el) => gsap.set(el, { clearProps: "scale" }));
    };
  }, [ready]);
}
