"use client";

import { MenuWrapper, Nav } from "./Chrome";
import { reserva } from "./analytics";
import { enlaces, img, video, webs997 as c } from "./content";

import { useCifras } from "@/motion/useCifras";
import { useEagerImages } from "@/motion/useEagerImages";
import { useFormas } from "@/motion/useFormas";
import { useGlitch } from "@/motion/useGlitch";
import { useHero } from "@/motion/useHero";
import { useHoverFx } from "@/motion/useHoverFx";
import { useMenu } from "@/motion/useMenu";
import { useMusee } from "@/motion/useMusee";
import { useNavLogo } from "@/motion/useNavLogo";
import { useParallax } from "@/motion/useParallax";
import { useReveals, playIntroReveals } from "@/motion/useReveals";
import { useShowreel } from "@/motion/useShowreel";
import { useSmoother } from "@/motion/useSmoother";
import { useVideos } from "@/motion/useVideos";
import { useWorks } from "@/motion/useWorks";

import { useEffect } from "react";

import "lenis/dist/lenis.css";
import "./webflow-base.css";
import "./site.css";

/**
 * Landing de la linea de webs a precio cerrado.
 *
 * Va aparte —ruta propia— pero NO reimplementa nada: reutiliza las mismas
 * clases que la portada, y como todos los motores de animacion buscan por
 * selector de clase, hereda su comportamiento sin una linea de motion nueva.
 * Eso es lo que garantiza que se vea de la misma familia y que, al juntarla
 * con la principal, no haya dos sistemas que mantener.
 *
 * Lo que hereda, en orden: disolucion de fluido sobre la placa del hero,
 * scroll suave de Lenis, reveals por linea, el video que se retira a una
 * esquina, la palabra que vuela al hacer scroll, el zoom de la pantalla con su
 * reflejo, los objetos que huyen del raton, el texto que se descompone y el
 * conteo de las cifras.
 *
 * NO lleva pantalla de carga. La de la portada dura diez segundos y aqui seria
 * un peaje antes de una oferta: esto es una landing de captacion, no la
 * entrada al sitio.
 */
/* La marquesina que se descompone al hacer scroll. Cuatro lineas, como en la
   portada: tres repeticiones del proceso y una con la condicion de la oferta. */
const MARQUESINA = (
  <>diagnóstico · diseño · desarrollo · online<br />diagnóstico · diseño · desarrollo · online<br />diagnóstico · diseño · desarrollo · online<br />997 € · precio cerrado · sin cuotas</>
);

