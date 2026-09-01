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
    /* En webs tapa la premisa; en el AI Act, la primera escena. Es la misma
       maniobra y no merece dos hooks: lo unico que cambia es quien cubre. */
    const tapa = document.querySelector<HTMLElement>(".orb-premisa, .act-tapa");
    if (!hero || !tapa) return;
    if (reducido()) return;

    /* Las dos columnas de texto retroceden juntas. El titular NO se nombra
       aparte —vive dentro de `.orb-tj-copy`— porque entonces el escalado se
       aplicaria dos veces. */
    const dentro = hero.querySelectorAll<HTMLElement>(".orb-tj-copy, .orb-tj-rail");
    const fondo = hero.querySelector<HTMLElement>(".orb-tj-lamina");

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


/* --------------------------------------------------------- micro detalles */

/**
 * Los filetes de los rotulos se trazan al llegar a ellos.
 *
 * Es el unico detalle de los pequeños que necesita JS: el resto —el lavado del
 * boton, el levante de las piezas, la flecha— son estados de hover y se
 * resuelven en CSS, que ademas no cuesta un solo cuadro.
 */
export function useMicro(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const filetes = [...document.querySelectorAll<HTMLElement>(".orb-eti-l")];
    if (!filetes.length) return;

    if (reducido()) {
      filetes.forEach((f) => { f.style.transform = "none"; });
      return;
    }

    gsap.set(filetes, { clearProps: "transform" });

    const tweens = filetes.map((f) =>
      gsap.fromTo(f,
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.1, ease: "power3.inOut",
          scrollTrigger: { trigger: f.parentElement ?? f, start: "top 88%", once: true },
        }),
    );

    return () => { tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); }); };
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

/* ------------------------------------------------------- entrada lateral */

/**
 * Las piezas marcadas entran desde fuera del canto derecho al llegar a ellas.
 *
 * Entran de una vez (`once`), no atadas al scroll: una maqueta que va y viene
 * segun subes y bajas se convierte en un juguete y distrae del texto que
 * tiene al lado.
 *
 * El desplazamiento se mide en porcentaje de la propia pieza y no en pixeles:
 * asi recorre lo mismo en una pantalla de 1440 que en una de 1920, que es lo
 * que hace que el gesto se lea igual en las dos.
 */
