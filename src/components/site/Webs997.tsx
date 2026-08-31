"use client";

import { useEffect } from "react";

import { MenuWrapper, Nav } from "./Chrome";
import { reserva } from "./analytics";
import { enlaces, img, video, webs997 as c } from "./content";

import { useEagerImages } from "@/motion/useEagerImages";
import { useHoverFx } from "@/motion/useHoverFx";
import { useMenu } from "@/motion/useMenu";
import { useNavLogo } from "@/motion/useNavLogo";
import { useReveals, playIntroReveals } from "@/motion/useReveals";
import { useSmoother } from "@/motion/useSmoother";
import { useCarrusel, useMuestras, usePila, usePrecio, useTachado, useTinte } from "@/motion/useWebs";

import "lenis/dist/lenis.css";
import "./webflow-base.css";
import "./site.css";

/**
 * Landing de la linea de webs a precio cerrado.
 *
 * Comparte con la portada el sistema —Inter, la paleta, Lenis, GSAP con
 * `scrub`, los reveals por linea y la disolucion de fluido del hero— pero NO su
 * estructura: aqui el scroll tacha una palabra, reparte una pila de ventanas,
 * arrastra el proceso en horizontal y asienta el precio como un contador
 * mecanico. Ninguna de esas composiciones existe en la portada.
 *
 * Y donde la portada es negra de principio a fin, esta recorre el color:
 * negro, rojo, blanco, azul y vuelta al negro. El fondo es la estructura, no un
 * acento.
 *
 * Sin pantalla de carga: la de la portada dura diez segundos y aqui seria un
 * peaje delante de una oferta.
 */
