"use client";

import { useEffect, useState } from "react";
import { gsap, registerGsap } from "./gsap";
import { playIntroReveals } from "./useReveals";

const KEY = "nothin:loader-played";

/* --- reparto de los 10 segundos --- */
const ENTRADA = 0.9;      // la marca aparece, cerrada
const ABRIR = 0.7;        // la A y la I se separan
const DESFILE = 6.6;      // los objetos pasan por el hueco
const CERRAR = 0.6;       // las letras vuelven a su sitio
const SALIDA = 0.45;      // la marca se retira
const PERSIANA = 1.1;     // la placa sube y descubre la pagina
const TOTAL = ENTRADA + ABRIR + DESFILE + CERRAR + SALIDA + PERSIANA; // ~10.35 s

/* Ritmo del desfile: segundos que dura cada objeto en pantalla. Empieza lento,
   se acelera en mitad y vuelve a frenar — de ahi el seno. */
const PASO_LENTO = 0.30;
const PASO_RAPIDO = 0.07;
const paso = (avance: number) =>
  PASO_RAPIDO + (PASO_LENTO - PASO_RAPIDO) * (1 - Math.sin(Math.min(avance, 1) * Math.PI));

/* Margen del vigilante: si a los 15 s la placa sigue puesta, algo se congelo. */
const WATCHDOG = 15000;

/** Bandera del "hero ya descubierto" — ver el comentario de abajo. */
export const HERO_REVEALED = "__heroRevealed" as const;

const anunciarHeroDescubierto = () => {
  (window as unknown as Record<string, boolean>)[HERO_REVEALED] = true;
  window.dispatchEvent(new Event("loader:hero-revealed"));
};

/*
 * `loader:hero-revealed` es un evento: quien se suscriba despues de que se haya
 * emitido no se entera nunca. En una recarga dentro de la misma pestana el
 * loader se salta y lo emite de forma sincrona dentro de su efecto, antes de
 * que `useSmoother` haya podido escuchar — y Lenis se quedaba parado para
 * siempre. La bandera global arregla eso.
 */

const yaVisto = () => {
  try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; }
};
const marcarVisto = () => {
  try { sessionStorage.setItem(KEY, "1"); } catch {}
};

/**
 * La pantalla de carga.
 *
 * Diez segundos: la marca blanca entra cerrada, la A y la I se separan, y por
 * el hueco desfilan los objetos uno detras de otro —acelerando hasta la mitad
 * y frenando despues— girando sobre si mismos y repitiendose. Al final las
 * letras se cierran, la marca se retira y la placa sube como una persiana.
 *
 * Devuelve `done` cuando la pagina de debajo ya esta viva.
 */
