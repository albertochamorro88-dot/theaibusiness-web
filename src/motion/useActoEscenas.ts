"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, registerGsap } from "./gsap";

/**
 * Las escenas de la pagina del AI Act.
 *
 * Aqui no hay un catalogo de entradas reutilizables: cada seccion defiende UNA
 * idea y su animacion ES esa idea. La ley sustituye lo que crees que regula:
 * una frase tacha a la otra. La ley clasifica en cuatro niveles: los cuatro se
 * apilan uno sobre otro. El calendario corre: el calendario se mueve. La multa
 * es un numero: el numero lo cuentas tu con el scroll.
 *
 * Regla comun a todas: por debajo de 900 px NO se clava nada. Robarle 400 vh
 * de scroll a un movil es secuestrar la pagina, y ademas los recorridos
 * horizontales no caben. En movil cada escena degrada a una entrada simple.
 */

const reducido = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Ancho a partir del cual se permite clavar secciones. */
const GRANDE = "(min-width: 901px)";
const CHICA = "(max-width: 900px)";

/* ==========================================================================
   01 · la sustitucion
   ========================================================================== */

/**
 * Una frase tacha a la otra.
 *
 * El reglamento no regula la tecnologia, regula el uso. La animacion no
 * "presenta" las dos frases: hace que la segunda ocupe el sitio de la primera.
 * Primero se traza el tachon, despues la frase vieja se apaga y retrocede
 * mientras la nueva se descubre de izquierda a derecha con una mascara.
 *
 * La mascara es `clip-path` y no un ancho: recortando el ancho, el texto se
 * reajustaria linea a linea mientras se descubre. Con `clip-path` el texto ya
 * esta compuesto y lo unico que se mueve es la ventana por la que se ve.
 */
export function useSustitucion(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const sec = document.querySelector<HTMLElement>(".act-sust");
    if (!sec) return;

    const fuera = sec.querySelector<HTMLElement>(".act-sust-fuera");
    const tachon = sec.querySelector<HTMLElement>(".act-tachon");
    /* Lo que se descubre es la copia LLENA, no el parrafo: debajo tiene que
       quedarse la copia hueca marcando adonde va a llegar el blanco. */
    const dentro = sec.querySelector<HTMLElement>(".act-sust-lleno");
    const cita = sec.querySelector<HTMLElement>(".act-sust-cita");
    const pie = sec.querySelector<HTMLElement>(".act-sust-pie");
    if (!fuera || !tachon || !dentro) return;

    const finales = () => {
      gsap.set(tachon, { scaleX: 1 });
      gsap.set(fuera, { opacity: 0.3 });
      gsap.set(dentro, { clipPath: "inset(-30% 0% -30% 0%)", opacity: 1, y: 0 });
      if (cita) gsap.set(cita, { opacity: 1, y: 0 });
      if (pie) gsap.set(pie, { opacity: 1 });
    };

    if (reducido()) { finales(); return; }

    const mm = gsap.matchMedia();

    mm.add(GRANDE, () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: "+=190%",
          scrub: 0.6,
          pin: sec.querySelector(".act-sust-pin"),
          pinSpacing: true,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(tachon, { scaleX: 0 }, { scaleX: 1, duration: 0.85, ease: "power2.inOut" }, 0);
      tl.fromTo(fuera, { opacity: 1, y: 0 }, { opacity: 0.3, y: -14, duration: 0.8, ease: "power1.in" }, 0.7);
      /* Los -30 % de arriba y abajo no son un margen de seguridad cualquiera:
         con interlineado por debajo de 1, la caja del bloque termina antes que
         el rabo de la "g", y un `inset(0)` se lo comia. El recorte solo debe
         mover el canto derecho. */
      tl.fromTo(dentro,
        { clipPath: "inset(-30% 100% -30% 0%)", opacity: 1, y: 26 },
        { clipPath: "inset(-30% 0% -30% 0%)", y: 0, duration: 1, ease: "power2.out" }, 0.75);
      if (cita) tl.fromTo(cita, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.6 }, 1.15);
      if (pie) tl.fromTo(pie, { opacity: 0 }, { opacity: 1, duration: 0.45 }, 1.35);
      /* Un compas al final. Sin el, lo ultimo en entrar llegaba justo en el
         fotograma en que se suelta el clavado: el 20/80 se ponia y desaparecia
         de pantalla en el mismo gesto, y nadie llegaba a leerlo. */
      tl.to({}, { duration: 0.5 }, 1.8);

      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    });

    /* En movil no se clava: las dos frases estan una debajo de otra y la
       sustitucion se dispara al llegar, de una vez. */
    mm.add(CHICA, () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sec, start: "top 70%", once: true },
      });
      tl.fromTo(tachon, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, 0);
      tl.fromTo(fuera, { opacity: 1 }, { opacity: 0.3, duration: 0.5 }, 0.5);
      tl.fromTo(dentro,
        { clipPath: "inset(-30% 100% -30% 0%)", y: 18 },
        { clipPath: "inset(-30% 0% -30% 0%)", y: 0, duration: 0.9, ease: "power2.out" }, 0.55);
      if (cita) tl.fromTo(cita, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 1);
      if (pie) tl.fromTo(pie, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.15);
      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    });

    return () => mm.revert();
  }, [ready]);
}