export default function Webs997() {
  useEagerImages(true);
  useReveals(true);
  useHoverFx(true);
  useMenu(true);
  useNavLogo(true);
  useSmoother(true, false);

  useTinte(true);
  useTachado(true);
  usePila(true);
  useCarrusel(true);
  useMuestras(true);
  usePrecio(true);

  /* Sin loader no hay nada que descubra lo que la hoja de estilos deja en
     `opacity:0`: hay que soltarlo a mano o los textos no llegan a verse. */
  useEffect(() => { playIntroReveals(); }, []);

  return (
    <div className="webs">
      <Nav cta={{ texto: "Cuéntanos tu caso", href: enlaces.email, evento: "webs_contacto" }} />
      <MenuWrapper />

      {/* --------------------------------------------------------- hero */}
      {/* Una sola composicion a pantalla completa: video a sangre, la marca
          arriba a la izquierda, el titular en el tercio superior y la banda de
          condiciones dentro del fundido de abajo. Nada mas: ni tarjetas, ni
          chips, ni bloques secundarios.

          Las medidas van en `--u`, que es 1/1058 del ALTO de la ventana. Atar
          el ritmo vertical al alto —y no al ancho— es lo que hace que la
          composicion llene la pantalla igual en un portatil que en un monitor
          panoramico, sin recolocar nada a mano. */}
      <header className="hero-video" data-fondo="#050505" data-tinta="#FAFAFA">
        <div className="plate">
          <video
            className="plate-video"
            src={video.webHero}
            poster={img.webHeroPoster}
            autoPlay loop muted playsInline preload="auto" aria-hidden="true"
          />
        </div>

        <div className="hero-copy">
          <h1 className="hv-h">
            <span>{c.titularA}</span>
            <span>{c.titularB} <em className="hv-precio">{c.titularPrecio}</em></span>
          </h1>

          <p className="hv-sub">
            <span>{c.subA}</span>
            <span>{c.subB}</span>
          </p>

          <div className="hv-acciones">
            <a
              href={enlaces.email}
              onClick={reserva("webs_contacto", "hero")}
              className="hv-pill"
            >
              <span>Cuéntanos tu caso</span>
            </a>
            <a href="#incluye" className="hv-ghost">{c.ghost}</a>
          </div>
        </div>

        <div className="hv-banda">
          {c.banda.map((b) => <span key={b}>{b}</span>)}
        </div>
      </header>

      {/* ---------------------------------------------------- la negacion */}
      <section className="section negacion" data-fondo="#FA4D4D" data-tinta="#0B0B0F">
        <div className="container">
          {/* Sin `line`: SplitText envuelve cada trozo en su mascara de linea,
              que es de bloque, y partia la frase en cuatro renglones dejando los
              puntos sueltos como vinetas. Aqui el reveal es una entrada simple y
              el trazo lo dibuja el scroll. */}
          <h2 opacity="" className="negacion-h">
            {c.negacionAntes}{" "}
            <span className="marcado">
              {c.negacionTachada}
              <i className="trazo trazo-tachado" aria-hidden="true" />
            </span>.
            <br />
            {c.negacionDespues}{" "}
            <span className="marcado">
              {c.negacionSubrayada}
              <i className="trazo trazo-subrayado" aria-hidden="true" />
            </span>.
          </h2>
          <div className="space-65" />
          <p line="" className="negacion-apoyo">{c.negacionApoyo}</p>
        </div>
      </section>

      {/* -------------------------------------------------------- la pila */}
      <section id="incluye" className="section pila" data-fondo="#F2F2F5" data-tinta="#0B0B0F">
        <div className="pila-w">
          <div className="pila-texto">
            <div line="" className="etiqueta">{c.pilaEtiqueta}</div>
            <h2 line="" className="pila-h">
              {c.pilaTitulo.split("\n").map((l, i) => (
                <span key={l}>{i > 0 && <br />}{l}</span>
              ))}
            </h2>
            <div className="pila-precio">997&thinsp;€</div>
          </div>

          {/* Cinco ventanas apiladas como un mazo; el scroll las reparte. */}
          <div className="pila-mazo">
            {c.incluye.map((it, i) => (
              <article key={it.nombre} className="pila-carta">
                <div className="carta-barra">
                  <span /><span /><span />
                  <div className="carta-n">{String(i + 1).padStart(2, "0")}</div>
                </div>
                <div className="carta-cuerpo">
                  <h3 className="carta-titulo">{it.nombre}</h3>
                  <p className="carta-detalle">{it.detalle}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ las muestras */}
      {/* Va pegada a "Cinco cosas" y en su mismo tramo de color: primero lo que
          te llevas, inmediatamente despues como se ve. Prometer webs que
          venden sin ensenar ninguna es pedirle al lector que se fie.

          Son dos, y dos piezas alineadas se leen como una rejilla incompleta.
          Entran desalineadas a proposito —la segunda arranca mas abajo— y el
          scroll separa mas todavia. */}
      <section className="section muestras" data-fondo="#F2F2F5" data-tinta="#0B0B0F">
        <div className="container">
          <div line="" className="etiqueta">{c.muestrasEtiqueta}</div>
          <h2 line="" className="muestras-h">{c.muestrasTitulo}</h2>
          <p line="" className="muestras-p">{c.muestrasApoyo}</p>
        </div>
        <div className="muestras-par">
          {c.muestras.map((m) => (
            <figure key={m.src} opacity="" className="muestra">
              <img src={img[m.src]} alt={m.alt} loading="lazy" />
            </figure>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------- el proceso */}
      <section className="section proceso" data-fondo="#5A70FA" data-tinta="#FFFFFF">
        <div className="proceso-cabecera container">
          <div line="" className="etiqueta">{c.procesoEtiqueta}</div>
          <h2 line="" className="proceso-h">{c.procesoTitulo}</h2>
          <p line="" className="proceso-p">{c.proceso}</p>
        </div>
        <div className="proceso-pista">
          <div className="proceso-carril">
            {c.pasos.map((p) => (
              <article key={p.n} className="wfase">
                <div className="wfase-n">{p.n}</div>
                <h3 className="wfase-nombre">{p.nombre}</h3>
                <p className="wfase-detalle">{p.detalle}</p>
              </article>
            ))}
            <article className="wfase fase-cierre">
              <div className="wfase-n">→</div>
              <h3 className="wfase-nombre">Tu web, online.</h3>
              <a
                href={enlaces.email}
                onClick={reserva("webs_contacto", "proceso")}
                className="wfase-enlace"
              >
                Cuéntanos tu caso
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ el precio */}
      <section className="section precio" data-fondo="#000000" data-tinta="#FFFFFF">
        <div className="container precio-c">
          <div line="" className="etiqueta">{c.precioEtiqueta}</div>
          <div className="precio-rodillo" data-precio={c.precio} aria-label={`${c.precio} euros`}>
            {[...c.precio].map((_, i) => (
              <span key={i} className="rodillo" aria-hidden="true">0</span>
            ))}
            <span className="rodillo-moneda" aria-hidden="true">€</span>
          </div>
          <h2 line="" className="precio-h">{c.precioTitulo}</h2>
          <p line="" className="precio-p">{c.precioApoyo}</p>
        </div>
      </section>

      {/* ------------------------------------------------------- el cierre */}
      <footer id="contacto" className="section cierre" data-fondo="#0B0B0F" data-tinta="#FFFFFF">
        <div className="container cierre-c">
          <h2 line="" className="cierre-h">
            {c.cierre.split("\n").map((l, i) => (
              <span key={l}>{i > 0 && <br />}{l}</span>
            ))}
          </h2>
          <p line="" className="cierre-p">{c.cierreApoyo}</p>
          <a
            opacity=""
            href={enlaces.email}
            onClick={reserva("webs_contacto", "final")}
            className="cierre-btn"
          >
            info@theaibusiness.com
          </a>
          <div className="cierre-pie">
            <span>©2026 — The AI Business</span>
            <span>Madrid · Miami · Dubái</span>
            <span>Precio cerrado</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