export function useLoader() {
  const [listo, setListo] = useState(false);

  useEffect(() => {
    registerGsap();

    const placa = document.querySelector<HTMLElement>(".loader");
    const letraA = document.querySelector<HTMLElement>(".cargando-a");
    const letraI = document.querySelector<HTMLElement>(".cargando-i");
    const marca = document.querySelector<HTMLElement>(".cargando-marca");
    const objetos = [...document.querySelectorAll<HTMLElement>(".cargando-objeto")];

    // Segunda visita en la misma pestana: directo a la pagina.
    if (!placa || yaVisto() || !letraA || !letraI || !marca || !objetos.length) {
      if (placa) gsap.set(placa, { display: "none" });
      playIntroReveals(false, true);
      window.dispatchEvent(new Event("loader:hero-reveal-start"));
      anunciarHeroDescubierto();
      const salto = requestAnimationFrame(() => setListo(true));
      return () => cancelAnimationFrame(salto);
    }

    const desbloquear = () => { document.documentElement.style.overflow = ""; };
    document.documentElement.style.overflow = "hidden";

    let asentado = false;

    /* Cuanto se separan la A y la I, en vh — la misma unidad que el alto de
       las letras y del hueco, para que la escena escale a la vez. El objeto
       mide 19vh, asi que 22 le deja unos 2vh de aire a cada lado: abierto de
       sobra para que respire, y sin alejar la I mas de la cuenta. */
    const HUECO = 22;

    const tl = gsap.timeline({
      onComplete: () => {
        asentado = true;
        marcarVisto();
        gsap.set(placa, { display: "none" });
        desbloquear();
        anunciarHeroDescubierto();
        setListo(true);
      },
    });

    gsap.set(objetos, { autoAlpha: 0, scale: 0.94 });
    gsap.set([letraA, letraI], { x: 0 });

    /* 1. entrada de la marca, todavia cerrada */
    tl.fromTo(marca,
      { autoAlpha: 0, scale: 0.86, filter: "blur(14px)" },
      { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: ENTRADA, ease: "power3.out" });

    /* 2. la A y la I se separan */
    tl.to(letraA, { x: `-${HUECO / 2}vh`, duration: ABRIR, ease: "power3.inOut" }, "abre")
      .to(letraI, { x: `${HUECO / 2}vh`, duration: ABRIR, ease: "power3.inOut" }, "abre");

    /* 3. el desfile: los objetos se van sustituyendo en el hueco, uno detras
       de otro, acelerando hasta la mitad y frenando despues. */
    const inicio = tl.duration();
    /* Los objetos ya no cruzan girando: aparecen y desaparecen en el sitio,
       como un pase de diapositivas. La entrada es casi un corte —una fraccion
       del turno— para que el cambio se lea limpio incluso en los turnos mas
       cortos, y cada uno se apaga justo cuando entra el siguiente. */
    const ENTRAR = 0.055;
    let t = 0;
    let i = 0;
    while (t < DESFILE) {
      const turno = paso(t / DESFILE);
      const obj = objetos[i % objetos.length];
      const aparecer = Math.min(ENTRAR, turno * 0.4);

      tl.fromTo(obj,
        { autoAlpha: 0, scale: 0.94 },
        { autoAlpha: 1, scale: 1, duration: aparecer, ease: "power2.out" },
        inicio + t);
      tl.to(obj,
        { autoAlpha: 0, duration: aparecer, ease: "power2.in" },
        inicio + t + turno - aparecer);

      t += turno;
      i += 1;
    }

    /* Los tramos finales se colocan en tiempos absolutos. Encadenandolos sin
       posicion, GSAP los pone detras de la pasada mas larga del desfile —que
       se sale de su tramo por el solape— y los diez segundos se iban a doce. */
    const cierre = inicio + DESFILE;

    /* 4. las letras vuelven a su forma original */
    tl.to(objetos, { autoAlpha: 0, duration: 0.3, ease: "power2.out" }, cierre)
      .to(letraA, { x: 0, duration: CERRAR, ease: "power3.inOut" }, cierre)
      .to(letraI, { x: 0, duration: CERRAR, ease: "power3.inOut" }, cierre);

    /* 5. salida de la marca y persiana */
    tl.to(marca,
      { autoAlpha: 0, scale: 0.94, filter: "blur(10px)", duration: SALIDA, ease: "power2.in" },
      cierre + CERRAR);
    tl.to(placa, {
      height: 0,
      duration: PERSIANA,
      ease: "power4.inOut",
      onStart: () => {
        window.dispatchEvent(new Event("loader:hero-reveal-start"));
        playIntroReveals();
      },
    }, cierre + CERRAR + SALIDA);

    /* `setTimeout` sigue corriendo en pestanas de fondo (solo se estrangula a
       ~1 s), asi que sirve de red donde `requestAnimationFrame` no llega: si la
       pestana se va de primer plano durante la animacion, GSAP se congela, el
       `onComplete` no llega nunca y el documento se quedaria bloqueado. */
    const vigilante = window.setTimeout(() => {
      if (asentado) return;
      tl.kill();
      gsap.set(placa, { display: "none", height: 0 });
      desbloquear();
      marcarVisto();
      playIntroReveals(false, true);
      window.dispatchEvent(new Event("loader:hero-reveal-start"));
      anunciarHeroDescubierto();
      setListo(true);
    }, WATCHDOG);

    /* Ojo: `marcarVisto()` solo se llama al TERMINAR, nunca al montar. En
       desarrollo React monta el efecto dos veces, y marcandolo aqui el segundo
       montaje leia "ya visto" y se saltaba la animacion entera: la pantalla de
       carga no llegaba a verse. */

    return () => {
      window.clearTimeout(vigilante);
      tl.kill();
      desbloquear();
    };
  }, []);

  return listo;
}

/** Duracion nominal de la pantalla de carga, en segundos. */
export const DURACION_CARGA = TOTAL;
