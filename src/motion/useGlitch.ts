"use client";

import { useEffect } from "react";
import { gsap, registerGsap } from "./gsap";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`§è!\"";
const FRAME_EVERY = 5;      // only rewrite glyphs every Nth frame
const VELOCITY_EASE = 0.14; // how fast the scramble energy chases the input
const VELOCITY_DECAY = 0.9; // and how fast it bleeds away
const RESOLVED_TAIL = 3;    // characters behind the head that snap back to normal

const randomGlyph = () => SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];

type Cell = { span: HTMLSpanElement; original: string };

/** Wrap every character of an element in a span so it can be scrambled individually. */
function explode(el: HTMLElement): Cell[] {
  const cells: Cell[] = [];
  const walk = (node: Node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? "";
        if (!text.trim()) return;
        const frag = document.createDocumentFragment();
        for (const ch of text) {
          const span = document.createElement("span");
          span.textContent = ch;
          span.style.display = "inline-block";
          span.style.whiteSpace = "pre";
          frag.appendChild(span);
          cells.push({ span, original: ch });
        }
        child.parentNode?.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };
  walk(el);
  return cells;
}

/**
 * The glitch section. Six stacked "we are nothin'" blocks scramble under a
 * head that advances with pointer energy, while a scrubbed timeline drops the
 * blocks away and resolves `.finaltext` into place.
 */
export function useGlitch(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const sections = [...document.querySelectorAll<HTMLElement>(".section.glitch")];
    if (!sections.length) return;

    const cleanups: Array<() => void> = [];

    sections.forEach((section) => {
      const blocks = [...section.querySelectorAll<HTMLElement>(".text-block-6")];
      if (!blocks.length) return;

      const originalHTML = blocks.map((b) => b.innerHTML);
      const perBlock = blocks.map((b) => explode(b));
      const allCells = perBlock.flat();
      const maxLen = Math.max(...perBlock.map((c) => c.length), 1);

      const finalEl = section.querySelector<HTMLElement>(".finaltext");
      const finalHTML = finalEl?.innerHTML ?? null;
      const finalCells = finalEl ? explode(finalEl) : [];

      /* ---- scramble loop ---- */
      let running = true;
      let energy = 0;
      let input = 0;
      let head = 0;
      let frame = 0;
      let raf = 0;
      let fallTl: gsap.core.Timeline | null = null;

      const paint = (cells: Cell[], at: number, e: number) => {
        cells.forEach(({ span, original }, i) => {
          if (i < at - RESOLVED_TAIL) { span.style.opacity = "1"; span.textContent = original; }
          else if (i < at)            { span.style.opacity = "1"; span.textContent = randomGlyph(); }
          else                        { span.style.opacity = "0"; span.textContent = original; }
        });
      };

      const tick = () => {
        if (!running) return;
        frame++;
        energy += (input - energy) * VELOCITY_EASE;
        input *= VELOCITY_DECAY;

        if (frame % FRAME_EVERY === 0) {
          if (energy > 0.01) {
            head = (head + 1 + energy * 10) % maxLen;
            perBlock.forEach((cells) => paint(cells, head, energy));
          } else {
            allCells.forEach(({ span, original }) => { span.textContent = original; });
          }
          // The final line resolves in step with the scrubbed timeline.
          if (finalCells.length && fallTl) {
            const progress = fallTl.scrollTrigger?.progress ?? 0;
            const upTo = Math.floor(progress * finalCells.length);
            finalCells.forEach(({ span, original }, i) => {
              span.style.opacity = i < upTo ? "1" : "0";
              span.textContent = i < upTo ? original : randomGlyph();
            });
          }
        }
        raf = requestAnimationFrame(tick);
      };

      const onWheel = (e: WheelEvent) => { input += Math.abs(e.deltaY) * 0.002; };
      const onMove = (e: MouseEvent) => { input += (Math.abs(e.movementX) + Math.abs(e.movementY)) * 0.004; };
      /* En un movil no hay rueda ni raton: sin esta tercera fuente el bloque
         se queda completamente quieto, que es justo lo que pasaba. El scroll
         existe en las dos, asi que sirve para todas. */
      let ultimaY = window.scrollY;
      const onScroll = () => {
        const y = window.scrollY;
        input += Math.abs(y - ultimaY) * 0.0025;
        ultimaY = y;
      };
      window.addEventListener("wheel", onWheel, { passive: true });
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      raf = requestAnimationFrame(tick);

      /* ---- scrubbed fall ---- */
      fallTl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top top", end: "center 30%", scrub: 2 },
      });
      perBlock.forEach((_, i) => {
        fallTl!.to(blocks[i], { yPercent: 60, opacity: 0, ease: "none" }, i * 0.06);
      });

      /* ---- layered imagery ---- */
      const triggers: ScrollTrigger[] = [];
      const glitchImgW = section.querySelector<HTMLElement>(".glitch-img-w");
      if (glitchImgW) {
        const t = gsap.to(glitchImgW, {
          opacity: 0.3, ease: "none", immediateRender: false,
          scrollTrigger: { trigger: section, start: "top top", end: "center center", scrub: 2 },
        });
        if (t.scrollTrigger) triggers.push(t.scrollTrigger);
      }

      const imgGlitchW = section.querySelector<HTMLElement>(".img-glitch-w");
      if (imgGlitchW) {
        const [first, second] = [...imgGlitchW.children] as HTMLElement[];
        if (first) {
          const t = gsap.fromTo(first, { y: 100 }, {
            y: -300, ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 1.5 },
          });
          if (t.scrollTrigger) triggers.push(t.scrollTrigger);
        }
        if (second) {
          const t = gsap.fromTo(second, { y: 100 }, {
            y: -800, ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 3 },
          });
          if (t.scrollTrigger) triggers.push(t.scrollTrigger);
        }
      }

      ([
        { wrapper: ".merguez", img: ".merguez-img", yPercent: -8 },
        { wrapper: ".ballon",  img: ".ballon-img",  yPercent: 10 },
      ] as const).forEach(({ wrapper, img, yPercent }) => {
        const w = section.querySelector<HTMLElement>(wrapper);
        const i = section.querySelector<HTMLElement>(img);
        if (!w || !i) return;
        gsap.set(w, { overflow: "hidden" });
        gsap.set(i, { height: "110%", width: "100%", objectFit: "cover", top: 0 });
        const t = gsap.fromTo(i, { yPercent: 0 }, {
          yPercent, ease: "none",
          scrollTrigger: { trigger: section, start: "20% top", end: "bottom top", scrub: 3 },
        });
        if (t.scrollTrigger) triggers.push(t.scrollTrigger);
      });

      cleanups.push(() => {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("scroll", onScroll);
        fallTl?.scrollTrigger?.kill();
        fallTl?.kill();
        triggers.forEach((t) => { t.animation?.kill(); t.kill(true); });
        blocks.forEach((b, i) => { b.innerHTML = originalHTML[i]; });
        if (finalEl && finalHTML !== null) finalEl.innerHTML = finalHTML;
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [ready]);
}
