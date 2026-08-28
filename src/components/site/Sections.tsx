"use client";

import { useState } from "react";

import { CasoVentana } from "./CasoVentana";
import { evento, reserva } from "./analytics";
import { casos, enlaces, equipo, img, pruebaGlobal, sedes, servicios, video } from "./content";
import type { Caso } from "./content";

/* ------------------------------------------------------------------ hero */

export function Hero() {
  return (
    <div className="section-w">
      <div className="section-fake-hero">
        <div className="div-block">
          <div delay="1.5" line="" no-scroll="" className="p-l">
            Not AI for the sake of AI.<br />AI that earns its place in the business.
          </div>
          <div className="space-24" />
          <a
            delay="2" opacity="" no-scroll=""
            href={enlaces.agenda} target="_blank" rel="noreferrer"
            onClick={reserva("hero_book_call", "hero")}
            className="btn black-blend w-inline-block"
          >
            <div className="btn__text"><p className="btn__text-p">Book a call</p></div>
            <div className="arrow-w">
              <div className="arrow black-blend">
                <div className="line-arrow" />
                <div className="shape-arrow" />
              </div>
            </div>
          </a>
        </div>
        <div className="link-hero-bottom-w">
          <div delay="1.5" line="" no-scroll="">{pruebaGlobal}</div>
          <div delay="1.5" opacity="" no-scroll="" className="link-hero-lang-w">
            <div className="link-hero-w">
              <a href={enlaces.linkedin} target="_blank" rel="noreferrer" className="link hide-desk w-inline-block"><div>LKDN</div></a>
              <a href={enlaces.linkedin} target="_blank" rel="noreferrer" className="link hide-tablet w-inline-block"><div>LinkedIn</div></a>
              <a href="#" className="link pointer-none w-inline-block"><div>/</div></a>
              <a href={enlaces.email} className="link hide-tablet w-inline-block"><div>info@theaibusiness.com</div></a>
              <a href={enlaces.email} className="link hide-desk w-inline-block"><div>email</div></a>
            </div>
            <a href="#" className="link-lang w-inline-block"><div>EN</div></a>
          </div>
        </div>
      </div>

      {/* El monograma en vidrio liquido: lo que aparece al disolver la placa. */}
      <video src={video.heroFondo} autoPlay loop muted playsInline className="video-hero-bg" />

      <section className="section hero-home">
        <div className="container hero-home">
          <div className="nothin-hero-w">
            <img src={img.marcaGradiente} alt="The AI Business" className="marca-hero" />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------- manifiesto */

export function Showreel() {
  return (
    <section className="section showreel">
      <div className="container showreel">
        <div className="space-150 mob-50" />
        <h2 line="" className="h1-home balance">
          Most companies are testing AI.<br />We put it into production.
        </h2>
        <div className="space-65" />
        <div className="video-showreel-w">
          <div className="video-showreel-full-w">
            <video src={video.showreel} autoPlay loop muted playsInline className="showreel-light" />
          </div>
          <div className="video-showreel-flip p-m">
            <div delay="0.2" line="">( The approach )</div>
            <div delay="0.2" line="" className="text-block-2">
              We start with the business, not the technology. If AI creates leverage,
              we build it. If it doesn&rsquo;t, we won&rsquo;t sell it.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- casos */

export function Casos() {
  const [abierto, setAbierto] = useState<Caso | null>(null);

  return (
    <section id="works" className="section works">
      <div className="container works">
        <div className="works-word-w">
          <div className="div-block-2">
            <div className="works-word-block-state1"><div className="works-word">w</div></div>
            <div className="works-word-block-state1"><div className="works-word o">o</div></div>
            <div className="works-word-block-state1"><div className="works-word r">r</div></div>
            <div className="works-word-block-state1"><div className="works-word k">k</div></div>
            <div className="works-word-block-state1"><div className="works-word">s</div></div>
          </div>
          <div className="div-block-2 hide-tablet">
            {Array.from({ length: 5 }, (_, i) => <div key={i} className="works-word-block-state2" />)}
          </div>
        </div>

        <div className="space-87" />
        <div className="titile-section-work">
          <h2 line="" className="h3-style">
            AI gets attention. <br />Results earn trust.
          </h2>
        </div>

        <div className="work_list_w w-dyn-list">
          <div role="list" className="work_list w-dyn-items">
            {casos.map((caso) => (
              <div key={caso.nombre} id="w-node-_4052a9ed-bc85-74d6-2f8d-4f251e3cf60d-78a9d1a3" role="listitem" className="work_item w-dyn-item">
                {/* Titular arriba y prueba abajo, las dos SIN hover: la cifra es
                    lo que sostiene el caso y en movil no hay puntero que la saque. */}
                <h2 line="" className="title-work">{caso.sector}</h2>
                <div line="" className="work-titular">{caso.titular}</div>
                <a
                  href={caso.href}
                  className="work-link w-inline-block"
                  onClick={(e) => { e.preventDefault(); evento(caso.evento); setAbierto(caso); }}
                >
                  <div className="img-work-w">
                    {caso.video ? (
                      <video src={caso.media} autoPlay loop muted playsInline className="img-work" />
                    ) : (
                      <img src={caso.media} loading="lazy" alt={caso.alt} className="img-work" />
                    )}
                  </div>
                  <div className="cursor-work">
                    <div>{caso.enlace}</div>
                    <div className="w-embed">
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                        <path d="M8.60254 0.353516L13.1188 4.86981L8.60254 9.3861" stroke="white" />
                        <line y1="5.01562" x2="13.1188" y2="5.01562" stroke="white" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div className="work-pie">
                  {caso.descriptor && <div line="" className="work-descriptor">{caso.descriptor}</div>}
                  {caso.prueba && <div line="" className="work-prueba">{caso.prueba}</div>}
                  <button
                    type="button"
                    className="work-ver"
                    onClick={() => { evento(caso.evento); setAbierto(caso); }}
                  >
                    {caso.enlace} <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-150 hide-tablet" />
        <div className="space-150 mob-100" />

        <div opacity="" className="work-view-all-w">
          <a href="/casos" className="btn view-all-btn w-inline-block">
            <div>View all</div>
            <div className="code-embed-2 w-embed">
              <svg className="arrow-icon" width="24" height="12" viewBox="-8 -1 26 14" fill="none">
                <polyline className="arrow-shaft" points="0.5,0 0.5,7.5 15.5,7.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                <polyline className="arrow-head" points="12,4 15.5,7.5 12,11" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </a>
          <div className="nbr-works-w">
            <div className="div-block-3"><div>(</div><div>{String(casos.length).padStart(2, "0")}</div><div>)</div></div>
          </div>
          <div className="text-block-3">© 2025 · 2026</div>
        </div>

        <div className="space-150 mob-100" />
      </div>

      <CasoVentana caso={abierto} onCerrar={() => setAbierto(null)} />
    </section>
  );
}

/* -------------------------------------------------------- sala de juntas */

export function SalaJuntas() {
  return (
    <section id="approach" className="section video">
      <div className="container video">
        <div className="musee-w">
          <img src={img.salaJuntas} loading="lazy" alt="" className="musee-bg" />
          <div className="video-w">
            <div className="tv-marco">
              <video src={video.manifiesto} autoPlay loop muted playsInline className="video-sticky" />
            </div>
            <video src={video.manifiestoReflejo} autoPlay loop muted playsInline className="video-reflet" />
          </div>
          <div className="btn-sound">
            <div>Sound</div>
            <div className="toggle-sound"><div className="tick-sound" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- firma */

export function Firma() {
  return (
    <section id="firma" className="section info-img">
      <div className="section-separator-blur" />
      <div className="container">
        <div className="space-87" />

        <div className="info-w p-l">
          <div line="">( In the room )</div>
          <div line="" id="w-node-_3bffa28f-e2c9-e1ae-1640-a1877cc8ebf8-78a9d1a3" className="text-block-7">
            We don&rsquo;t talk about AI from the outside. We&rsquo;re in the rooms where
            founders, investors and industry leaders decide what gets built next.
          </div>
          <div className="space-24 hide-landscape" />
          <div className="space-24 hide-landscape" />
          <div className="space-24" />
          <div className="space-24" />

          <div id="w-node-_8c8bfc91-8576-abe0-d854-49082250bec5-78a9d1a3" className="img-block-grid">
            <div parallax-scrub="1" parallax-y="-100" parallax="" id="w-node-_01baddd9-d465-59de-ee3e-5a9211c9095b-78a9d1a3" className="img-block-left">
              <div className="img-block-left-w">
                <img className="image" src={img.proyectoAutointel} alt="" parallax-img="" parallax-img-scrub="3" parallax-img-y="-8" loading="lazy" />
              </div>
              <div className="text-block-4">Featured by<br />Emprendedores.</div>
            </div>
            <div parallax-scrub="2" parallax-y="-60" parallax="" className="img-block-right-w">
              <img className="image" src={img.proyectoDermai} alt="" parallax-img="" parallax-img-scrub="3" parallax-img-y="10" loading="lazy" />
            </div>
          </div>
        </div>

        <div className="space-150 hide-landscape" />
        <div className="space-87" />

        <h2 line="" className="h1-home">If AI can move the business, <br /><span className="acento">we&rsquo;ll find where.</span></h2>

        <div className="space-87" />

        <div className="infobusiness-grid">
          <div id="w-node-_873b8711-445d-2907-3f1f-fca36caf4d24-78a9d1a3" className="img-block-grid">
            <div id="w-node-_873b8711-445d-2907-3f1f-fca36caf4d25-78a9d1a3" className="info-grid-left">
              <div line="" className="text-block-4">We work across :</div>
              <div className="fake-img" />
            </div>
            <div className="info-grid-right">
              <div className="div-block-4">
                <div className="list">
                  {servicios.map((s) => (
                    <div key={s} className="list-item">
                      <div delay="0.5" scale="" className="list-dot" />
                      <div line="">{s}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-87" />

        {/* Collage flotante: ocho objetos recortados sobre el negro, con la A
            y la I de la marca sueltas entre ellos. */}
        <div className="formes-w">
          <img src={img.asterisco} loading="lazy" alt="Asterisco de globo metalizado en rojo y azul." className="forma asterisco" />
          <img src={img.raton} loading="lazy" alt="Raton de ordenador de papel de aluminio arrugado." className="forma raton" />
          <img src={img.perro} loading="lazy" alt="Perro de globos rojo." className="forma perro" />
          <img src={img.engranaje} loading="lazy" alt="Engranaje de vidrio translucido." className="forma engranaje" />
          <img src={img.bombilla} loading="lazy" alt="Bombilla de papel de aluminio arrugado." className="forma bombilla" />
          <img src={img.tele} loading="lazy" alt="Televisor hinchable azul." className="forma tele" />
          <img src={img.candado} loading="lazy" alt="Candado de papel de aluminio arrugado." className="forma candado" />
          <img src={img.pompon} loading="lazy" alt="Pompon de tiras metalizadas azules." className="forma pompon" />
          <img src={img.letraA} loading="lazy" alt="" className="letra letra-a" />
          <img src={img.letraI} loading="lazy" alt="" className="letra letra-i" />
        </div>

        <div className="infobusiness-grid">
          <div id="w-node-_5df3fb26-e0d9-a608-cc8d-469d5b5a1816-78a9d1a3" className="img-block-grid p-s">
            <div id="w-node-_5df3fb26-e0d9-a608-cc8d-469d5b5a1817-78a9d1a3" className="info-grid-left">
              <div line="" className="text-block-4 marg-40">Who builds it :</div>
              <div className="fake-img" />
            </div>
            <div className="info-grid-right second">
              <div className="div-block-4">
                <div className="list">
                  <h2 line="" className="title-work info-team">founders</h2>
                  {equipo.map((n) => (
                    <div key={n} className="list-item"><div line="">{n}</div></div>
                  ))}
                </div>
                <div>
                  <h2 line="" className="title-work info-team">where we operate</h2>
                  {sedes.map((n) => (
                    <div key={n} className="list-item"><div line="">{n}</div></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-87 hide-landscape" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- la brecha */

const LINEA = (
  <>strategy · build · deploy · measure<br />strategy · build · deploy · measure<br />strategy · build · deploy · measure<br />30 min · no commitment · 100% confidential</>
);

export function Brecha() {
  return (
    <section className="section glitch">
      <div className="glitch-img-w">
        <img src={img.ejecutivo} loading="lazy" alt="Ejecutivo en un ascensor con un maletin de The AI Business." className="img-ascenseur" />
      </div>
      <div className="glitch-text-w">
        <div className="glitch-text-sticky-w">
          {["_3", "_1", "_2", "_4", "", "_6"].map((mod, i) => (
            <div key={i} className={`div-block-5${mod === "" ? " none" : ""}`}>
              <div className={`text-block-6${mod ? ` ${mod}` : ""}`}>{LINEA}</div>
            </div>
          ))}
          <div className="finaltext">
Strategy. <br />Build. <br />Deploy. <br />Measure.
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
  );
}

/* ---------------------------------------------------------------- cierre */

export function Footer() {
  return (
    <footer id="contact" className="section-footer">
      <div className="container footer-c">
        <div>
          <h2 line="" className="h1-home">Start with <br />the problem.</h2>
          <div className="space-24" />
          <div line="" className="p-l cierre-linea">
            In one call, we&rsquo;ll identify the opportunity, feasibility and next step.
          </div>
          <div className="space-24" />
          <div className="div-block-7">
            <div opacity="" className="div-block-6 mob">
              <a
                href={enlaces.agenda} target="_blank" rel="noreferrer"
                onClick={reserva("final_book_strategy_call", "final")}
                className="btn w-inline-block"
              >
                <div className="btn__text"><p className="btn__text-p">Book a strategy call</p></div>
                <div className="arrow-w">
                  <div className="arrow">
                    <div className="line-arrow" />
                    <div className="shape-arrow" />
                  </div>
                </div>
              </a>
              <a href={enlaces.email} className="btn email w-inline-block">
                <div className="btn__text"><p className="btn__text-p">info@theaibusiness.com</p></div>
                <div className="arobase">@</div>
              </a>
            </div>
            <div id="w-node-_92fe2b40-7a92-f80a-554b-04fcd6a444e3-d6a444d6" className="social-links-w">
              <a opacity="" href={enlaces.linkedin} target="_blank" rel="noreferrer" className="link footer w-inline-block"><div className="pointer-none">LinkedIn</div></a>
              <a opacity="" href={enlaces.web} target="_blank" rel="noreferrer" className="link footer w-inline-block"><div className="pointer-none">theaibusiness.com</div></a>
              <a opacity="" href={enlaces.email} className="link footer w-inline-block"><div className="pointer-none">info@theaibusiness.com</div></a>
            </div>
          </div>
          <div className="space-12" />
          <div className="riesgo-linea">30 min &middot; no commitment &middot; 100% confidential</div>
          <div className="space-150 mob-100" />
          <div className="footer-svg-w">
            <img src={img.logo} alt="The AI Business" className="marca-footer" />
          </div>
          <div className="space-12" />
        </div>
        <div className="footer-info-w">
          <h2 className="footer-info">©2026 — The AI Business</h2>
          <h2 className="footer-info hide-tablet">Madrid · Miami · Dubai</h2>
          <div className="lang-footer">
            <h2 className="footer-info hide-tablet">No commitment</h2>
            <a href="#" className="link-lang hide-tablet w-inline-block"><div>EN</div></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
