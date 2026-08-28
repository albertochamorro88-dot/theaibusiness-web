"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, Flip, registerGsap } from "./gsap";

/** Desktop grid placement — cycle of 6 items across 4 rows. */
const DESKTOP_SLOTS = [
  { col: "1 / 7",  rowOffset: 0, alignSelf: "",    imgH: "43.125rem" },
  { col: "9 / 13", rowOffset: 0, alignSelf: "end", imgH: "26.875rem" },
  { col: "3 / 11", rowOffset: 1, alignSelf: "",    imgH: "42.25rem"  },
  { col: "1 / 5",  rowOffset: 2, alignSelf: "end", imgH: "26.875rem" },
  { col: "7 / 13", rowOffset: 2, alignSelf: "",    imgH: "43.125rem" },
  { col: "3 / 11", rowOffset: 3, alignSelf: "",    imgH: "42.25rem"  },
] as const;
const ROWS_PER_CYCLE = 4;

/** Mobile grid placement — cycle of 3 across 6 columns. */
const MOBILE_SLOTS = [
  { col: "1 / 7" as string | undefined, small: false, ratio: "1 / 1" },
  { col: undefined,                     small: true,  ratio: "253 / 241" },
  { col: "1 / 7" as string | undefined, small: false, ratio: "343 / 550" },
] as const;
const MOBILE_COLS = 6;
const MOBILE_SMALL_A = "3 / 7";
const MOBILE_SMALL_B = "1 / 5";

/** Per-item scroll offset, cycling. */
const ITEM_PARALLAX = [80, -150, -100, -160, 100, -90];

const CLIP_FROM = [
  "inset(100% 100% 0% 0%)",
  "inset(100% 0% 0% 100%)",
  "inset(100% 0% 0% 0%)",
  "inset(100% 100% 0% 0%)",
  "inset(100% 0% 0% 100%)",
  "inset(100% 0% 0% 0%)",
];
const CLIP_TO = "inset(0% 0% 0% 0%)";

const CURSOR_LERP = 0.09;