export function useEntraDerecha(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const piezas = [...document.querySelectorAll<HTMLElement>("[data-entra-der]")];
    if (!piezas.length) return;

    if (reducido()) {
      piezas.forEach((p) => { p.style.opacity = "1"; });
      return;
    }

    gsap.set(piezas, { clearProps: "opacity,transform" });

    const tweens = piezas.map((p) =>
      gsap.fromTo(p,
        { xPercent: 46, opacity: 0 },
        {
          xPercent: 0, opacity: 1, duration: 1.15, ease: "power3.out",
          scrollTrigger: { trigger: p, start: "top 82%", once: true },
        }),
    );

    return () => { tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); }); };
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

    const hero = h1.closest<HTMLElement>(".orb-hero");
    const lamina = hero?.querySelector<HTMLElement>(".orb-tj-lamina") ?? null;
    const filete = hero?.querySelector<HTMLElement>(".orb-h1-filete") ?? null;
    const cuenta = hero?.querySelector<HTMLElement>("[data-cuenta]") ?? null;
    const piezas = hero ? [...hero.querySelectorAll<HTMLElement>("[data-entra]")] : [];

    const marca = h1.querySelector<HTMLElement>("[data-marca]");

    if (reducido()) {
      h1.style.opacity = "1";
      if (filete) filete.style.transform = "scaleX(1)";
      return;
    }

    /* Igual que en el tapado: `from` graba como destino el valor actual, y si
       un montaje anterior dejo una pieza a cero, el nuevo la animaria de cero
       a cero. Se limpia primero y se declara el destino a mano. */
    gsap.set([h1, marca, lamina, ...piezas].filter(Boolean) as HTMLElement[],
      { clearProps: "opacity,transform,clipPath" });
    const opacidadFinal = (el: HTMLElement) => Number(getComputedStyle(el).opacity) || 1;
    const finales = piezas.map(opacidadFinal);

    h1.style.opacity = "1";

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    /* La lamina se DESTAPA de abajo arriba, no se funde. Un recorte que sube
       hace que la imagen parezca sacada del propio negro de la tarjeta; un
       fundido solo la enciende. El video empuja un pelo hacia dentro a la vez,
       que es lo que impide que el destape se lea como una persiana. */
    if (lamina) {
      tl.fromTo(lamina,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.25,
          ease: "power3.inOut",
          onComplete: () => { gsap.set(lamina, { clearProps: "clipPath" }); },
        }, 0);
      const v = lamina.querySelector<HTMLElement>(".orb-cara");
      if (v) tl.fromTo(v, { scale: 1.14 }, { scale: 1, duration: 1.6, ease: "power2.out" }, 0);
    }

    /* La caida en domino.
     *
     * Cada letra empieza tumbada hacia atras sobre su propio canto inferior y
     * se levanta con un rebote corto. Las tres cosas que lo convierten en
     * domino y no en un desvanecido: el eje de giro esta en la BASE de la
     * letra (`transformOrigin` al 100 % de altura) y no en su centro; el
     * retraso entre una y otra sube a 38 milesimas, que es donde el ojo
     * empieza a leer una secuencia en vez de un bloque; y el `back.out` pasa
     * de largo y vuelve, que es lo que hace la ficha al asentarse.
     *
     * Al terminar se limpian los `transform` en linea: si no, el estilo que
     * GSAP deja escrito gana al del `:hover` y las letras dejan de responder
     * al raton para siempre. */
    const palabras = [...h1.querySelectorAll<HTMLElement>("[data-palabra]")];
    const dianas = palabras.length ? palabras : [h1];
    const sp = dianas.map((el) => new SplitText(el, { type: "chars", charsClass: "orb-ch" }));
    const letras = sp.flatMap((s) => s.chars);

    tl.fromTo(letras,
      {
        yPercent: 104,
        rotationX: -94,
        opacity: 0,
        transformOrigin: "50% 100% -14px",
      },
      {
        yPercent: 0,
        rotationX: 0,
        opacity: 1,
        duration: 0.95,
        ease: "back.out(1.6)",
        stagger: { each: 0.038, from: "start" },
        onComplete: () => { gsap.set(letras, { clearProps: "transform,opacity" }); },
      }, 0.42);

    /* La palabra en degradado sube ENTERA. No se puede partir en letras sin
       perder el degradado, asi que entra como bloque desde debajo de su
       mascara, un pelo antes que el resto. */
    if (marca) tl.fromTo(marca, { yPercent: 118 }, { yPercent: 0, duration: 1.05 }, 0.4);

    /* El filete se traza hasta topar con el canto, justo detras de la palabra
       que acaba de subir. */
    if (filete) {
      tl.fromTo(filete, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power3.inOut" }, 0.72);
    }

    /* La ficha, el par de datos, la pastilla, el rail y la cifra entran en
       cascada, cada uno hasta SU opacidad —van del 42 al 100 %—, que es por lo
       que no se puede animar el grupo entero a 1. */
    piezas.forEach((el, i) => {
      tl.fromTo(el,
        { y: 20, opacity: 0 },
        { y: 0, opacity: finales[i], duration: 0.85 },
        0.95 + i * 0.09);
    });

    /* La cifra se cuenta. Es el precio: verlo subir hasta pararse en 997 dice
       "cerrado" mejor que escribirlo. */
    if (cuenta) {
      const fin = Number(cuenta.dataset.cuenta) || 0;
      const obj = { v: 0 };
      tl.to(obj, {
        v: fin,
        duration: 1.25,
        ease: "power2.out",
        snap: { v: 1 },
        onUpdate: () => { cuenta.textContent = String(Math.round(obj.v)); },
        onComplete: () => { cuenta.textContent = String(fin); },
      }, 1.05);
    }

    /* La respiracion posterior. Amplitud minima —seis pixeles en catorce
       segundos— porque lo que se busca es que no parezca congelado, no que se
       mueva. */
    const respirar = gsap.to(h1, {
      y: -6,
      duration: 7,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2.4,
    });

    return () => { tl.kill(); respirar.kill(); sp.forEach((s) => s.revert()); };
  }, [ready]);
}

/* ------------------------------------------------------------ mira al raton */