/* ==========================================================================
   02 · la pila de niveles
   ========================================================================== */

/**
 * Los cuatro niveles se apilan, no se listan.
 *
 * La ley mete cada sistema en una caja y solo en una. Una lista de cuatro
 * filas no dice eso; cuatro laminas que se tapan entre si, si: al final solo
 * queda una a la vista. El medidor de la izquierda va bajando de rojo a gris
 * mientras se apilan, que es la escala de riesgo.
 *
 * La lamina que se va no desaparece: se encoge y se apaga, y asoma por arriba.
 * Sin ese resto no se entiende que hay una pila debajo.
 */
export function usePila(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const sec = document.querySelector<HTMLElement>(".act-pila");
    if (!sec) return;

    const pin = sec.querySelector<HTMLElement>(".act-pila-pin");
    const laminas = [...sec.querySelectorAll<HTMLElement>(".act-nivel")];
    const marcas = [...sec.querySelectorAll<HTMLElement>(".act-medidor-i")];
    const relleno = sec.querySelector<HTMLElement>(".act-medidor-f");
    if (!pin || laminas.length < 2) return;

    if (reducido()) {
      gsap.set(laminas, { clearProps: "all" });
      gsap.set(marcas, { opacity: 1 });
      if (relleno) gsap.set(relleno, { scaleY: 1 });
      return;
    }

    const mm = gsap.matchMedia();

    mm.add(GRANDE, () => {
      const n = laminas.length;

      /* Punto de partida: la primera a la vista, las demas fuera por abajo. */
      gsap.set(laminas, { yPercent: (i) => (i === 0 ? 0 : 100), opacity: 1 });
      gsap.set(marcas, { opacity: (i) => (i === 0 ? 1 : 0.22) });
      if (relleno) gsap.set(relleno, { scaleY: 1 / n });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          /* Una pantalla de scroll por cada cambio de lamina. Ni mas —se hace
             eterno— ni menos: por debajo de eso el cambio se salta. */
          end: () => `+=${(n - 1) * 100 + 60}%`,
          scrub: 0.55,
          pin,
          pinSpacing: true,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 1; i < n; i++) {
        const t = i - 1;

        /* No retrocede solo la anterior: retroceden TODAS las que ya cayeron,
           y cada una un poco mas que la que tiene encima. Moviendo solo la
           ultima, las cuatro acababan en el mismo sitio y por arriba asomaba
           un unico canto; escalonandolas se ve la baraja entera y se entiende
           cuantas llevas. */
        for (let j = 0; j < i; j++) {
          const hondo = i - j;
          tl.to(laminas[j], {
            yPercent: -11 * hondo,
            scale: Math.max(0.82, 1 - 0.055 * hondo),
            opacity: Math.max(0.12, 0.42 - 0.1 * hondo),
            ease: "power1.inOut", duration: 1,
          }, t);
        }

        tl.fromTo(laminas[i],
          { yPercent: 100 },
          { yPercent: 0, ease: "power2.out", duration: 1 }, t);
        if (marcas[i - 1]) tl.to(marcas[i - 1], { opacity: 0.22, duration: 1 }, t);
        if (marcas[i]) tl.to(marcas[i], { opacity: 1, duration: 1 }, t);
        if (relleno) tl.to(relleno, { scaleY: (i + 1) / n, ease: "none", duration: 1 }, t);
      }
      /* La ultima lamina tiene que quedarse a la vista un momento antes de que
         la seccion se despegue. */
      tl.to({}, { duration: 0.6 }, n - 1);

      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    });

    /* En movil las cuatro van en columna. La pila no cabe, pero la idea de
       orden si: entran de una en una desde abajo. */
    mm.add(CHICA, () => {
      gsap.set(laminas, { clearProps: "transform,opacity" });
      gsap.set(marcas, { opacity: 1 });
      if (relleno) gsap.set(relleno, { scaleY: 1 });
      const tw = gsap.fromTo(laminas,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: sec, start: "top 72%", once: true },
        });
      return () => { tw.scrollTrigger?.kill(); tw.kill(); };
    });

    return () => mm.revert();
  }, [ready]);
}