export default function Webs997() {
  useEagerImages(true);
  useReveals(true);
  useParallax(true);
  useWorks(true);
  useMusee(true);
  useGlitch(true);
  useFormas(true);
  useVideos(true);
  useShowreel(true);
  useCifras(true);
  useHoverFx(true);
  useMenu(true);
  useNavLogo(true);
  useHero(true);
  useSmoother(true, false);

  /* Sin loader no hay nada que descubra lo que la hoja de estilos deja en
     `opacity:0`. Hay que soltarlo a mano o la nav y los textos con `line` no
     llegan a verse nunca. */
  useEffect(() => { playIntroReveals(); }, []);

  return (
    <>
      <Nav />
      <MenuWrapper />

      <div className="page-wrapper">
        <div className="main-wrapper">
          <div className="page_view">

            {/* ---------------------------------------------------- hero */}
            <div className="section-w">
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
                    onClick={reserva("webs_book_call", "hero")}
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
                      <a href={enlaces.email} className="link hide-tablet w-inline-block"><div>info@theaibusiness.com</div></a>
                      <a href={enlaces.email} className="link hide-desk w-inline-block"><div>email</div></a>
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

            {/* -------------------------------------------- manifiesto */}
            <section className="section showreel">
              <div className="container showreel">
                <div className="space-150 mob-50" />
                <h2 line="" className="h1-home balance">
                  {c.manifiesto.split("\n").map((l, i) => (
                    <span key={l}>{i > 0 && <br />}{l}</span>
                  ))}
                </h2>
                <div className="space-65" />
                <div className="video-showreel-w">
                  <div className="video-showreel-full-w">
                    <video src={video.showreel} autoPlay loop muted playsInline className="showreel-light" />
                  </div>
                  <div className="video-showreel-flip p-m">
                    <div delay="0.2" line="">{c.apoyoEtiqueta}</div>
                    <div delay="0.2" line="" className="text-block-2">{c.apoyo}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* ------------------------------------------- que incluye */}
            <section id="incluye" className="section works">
              <div className="container works">
                <div className="works-word-w">
                  <div className="div-block-2">
                    {[...c.palabra].map((l, i) => (
                      <div key={i} className="works-word-block-state1"><div className="works-word">{l}</div></div>
                    ))}
                  </div>
                  <div className="div-block-2 hide-tablet">
                    {[...c.palabra].map((_, i) => <div key={i} className="works-word-block-state2" />)}
                  </div>
                </div>

                <div className="space-87" />
                <div className="titile-section-work">
                  <h2 line="" className="h3-style">
                    {c.incluyeTitulo.split("\n").map((l, i) => (
                      <span key={l}>{i > 0 && <br />}{l}</span>
                    ))}
                  </h2>
                </div>

                <div className="space-87" />

                <div className="incluye-lista">
                  {c.incluye.map((it) => (
                    <div key={it.nombre} className="incluye-fila">
                      <h3 line="" className="incluye-nombre">{it.nombre}</h3>
                      <div line="" className="incluye-detalle">{it.detalle}</div>
                    </div>
                  ))}
                </div>

                <div className="space-150 mob-100" />

                {/* Las cuatro cifras suben al entrar, como en las fichas de caso.
                    Ninguna es una metrica de resultado: son las condiciones de la
                    oferta, que es lo unico que este servicio puede afirmar. */}
                <div className="caso-cifras cifras-webs">
                  {c.cifras.map((r) => (
                    <div key={r.concepto} className="caso-cifra">
                      <div className="caso-cifra-dato" data-cifra={r.cifra}>{r.cifra}</div>
                      <div className="caso-cifra-concepto">{r.concepto}</div>
                    </div>
                  ))}
                </div>

                <div className="space-150 mob-100" />
              </div>
            </section>

            {/* ------------------------------------------ la web en pantalla */}
            <section className="section video">
              <div className="container video">
                <div className="musee-w">
                  <img src={img.salaJuntas} loading="lazy" alt="" className="musee-bg" />
                  <div className="video-w">
                    <div className="tv-marco">
                      <video src={video.manifiesto} autoPlay loop muted playsInline className="video-sticky" />
                    </div>
                    <video src={video.manifiestoReflejo} autoPlay loop muted playsInline className="video-reflet" />
                  </div>
                </div>
              </div>
            </section>

            {/* --------------------------------------- proceso y por que 997 */}
            <section id="proceso" className="section info-img">
              <div className="section-separator-blur" />
              <div className="container">
                <div className="space-87" />

                <div className="info-w p-l">
                  <div line="">{c.pasosEtiqueta}</div>
                  <div line="" className="text-block-7">{c.proceso}</div>
                </div>

                <div className="space-87" />

                <div className="pasos-w">
                  {c.pasos.map((p) => (
                    <div key={p.n} className="paso">
                      <div delay="0.4" line="" className="paso-n">{p.n}</div>
                      <h3 line="" className="paso-nombre">{p.nombre}</h3>
                      <div line="" className="paso-detalle">{p.detalle}</div>
                    </div>
                  ))}
                </div>

                <div className="space-150 mob-100" />

                <h2 line="" className="h1-home">
                  Por qué <br /><span className="acento">997 €.</span>
                </h2>
                <div className="space-24" />
                <div line="" className="p-l porque-linea">{c.porque}</div>

                <div className="space-87" />

                {/* Los objetos huyen del raton dentro de esta zona, igual que en
                    la portada. Piezas prestadas del collage principal hasta que
                    lleguen las suyas. */}
                <div className="formes-w">
                  <img src={img.asterisco} loading="lazy" alt="" className="forma asterisco" />
                  <img src={img.raton} loading="lazy" alt="" className="forma raton" />
                  <img src={img.perro} loading="lazy" alt="" className="forma perro" />
                  <img src={img.engranaje} loading="lazy" alt="" className="forma engranaje" />
                  <img src={img.bombilla} loading="lazy" alt="" className="forma bombilla" />
                  <img src={img.tele} loading="lazy" alt="" className="forma tele" />
                  <img src={img.candado} loading="lazy" alt="" className="forma candado" />
                  <img src={img.pompon} loading="lazy" alt="" className="forma pompon" />
                </div>

                <div className="space-87 hide-landscape" />
              </div>
            </section>

            {/* -------------------------------------------- las cuatro fases */}
            <section className="section glitch">
              <div className="glitch-img-w">
                <img src={img.ejecutivo} loading="lazy" alt="" className="img-ascenseur" />
              </div>
              <div className="glitch-text-w">
                <div className="glitch-text-sticky-w">
                  {["_3", "_1", "_2", "_4", "", "_6"].map((mod, i) => (
                    <div key={i} className={`div-block-5${mod === "" ? " none" : ""}`}>
                      <div className={`text-block-6${mod ? ` ${mod}` : ""}`}>{MARQUESINA}</div>
                    </div>
                  ))}
                  <div className="finaltext">
                    Diagnóstico. <br />Diseño. <br />Desarrollo. <br />Online.
                  </div>
                </div>
                <div className="img-glitch-w">
                  <div className="merguez">
                    <img className="merguez-img" src={img.proyectoBanca} alt="" loading="lazy" />
                  </div>
                  <div className="ballon">
                    <img className="ballon-img" src={img.proyectoFundos} alt="" loading="lazy" />
                  </div>
                </div>
              </div>
            </section>

            {/* ------------------------------------------------------ cierre */}
            <footer id="contacto" className="section-footer">
              <div className="container footer-c">
                <div>
                  <h2 line="" className="h1-home">
                    {c.cierre.split("\n").map((l, i) => (
                      <span key={l}>{i > 0 && <br />}{l}</span>
                    ))}
                  </h2>
                  <div className="space-24" />
                  <div line="" className="p-l cierre-linea">
                    Diseño, copy y desarrollo en una sola pieza. Sin cuotas ocultas.
                  </div>
                  <div className="space-24" />
                  <div className="div-block-7">
                    <div opacity="" className="div-block-6 mob">
                      <a
                        href={enlaces.email}
                        onClick={reserva("webs_book_call", "final")}
                        className="btn w-inline-block"
                      >
                        <div className="btn__text"><p className="btn__text-p">info@theaibusiness.com</p></div>
                        <div className="arobase">@</div>
                      </a>
                    </div>
                    <div className="social-links-w social-webs">
                      <a opacity="" href={enlaces.linkedin} target="_blank" rel="noreferrer" className="link footer w-inline-block"><div className="pointer-none">LinkedIn</div></a>
                      <a opacity="" href={enlaces.web} target="_blank" rel="noreferrer" className="link footer w-inline-block"><div className="pointer-none">theaibusiness.com</div></a>
                    </div>
                  </div>
                  <div className="space-150 mob-100" />
                  <div className="footer-svg-w">
                    <img src={img.logo} alt="The AI Business" className="marca-footer" />
                  </div>
                  <div className="space-12" />
                </div>
                <div className="footer-info-w">
                  <h2 className="footer-info">©2026 — The AI Business</h2>
                  <h2 className="footer-info hide-tablet">Madrid · Miami · Dubái</h2>
                  <div className="lang-footer">
                    <h2 className="footer-info hide-tablet">Precio cerrado</h2>
                  </div>
                </div>
              </div>
            </footer>

          </div>
        </div>
      </div>
    </>
  );
}
