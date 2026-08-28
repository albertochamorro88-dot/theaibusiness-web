"use client";

import { useEffect } from "react";
import Link from "next/link";

import { MenuWrapper, Nav } from "./Chrome";
import { reserva } from "./analytics";
import { casos, enlaces, img } from "./content";
import type { Caso } from "./content";

import { useHoverFx } from "@/motion/useHoverFx";
import { useMenu } from "@/motion/useMenu";
import { useNavLogo } from "@/motion/useNavLogo";
import { useReveals, playIntroReveals } from "@/motion/useReveals";
import { useSmoother } from "@/motion/useSmoother";
import { useVideos } from "@/motion/useVideos";

import "lenis/dist/lenis.css";
import "./webflow-base.css";
import "./site.css";

/**
 * La ficha propia de un caso.
 *
 * Fondo claro, al reves que la portada: el handoff pide conservar la
 * alternancia blanco/negro de la referencia, y las fichas son el tramo claro.
 *
 * Los bloques largos —`contexto` y `concepto`— solo se pintan si existen. En
 * los casos cuyo relato todavia no ha aprobado el cliente la pagina queda mas
 * corta, y eso es preferible a rellenarla con texto inventado sobre un cliente
 * con nombre y logotipo reales.
 */
export function CasoPagina({ caso }: { caso: Caso }) {
  /* Sin pantalla de carga aqui: el segundo argumento evita que Lenis se quede
     esperando un evento que en esta ruta no llega nunca. */
  useSmoother(true, false);
  useVideos(true);
  useReveals(true);
  /* La nav es la misma pieza que en la portada y necesita su maquinaria: sin
     `useMenu` los enlaces del desplegable se quedan a la vista, y sin
     `useNavLogo` el logotipo completo se pinta encima del monograma. */
  useMenu(true);
  useNavLogo(true);
  useHoverFx(true);

  /* La hoja de estilos deja en `opacity:0` todo lo que lleva `line`, `letter`
     u `opacity`, y quien los descubre es el final del loader. En esta ruta no
     hay loader, asi que sin esta llamada la nav se quedaba invisible. */
  useEffect(() => { playIntroReveals(); }, []);

  const i = casos.findIndex((c) => c.slug === caso.slug);
  const siguiente = casos[(i + 1) % casos.length];

  const medio = (clase: string) =>
    caso.video ? (
      <video src={caso.media} autoPlay loop muted playsInline className={clase} aria-label={caso.alt} />
    ) : (
      <img src={caso.media} alt={caso.alt} className={clase} />
    );

  return (
    <>
      <Nav />
      <MenuWrapper />

      <article className="caso-pagina">
        <header className="caso-portada">
          <h1 className="caso-nombre">{caso.nombre}</h1>
          <div className="caso-numero">{caso.numero}</div>
        </header>

        <div className="caso-entrada">
          <p className="caso-titular">{caso.titular}</p>
          {caso.contexto && <p className="caso-contexto">{caso.contexto}</p>}
          {caso.descriptor && <p className="caso-descriptor">{caso.descriptor}</p>}
        </div>

        <figure className="caso-medio">{medio("caso-medio-img")}</figure>

        <div className="caso-meta">
          <span>©25 . 26</span>
          <span>{caso.categoria}</span>
          <span className="caso-meta-sector">{caso.sector}</span>
        </div>

        {caso.concepto && (
          <section className="caso-bloque">
            <div className="caso-etiqueta">( El planteamiento )</div>
            <p className="caso-parrafo">{caso.concepto}</p>
          </section>
        )}

        {caso.resultados?.length ? (
          <section className="caso-bloque">
            <div className="caso-etiqueta">( Resultados )</div>
            <div className="caso-cifras">
              {caso.resultados.map((r) => (
                <div key={r.concepto} className="caso-cifra">
                  <div className="caso-cifra-dato">{r.cifra}</div>
                  <div className="caso-cifra-concepto">{r.concepto}</div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="caso-cierre">
          <h2 className="caso-cierre-titulo">Empecemos por el problema</h2>
          <div className="caso-cierre-botones">
            <a
              href={enlaces.agenda}
              target="_blank"
              rel="noreferrer"
              onClick={reserva("final_book_strategy_call", "caso")}
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
          <Link href="/#casos" className="caso-pie-enlace">
            Todos los casos <span aria-hidden="true">&#8627;</span>
          </Link>
          <Link href={`/casos/${siguiente.slug}`} className="caso-pie-enlace caso-pie-siguiente">
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