/* ==========================================================================
   03 · el reloj
   ========================================================================== */

/**
 * El calendario se mueve mientras lo lees.
 *
 * Es la unica seccion cuyo tema es el paso del tiempo, asi que es la unica que
 * se recorre en horizontal: bajas y las fechas pasan de largo. La linea se
 * traza al mismo ritmo y cada hito se enciende JUSTO cuando cruza el centro de
 * la pantalla.
 *
 * Ese instante no se estima: se calcula. Se mide donde esta cada hito dentro
 * del tren, se resta medio ancho de pantalla y se divide por el recorrido
 * total. Asi el encendido cae en el fotograma en que la fecha esta centrada,
 * en cualquier pantalla.
 */
export function useReloj(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const sec = document.querySelector<HTMLElement>(".act-reloj");
    if (!sec) return;

    const pin = sec.querySelector<HTMLElement>(".act-reloj-pin");
    const tren = sec.querySelector<HTMLElement>(".act-tren");
    const via = sec.querySelector<HTMLElement>(".act-via-l");
    const hitos = [...sec.querySelectorAll<HTMLElement>(".act-hito")];
    if (!pin || !tren || !hitos.length) return;

    if (reducido()) {
      gsap.set(hitos, { opacity: 1 });
      if (via) gsap.set(via, { scaleX: 1 });
      return;
    }

    const mm = gsap.matchMedia();

    mm.add(GRANDE, () => {
      const recorrido = () => Math.max(0, tren.scrollWidth - window.innerWidth + 96);

      gsap.set(hitos, { opacity: 0.24 });
      if (via) gsap.set(via, { scaleX: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: () => `+=${recorrido() + window.innerHeight * 0.4}`,
          scrub: 0.5,
          pin,
          pinSpacing: true,
          invalidateOnRefresh: true,
        },
      });

      tl.to(tren, { x: () => -recorrido(), ease: "none", duration: 1 }, 0);
      if (via) tl.to(via, { scaleX: 1, ease: "none", duration: 1 }, 0);

      /* El encendido de cada fecha, colocado en el punto del recorrido en que
         esa fecha queda centrada. */
      const D = recorrido();
      hitos.forEach((h) => {
        const centro = h.offsetLeft + h.offsetWidth / 2;
        const t = D > 0 ? (centro - window.innerWidth / 2) / D : 0;
        tl.to(h, { opacity: 1, duration: 0.14, ease: "none" },
          Math.min(0.92, Math.max(0, t)));
      });

      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    });

    mm.add(CHICA, () => {
      gsap.set(tren, { clearProps: "transform" });
      if (via) gsap.set(via, { scaleX: 1 });
      const tw = gsap.fromTo(hitos,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: sec, start: "top 72%", once: true },
        });
      return () => { tw.scrollTrigger?.kill(); tw.kill(); };
    });

    return () => mm.revert();
  }, [ready]);
}

/* ==========================================================================
   04 · la multa
   ========================================================================== */

/**
 * La cifra la cuentas tu.
 *
 * El resto de contadores de la casa se disparan al llegar y corren solos. Este
 * no: va atado al scroll, asi que el numero sube al ritmo al que bajas. Una
 * sancion no es un dato que aparece, es algo que crece mientras no haces nada,
 * y esa es exactamente la sensacion que se busca.
 *
 * El resplandor rojo sube con el numero. A 35 esta al maximo.
 */
export function useMulta(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const sec = document.querySelector<HTMLElement>(".act-multa");
    if (!sec) return;

    const pin = sec.querySelector<HTMLElement>(".act-multa-pin");
    const num = sec.querySelector<HTMLElement>("[data-multa]");
    const brillo = sec.querySelector<HTMLElement>(".act-multa-brillo");
    const pie = sec.querySelector<HTMLElement>(".act-multa-pie");
    const lados = [...sec.querySelectorAll<HTMLElement>(".act-lado")];
    if (!pin || !num) return;

    const fin = Number(num.dataset.multa) || 0;

    if (reducido()) {
      num.textContent = String(fin);
      if (brillo) gsap.set(brillo, { opacity: 0.85 });
      if (pie) gsap.set(pie, { opacity: 1 });
      gsap.set(lados, { opacity: 1, y: 0 });
      return;
    }

    const mm = gsap.matchMedia();

    const contar = (tl: gsap.core.Timeline, dur: number, pos: number) => {
      const obj = { v: 0 };
      num.textContent = "0";
      tl.to(obj, {
        v: fin, duration: dur, ease: "none", snap: { v: 1 },
        onUpdate: () => { num.textContent = String(Math.round(obj.v)); },
      }, pos);
    };

    mm.add(GRANDE, () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: "+=150%",
          scrub: 0.4,
          pin,
          pinSpacing: true,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(num.parentElement ?? num,
        { scale: 0.86, opacity: 0.4 },
        { scale: 1, opacity: 1, duration: 1, ease: "power2.out" }, 0);
      contar(tl, 1, 0);
      if (brillo) tl.fromTo(brillo, { opacity: 0, scale: 0.6 },
        { opacity: 0.85, scale: 1, duration: 1, ease: "none" }, 0);
      if (pie) tl.fromTo(pie, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.3 }, 0.85);
      if (lados.length) tl.fromTo(lados,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.1 }, 1);
      tl.to({}, { duration: 0.45 }, 1.4);

      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    });

    mm.add(CHICA, () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sec, start: "top 75%", end: "bottom 60%", scrub: 0.4 },
      });
      contar(tl, 1, 0);
      if (brillo) tl.fromTo(brillo, { opacity: 0 }, { opacity: 0.7, duration: 1, ease: "none" }, 0);
      if (pie) tl.fromTo(pie, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.85);
      if (lados.length) tl.fromTo(lados, { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.1 }, 0.9);
      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    });

    return () => mm.revert();
  }, [ready]);
}

