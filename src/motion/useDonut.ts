"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText, registerGsap } from "./gsap";

/**
 * Los movimientos de la pagina de estudio.
 *
 * La referencia esta hecha en Framer y su motor de animacion es declarativo, no
 * un `scripts.min.js` propio: se pueden leer los valores en vez de deducirlos a
 * ojo. Estos cinco son los que sostienen la pagina —cinta infinita, paralaje,
 * revelado palabra a palabra, acordeon y texto rodante— y se reconstruyen aqui
 * con GSAP, que es la herramienta de la casa.
 */

const reducido = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* --------------------------------------------------------- cinta infinita */

/**
 * El texto gigante que desfila sin fin.
 *
 * El truco es que el contenido esta duplicado en el DOM y el tween recorre
 * exactamente la mitad del ancho: al llegar, la segunda copia esta justo donde
 * estaba la primera, asi que el salto a cero es invisible. Medir con
 * `scrollWidth / 2` en vez de con un porcentaje fijo es lo que permite cambiar
 * el texto sin recalcular nada.
 *
 * Va con reloj propio, no con `scrub`: una cinta que solo avanza cuando el
 * lector mueve la rueda se lee como algo roto, no como algo vivo.
 */
export function useMarquesina(ready: boolean) {
  useEffect(() => {
    if (!ready || reducido()) return;
    registerGsap();

    const cintas = [...document.querySelectorAll<HTMLElement>("[data-cinta]")];
    const tweens = cintas.map((cinta) => {
      const via = cinta.querySelector<HTMLElement>(".cinta-via");
      if (!via) return null;
      const mitad = () => via.scrollWidth / 2;
      /* Velocidad en pixeles por segundo, no en segundos totales: si no, una
         cinta con mas texto iria mas rapida que otra con menos.
         105 px/s es el valor MEDIDO sobre la referencia siguiendo la posicion
         en pantalla de sus copias con el scroll congelado: se desplazaban ~44
         px cada 430 ms. Va con reloj propio y no depende del scroll — se
         comprobo moviendo la pagina y la cadencia no cambio. */
      const vel = Number(cinta.dataset.cinta) || 90;
      const dir = cinta.dataset.cintaDir === "-1" ? 1 : -1;
      return gsap.to(via, {
        x: () => dir * mitad(),
        duration: () => mitad() / vel,
        ease: "none",
        repeat: -1,
        modifiers: { x: (x) => `${gsap.utils.wrap(-mitad(), 0, parseFloat(x))}px` },
      });
    });

    return () => { tweens.forEach((t) => t?.kill()); };
  }, [ready]);
}

/* ----------------------------------------------------------------- paralaje */

/**
 * Las imagenes que se mueven a distinta velocidad que la pagina.
 *
 * El recorrido se expresa en porcentaje de la propia altura de la pieza, no en
 * pixeles: asi una imagen alta se desplaza mas que una baja y las dos tardan lo
 * mismo en cruzar la pantalla. `invalidateOnRefresh` recalcula al redimensionar
 * —sin eso, girar el movil deja el recorrido del tamano anterior.
 */