/**
 * El personaje del encabezado sigue al puntero.
 *
 * No se le pueden mover las pupilas: los dos puntos de la pantalla son parte
 * del video y la cabeza YA gira dentro del plano —medido, entre el segundo 1
 * y el 5 se desplaza unos 50 de los 1280 px del original—, asi que unas
 * pupilas pintadas encima se desincronizarian a los pocos fotogramas. Lo que
 * sigue al raton es la figura entera, con retraso, y el foco que la ilumina.
 *
 * Tres capas a velocidades distintas, que es de donde sale la profundidad:
 * la figura va la primera, el foco un poco por detras y el fondo desenfocado
 * del marco se mueve al reves y mas despacio.
 *
 * `quickTo` en vez de un `to` por cada movimiento del raton: reutiliza el
 * mismo tween en vez de crear uno nuevo sesenta veces por segundo.
 *
 * Solo en punteros finos. En una pantalla tactil no hay cursor al que seguir,
 * y `pointermove` ahi se dispara con el dedo: la figura pegaria un salto a
 * cada toque.
 */
export function useMiraPuntero(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    if (reducido()) return;
    if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    registerGsap();

    const hero = document.querySelector<HTMLElement>(".orb-hero");
    const video = hero?.querySelector<HTMLElement>(".orb-cara");
    if (!hero || !video) return;
    const fondo = hero.querySelector<HTMLElement>(".orb-marco-fondo");
    const luz = hero.querySelector<HTMLElement>(".orb-luz");

    const ojos = [...hero.querySelectorAll<HTMLElement>(".orb-ojo")];

    const vx = gsap.quickTo(video, "x", { duration: 0.65, ease: "power3.out" });
    const vy = gsap.quickTo(video, "y", { duration: 0.65, ease: "power3.out" });
    /* Los ojos van MAS RAPIDO que la cabeza —0,32 s frente a 0,65— porque asi
       es como funciona mirar: la vista llega antes que el cuello. Y en
       `xPercent`, no en pixeles: el recorrido queda atado al tamano del propio
       ojo, asi que se escala solo con la ventana. */
    const ox = ojos.map((o) => gsap.quickTo(o, "xPercent", { duration: 0.32, ease: "power2.out" }));
    const oy = ojos.map((o) => gsap.quickTo(o, "yPercent", { duration: 0.32, ease: "power2.out" }));
    const lx = luz ? gsap.quickTo(luz, "x", { duration: 1.1, ease: "power3.out" }) : null;
    const ly = luz ? gsap.quickTo(luz, "y", { duration: 1.1, ease: "power3.out" }) : null;
    const fx = fondo ? gsap.quickTo(fondo, "x", { duration: 1.5, ease: "power3.out" }) : null;
    const fy = fondo ? gsap.quickTo(fondo, "y", { duration: 1.5, ease: "power3.out" }) : null;

    let encendida = false;
    const limite = (n: number) => Math.max(-0.5, Math.min(0.5, n));

    const mover = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      /* Acotado a la caja del encabezado: al bajar por la pagina el raton se
         sale de ella y sin acotar los valores se dispararian. */
      const nx = limite((e.clientX - r.left) / r.width - 0.5);
      const ny = limite((e.clientY - r.top) / r.height - 0.5);
      vx(nx * 40); vy(ny * 20);
      /* Tope de 46 y 32: mas alla el punto toca el canto de la pantalla y deja
         de leerse como una mirada. */
      ox.forEach((f) => f(nx * 92));
      oy.forEach((f) => f(ny * 64));
      if (lx && ly) { lx(nx * 70); ly(ny * 32); }
      if (fx && fy) { fx(nx * -40); fy(ny * -20); }
      if (luz && !encendida) {
        encendida = true;
        gsap.to(luz, { opacity: 0.9, duration: 0.7, ease: "power2.out" });
      }
    };

    const soltar = () => {
      vx(0); vy(0);
      ox.forEach((f) => f(0));
      oy.forEach((f) => f(0));
      if (lx && ly) { lx(0); ly(0); }
      if (fx && fy) { fx(0); fy(0); }
      if (luz && encendida) {
        encendida = false;
        gsap.to(luz, { opacity: 0, duration: 0.9, ease: "power2.out" });
      }
    };

    window.addEventListener("pointermove", mover, { passive: true });
    document.addEventListener("pointerleave", soltar);
    window.addEventListener("blur", soltar);

    return () => {
      window.removeEventListener("pointermove", mover);
      document.removeEventListener("pointerleave", soltar);
      window.removeEventListener("blur", soltar);
      gsap.killTweensOf([video, luz, fondo, ...ojos].filter(Boolean) as HTMLElement[]);
      gsap.set(video, { x: 0, y: 0 });
      if (ojos.length) gsap.set(ojos, { clearProps: "transform" });
      if (luz) gsap.set(luz, { x: 0, y: 0, opacity: 0 });
      if (fondo) gsap.set(fondo, { x: 0, y: 0 });
    };
  }, [ready]);
}

