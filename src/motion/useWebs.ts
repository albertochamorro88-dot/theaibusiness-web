"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, registerGsap } from "./gsap";

/**
 * Los movimientos propios de la landing de webs.
 *
 * Comparten herramienta con la portada —GSAP, ScrollTrigger, `scrub` atado a
 * Lenis— pero no repiten ninguna de sus composiciones: aqui el scroll tacha una
 * palabra, reparte una pila de ventanas, arrastra el proceso en horizontal y
 * hace caer el precio.
 */

/* ------------------------------------------------------------- la negacion */

/**
 * La linea que tacha "bonitas" y el subrayado que entra bajo "venden".
 *
 * Van con `scrub`: el trazo avanza con el scroll, no con un reloj, para que se
 * lea como una correccion que hace el propio lector.
 */
export function useTachado(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const seccion = document.querySelector<HTMLElement>(".section.negacion");
    if (!seccion) return;
    const trazos = [...seccion.querySelectorAll<HTMLElement>(".trazo")];
    if (!trazos.length) return;

    const tw = gsap.fromTo(trazos,
      { scaleX: 0 },
      {
        scaleX: 1, ease: "none", transformOrigin: "0% 50%", stagger: 0.35,
        scrollTrigger: { trigger: seccion, start: "top 62%", end: "center 45%", scrub: 0.6 },
      });

    return () => { tw.scrollTrigger?.kill(); tw.kill(); gsap.set(trazos, { clearProps: "all" }); };
  }, [ready]);
}

/* ---------------------------------------------------------------- la pila */

/* Cuanto baja y se separa cada ventana al repartirse. El paso vertical tiene
   que superar el alto de una ventana: con menos, cada una tapaba el cuerpo de
   la anterior y el texto quedaba ilegible unos sobre otros. */
const PASO_Y = 140;
const PASO_X = 18;

/**
 * Las cinco ventanas que se reparten.
 *
 * Empiezan apiladas una encima de otra, como un mazo, y al recorrer la seccion
 * se abren en escalera hasta que se leen las cinco. La seccion se ancla
 * mientras dura el reparto: sin `pin` la pila se abriria a la vez que sube y la
 * ultima ventana llegaria a su sitio ya fuera de pantalla.
 */
export function usePila(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const zona = document.querySelector<HTMLElement>(".pila-w");
    const cartas = zona ? [...zona.querySelectorAll<HTMLElement>(".pila-carta")] : [];
    if (!zona || !cartas.length) return;

    /* De tablet hacia abajo no hay alto suficiente para anclar sin tapar el
       resto: ahi las ventanas van en columna y solo entran con un reveal. */
    if (!window.matchMedia("(min-width: 992px)").matches) {
      const tw = gsap.fromTo(cartas,
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.09,
          scrollTrigger: { trigger: zona, start: "top 80%", once: true },
        });
      return () => { tw.scrollTrigger?.kill(); tw.kill(); };
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: zona, start: "top top", end: "+=140%",
        pin: zona, pinSpacing: true, scrub: 0.8, invalidateOnRefresh: true,
        /* Por delante del resto: este `pin` inserta espaciador y desplaza todo
           lo que va debajo. Si algo de abajo midiera antes, sus marcas
           quedarian obsoletas. */
        refreshPriority: 3,
      },
    });

    cartas.forEach((carta, i) => {
      gsap.set(carta, { zIndex: i + 1 });
      tl.fromTo(carta,
        { y: i * 8, x: i * 4, rotate: (i - 2) * 0.6, autoAlpha: i === 0 ? 1 : 0.06 },
        { y: i * PASO_Y, x: i * PASO_X, rotate: 0, autoAlpha: 1, ease: "power2.out" },
        i * 0.12);
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set(cartas, { clearProps: "all" });
    };
  }, [ready]);
}

/* ----------------------------------------------------------- el proceso */

/**
 * Las cuatro fases, en horizontal.
 *
 * La seccion se ancla y el carril se desplaza en X mientras el scroll baja: es
 * el unico tramo del sitio que se lee de izquierda a derecha, y esa ruptura es
 * justo lo que separa el "que compras" del "como se hace".
 */
export function useCarrusel(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const seccion = document.querySelector<HTMLElement>(".section.proceso");
    const carril = seccion?.querySelector<HTMLElement>(".proceso-carril");
    if (!seccion || !carril) return;
    if (!window.matchMedia("(min-width: 992px)").matches) return;

    const recorrido = () => carril.scrollWidth - carril.parentElement!.clientWidth;
    if (recorrido() <= 0) return;

    const tw = gsap.to(carril, {
      x: () => -recorrido(),
      ease: "none",
      scrollTrigger: {
        trigger: seccion, start: "top top",
        end: () => `+=${recorrido() + window.innerHeight * 0.5}`,
        pin: true, scrub: 0.7, invalidateOnRefresh: true, refreshPriority: 2,
      },
    });

    return () => { tw.scrollTrigger?.kill(); tw.kill(); gsap.set(carril, { clearProps: "all" }); };
  }, [ready]);
}

/* ------------------------------------------------------------- el precio */

const DIGITOS = "0123456789";

