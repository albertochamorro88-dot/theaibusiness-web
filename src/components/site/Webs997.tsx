"use client";

import { useEffect } from "react";

import { MenuWrapper, Nav } from "./Chrome";
import { reserva } from "./analytics";
import { enlaces, webs997 as c } from "./content";

import { useEagerImages } from "@/motion/useEagerImages";
import { useHoverFx } from "@/motion/useHoverFx";
import { useMenu } from "@/motion/useMenu";
import { useNavLogo } from "@/motion/useNavLogo";
import { useReveals, playIntroReveals } from "@/motion/useReveals";
import { useSmoother } from "@/motion/useSmoother";
import { useVideos } from "@/motion/useVideos";
import { useAurora, useCarrusel, usePila, usePrecio, useTachado, useTinte } from "@/motion/useWebs";

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
  useVideos(true);
  useHoverFx(true);
  useMenu(true);
  useNavLogo(true);
  useSmoother(true, false);

  useAurora(true);
  useTinte(true);
  useTachado(true);
  usePila(true);
  useCarrusel(true);
  usePrecio(true);

  /* Sin loader no hay nada que descubra lo que la hoja de estilos deja en
     `opacity:0`: hay que soltarlo a mano o los textos no llegan a verse. */
  useEffect(() => { playIntroReveals(); }, []);

  return (
    <div className="webs">
      <Nav cta={{ texto: "Cuéntanos tu caso", href: enlaces.email, evento: "webs_contacto" }} />
      <MenuWrapper />

      {/* --------------------------------------------------------- hero */}
      {/* Sin video y sin la disolucion de fluido de la portada: aqui no hay
          nada debajo que descubrir. El titular es texto real —se puede
          seleccionar, indexar y partir por lineas— y el movimiento lo pone el
          fondo, que deriva solo y sigue al cursor. */}
      <header className="hero-webs" data-fondo="#000000" data-tinta="#FFFFFF">
        <div className="aurora" aria-hidden="true">
          <span className="aurora-mancha aurora-roja" />
          <span className="aurora-mancha aurora-azul" />
          <span className="aurora-grano" />
        </div>

        <div className="container hero-webs-c">
          <div delay="0.2" line="" className="etiqueta hero-epigrafe">{c.epigrafe}</div>

          <h1 className="hero-h">
            <span delay="0.35" line="" className="hero-linea">{c.titularA}</span>
            <span delay="0.45" line="" className="hero-linea">{c.titularB}</span>
            <span delay="0.6" line="" className="hero-linea hero-linea-precio">
              {c.titularC} <em className="hero-precio">{c.titularPrecio}</em>
            </span>
          </h1>

          {/* Sin `<br>`: cada salto se convierte en una linea con su mascara y
              el hueco entre las dos frases se leia como dos parrafos. Se deja
              que envuelva sola contra su ancho maximo. */}
          <div delay="0.9" line="" className="hero-entrada">
            {c.entrada.replace("\n", " ")}
          </div>

          <a
            delay="1.1" opacity=""
            href={enlaces.email}
            onClick={reserva("webs_contacto", "hero")}
            className="hero-cta"
          >
            Cuéntanos tu caso
            <svg width="15" height="10" viewBox="0 0 15 10" fill="none" aria-hidden="true">
              <path d="M9.5 0.5L14 5L9.5 9.5" stroke="currentColor" strokeWidth="1.2" />
              <line y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </a>

          <div delay="1.2" opacity="" className="hero-pie">
            <span>{c.pie}</span>
            <a href={enlaces.email} className="hero-pie-mail">info@theaibusiness.com</a>
          </div>
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
      <section className="section pila" data-fondo="#F2F2F5" data-tinta="#0B0B0F">
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
