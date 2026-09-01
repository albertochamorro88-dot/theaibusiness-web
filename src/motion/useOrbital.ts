"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText, registerGsap } from "./gsap";

/**
 * Los movimientos de la direccion orbital.
 *
 * Los numeros no son inventados: salen de muestrear la referencia en 21
 * posiciones de scroll y comparar el mismo elemento entre muestras. La galeria
 * ocupa 4500 px de scroll dentro de una seccion clavada, sus piezas recorren
 * hasta 1566 px en horizontal escalando al doble, el bloque de contacto va a
 * 13-15 % y la foto al 5,57 %.
 */

const reducido = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------- galeria orbital */

/**
 * Las piezas giran sobre una elipse mientras la seccion esta clavada.
 *
 * Elipse y no circulo: una pantalla es mas ancha que alta, y sobre un circulo
 * las piezas de arriba y abajo se salian mientras sobraba sitio a los lados.
 *
 * La que pasa por delante —la que esta mas abajo en la elipse— crece hasta el
 * doble y sube al frente. Ese cambio de tamano es lo que convierte la rotacion
 * en una secuencia con protagonista, en vez de un carrusel que da vueltas.
 *
 * Por debajo de 992 px no se clava nada: robar 4500 px de scroll en un movil es
 * secuestrar la pagina.
 */
export function useOrbita(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const seccion = document.querySelector<HTMLElement>(".orb-galeria");
    const pista = document.querySelector<HTMLElement>(".orb-pista");
    if (!seccion || !pista) return;

    const piezas = [...pista.querySelectorAll<HTMLElement>(".orb-pieza")];
    if (!piezas.length) return;

    if (window.matchMedia("(max-width: 992px)").matches || reducido()) {
      piezas.forEach((p) => { p.style.position = "relative"; p.style.transform = "none"; });
      seccion.classList.add("orb-plana");
      return;
    }

    const N = piezas.length;
    const RX = () => Math.min(window.innerWidth * 0.34, 560);
    const RY = () => Math.min(window.innerHeight * 0.30, 300);

    /* `colocar` se llama en cada cuadro con el avance del scroll (0 a 1). El
       angulo de cada pieza es su reparto en la elipse mas el giro acumulado. */
    const colocar = (avance: number) => {
      const rx = RX(), ry = RY();
      piezas.forEach((p, i) => {
        const a = (i / N) * Math.PI * 2 + avance * Math.PI * 2;
        const x = Math.cos(a - Math.PI / 2) * rx;
        const y = Math.sin(a - Math.PI / 2) * ry;
        /* `frente` vale 1 cuando la pieza esta en la parte baja de la elipse,
           que es la que se lee como "delante". */
        const frente = (Math.sin(a - Math.PI / 2) + 1) / 2;
        const escala = 0.62 + frente * 1.38;          // hasta 2,0 — medido
        p.style.transform =
          `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${escala.toFixed(3)})`;
        p.style.zIndex = String(Math.round(frente * 100));
        p.style.opacity = (0.35 + frente * 0.65).toFixed(3);
      });
    };
    colocar(0);

    const st = ScrollTrigger.create({
      trigger: seccion,
      start: "top top",
      end: "+=4500",              // medido sobre la referencia
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      refreshPriority: 2,
      onUpdate: (self) => colocar(self.progress),
    });

    const remedir = () => colocar(st.progress);
    window.addEventListener("resize", remedir);

    return () => { st.kill(); window.removeEventListener("resize", remedir); };
  }, [ready]);
}

/* ------------------------------------------------------------------ paralaje */

/** Recorrido en porcentaje de la propia altura. Valor por elemento. */
export function useParalajeOrb(ready: boolean) {
  useEffect(() => {
    if (!ready || reducido()) return;
    registerGsap();
    const piezas = [...document.querySelectorAll<HTMLElement>("[data-orb-par]")];
    const tw = piezas.map((el) => {
      const pct = Number(el.dataset.orbPar) || 13;
      return gsap.fromTo(el, { yPercent: pct }, {
        yPercent: -pct, ease: "none",
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: "top bottom", end: "bottom top",
          scrub: true, invalidateOnRefresh: true,
        },
      });
    });
    return () => { tw.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); }); };
  }, [ready]);
}

/* --------------------------------------------------- marquesina por scroll */

/**
 * El titular que se desplaza en horizontal segun se baja.
 *
 * Atado al scroll, no a un reloj: en la referencia recorre 1584 px y se detiene
 * si el lector se detiene. Es la diferencia con una cinta normal, y se nota:
 * esta obedece, la otra desfila sola.
 */
export function useCintaScroll(ready: boolean) {
  useEffect(() => {
    if (!ready || reducido()) return;
    registerGsap();
    const piezas = [...document.querySelectorAll<HTMLElement>("[data-orb-cinta]")];
    const tw = piezas.map((el) => {
      const d = Number(el.dataset.orbCinta) || 1584;   // medido
      return gsap.fromTo(el, { x: d / 2 }, {
        x: -d / 2, ease: "none",
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: "top bottom", end: "bottom top",
          scrub: true, invalidateOnRefresh: true,
        },
      });
    });
    return () => { tw.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); }); };
  }, [ready]);
}

