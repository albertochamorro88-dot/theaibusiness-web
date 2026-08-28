"use client";

import { useEffect } from "react";
import Link from "next/link";

import { MenuWrapper, Nav } from "./Chrome";
import { reserva } from "./analytics";
import { enlaces, img, ofertas } from "./content";
import type { Oferta } from "./content";

import { useHoverFx } from "@/motion/useHoverFx";
import { useMenu } from "@/motion/useMenu";
import { useNavLogo } from "@/motion/useNavLogo";
import { useReveals, playIntroReveals } from "@/motion/useReveals";
import { useSmoother } from "@/motion/useSmoother";

import "lenis/dist/lenis.css";
import "./webflow-base.css";
import "./site.css";

/**
 * La ficha de una linea de la oferta.
 *
 * Comparte hoja de estilos con las fichas de caso —mismo fondo claro, mismo
 * titulo enorme con su ordinal, misma reticula— para que las nueve y las cinco
 * se lean como la misma familia. Cambia lo que hay en medio: en un caso son
 * resultados medidos; aqui, que incluye y con que se sale.
 *
 * El medio no es una captura de proyecto sino el objeto del collage que le
 * toca, centrado sobre la placa oscura: no hay material real de estas lineas y
 * es preferible una pieza de marca a un pantallazo inventado.
 */
export function ServicioPagina({ oferta }: { oferta: Oferta }) {
  useSmoother(true, false);
  useReveals(true);
  useMenu(true);
  useNavLogo(true);
  useHoverFx(true);
  useEffect(() => { playIntroReveals(); }, []);

  const hermanas = ofertas.filter((o) => o.tipo === oferta.tipo);
  const i = hermanas.findIndex((o) => o.slug === oferta.slug);
  const siguiente = hermanas[(i + 1) % hermanas.length];

  return (
    <>
      <Nav />
      <MenuWrapper />

      <article className="caso-pagina">
        <header className="caso-portada">
          <h1 className="caso-nombre ficha-nombre">{oferta.nombre}</h1>
          <div className="caso-numero">{oferta.numero}</div>
        </header>

        <div className="caso-entrada">
          <p className="caso-titular">{oferta.titular}</p>
          <p className="caso-contexto">{oferta.contexto}</p>
        </div>

        <figure className="caso-medio ficha-medio">
          <img src={oferta.objeto} alt={oferta.alt} className="ficha-objeto" />
        </figure>

        <div className="caso-meta">
          <span>©25 . 26</span>
          <span>{oferta.epigrafe}</span>
          <span className="caso-meta-sector">The AI Business</span>
        </div>

        <section className="caso-bloque">
          <div className="caso-etiqueta">( El planteamiento )</div>
          <p className="caso-parrafo">{oferta.planteamiento}</p>
        </section>

        <section className="caso-bloque">
          <div className="caso-etiqueta">( Qué incluye )</div>
          <ul className="ficha-lista">
            {oferta.incluye.map((linea) => (
              <li key={linea} className="ficha-lista-item">{linea}</li>
            ))}
          </ul>
        </section>

        <section className="caso-bloque">
          <div className="caso-etiqueta">( Con qué sales )</div>
          <p className="ficha-entregable">{oferta.entregable}</p>
        </section>

        <section className="caso-cierre">
          <h2 className="caso-cierre-titulo">Empecemos por el problema</h2>
          <div className="caso-cierre-botones">
            <a
              href={enlaces.agenda}
              target="_blank"
              rel="noreferrer"
              onClick={reserva("final_book_strategy_call", "servicio")}
              className="btn w-inline-block"
            >
              <div className="btn__text"><p className="btn__text-p">Reservar llamada</p></div>
              <div className="arrow-w">
                <div className="arrow">
                  <div className="line-arrow" />
                  <div className="shape-arrow" />
                </div>
              </div>
            </a>
            <a href={enlaces.email} className="btn email w-inline-block">
              <div className="btn__text"><p className="btn__text-p">Escríbenos</p></div>
              <div className="arobase">@</div>
            </a>
          </div>
          <div className="caso-riesgo">30 min · sin compromiso · 100% confidencial</div>
        </section>

        <nav className="caso-pie">
          <Link href="/#enfoque" className="caso-pie-enlace">
            Toda la oferta <span aria-hidden="true">&#8627;</span>
          </Link>
          <Link href={`/servicios/${siguiente.slug}`} className="caso-pie-enlace caso-pie-siguiente">
            Siguiente : {siguiente.nombre}
          </Link>
        </nav>

        <div className="caso-marca">
          <img src={img.logo} alt="The AI Business" />
        </div>
      </article>
    </>
  );
}
