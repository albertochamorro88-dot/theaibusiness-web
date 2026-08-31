"use client";

import { useEffect } from "react";

import { MenuWrapper, Nav } from "./Chrome";
import { reserva } from "./analytics";
import { casos, enlaces, img, ofertas } from "./content";
import { donut as c } from "./donut-content";

import { useEagerImages } from "@/motion/useEagerImages";
import { useHoverFx } from "@/motion/useHoverFx";
import { useMenu } from "@/motion/useMenu";
import { useNavLogo } from "@/motion/useNavLogo";
import { useReveals, playIntroReveals } from "@/motion/useReveals";
import { useSmoother } from "@/motion/useSmoother";
import {
  useAcordeon, useMarquesina, useNavTinta, useParalaje, useRevelado, useRodillo,
} from "@/motion/useDonut";

import "lenis/dist/lenis.css";
import "./webflow-base.css";
import "./site.css";

const servicios = ofertas.filter((o) => o.tipo === "servicio");
const modelos = ofertas.filter((o) => o.tipo === "modelo");

/**
 * Direccion de diseno alternativa para la portada.
 *
 * El armazon sale de una referencia externa —epigrafe numerado por seccion,
 * cinta infinita de texto gigante, rejilla de trabajo descompensada, acordeon
 * y revelado palabra a palabra—, reconstruido con GSAP.
 *
 * De ella NO viene ni el color ni el tono. Su paleta es amarillo sobre rosa
 * chicle con un cuarto tramo naranja; aqui el recorrido es el de la casa
 * —negro, rojo, azul, gris— y el naranja esta prohibido por guia de marca. Su
 * voz es de broma y guino; la nuestra puntua 2 sobre 10 en juguetona, asi que
 * el texto es propio.
 *
 * Vive en su propia ruta a proposito: es una propuesta para comparar contra la
 * portada actual, no un reemplazo.
 */
