"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText, registerGsap } from "./gsap";

/**
 * Attribute-driven reveal engine, ported 1:1 from the original bundle.
 *
 *   [line]     lines split, masked, yPercent 100 -> 0
 *   [letter]   chars split, masked, yPercent 100 -> 0
 *   [opacity]  0 -> 1
 *   [scale]    0 -> 1
 *
 * `delay="<seconds>"` offsets the tween. `no-scroll` opts the element out of
 * ScrollTrigger — it waits for the loader and is played by `playIntroReveals()`.
 */

type IntroPlay = (immediate?: boolean, skip?: boolean) => void;

const introQueue: IntroPlay[] = [];
let introFlushed = false;

export function playIntroReveals(immediate = false, skip = false) {
  introFlushed = true;
  const queued = introQueue.splice(0, introQueue.length);
  queued.forEach((play) => play(immediate, skip));
}

export function resetIntroReveals() {
  introFlushed = false;
  introQueue.length = 0;
}

const delayOf = (el: Element) =>
  parseFloat(el.getAttribute("delay") ?? el.getAttribute("data-delay") ?? "") || 0;

export function useReveals(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const splits: SplitText[] = [];
    const tweens: gsap.core.Tween[] = [];

    const enqueue = (el: Element, play: IntroPlay) => {
      // If the loader already finished (e.g. a session repeat), play immediately.
      if (introFlushed) play(false, false);
      else introQueue.push(play);
    };

    const build = (
      selector: string,
      type: "lines" | "chars",
      childClass: string,
      scrollVars: { duration: number; ease: string; stagger: number },
      introVars: { duration: number; ease: string; stagger: number },
    ) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        if (el.dataset.revealInit === "1") return;
        el.dataset.revealInit = "1";

        const noScroll = el.hasAttribute("no-scroll");
        const delay = delayOf(el);
        const split = new SplitText(el, {
          type,
          linesClass: type === "lines" ? childClass : undefined,
          charsClass: type === "chars" ? childClass : undefined,
          mask: type,
          autoSplit: false,
          aria: "auto",
        });
        splits.push(split);

        const targets = (type === "lines" ? split.lines : split.chars) as HTMLElement[];
        gsap.set(targets, { yPercent: 100 });
        gsap.set(el, { opacity: 1 });

        if (noScroll) {
          enqueue(el, (immediate = false, skip = false) => {
            gsap.to(targets, {
              yPercent: 0,
              duration: skip ? 0 : introVars.duration,
              ease: introVars.ease,
              stagger: skip ? 0 : introVars.stagger,
              delay: immediate || skip ? 0 : delay,
            });
          });
        } else {
          tweens.push(
            gsap.to(targets, {
              yPercent: 0,
              duration: scrollVars.duration,
              ease: scrollVars.ease,
              stagger: scrollVars.stagger,
              delay,
              scrollTrigger: { trigger: el, start: "top 95%", toggleActions: "play none none none" },
            }),
          );
        }
      });
    };

    const buildSimple = (
      selector: string,
      from: gsap.TweenVars,
      to: gsap.TweenVars,
    ) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        if (el.dataset.revealInit === "1") return;
        el.dataset.revealInit = "1";

        const noScroll = el.hasAttribute("no-scroll");
        const delay = delayOf(el);
        gsap.set(el, from);

        if (noScroll) {
          enqueue(el, (immediate = false, skip = false) => {
            gsap.set(el, from);
            gsap.to(el, {
              ...to,
              duration: skip ? 0 : (to.duration as number),
              delay: immediate || skip ? 0 : delay,
              overwrite: true,
            });
          });
        } else {
          tweens.push(
            gsap.to(el, {
              ...to,
              delay,
              scrollTrigger: { trigger: el, start: "top 95%", toggleActions: "play none none none" },
            }),
          );
        }
      });
    };

    const run = () => {
      build(
        "[line]", "lines", "line-child",
        { duration: 1, ease: "power4.inOut", stagger: 0.05 },
        { duration: 1, ease: "power4.inOut", stagger: 0.05 },
      );
      build(
        "[letter]", "chars", "letter-child",
        { duration: 1.2, ease: "power4.inOut", stagger: 0.03 },
        { duration: 1, ease: "power4.out", stagger: 0.1 },
      );
      buildSimple("[opacity]", { opacity: 0 }, { opacity: 1, duration: 1, ease: "power3.out" });
      buildSimple(
        "[scale]",
        { scale: 0, transformOrigin: "50% 50%" },
        { scale: 1, duration: 1, ease: "power3.out" },
      );
      ScrollTrigger.refresh();
    };

    // The original waits for document.fonts before splitting — line breaks
    // depend on the loaded face, so splitting early gives the wrong lines.
    let cancelled = false;
    const timeout = window.setTimeout(() => !cancelled && run(), 3000);
    document.fonts.ready.then(() => {
      if (cancelled) return;
      window.clearTimeout(timeout);
      run();
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
      splits.forEach((s) => s.revert());
      document.querySelectorAll<HTMLElement>("[data-reveal-init]").forEach((el) => {
        delete el.dataset.revealInit;
      });
    };
  }, [ready]);
}
