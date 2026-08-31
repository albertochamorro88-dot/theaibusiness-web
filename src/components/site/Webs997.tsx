"use client";

import { useEffect } from "react";

import { MenuWrapper, Nav } from "./Chrome";
import { reserva } from "./analytics";
import { enlaces, img, video, webs997 as c } from "./content";

import { useEagerImages } from "@/motion/useEagerImages";
import { useHero } from "@/motion/useHero";
import { useHoverFx } from "@/motion/useHoverFx";
import { useMenu } from "@/motion/useMenu";
import { useNavLogo } from "@/motion/useNavLogo";
import { useReveals, playIntroReveals } from "@/motion/useReveals";
import { useSmoother } from "@/motion/useSmoother";
import { useVideos } from "@/motion/useVideos";
import { useCarrusel, usePila, usePrecio, useTachado, useTinte } from "@/motion/useWebs";

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
  useHero(true);
  useSmoother(true, false);

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
      <div className="section-w" data-fondo="#000000" data-tinta="#FFFFFF">
        <div className="section-fake-hero">
          <div className="div-block">
            <div delay="1.5" line="" no-scroll="" className="p-l">
              {c.entrada.split("\n").map((l, i) => (
                <span key={l}>{i > 0 && <br />}{l}</span>
              ))}
            </div>
            <div className="space-24" />
            <a
              delay="2" opacity="" no-scroll=""
              href={enlaces.email}
              onClick={reserva("webs_contacto", "hero")}
              className="btn black-blend w-inline-block"
            >
              <div className="btn__text"><p className="btn__text-p">Cuéntanos tu caso</p></div>
              <div className="arrow-w">
                <div className="arrow black-blend">
                  <div className="line-arrow" />
                  <div className="shape-arrow" />
                </div>
              </div>
            </a>
          </div>
          <div className="link-hero-bottom-w">
            <div delay="1.5" line="" no-scroll="">{c.pie}</div>
            <div delay="1.5" opacity="" no-scroll="" className="link-hero-lang-w">
              <div className="link-hero-w">
                <a href={enlaces.email} className="link w-inline-block"><div>info@theaibusiness.com</div></a>
              </div>
              <a href="#" className="link-lang w-inline-block"><div>ES</div></a>
            </div>
          </div>
        </div>

        <video src={video.heroFondo} autoPlay loop muted playsInline className="video-hero-bg" />

        <section className="section hero-home">
          <div className="container hero-home">
            <div className="nothin-hero-w">
              <img src={img.marca997} alt="997 €" className="marca-hero marca-997" />
            </div>
          </div>
        </section>
      </div>

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