export function useParalaje(ready: boolean) {
  useEffect(() => {
    if (!ready || reducido()) return;
    registerGsap();

    const piezas = [...document.querySelectorAll<HTMLElement>("[data-paralaje]")];
    const tweens = piezas.map((el) => {
      /* 10 es el valor medido en las capas grandes de la referencia: -0,1000
         px por cada px de scroll, en sentido contrario. Sus bloques de texto
         van al 5,75 %. */
      const pct = Number(el.dataset.paralaje) || 10;
      return gsap.fromTo(
        el,
        { yPercent: pct },
        {
          yPercent: -pct,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    return () => { tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); }); };
  }, [ready]);
}

/* ---------------------------------------------------------------- revelado */

/**
 * El parrafo que se enciende palabra a palabra segun se baja.
 *
 * Las palabras arrancan a media opacidad en vez de invisibles: la frase se lee
 * entera desde el principio y lo que hace el scroll es subrayar por donde va.
 * Si arrancasen a cero, el lector estaria mirando un hueco.
 *
 * `SplitText` se revierte al desmontar; sin eso, cada remontaje en desarrollo
 * volvia a partir un texto ya partido y las palabras se anidaban.
 */
export function useRevelado(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const dianas = [...document.querySelectorAll<HTMLElement>("[data-revelado]")];
    if (!dianas.length) return;

    if (reducido()) {
      dianas.forEach((el) => { el.style.opacity = "1"; });
      return;
    }

    const partidos = dianas.map((el) => new SplitText(el, { type: "words" }));
    const tweens = partidos.map((sp, i) =>
      gsap.fromTo(
        sp.words,
        { opacity: 0.22 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.4,
          scrollTrigger: {
            trigger: dianas[i],
            start: "top 78%",
            end: "bottom 55%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      ),
    );

    return () => {
      tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
      partidos.forEach((sp) => sp.revert());
    };
  }, [ready]);
}

/* ---------------------------------------------------------------- acordeon */

/**
 * Las filas que se abren al pulsarlas.
 *
 * La altura se anima a `auto` y no a un numero: el detalle de cada fila tiene
 * el largo que tiene, y fijar una altura obligaria a recortar el texto largo o
 * a dejar un hueco en el corto. GSAP resuelve `auto` midiendo antes de animar.
 *
 * Solo una abierta a la vez. Es un indice, y dos filas abiertas empujan la
 * siguiente fuera de pantalla mientras la lees.
 */
export function useAcordeon(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    /* Un acordeon por contenedor, NO todas las filas de la pagina: hay dos
       bloques —servicios y modelos— y agruparlos hacia que abrir un servicio
       cerrase un modelo, y que el segundo bloque arrancase entero cerrado. */
    const grupos = [...document.querySelectorAll<HTMLElement>(".acordeon")]
      .map((g) => [...g.querySelectorAll<HTMLElement>(".acordeon-fila")])
      .filter((g) => g.length);
    if (!grupos.length) return;

    const cerrar = (fila: HTMLElement) => {
      const cuerpo = fila.querySelector<HTMLElement>(".acordeon-cuerpo");
      if (!cuerpo) return;
      fila.classList.remove("abierta");
      fila.querySelector(".acordeon-cabeza")?.setAttribute("aria-expanded", "false");
      gsap.to(cuerpo, { height: 0, duration: 0.42, ease: "power2.inOut",
        onComplete: () => ScrollTrigger.refresh() });
    };

    const abrir = (fila: HTMLElement) => {
      const cuerpo = fila.querySelector<HTMLElement>(".acordeon-cuerpo");
      if (!cuerpo) return;
      fila.classList.add("abierta");
      fila.querySelector(".acordeon-cabeza")?.setAttribute("aria-expanded", "true");
      gsap.to(cuerpo, { height: "auto", duration: 0.48, ease: "power2.out",
        onComplete: () => ScrollTrigger.refresh() });
    };

    const manejadores = grupos.flatMap((filas) =>
      filas.map((fila) => {
        const cabeza = fila.querySelector<HTMLElement>(".acordeon-cabeza");
        if (!cabeza) return null;
        const fn = () => {
          const abierta = fila.classList.contains("abierta");
          // Solo se cierran las hermanas del MISMO bloque.
          filas.forEach((f) => f.classList.contains("abierta") && cerrar(f));
          if (!abierta) abrir(fila);
        };
        cabeza.addEventListener("click", fn);
        return { cabeza, fn };
      }),
    );

    // La primera de CADA bloque abierta: uno entero cerrado no ensena que se abre.
    grupos.forEach((filas) => filas[0] && abrir(filas[0]));

    return () => {
      manejadores.forEach((m) => m?.cabeza.removeEventListener("click", m.fn));
    };
  }, [ready]);
}

/* ----------------------------------------------------------- texto rodante */

/**
 * El enlace cuya etiqueta rueda hacia arriba al pasar por encima.
 *
 * La referencia lo hace sin duplicar el nodo: pinta la copia con
 * `text-shadow: 0 <alto de linea> 0 <color>` —una sombra solida colocada justo
 * una linea por debajo— y desplaza el bloque dentro de un contenedor con
 * `overflow:hidden`. Una sola palabra en el DOM, ninguna copia que mantener
 * sincronizada, y los lectores de pantalla leen el enlace una vez.
 *
 * Todo el efecto vive en CSS; esto solo marca los enlaces que lo llevan para no
 * tener que repetir la variable de alto de linea en cada uno.
 */
export function useRodillo(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    const enlaces = [...document.querySelectorAll<HTMLElement>("[data-rodillo]")];
    enlaces.forEach((el) => {
      const alto = Math.round(parseFloat(getComputedStyle(el).lineHeight));
      if (Number.isFinite(alto)) el.style.setProperty("--rodillo-alto", `${alto}px`);
    });
  }, [ready]);
}

/* ------------------------------------------------------------ tinta de nav */

/**
 * El color de la barra fija, atado a la seccion que tiene debajo.
 *
 * La barra no se mueve y el fondo cambia cuatro veces —negro, rojo, azul,
 * gris—, asi que un color fijo se pierde en al menos dos tramos: sobre el rojo
 * la barra quedaba en azul sobre rojo, ilegible.
 *
 * Se resuelve leyendo la tinta que ya declara cada seccion en CSS y copiandola
 * a una variable que usa la barra. El disparador se ajusta a la altura de la
 * barra, no a la mitad de la pantalla: lo que importa es que cambie cuando la
 * seccion pasa POR DETRAS de ella, no cuando llega al centro.
 */
export function useNavTinta(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    registerGsap();

    const raiz = document.querySelector<HTMLElement>(".donut");
    const secciones = [...document.querySelectorAll<HTMLElement>(".dsec")];
    if (!raiz || !secciones.length) return;

    const pintar = (el: HTMLElement) => {
      const tinta = getComputedStyle(el).getPropertyValue("--dtinta").trim();
      if (tinta) raiz.style.setProperty("--nav-ink", tinta);
    };

    const triggers = secciones.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 72px",
        end: "bottom 72px",
        onEnter: () => pintar(el),
        onEnterBack: () => pintar(el),
      }),
    );

    pintar(secciones[0]);
    return () => { triggers.forEach((t) => t.kill()); };
  }, [ready]);
}
