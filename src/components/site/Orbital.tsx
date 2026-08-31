"use client";

import { useEffect, useRef } from "react";

import { MenuWrapper, Nav } from "./Chrome";
import { reserva } from "./analytics";
import { casos, enlaces, img, ofertas } from "./content";

import { useHoverFx } from "@/motion/useHoverFx";
import { useMenu } from "@/motion/useMenu";
import { useNavLogo } from "@/motion/useNavLogo";
import { useReveals, playIntroReveals } from "@/motion/useReveals";
import { useSmoother } from "@/motion/useSmoother";
import { useCintaScroll, useOrbita, useParalajeOrb } from "@/motion/useOrbital";
import { useRodillo } from "@/motion/useDonut";
import { montarTilt } from "@/webgl/tilt";

import "lenis/dist/lenis.css";
import "./webflow-base.css";
import "./site.css";

const servicios = ofertas.filter((o) => o.tipo === "servicio");

/**
 * Direccion orbital para la portada.
 *
 * Las mecanicas salen de medir una referencia externa —galeria clavada de 4500
 * px con las piezas girando y escalando al doble, paralaje al 13 %, titular que
 * recorre 1584 px atado al scroll— pero el WebGL del encabezado esta escrito de
 * cero: se leyo su tecnica, no su codigo. El contenido, el color y la voz son
 * los de la casa.
 *
 * Ruta propia y sin indexar: es una propuesta para comparar, no un reemplazo.
 */
export default function Orbital() {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useReveals(true);
  useHoverFx(true);
  useMenu(true);
  useNavLogo(true);
  useSmoother(true, false);

  useOrbita(true);
  useParalajeOrb(true);
  useCintaScroll(true);
  useRodillo(true);

  useEffect(() => { playIntroReveals(); }, []);

  useEffect(() => {
    if (!lienzo.current) return;
    return montarTilt(lienzo.current, img.salaJuntas);
  }, []);

  return (
    <div className="orbital">
      <Nav cta={{ texto: "Reservar diagnóstico", href: enlaces.agenda, evento: "orb_nav" }} />
      <MenuWrapper />

      {/* ------------------------------------------------------------ hero */}
      <header className="orb-hero">
        <canvas ref={lienzo} className="orb-lienzo" aria-hidden="true" />
        <div className="orb-hero-copy">
          <h1 line="" className="orb-h1">
            <span>Sistemas de IA</span>
            <span>que ejecutan.</span>
          </h1>
          <p line="" className="orb-sub">
            Detectamos dónde pierde tiempo y dinero tu empresa, construimos el
            sistema y medimos el resultado.
          </p>
        </div>
        <div className="orb-hero-pie">
          <span>Madrid · Miami · Dubái</span>
          <span>Mueve el cursor</span>
        </div>
      </header>

      {/* --------------------------------------------------------- premisa */}
      <section className="orb-premisa">
        <div className="orb-cont">
          <div line="" className="orb-eti">( 01 — Premisa )</div>
          <h2 line="" className="orb-h2">
            No somos un proveedor de software. Construimos el sistema y
            respondemos del resultado.
          </h2>
          <figure className="orb-retrato">
            <img src={img.ejecutivo} alt="" loading="lazy" data-orb-par="5.57" />
          </figure>
        </div>
      </section>

      {/* ------------------------------------------------- galeria orbital */}
      {/* Se clava 4500 px y las piezas giran sobre una elipse; la que pasa por
          delante crece al doble. La medida sale de la referencia. */}
      <section className="orb-galeria">
        <div className="orb-galeria-cab">
          <div className="orb-eti">( 02 — Trabajo )</div>
          <h2 className="orb-h2-chico">Cinco sistemas en producción.</h2>
        </div>
        <div className="orb-pista">
          {casos.map((k, i) => (
            <article key={k.slug} className="orb-pieza">
              <a href={`/casos/${k.slug}/`} className="orb-pieza-a">
                <div className="orb-pieza-marco">
                  {k.video ? (
                    <video src={k.media} autoPlay loop muted playsInline preload="metadata" aria-label={k.alt} />
                  ) : (
                    <img src={k.media} alt={k.alt} loading="lazy" />
                  )}
                </div>
                <div className="orb-pieza-pie">
                  <span>{k.nombre}</span>
                  <span>({String(i + 1).padStart(2, "0")})</span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- capacidad */}
      <section className="orb-capacidad">
        <div className="orb-cont">
          <div line="" className="orb-eti">( 03 — Capacidad )</div>
          <ul className="orb-lista">
            {servicios.map((s) => (
              <li key={s.slug} className="orb-lista-fila">
                <a href={`/servicios/${s.slug}/`} data-rodillo="" className="drodillo">
                  <span>{s.nombre}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------- cierre */}
      <footer id="contacto" className="orb-cierre">
        {/* Recorre 1584 px atado al scroll: si el lector para, para. */}
        <div className="orb-cinta-w" aria-hidden="true">
          <div className="orb-cinta" data-orb-cinta="1584">Cuéntanos tu caso —</div>
        </div>

        <div className="orb-marcos">
          <figure><img src={img.proyectoBanca} alt="" loading="lazy" data-orb-par="13" /></figure>
          <figure><img src={img.proyectoFundos} alt="" loading="lazy" data-orb-par="15" /></figure>
        </div>

        <div className="orb-cont orb-cierre-c">
          <p line="" className="orb-cierre-p">
            Diagnóstico en 72 horas. Sin compromiso.
          </p>
          <a
            opacity=""
            href={enlaces.agenda}
            onClick={reserva("orb_cierre", "final")}
            className="orb-btn"
          >
            Reservar diagnóstico
          </a>
          <a href={enlaces.email} data-rodillo="" className="drodillo orb-mail">
            <span>info@theaibusiness.com</span>
          </a>
          <div className="orb-pie">
            <span>©2026 — The AI Business</span>
            <span>Madrid · Miami · Dubái</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