/* ---------------------------------------------------------------- tapado */

/**
 * La seccion siguiente sube y tapa al encabezado.
 *
 * El encabezado se queda pegado arriba y la seccion de debajo, que va en una
 * capa superior con fondo propio, se le echa encima. No hay que mover nada: lo
 * hace `position:sticky` con el orden de capas. Lo que si se anima es la
 * despedida —el encabezado se aleja un poco y se apaga mientras lo cubren—,
 * porque sin eso parece que la pagina se ha roto y hay dos cosas superpuestas.
 *
 * Se anima el CONTENIDO del encabezado, no el encabezado entero: escalar el
 * contenedor escalaria tambien el lienzo WebGL, que tiene su propia resolucion
 * y saldria borroso.
 */
export function useTapado(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const hero = document.querySelector<HTMLElement>(".orb-hero");
    const tapa = document.querySelector<HTMLElement>(".orb-premisa");
    if (!hero || !tapa) return;
    if (reducido()) return;

    /* El texto y el pie retroceden juntos. El titular NO se nombra aparte
       —vive dentro de `.orb-hero-copy`— porque entonces el escalado se
       aplicaria dos veces. */
    const dentro = hero.querySelectorAll<HTMLElement>(".orb-hero-copy, .orb-hero-pie");
    const fondo = hero.querySelector<HTMLElement>(".orb-hero-panel");

    /* Se limpia lo que hubiera escrito una ejecucion anterior. Un `to` graba
       como punto de partida el valor que encuentra: si el montaje previo dejo
       el encabezado a 0,7 de opacidad, el nuevo animaria de 0,7 a 0,7 y el
       encabezado se quedaria apagado para siempre. */
    gsap.set([...dentro, fondo].filter(Boolean) as HTMLElement[],
      { clearProps: "opacity,transform" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: tapa,
        start: "top bottom",
        end: "top top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    /* El encabezado RETROCEDE, no desaparece. Apagarlo a 0,35 contra una tapa
       del mismo negro dejaba nada que ver siendo cubierto: parecia una pagina
       oscura con una franja arriba. Se queda al 0,7 y se aleja un poco, que es
       lo que da la sensacion de profundidad. */
    tl.to(dentro, { scale: 0.94, yPercent: -6, opacity: 0.7, ease: "none" }, 0);
    /* El fondo se apaga, pero NO se escala: encogerlo dejaria a la vista el
       negro del borde justo cuando el video ocupa la pantalla entera. */
    if (fondo) tl.to(fondo, { opacity: 0.45, ease: "none" }, 0);

    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, [ready]);
}

/* ---------------------------------------------------------------- letras */

/**
 * Los titulares entran letra a letra desde debajo de su linea.
 *
 * Cada linea se envuelve en una mascara con `overflow:hidden` y las letras
 * suben desde fuera: el texto no aparece, ASOMA. Es la diferencia entre un
 * fundido y un movimiento, y es de donde sale el impacto.
 *
 * Entrada de una vez (`once`) en lugar de atada al scroll con `scrub`: un
 * titular que se rehace cada vez que pasas por delante cansa, y a media
 * animacion se lee a medias. Aqui el scroll DISPARA, no gobierna.
 *
 * `revert()` al desmontar: sin eso, cada remontaje volvia a partir un texto ya
 * partido y las letras se anidaban unas dentro de otras.
 */
export function useLetras(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const dianas = [...document.querySelectorAll<HTMLElement>("[data-letras]")];
    if (!dianas.length) return;

    if (reducido()) {
      dianas.forEach((el) => { el.style.opacity = "1"; });
      return;
    }

    const partidos: SplitText[] = [];
    const tweens: gsap.core.Tween[] = [];

    dianas.forEach((el) => {
      el.style.opacity = "1";
      const sp = new SplitText(el, {
        type: "lines,chars",
        linesClass: "orb-linea",
      });
      partidos.push(sp);
      tweens.push(
        gsap.from(sp.chars, {
          yPercent: 118,
          duration: 0.85,
          ease: "power3.out",
          stagger: { each: 0.014, from: "start" },
          scrollTrigger: {
            trigger: el,
            start: "top 84%",
            once: true,
          },
        }),
      );
    });

    return () => {
      tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
      partidos.forEach((sp) => sp.revert());
    };
  }, [ready]);
}


/* --------------------------------------------------------- lo que incluye */

/**
 * La lista de lo que entra en el precio: entrada escalonada y filete que se
 * dibuja.
 *
 * Cada fila sube desde abajo con nueve centesimas de retraso sobre la
 * anterior, y su filete se traza de izquierda a derecha. El escalonado es lo
 * que convierte cinco lineas identicas en una enumeracion: se leen de una en
 * una porque aparecen de una en una.
 *
 * `fromTo` y no `from`: el destino se declara, no se muestrea. Con `from`, un
 * remontaje graba como destino el valor que encuentra —cero, si la entrada
 * anterior lo dejo oculto— y la lista no vuelve a aparecer nunca.
 */