/* ------------------------------------------------------------------- cara */

/**
 * Coloca la caja de la IMAGEN del encabezado.
 *
 * `object-fit: cover` recorta: la caja del elemento y la de la imagen que se
 * ve dentro NO son la misma. Un ojo colocado en porcentajes del <video>
 * caeria donde no toca en cuanto cambiase el ancho de la ventana. Asi que la
 * cuenta que hace `cover` se hace aqui a mano, se le da ese tamano exacto a
 * `.orb-cara` y el video pasa a `fill` dentro de ella. A partir de ahi los
 * ojos son dos porcentajes fijos y no se despegan de la cara.
 *
 * Las cuatro medidas del encuadre —desplazamiento, holgura y punto de
 * recorte— se leen del CSS, que es donde viven, en vez de repetirlas aqui.
 */
/* El fotograma: medida y, dentro de el, el punto entre los ojos y el ancho de
   la cabeza. Todo lo demas se coloca respecto a ese punto. */
const CARA = { w: 1280, h: 716, ax: 0.4937, ay: 0.2469 };

/* Margen que hay que dejar libre por cada lado para que el seguimiento del
   puntero no destape el canto de la tarjeta. */
const MX = 32, MY = 16;

export function useCara(ready: boolean) {
  useEffect(() => {
    if (!ready) return;

    const lamina = document.querySelector<HTMLElement>(".orb-hero .orb-tj-lamina");
    const cara = lamina?.querySelector<HTMLElement>(".orb-cara");
    if (!lamina || !cara) return;

    const medir = () => {
      const Lw = lamina.clientWidth;
      const Lh = lamina.clientHeight;
      if (!Lw || !Lh) return;

      const cs = getComputedStyle(lamina);
      const num = (n: string, d: number) => {
        const v = parseFloat(cs.getPropertyValue(n));
        return isNaN(v) ? d : v;
      };
      const holg = num("--cara-o", 0);   // holgura vertical, en px
      const z = num("--cara-z", 1);      // acercamiento sobre el encuadre justo
      const cx = num("--cara-cx", 0.5);  // donde cae la cara, a lo ancho
      const cy = num("--cara-cy", 0.5);  // y a lo alto
      const libre = num("--cara-libre", 0); // canto izquierdo que puede quedar al aire
      /* El ancla: que punto del fotograma es "la cara". En el plano del
         personaje es el punto entre los ojos; en uno abstracto, el centro. */
      const ax = num("--cara-ax", CARA.ax);
      const ay = num("--cara-ay", CARA.ay);

      const bw = Lw;
      const bh = Lh + holg * 2;
      const by = -holg;

      /* La medida real del fotograma cuando el video ya la sabe: asi la cuenta
         vale para cualquier plano y no solo para el que se midio a mano. */
      const v = cara.querySelector<HTMLVideoElement>("video");
      const fw = v && v.videoWidth ? v.videoWidth : CARA.w;
      const fh = v && v.videoHeight ? v.videoHeight : CARA.h;

      /* `cover`: se escala por el lado que falta, nunca por el que sobra. */
      const s = Math.max(bw / fw, bh / fh) * z;
      const iw = fw * s;
      const ih = fh * s;

      /* Se coloca por la CARA, no por el canto: "los ojos van al 68 % del
         ancho de la tarjeta" se lee y se corrige; "left: -17 %" no. */
      let left = cx * bw - ax * iw;
      let top = by + cy * bh - ay * ih;

      /* Y sin dejar de cubrir la tarjeta ni un pixel, contando el recorrido
         del puntero. Si lo pedido no cabe, se pega al canto: mas vale la cara
         un poco corrida que una franja de fondo a la vista. */
      const apretar = (v: number, lo: number, hi: number, m: number) =>
        (hi - m) - (lo + m) >= 0
          ? Math.min(hi - m, Math.max(lo + m, v))
          : Math.min(hi, Math.max(lo, v));
      left = apretar(left, bw - iw, libre * bw, MX);
      top = apretar(top, by + bh - ih, by, MY);

      cara.style.width = `${iw}px`;
      cara.style.height = `${ih}px`;
      cara.style.left = `${left}px`;
      cara.style.top = `${top}px`;
    };

    medir();
    /* Y otra vez cuando el video ya sabe cuanto mide: al montar, `videoWidth`
       todavia es 0 y la cuenta saldria con la medida de reserva. */
    const v0 = cara.querySelector<HTMLVideoElement>("video");
    v0?.addEventListener("loadedmetadata", medir);
    /* `ResizeObserver` y no `resize`: la lamina tambien cambia de medida
       cuando lo hace la tarjeta, sin que la ventana se mueva. */
    const ro = new ResizeObserver(medir);
    ro.observe(lamina);
    window.addEventListener("orientationchange", medir);
    return () => {
      ro.disconnect();
      v0?.removeEventListener("loadedmetadata", medir);
      window.removeEventListener("orientationchange", medir);
    };
  }, [ready]);
}