export function useWorks(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const section = document.querySelector<HTMLElement>(".section.works");
    if (!section) return;

    const isDesktop = window.matchMedia("(min-width: 992px)").matches;
    const cleanups: Array<() => void> = [];

    /* ---------- "WORKS" wordmark: Flip between two rows of slots ---------- */
    let wordTrigger: ScrollTrigger | null = null;
    let wordTl: gsap.core.Timeline | null = null;
    let moved: Array<{ word: HTMLElement; parent: HTMLElement; next: ChildNode | null }> = [];

    const buildWordmark = () => {
      const words = [...section.querySelectorAll<HTMLElement>(".works-word-block-state1 .works-word")];
      const targets = [...section.querySelectorAll<HTMLElement>(".works-word-block-state2")];
      if (!words.length || targets.length < words.length) return;

      moved = words.map((word) => ({
        word,
        parent: word.parentElement as HTMLElement,
        next: word.nextSibling,
      }));

      const state = Flip.getState(words);
      words.forEach((word, i) => targets[i].appendChild(word));

      wordTl = Flip.from(state, {
        ease: "power4.inOut",
        duration: 1.4,
        stagger: { each: 0.2, from: "end" },
        repeat: 1,
        yoyo: true,
        paused: true,
      });

      // Each letter also pinches to 20% and back, offset from the end of the row.
      words.forEach((word, i) => {
        const at = (words.length - 1 - i) * 0.1;
        wordTl!.to(word, { scale: 0.2, duration: 0.8, ease: "power4.inOut" }, at);
        wordTl!.to(word, { scale: 1,   duration: 0.8, ease: "power4.inOut" }, at + 0.8);
      });

      wordTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 3,
        animation: wordTl,
      });
    };

    const teardownWordmark = () => {
      wordTrigger?.kill();
      wordTrigger = null;
      wordTl?.kill();
      wordTl = null;
      moved.forEach(({ word, parent, next }) => {
        if (!parent) return;
        gsap.killTweensOf(word);
        gsap.set(word, { clearProps: "all" });
        if (next && next.parentNode === parent) parent.insertBefore(word, next);
        else parent.appendChild(word);
      });
      moved = [];
    };

    if (isDesktop) {
      buildWordmark();
      let debounce: number | undefined;
      const onResize = () => {
        window.clearTimeout(debounce);
        debounce = window.setTimeout(() => { teardownWordmark(); buildWordmark(); }, 200);
      };
      window.addEventListener("resize", onResize);
      cleanups.push(() => {
        window.clearTimeout(debounce);
        window.removeEventListener("resize", onResize);
        teardownWordmark();
      });
    }

    /* ---------- Grid placement + clip reveal + item parallax ---------- */
    const items = [...section.querySelectorAll<HTMLElement>(".work_item")];
    const triggers: ScrollTrigger[] = [];

    if (!isDesktop && items.length) {
      const list = items[0].parentElement;
      if (list) {
        gsap.set(list, {
          display: "grid",
          gridTemplateColumns: `repeat(${MOBILE_COLS}, 1fr)`,
          gridAutoFlow: "row dense",
          alignItems: "start",
        });
      }
    }

    items.forEach((item, i) => {
      const imgWrap = item.querySelector<HTMLElement>(".img-work-w");
      const img = item.querySelector<HTMLElement>(".img-work");

      if (isDesktop) {
        const slot = DESKTOP_SLOTS[i % DESKTOP_SLOTS.length];
        const row = Math.floor(i / DESKTOP_SLOTS.length) * ROWS_PER_CYCLE + slot.rowOffset + 1;
        item.style.gridColumn = slot.col;
        item.style.gridRow = String(row);
        item.style.alignSelf = slot.alignSelf;
        if (imgWrap) imgWrap.style.height = slot.imgH;
      } else {
        const slot = MOBILE_SLOTS[i % MOBILE_SLOTS.length];
        let col = slot.col;
        if (slot.small) {
          col = Math.floor(i / MOBILE_SLOTS.length) % 2 === 0 ? MOBILE_SMALL_A : MOBILE_SMALL_B;
        }
        item.style.gridColumn = col ?? "1 / 7";
        item.style.gridRow = "auto";
        item.style.alignSelf = "start";
        item.style.display = "flex";
        item.style.flexDirection = "column";
        if (imgWrap) {
          imgWrap.style.width = "100%";
          imgWrap.style.height = "auto";
          imgWrap.style.aspectRatio = slot.ratio;
        }
      }

      if (imgWrap) gsap.set(imgWrap, { overflow: "hidden" });
      /* El original dejaba la imagen a su alto natural y que el contenedor la
         recortase: eran fotos verticales, siempre mas altas que la ficha, y de
         paso su anchura era la que daba ancho a toda la cadena. Aqui el medio
         es mixto — cuatro videos apaisados de 2:1 — y a su alto natural dejaba
         media ficha en negro. Ahora el ancho lo fija el CSS en el enlace y en
         el contenedor, y la pieza se estira al 130% del alto: ese 30% de mas
         es el margen por el que se desliza el parallax de dentro sin descubrir
         el borde inferior. */
      if (img) {
        gsap.set(img, {
          height: isDesktop ? "130%" : "100%",
          width: "100%",
          objectFit: "cover",
          top: isDesktop ? "-15%" : 0,
        });
      }

      if (imgWrap) {
        gsap.set(imgWrap, { clipPath: CLIP_FROM[i % CLIP_FROM.length] });
        const reveal = gsap.to(imgWrap, {
          clipPath: CLIP_TO,
          ease: "power4.inOut",
          duration: 1,
          scrollTrigger: { trigger: item, start: "top 88%", toggleActions: "play none none none" },
        });
        if (reveal.scrollTrigger) triggers.push(reveal.scrollTrigger);
      }

      if (isDesktop) {
        const y = ITEM_PARALLAX[i % ITEM_PARALLAX.length];
        const outer = gsap.fromTo(item, { y: 0 }, {
          y, ease: "none",
          scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 1.5 },
        });
        if (outer.scrollTrigger) triggers.push(outer.scrollTrigger);

        if (img) {
          /* Recorrido acortado respecto al original (-5 -> -20). Alli la
             imagen sobresalia mucho del contenedor y habia sitio de sobra;
             con el 130% de ahora, pasar de -10 destaparia el canto de abajo. */
          const inner = gsap.fromTo(img, { yPercent: -2 }, {
            yPercent: -10, ease: "none",
            scrollTrigger: { trigger: item, start: "top bottom", end: "bottom center", scrub: 3 },
          });
          if (inner.scrollTrigger) triggers.push(inner.scrollTrigger);
        }
      }
    });
    cleanups.push(() => triggers.forEach((t) => { t.animation?.kill(); t.kill(true); }));

    /* ---------- "explore" cursor that trails the pointer inside each card ---------- */
    section.querySelectorAll<HTMLElement>(".work-link").forEach((link) => {
      const cursor = link.querySelector<HTMLElement>(".cursor-work");
      if (!cursor) return;

      gsap.set(link, { position: "relative" });
      gsap.set(cursor, {
        position: "absolute", xPercent: -50, yPercent: -50,
        left: 0, top: 0, scale: 0, autoAlpha: 0,
        pointerEvents: "none", zIndex: 10,
      });
      link.style.cursor = "none";

      const s = { tx: 0, ty: 0, cx: 0, cy: 0, raf: 0, active: false, lastX: NaN, lastY: NaN };

      const tick = () => {
        s.cx += (s.tx - s.cx) * CURSOR_LERP;
        s.cy += (s.ty - s.cy) * CURSOR_LERP;
        gsap.set(cursor, { x: s.cx, y: s.cy });
        const moving = Math.abs(s.cx - s.tx) > 0.05 || Math.abs(s.cy - s.ty) > 0.05;
        s.raf = s.active || moving ? requestAnimationFrame(tick) : 0;
      };

      const show = () => {
        if (s.active) return;
        s.active = true;
        gsap.to(cursor, { scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(1.8)", overwrite: "auto" });
        if (!s.raf) s.raf = requestAnimationFrame(tick);
      };
      const hide = () => {
        if (!s.active) return;
        s.active = false;
        gsap.to(cursor, { scale: 0, autoAlpha: 0, duration: 0.38, ease: "power3.in", overwrite: "auto" });
      };

      const onMove = (e: MouseEvent) => {
        const r = link.getBoundingClientRect();
        s.tx = e.clientX - r.left;
        s.ty = e.clientY - r.top;
        const jumped = e.clientX !== s.lastX || e.clientY !== s.lastY;
        s.lastX = e.clientX;
        s.lastY = e.clientY;
        if (!jumped) {
          if (s.active && !s.raf) s.raf = requestAnimationFrame(tick);
          return;
        }
        if (!s.active) {
          s.cx = s.tx; s.cy = s.ty;
          gsap.set(cursor, { x: s.cx, y: s.cy });
        }
        show();
        if (!s.raf) s.raf = requestAnimationFrame(tick);
      };

      link.addEventListener("mousemove", onMove);
      link.addEventListener("mouseleave", hide);
      cleanups.push(() => {
        link.removeEventListener("mousemove", onMove);
        link.removeEventListener("mouseleave", hide);
        if (s.raf) cancelAnimationFrame(s.raf);
        gsap.killTweensOf(cursor);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [ready]);
}