export function useIncluye(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const lista = document.querySelector<HTMLElement>(".orb-lista");
    if (!lista) return;
    const filas = [...lista.querySelectorAll<HTMLElement>(".orb-lista-fija")];
    if (!filas.length) return;

    if (reducido()) {
      filas.forEach((f) => { f.style.opacity = "1"; });
      return;
    }

    const filetes = filas
      .map((f) => f.querySelector<HTMLElement>(".orb-lista-filete"))
      .filter(Boolean) as HTMLElement[];

    gsap.set([...filas, ...filetes], { clearProps: "opacity,transform" });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: lista, start: "top 80%", once: true },
    });

    tl.fromTo(filas,
      { y: 34, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, ease: "power3.out", stagger: 0.09 }, 0);
    tl.fromTo(filetes,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.95, ease: "power2.inOut", stagger: 0.09 }, 0.12);

    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, [ready]);
}

/* ------------------------------------------------------------ entrada hero */

/**
 * La entrada del encabezado.
 *
 * El titular estaba usando el mismo revelado que el resto de la pagina —una
 * entrada por scroll— y en el encabezado eso no funciona: ya esta en pantalla
 * al cargar, asi que se dispara antes de que el lector mire y lo que ve es un
 * texto quieto. Aqui tiene su propia linea de tiempo, escalonada y con reloj.
 *
 * Las letras suben desde debajo de su linea, giradas hacia atras: `rotationX`
 * con perspectiva hace que asomen como si volcasen sobre un eje, en vez de
 * limitarse a deslizar. Es lo que le da peso.
 *
 * Y no termina: el titular respira despues, muy despacio. Un encabezado que se
 * queda completamente inmovil tras la entrada se lee como una captura.
 */
export function useHeroEntrada(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const h1 = document.querySelector<HTMLElement>(".orb-h1");
    if (!h1) return;

    const sub = document.querySelector<HTMLElement>(".orb-sub");
    const pie = document.querySelector<HTMLElement>(".orb-hero-pie");

    if (reducido()) {
      [h1, sub, pie].forEach((e) => e && (e.style.opacity = "1"));
      return;
    }

    /* Igual que en el tapado: `from` graba como destino el valor actual, y si
       un montaje anterior dejo el subtitulo a cero, el nuevo lo animaria de
       cero a cero. Se limpia primero y se declara el destino a mano. */
    const marca = h1.querySelector<HTMLElement>("[data-marca]");
    gsap.set([h1, sub, pie, marca].filter(Boolean) as HTMLElement[], { clearProps: "opacity,transform" });
    const opacidadFinal = (el: HTMLElement) => Number(getComputedStyle(el).opacity) || 1;
    const opSub = sub ? opacidadFinal(sub) : 1;
    const opPie = pie ? opacidadFinal(pie) : 1;

    h1.style.opacity = "1";

    /* Se parte PALABRA A PALABRA, no el titular entero.
       El titular reparte sus tres palabras con `space-between`, y partir el h1
       de una vez lo sustituye por divs de linea: las tres palabras caerian
       dentro de una sola caja y el reparto se perderia. Partiendo cada palabra
       por dentro, la caja sobrevive y sigue siendo un elemento del reparto.
       Cada palabra lleva ademas su propia mascara, asi que ya no hace falta la
       clase de linea. */
    const palabras = [...h1.querySelectorAll<HTMLElement>("[data-palabra]")];
    const dianas = palabras.length ? palabras : [h1];
    const sp = dianas.map((el) => new SplitText(el, { type: "chars" }));
    const letras = sp.flatMap((s) => s.chars);

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    /* El lienzo NO se anima desde fuera. Escalarlo con GSAP agranda su caja,
       y la funcion que ajusta la resolucion reescribe `canvas.width`, lo que
       REINICIA el buffer de dibujo de WebGL: el video desaparecia y el lienzo
       acababa a 3226x2016 en vez de 2880x1800. Su entrada ya la hace el propio
       shader con el uniforme `uEntrada`. */

    tl.from(letras, {
      yPercent: 120,
      rotationX: -78,
      transformOrigin: "50% 100% -30px",
      duration: 1.05,
      stagger: { each: 0.017, from: "start" },
    }, 0.25);

    /* La palabra en degradado sube ENTERA. No se puede partir en letras sin
       perder el degradado, asi que entra como bloque desde debajo de su
       mascara, un pelo antes que el resto. */
    if (marca) tl.fromTo(marca, { yPercent: 118 }, { yPercent: 0, duration: 1.05 }, 0.18);

    if (sub) tl.fromTo(sub, { y: 24, opacity: 0 }, { y: 0, opacity: opSub, duration: 0.9 }, "-=0.55");
    if (pie) tl.fromTo(pie, { y: 14, opacity: 0 }, { y: 0, opacity: opPie, duration: 0.7 }, "-=0.5");

    /* La respiracion posterior. Amplitud minima —seis pixeles en catorce
       segundos— porque lo que se busca es que no parezca congelado, no que se
       mueva. */
    const respirar = gsap.to(h1, {
      y: -6,
      duration: 7,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2,
    });

    return () => { tl.kill(); respirar.kill(); sp.forEach((s) => s.revert()); };
  }, [ready]);
}