/* ==========================================================================
   05 · la apertura del video
   ========================================================================== */

/**
 * El marco del video se abre como un obturador.
 *
 * Llega como una rendija y se abre por arriba y por abajo hasta el 16:9. Es
 * una seccion que solo pide una cosa —dale al play— y la animacion no hace
 * mas que eso: destapar. No se clava; se ata al recorrido de entrada, que es
 * suficiente para que la apertura ocurra mientras miras.
 */
export function useApertura(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const marco = document.querySelector<HTMLElement>(".act-video-m");
    if (!marco) return;

    if (reducido()) {
      gsap.set(marco, { clipPath: "inset(0% 0% 0% 0%)", scale: 1 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: marco,
        start: "top 92%",
        end: "top 34%",
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(marco,
      { clipPath: "inset(44% 0% 44% 0%)", scale: 0.9 },
      { clipPath: "inset(0% 0% 0% 0%)", scale: 1, ease: "power2.out", duration: 1 }, 0);

    const play = marco.querySelector<HTMLElement>(".act-play");
    if (play) tl.fromTo(play, { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.8)" }, 0.6);

    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, [ready]);
}

/* ==========================================================================
   06 · la caida
   ========================================================================== */

/**
 * Tres se caen, una se queda.
 *
 * La seccion dice que los demas diagnostican y nosotros construimos. En vez de
 * escribirlo mas veces, las tres primeras columnas se hunden y se apagan
 * mientras la nuestra sube y se enciende con el filete en degradado. El scroll
 * hace la comparacion.
 */
export function useCaida(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const sec = document.querySelector<HTMLElement>(".act-rivales");
    if (!sec) return;

    const todas = [...sec.querySelectorAll<HTMLElement>(".act-rival")];
    if (todas.length < 2) return;
    const otros = todas.filter((c) => !c.hasAttribute("data-nosotros"));
    const nuestra = todas.find((c) => c.hasAttribute("data-nosotros"));
    const filetes = [...sec.querySelectorAll<HTMLElement>(".act-rival-l")];

    if (reducido()) {
      gsap.set(todas, { clearProps: "all" });
      gsap.set(filetes, { scaleX: 1 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec,
        start: "top 72%",
        end: "bottom 78%",
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(filetes, { scaleX: 0 },
      { scaleX: 1, duration: 0.35, ease: "power2.out", stagger: 0.05 }, 0);
    tl.fromTo(otros,
      { y: 0, opacity: 1 },
      { y: 30, opacity: 0.3, duration: 1, ease: "power1.in", stagger: 0.06 }, 0.35);
    if (nuestra) tl.fromTo(nuestra,
      { y: 30, opacity: 0.45 },
      { y: -10, opacity: 1, duration: 1, ease: "power2.out" }, 0.35);

    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, [ready]);
}

/* ==========================================================================
   refresco
   ========================================================================== */

/**
 * Recalcula los anclajes cuando las fuentes terminan de cargar.
 *
 * Las secciones clavadas miden distancias en pixeles al montarse. Si en ese
 * momento el navegador todavia dibuja con la tipografia de reserva, los
 * titulares cambian de alto al llegar Inter y todos los disparadores quedan
 * corridos. Un refresco al terminar las fuentes lo arregla de una vez.
 */
export function useRefresco(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();
    let vivo = true;
    const refrescar = () => { if (vivo) ScrollTrigger.refresh(); };
    document.fonts?.ready.then(refrescar).catch(() => {});
    const t = window.setTimeout(refrescar, 900);
    return () => { vivo = false; window.clearTimeout(t); };
  }, [ready]);
}