/**
 * El precio que se asienta.
 *
 * Las tres cifras giran como un contador mecanico y se van fijando de
 * izquierda a derecha hasta quedarse en 997. Va con `scrub`, asi que el lector
 * controla el giro: parar a mitad y ver los digitos quietos es parte del
 * efecto.
 *
 * No hay ninguna cifra de partida inventada —nada de "antes 4.500 €"—: el
 * documento del servicio dice "varios miles" y no da un numero, asi que aqui
 * tampoco.
 */
export function usePrecio(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const marcador = document.querySelector<HTMLElement>(".precio-rodillo");
    if (!marcador) return;
    const objetivo = marcador.dataset.precio ?? "997";
    const ruedas = [...marcador.querySelectorAll<HTMLElement>(".rodillo")];
    if (ruedas.length !== objetivo.length) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (quieto) {
      ruedas.forEach((r, i) => { r.textContent = objetivo[i]; });
      return;
    }

    const estado = { p: 0 };
    const pintar = () => {
      ruedas.forEach((rueda, i) => {
        // Cada rueda se fija en su tramo: la primera antes que la ultima.
        const fija = (estado.p - i * 0.22) / 0.34;
        rueda.textContent = fija >= 1
          ? objetivo[i]
          : DIGITOS[Math.floor(Math.random() * 10)];
      });
    };
    pintar();

    const tw = gsap.to(estado, {
      p: 1.2, ease: "none", onUpdate: pintar,
      scrollTrigger: { trigger: marcador, start: "top 88%", end: "top 34%", scrub: 0.5 },
    });

    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, [ready]);
}

/* --------------------------------------------------------------- el tinte */

/**
 * El recorrido de color.
 *
 * La portada es negra de principio a fin y usa el rojo y el azul como acento.
 * Aqui el color es la estructura: cada tramo tine la pagina entera —negro,
 * rojo, blanco, azul y vuelta al negro— y el cambio se interpola, no se corta,
 * asi que el fondo esta vivo durante todo el scroll.
 *
 * Fondo y tinta viajan como variables CSS en la raiz, de modo que cualquier
 * elemento que las use cambia solo: no hay que repintar nada a mano ni
 * mantener una clase por tramo.
 */
export function useTinte(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const paradas = [...document.querySelectorAll<HTMLElement>("[data-fondo]")];
    if (!paradas.length) return;

    const raiz = document.documentElement;
    const triggers: ScrollTrigger[] = [];

    const teñir = (el: HTMLElement) => {
      gsap.to(raiz, {
        "--fondo": el.dataset.fondo,
        "--tinta": el.dataset.tinta,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
      });
    };

    paradas.forEach((el) => {
      triggers.push(ScrollTrigger.create({
        trigger: el,
        /* El cambio salta cuando el tramo cruza la mitad de la pantalla: antes
           se adelantaba al contenido y el lector veia el color nuevo sobre el
           texto viejo. */
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => teñir(el),
        onEnterBack: () => teñir(el),
      }));
    });

    // El primer tramo no dispara `onEnter` porque ya esta en pantalla al cargar.
    teñir(paradas[0]);

    return () => { triggers.forEach((t) => t.kill()); };
  }, [ready]);
}

/* --------------------------------------------------------------- la aurora */

/** Cuanto se desplaza cada mancha con el cursor, en px. */
const ARRASTRE = 90;

/**
 * El fondo vivo del hero.
 *
 * Dos manchas de color —una roja y una azul— que derivan despacio y siguen al
 * cursor con retardo. Sustituye a la disolucion de fluido de la portada: alli
 * el pincel descubre un video que hay debajo; aqui no hay video que descubrir,
 * asi que el hero se mueve por si mismo y reacciona al puntero sin depender de
 * ninguna pieza de arte.
 *
 * Es CSS y transformaciones, no WebGL: cuesta una fraccion de la simulacion de
 * fluidos y no deja al hero en negro si el equipo no tiene aceleracion.
 */
export function useAurora(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const zona = document.querySelector<HTMLElement>(".aurora");
    const manchas = zona ? [...zona.querySelectorAll<HTMLElement>(".aurora-mancha")] : [];
    if (!zona || !manchas.length) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (!quieto) {
        // Deriva propia: cada mancha con su periodo, para que no laten a la vez.
        manchas.forEach((m, i) => {
          gsap.to(m, {
            xPercent: i % 2 ? -14 : 14,
            yPercent: i % 2 ? 10 : -12,
            scale: 1.14,
            duration: 11 + i * 3.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        });
      }

      /* El cursor arrastra las manchas en sentidos opuestos: la roja hacia el
         puntero y la azul en contra, que es lo que separa el degradado y hace
         que el fondo parezca profundo en vez de plano. */
      const seguir = manchas.map((m) => gsap.quickTo(m, "x", { duration: 1.1, ease: "power3.out" }));
      const seguirY = manchas.map((m) => gsap.quickTo(m, "y", { duration: 1.1, ease: "power3.out" }));

      const mover = (e: PointerEvent) => {
        const r = zona.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        manchas.forEach((_, i) => {
          const signo = i % 2 ? -1 : 1;
          seguir[i](dx * ARRASTRE * signo);
          seguirY[i](dy * ARRASTRE * signo);
        });
      };

      if (!quieto) window.addEventListener("pointermove", mover, { passive: true });
      return () => window.removeEventListener("pointermove", mover);
    }, zona);

    return () => ctx.revert();
  }, [ready]);
}
