"use client";

import { useEffect, useRef } from "react";

import { MenuWrapper, Nav } from "./Chrome";
import { reserva } from "./analytics";
import { enlaces, img, video, webs997 as w } from "./content";

import { useHoverFx } from "@/motion/useHoverFx";
import { useMenu } from "@/motion/useMenu";
import { useNavLogo } from "@/motion/useNavLogo";
import { useReveals, playIntroReveals } from "@/motion/useReveals";
import { useSmoother } from "@/motion/useSmoother";
import { useCintaScroll, useHeroEntrada, useLetras, useOrbita, useParalajeOrb, useTapado } from "@/motion/useOrbital";
import { useRodillo } from "@/motion/useDonut";
import { montarTilt } from "@/webgl/tilt";

import "lenis/dist/lenis.css";
import "./webflow-base.css";
import "./site.css";

/* Las piezas de la orbita son webs, no casos de IA: esta pagina vende la linea
   de webs a precio cerrado. Solo hay dos maquetas reales; las tres restantes
   son huecos declarados, con su medida escrita dentro para sustituir. */
const G = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/media/img/estudio`;
const muestras = [
  { src: `${G}/web-01.webp`, nombre: "Web 01" },
  { src: `${G}/web-02.webp`, nombre: "Web 02" },
  { src: `${G}/web-03.webp`, nombre: "Web 03" },
  { src: `${G}/web-04.webp`, nombre: "Web 04" },
  { src: `${G}/web-05.webp`, nombre: "Web 05" },
];

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
  useTapado(true);
  useLetras(true);
  useHeroEntrada(true);
  useRodillo(true);

  useEffect(() => { playIntroReveals(); }, []);

  useEffect(() => {
    if (!lienzo.current) return;
    return montarTilt(lienzo.current, video.estudioHero);
  }, []);

  return (
    <div className="orbital">
      <Nav cta={{ texto: "Cuéntanos tu caso", href: enlaces.email, evento: "orb_nav" }} />
      <MenuWrapper />

      {/* ------------------------------------------------------------ hero */}
      <header className="orb-hero">
        {/* Tres palabras repartidas de canto a canto. Antes eran dos lineas de
            frase completa dentro de media pagina: cuarenta caracteres a 4,5
            rem no son un titular, son un parrafo grande. El precio sale del
            titulo y baja a su propio bloque, donde ademas se lee mejor. */}
        <h1 className="orb-h1">
          <span data-palabra="">Webs</span>
          <span data-palabra="">que</span>
          <span data-palabra="">convierten</span>
        </h1>

        <div className="orb-hero-fila">
          <div className="orb-hero-copy">
            <p className="orb-precio-b">
              <em className="orb-precio">{w.titularPrecio}</em>
              <span className="orb-precio-t">Precio cerrado</span>
            </p>
            <p line="" className="orb-sub">
              {w.subA} {w.subB}
            </p>
          </div>

          {/* El video vive en su propio marco a la derecha, no a sangre:
              rodeado de negro se lee como una pieza, y la inclinacion hacia el
              cursor se percibe mucho mejor cuando hay borde contra el que
              compararla. */}
          <div className="orb-hero-panel">
            <canvas ref={lienzo} className="orb-lienzo" aria-hidden="true" />
          </div>
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
          <h2 data-letras="" className="orb-h2">
            No vendemos webs bonitas. Vendemos webs que venden.
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
          {/* Este rotulo decia "Cinco cosas. Un solo precio.", que es el
              titulo de lo que INCLUYE el precio y estaba encabezando la
              galeria de trabajo. Cada uno vuelve a su seccion. */}
          <h2 data-letras="" className="orb-h2-chico">{w.muestrasTitulo}</h2>
        </div>
        <div className="orb-pista">
          {muestras.map((m, i) => (
            <article key={m.src} className="orb-pieza">
              <div className="orb-pieza-marco">
                <img src={m.src} alt={`Diseño de web: ${m.nombre}.`} loading="lazy" />
              </div>
              <div className="orb-pieza-pie">
                <span>{m.nombre}</span>
                <span>({String(i + 1).padStart(2, "0")})</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- capacidad */}
      <section className="orb-capacidad">
        <div className="orb-cont">
          <div line="" className="orb-eti">( 03 — Qué incluye )</div>
          <h2 data-letras="" className="orb-h2 orb-h2-incluye">
            {w.pilaTitulo.replace("\n", " ")}
          </h2>
          <ul className="orb-lista">
            {w.incluye.map((it) => (
              <li key={it.nombre} className="orb-lista-fila orb-lista-fija">
                <span className="orb-lista-n">{it.nombre}</span>
                <span className="orb-lista-d">{it.detalle}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------- cierre */}
      <footer id="contacto" className="orb-cierre">
        {/* Recorre 1584 px atado al scroll: si el lector para, para. */}
        <div className="orb-cinta-w" aria-hidden="true">
          <div className="orb-cinta" data-orb-cinta="1584">997 € — Cuéntanos tu caso —</div>
        </div>

        <div className="orb-marcos">
          <figure><img src={img.proyectoBanca} alt="" loading="lazy" data-orb-par="13" /></figure>
          <figure><img src={img.proyectoFundos} alt="" loading="lazy" data-orb-par="15" /></figure>
        </div>

        <div className="orb-cont orb-cierre-c">
          {/* El cierre no tenia titulo: se pasaba de una cinta a un parrafo de
              apoyo y un boton. Ahora abre y cierra con el mismo peso. */}
          <h2 data-letras="" className="orb-h2-cierre">Empecemos por tu negocio.</h2>
          <p data-letras="" className="orb-cierre-p">{w.cierreApoyo}</p>
          <a
            opacity=""
            href={enlaces.email}
            onClick={reserva("orb_cierre", "final")}
            className="orb-btn"
          >
            Cuéntanos tu caso
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