/* --------------------------------------------------------------- parpadeo */

/**
 * Los ojos parpadean.
 *
 * Es lo que separa dos puntos encendidos de una cara: sin esto la mirada es
 * fija y muerta por muy bien que siga al raton. Se APLASTA el ojo en vertical
 * en vez de apagarlo —apagarlo lo delata como un div que se enciende—, y de
 * vez en cuando van dos seguidos, que es como parpadea la gente.
 *
 * Va aparte del seguimiento del puntero: aquel no se monta en pantallas
 * tactiles, y ahi la cara se quedaria con la mirada congelada.
 */
export function useParpadeo(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    if (reducido()) return;
    registerGsap();

    const ojos = [...document.querySelectorAll<HTMLElement>(".orb-hero .orb-ojo")];
    if (!ojos.length) return;

    let reloj = 0;
    let tw: gsap.core.Tween | null = null;
    const pestanear = () => {
      tw = gsap.to(ojos, {
        scaleY: 0.08,
        duration: 0.075,
        ease: "power2.in",
        yoyo: true,
        repeat: 1,
        transformOrigin: "50% 50%",
        onComplete: () => {
          const doble = Math.random() < 0.28;
          reloj = window.setTimeout(pestanear, doble ? 190 : 2600 + Math.random() * 4200);
        },
      });
    };
    reloj = window.setTimeout(pestanear, 1800 + Math.random() * 2000);

    return () => {
      window.clearTimeout(reloj);
      tw?.kill();
      gsap.set(ojos, { clearProps: "scaleY,transformOrigin" });
    };
  }, [ready]);
}

/* -------------------------------------------------------------- AI Act */

/**
 * Las cifras se cuentan y los filetes se trazan al llegar.
 *
 * Vale para cualquier `[data-cuenta]` que NO viva en el encabezado —ese lo
 * lleva la entrada del hero— y para los filetes de las columnas de la
 * comparativa.
 *
 * `once: true`: el numero sube una vez. Un contador que se rebobina cada vez
 * que pasas por delante convierte un dato en un juguete.
 */
export function useActo(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const suave = !reducido();
    const limpiar: Array<() => void> = [];

    const cifras = [...document.querySelectorAll<HTMLElement>("[data-cuenta]")]
      .filter((el) => !el.closest(".orb-hero"));

    cifras.forEach((el) => {
      const fin = Number(el.dataset.cuenta) || 0;
      if (!suave) { el.textContent = String(fin); return; }
      const obj = { v: 0 };
      el.textContent = "0";
      const tw = gsap.to(obj, {
        v: fin,
        duration: 1.35,
        ease: "power2.out",
        snap: { v: 1 },
        onUpdate: () => { el.textContent = String(Math.round(obj.v)); },
        onComplete: () => { el.textContent = String(fin); },
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });
      limpiar.push(() => { tw.scrollTrigger?.kill(); tw.kill(); });
    });

    /* Los filetes de la comparativa NO se trazan aqui: los lleva `useCaida`,
       que ademas los ata al mismo recorrido en que las columnas se hunden.
       Trazarlos dos veces dejaba el segundo tween sobrescribiendo al primero. */

    return () => { limpiar.forEach((f) => f()); };
  }, [ready]);
}