export default function Donut() {
  useEagerImages(true);
  useReveals(true);
  useHoverFx(true);
  useMenu(true);
  useNavLogo(true);
  useSmoother(true, false);

  useMarquesina(true);
  useParalaje(true);
  useRevelado(true);
  useAcordeon(true);
  useRodillo(true);
  useNavTinta(true);

  /* Sin pantalla de carga no hay nada que suelte lo que la hoja de estilos deja
     en `opacity:0`. Hay que dispararlo a mano. */
  useEffect(() => { playIntroReveals(); }, []);

  return (
    <div className="donut">
      <Nav cta={{ texto: "Reservar diagnóstico", href: enlaces.agenda, evento: "donut_nav" }} />
      <MenuWrapper />

      {/* ------------------------------------------------------------ hero */}
      <header className="dsec dhero">
        <p className="dhero-sup">{c.heroSuperior}</p>
        <div className="dhero-nucleo">
          <img src={c.heroNucleo} alt={c.heroNucleoAlt} data-paralaje="10" />
        </div>
        <p className="dhero-inf">{c.heroInferior}</p>
        {/* La marca gigante, cortada por el borde inferior: el corte es lo que
            invita a seguir bajando. */}
        <div className="dhero-marca" aria-hidden="true">{c.cierreMarca}</div>
      </header>

      {/* ------------------------------------------------------ manifiesto */}
      <section className="dsec dmanifiesto">
        <Epigrafe texto={c.manifiestoEpigrafe} num={c.manifiestoNumero} cat={c.manifiestoCategoria} />
        <div className="dcont">
          <h2 className="dniega">
            {c.manifiestoNiegas.map((l) => <span key={l} line="">{l}</span>)}
          </h2>
          <p line="" className="dafirma">{c.manifiestoAfirma}</p>
        </div>
      </section>

      {/* ----------------------------------------------------------- casos */}
      <section id="casos" className="dsec dcasos">
        <Epigrafe texto={c.casosEpigrafe} num={c.casosNumero} cat={c.casosCategoria} />

        {/* La cinta: el contenido va duplicado y el tween recorre justo la
            mitad, asi que el salto de vuelta a cero cae donde no se ve. */}
        <div className="cinta" data-cinta="105" aria-hidden="true">
          <div className="cinta-via">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="cinta-pieza">{c.casosCinta}</span>
            ))}
          </div>
        </div>

        <div className="dcont dcasos-intro">
          <p line="" className="dcasos-apoyo">{c.casosApoyo}</p>
          <a href="/#casos" data-rodillo="" className="drodillo dcasos-enlace">
            <span>{c.casosEnlace}</span>
          </a>
        </div>

        {/* Rejilla descompensada: las cinco fichas no comparten ni ancho ni
            altura de arranque. Alineadas se leerian como una fila incompleta. */}
        <div className="dgrid">
          {casos.map((k, i) => (
            <article key={k.slug} className={`dcarta dcarta-${i + 1}`}>
              <a href={`/casos/${k.slug}/`} className="dcarta-a">
                <div className="dcarta-marco">
                  {k.video ? (
                    <video src={k.media} autoPlay loop muted playsInline preload="metadata" aria-label={k.alt} />
                  ) : (
                    <img src={k.media} alt={k.alt} loading="lazy" />
                  )}
                </div>
                <div className="dcarta-pie">
                  <span className="dcarta-n">{k.nombre}</span>
                  <span className="dcarta-i">({String(i + 1).padStart(2, "0")})</span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- servicios */}
      <section id="servicios" className="dsec dservicios">
        <Epigrafe texto={c.serviciosEpigrafe} num={c.serviciosNumero} cat={c.serviciosCategoria} />
        <div className="dcont">
          <h2 line="" className="dtitulo">
            Servicios <em>({servicios.length})</em>
          </h2>
          <Acordeon filas={servicios.map((s, i) => ({
            n: String(i + 1).padStart(2, "0"),
            titulo: s.nombre,
            cuerpo: s.contexto,
            href: `/servicios/${s.slug}/`,
          }))} />
        </div>
      </section>

      {/* --------------------------------------------------------- enfoque */}
      <section id="enfoque" className="dsec denfoque">
        <Epigrafe texto={c.enfoqueEpigrafe} num={c.enfoqueNumero} cat={c.enfoqueCategoria} />
        <div className="dcont denfoque-c">
          {/* Las palabras arrancan a media opacidad, no invisibles: la frase se
              lee entera desde el principio y el scroll solo subraya por donde
              va la lectura. */}
          <p data-revelado="" className="denfoque-t">{c.enfoqueTexto}</p>
          <figure className="denfoque-fig">
            <img src={c.enfoqueImagen} alt={c.enfoqueAlt} loading="lazy" data-paralaje="10" />
          </figure>
        </div>
      </section>

      {/* --------------------------------------------------------- modelos */}
      <section className="dsec dmodelos">
        <Epigrafe texto={c.modelosEpigrafe} num={c.modelosNumero} cat={c.modelosCategoria} />
        <div className="dcont">
          <h2 line="" className="dtitulo">
            Modelos <em>({modelos.length})</em>
          </h2>
          <p line="" className="dmodelos-apoyo">{c.modelosApoyo}</p>
          <Acordeon filas={modelos.map((m, i) => ({
            n: String(i + 1).padStart(2, "0"),
            titulo: m.nombre,
            cuerpo: m.contexto,
            href: `/servicios/${m.slug}/`,
          }))} />
        </div>
      </section>

      {/* ---------------------------------------------------------- cierre */}
      <footer id="contacto" className="dsec dcierre">
        <Epigrafe texto={c.cierreEpigrafe} num={c.cierreNumero} cat={c.cierreCategoria} />

        <div className="cinta dtira" data-cinta="105" data-cinta-dir="-1" aria-hidden="true">
          <div className="cinta-via">
            {[...c.tira, ...c.tira].map((p, i) => (
              <img key={i} src={p.src} alt="" loading="lazy"
                style={{ width: `${p.w}px`, height: `${p.h}px` }} />
            ))}
          </div>
        </div>

        <div className="dcont dcierre-c">
          <h2 line="" className="dcierre-h">{c.cierreTitular}</h2>
          <p line="" className="dcierre-p">{c.cierreApoyo}</p>
          <a
            opacity=""
            href={enlaces.agenda}
            onClick={reserva("donut_cierre", "final")}
            className="dcierre-btn"
          >
            Reservar diagnóstico
          </a>
          <a href={enlaces.email} data-rodillo="" className="drodillo dcierre-mail">
            <span>info@theaibusiness.com</span>
          </a>
        </div>

        <div className="dcierre-marca" aria-hidden="true">
          <img src={img.logo} alt="" />
        </div>
        <div className="dcierre-pie">
          <span>©2026 — The AI Business</span>
          <span>Madrid · Miami · Dubái</span>
        </div>
      </footer>
    </div>
  );
}

/** El epigrafe de seccion: etiqueta, ordinal y categoria en una sola linea. */
function Epigrafe({ texto, num, cat }: { texto: string; num: string; cat: string }) {
  return (
    <div line="" className="depi">
      <span>{texto}</span>
      <span className="depi-n">{num}</span>
      <span className="depi-c">{cat}</span>
    </div>
  );
}

type Fila = { n: string; titulo: string; cuerpo: string; href: string };

/** Las filas que se abren al pulsarlas. Solo una abierta a la vez. */
function Acordeon({ filas }: { filas: Fila[] }) {
  return (
    <div className="acordeon">
      {filas.map((f) => (
        <div key={f.titulo} className="acordeon-fila">
          <button type="button" className="acordeon-cabeza" aria-expanded="false">
            <span className="acordeon-n">{f.n}</span>
            <span className="acordeon-t">{f.titulo}</span>
            <span className="acordeon-mas" aria-hidden="true" />
          </button>
          <div className="acordeon-cuerpo">
            <div className="acordeon-dentro">
              <p>{f.cuerpo}</p>
              <a href={f.href} className="acordeon-enlace">Ver ficha</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
