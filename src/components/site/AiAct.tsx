"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { MenuWrapper, Nav } from "./Chrome";
import { evento, reserva } from "./analytics";
import { enlaces } from "./content";
import {
  EN_VIGOR_DESDE,
  actBandas,
  actCifras,
  actClaim,
  actContacto,
  actFicha,
  actHero,
  actHitos,
  actMedia,
  actNiveles,
  actRivales,
} from "./aiact-content";

import { useGlitch } from "@/motion/useGlitch";
import { useHoverFx } from "@/motion/useHoverFx";
import { useMenu } from "@/motion/useMenu";
import { useNavLogo } from "@/motion/useNavLogo";
import { useReveals, playIntroReveals } from "@/motion/useReveals";
import { useSmoother } from "@/motion/useSmoother";
import {
  useActo,
  useCara,
  useCintaScroll,
  useHeroEntrada,
  useIncluye,
  useLetras,
  useMicro,
  useMiraPuntero,
  useParalajeOrb,
  useTapado,
} from "@/motion/useOrbital";
import { useRodillo } from "@/motion/useDonut";

import "lenis/dist/lenis.css";
import "./webflow-base.css";
import "./site.css";

/* Los dias que lleva en vigor el articulo 4. Se calcula EN EL CLIENTE, no al
   renderizar en servidor: el numero cambia cada dia y el HTML exportado es
   estatico, asi que un valor cocido en el build se quedaria viejo y ademas
   provocaria un desajuste de hidratacion. */
function useDiasEnVigor() {
  const [dias, setDias] = useState<number | null>(null);
  useEffect(() => {
    const desde = new Date(`${EN_VIGOR_DESDE}T00:00:00Z`).getTime();
    const hoy = Date.now();
    setDias(Math.max(0, Math.floor((hoy - desde) / 86400000)));
  }, []);
  return dias;
}

export default function AiAct() {
  const video1 = useRef<HTMLVideoElement>(null);
  const dias = useDiasEnVigor();

  useReveals(true);
  useHoverFx(true);
  useMenu(true);
  useNavLogo(true);
  useSmoother(true, false);

  useParalajeOrb(true);
  useCintaScroll(true);
  useTapado(true);
  useLetras(true);
  useHeroEntrada(true);
  useCara(true);
  useMiraPuntero(true);
  useIncluye(true);
  useMicro(true);
  useActo(true);
  useGlitch(true);
  useRodillo(true);

  useEffect(() => { playIntroReveals(); }, []);

  /* Mismo arranque a prueba de bloqueos que en la otra pagina: `autoplay` se
     lo puede negar el navegador, asi que se reintenta al tener datos y al
     primer gesto del lector. */
  useEffect(() => {
    const v = video1.current;
    if (!v) return;
    const arrancar = () => { v.play().catch(() => {}); };
    arrancar();
    v.addEventListener("loadeddata", arrancar);
    window.addEventListener("pointerdown", arrancar, { once: true });
    window.addEventListener("scroll", arrancar, { once: true, passive: true });
    return () => {
      v.removeEventListener("loadeddata", arrancar);
      window.removeEventListener("pointerdown", arrancar);
      window.removeEventListener("scroll", arrancar);
    };
  }, []);

  /* Los enlaces del encabezado van a secciones de la propia pagina. Lenis
     lleva el scroll REAL de la ventana, asi que un `scrollIntoView` suave
     funciona sin pelearse con el. */
  const irA = (destino: string) => (e: React.MouseEvent) => {
    const d = document.querySelector(destino);
    if (!d) return;
    e.preventDefault();
    d.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const asunto = useMemo(
    () => encodeURIComponent("Diagnóstico AI Act — 15 min"),
    [],
  );

  return (
    <div className="orbital act">
      <Nav cta={{ texto: "Reservar diagnóstico", href: enlaces.email, evento: "act_nav" }} />
      <MenuWrapper />

      {/* ------------------------------------------------------------ hero */}
      <header className="orb-hero act-hero">
        <div className="orb-marco">
          <div
            className="orb-marco-fondo"
            aria-hidden="true"
            style={{ backgroundImage: `url(${actMedia.heroPoster})` }}
          />

          <div className="orb-tarjeta">
            {/* ---------------------------------------- columna izquierda */}
            <div className="orb-tj-copy">
              <div className="orb-tj-alto">
                <div className="orb-eti orb-eti-tj">
                  ( 00 — {actHero.eyebrow} )
                  <i className="orb-eti-l" aria-hidden="true" />
                </div>
                <p data-entra="" className="orb-just">{actFicha}</p>
                <div data-entra="" className="orb-par">
                  <span>En vigor desde</span>
                  <span>
                    2 feb 2025
                    {dias !== null && <> · <b className="act-dias">{dias} días</b></>}
                  </span>
                </div>
              </div>

              {/* El calendario, en corto. En la otra pagina este hueco lo
                  ocupan las cuatro fases del metodo; aqui, las cuatro fechas
                  del reglamento, que es el dato que aprieta. */}
              <ol data-entra="" className="orb-fases act-fases">
                {actHitos.map((h) => (
                  <li key={h.fecha} data-pasado={h.pasado ? "" : undefined}>
                    <i aria-hidden="true">{h.corto}</i>
                    <span>{h.titulo}</span>
                  </li>
                ))}
              </ol>

              <div className="orb-tj-bajo">
                <h1 className="orb-h1">
                  <span className="orb-h1-linea">
                    <span data-marca="" className="orb-h1-marca">{actHero.marca}</span>
                    <i className="orb-h1-filete" aria-hidden="true" />
                  </span>
                  <span data-palabra="" className="orb-h1-sangra">{actHero.palabras[0]}</span>
                  <span data-palabra="">{actHero.palabras[1]}</span>
                </h1>
                <a
                  data-entra=""
                  className="orb-pastilla"
                  href="#niveles"
                  onClick={(e) => { evento("act_hero_ver"); irA("#niveles")(e); }}
                >
                  <span>{actHero.cta}</span>
                  <i className="orb-pastilla-i" aria-hidden="true">→</i>
                </a>
              </div>
            </div>

            {/* ------------------------------------------ la lamina del video */}
            <div className="orb-tj-lamina">
              <div className="orb-cara">
                <video
                  ref={video1}
                  className="orb-lienzo"
                  preload="auto"
                  src={actMedia.heroVideo}
                  poster={actMedia.heroPoster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-hidden="true"
                />
              </div>
              <i className="orb-luz" aria-hidden="true" />
              <i className="orb-lamina-vel" aria-hidden="true" />
            </div>

            {/* ------------------------------------------------ rail derecho */}
            <div className="orb-tj-rail">
              <nav data-entra="" className="orb-rail-nav" aria-label="Secciones">
                <a href="#niveles" onClick={irA("#niveles")}>Niveles</a>
                <a href="#calendario" onClick={irA("#calendario")}>Calendario</a>
                <a href="#contacto" onClick={irA("#contacto")}>Contacto</a>
              </nav>
              {/* En la otra pagina esta esquina lleva el precio. Aqui lleva la
                  sancion: es el numero que decide si sigues leyendo. */}
              <div data-entra="" className="orb-cifra">
                <span className="orb-cifra-n">
                  <i aria-hidden="true">(</i>
                  <span data-cuenta="35">35</span>
                  <em>M€</em>
                  <i aria-hidden="true">)</i>
                </span>
                <span className="orb-cifra-p">Sanción máxima · Art. 99</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------- 01 · por que te afecta */}
      <section className="orb-premisa act-claim">
        <div className="orb-cont">
          <div line="" className="orb-eti">( 01 — {actClaim.etiqueta} )<i className="orb-eti-l" aria-hidden="true" /></div>

          <div className="act-claim-rejilla">
            <h2 data-letras="" className="orb-h2 act-lead">{actClaim.lead}</h2>

            <blockquote className="act-cita">
              <p data-letras="">{actClaim.cita}</p>
              <p className="act-cita-acento" data-letras="">{actClaim.citaAcento}</p>
            </blockquote>

            <p data-letras="" className="act-cuerpo">{actClaim.cuerpo}</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- banda 1 */}
      <Banda i={0} irA={irA} />

      {/* ------------------------------------------------- 02 · los niveles */}
      <section id="niveles" className="orb-capacidad act-niveles">
        <div className="orb-cont">
          <div line="" className="orb-eti">( 02 — Niveles de riesgo )<i className="orb-eti-l" aria-hidden="true" /></div>
          <h2 className="orb-h2 orb-h2-incluye">
            <span data-letras="">La ley no clasifica empresas.</span>
            <span className="orb-degradado">Clasifica sistemas.</span>
          </h2>
          <ul className="orb-lista act-lista">
            {actNiveles.map((n) => (
              <li key={n.index} className="orb-lista-fila orb-lista-fija">
                <span className="orb-lista-i">{n.index}</span>
                <span className="orb-lista-n">
                  {n.titulo}
                  {n.etiqueta && <b className="act-chip">{n.etiqueta}</b>}
                </span>
                <span className="orb-lista-d">{n.cuerpo}</span>
                <i className="orb-lista-filete" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------- 03 · el calendario */}
      <section id="calendario" className="act-linea">
        <div className="orb-cont">
          <div line="" className="orb-eti">( 03 — El calendario )<i className="orb-eti-l" aria-hidden="true" /></div>
          <h2 data-letras="" className="orb-h2 act-linea-h">Las fechas ya corren.</h2>

          <ol className="act-hitos">
            {actHitos.map((h) => (
              <li key={h.fecha} className="act-hito" data-pasado={h.pasado ? "" : undefined}>
                <span className="act-hito-f">{h.fecha}</span>
                <span className="act-hito-e">{h.estado}</span>
                <i className="act-hito-p" aria-hidden="true" />
                <h3 className="act-hito-t">{h.titulo}</h3>
                <p className="act-hito-c">{h.cuerpo}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------- banda 2 */}
      <Banda i={1} irA={irA} />

      {/* --------------------------------------------------- 04 · las cifras */}
      <section className="act-cifras">
        <div className="orb-cont">
          <div line="" className="orb-eti">( 04 — Lo que hay en juego )<i className="orb-eti-l" aria-hidden="true" /></div>
          <div className="act-cifras-r">
            {actCifras.map((c) => (
              <div key={c.etiqueta} className="act-cifra">
                <span className="act-cifra-n">
                  <span data-cuenta={String(c.n)}>{c.n}</span>
                  <em>{c.sufijo}</em>
                </span>
                <span className="act-cifra-e">{c.etiqueta}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------- 05 · con quien comparan */}
      <section className="act-rivales">
        <div className="orb-cont">
          <div line="" className="orb-eti">( 05 — Con quién nos comparan )<i className="orb-eti-l" aria-hidden="true" /></div>
          <h2 className="orb-h2 orb-h2-incluye">
            <span data-letras="">Todos te dicen qué falla.</span>
            <span className="orb-degradado">Nosotros lo arreglamos.</span>
          </h2>
          <div className="act-rivales-r">
            {actRivales.map((r, i) => (
              <article
                key={r.quien}
                className="act-rival"
                data-nosotros={i === actRivales.length - 1 ? "" : undefined}
              >
                <h3 className="act-rival-q">{r.quien}</h3>
                <p className="act-rival-w">{r.que}</p>
                <p className="act-rival-c">{r.cuerpo}</p>
                <i className="act-rival-l" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- banda 3 */}
      <Banda i={2} irA={irA} />

      {/* ---------------------------------------------------------- cierre */}
      <footer id="contacto" className="orb-cierre act-cierre">
        <div className="orb-cinta-w" aria-hidden="true">
          <div className="orb-cinta" data-orb-cinta="1584">Reglamento UE 2024/1689 — Ya te obliga —</div>
        </div>

        <div className="orb-cont act-cierre-r">
          <div className="act-cierre-c">
            <h2 data-letras="" className="orb-h2-cierre act-cierre-h">
              {actContacto.titulo[0]}<br />{actContacto.titulo[1]}
            </h2>
            <p data-letras="" className="orb-cierre-p act-cierre-p">{actContacto.texto}</p>
            <a href={enlaces.email} data-rodillo="" className="drodillo orb-mail">
              <span>info@theaibusiness.com</span>
            </a>
          </div>

          {/* El formulario compone un correo con lo que se rellena. No hay
              servidor detras: la pagina es estatica y esto es lo que hay hasta
              que se conecte la agenda. */}
          <form
            className="act-form"
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              const cuerpo = [
                `Nombre: ${d.get("nombre") ?? ""}`,
                `Email: ${d.get("email") ?? ""}`,
                `Empresa: ${d.get("empresa") ?? ""}`,
                `Caso: ${d.get("caso") ?? ""}`,
              ].join("\n");
              evento("act_form", { caso: String(d.get("caso") ?? "") });
              window.location.href =
                `mailto:info@theaibusiness.com?subject=${asunto}&body=${encodeURIComponent(cuerpo)}`;
            }}
          >
            <h3 className="act-form-h">{actContacto.formTitulo}</h3>
            <p className="act-form-p">{actContacto.formTexto}</p>

            <label className="act-campo">
              <span>{actContacto.campos.nombre}</span>
              <input name="nombre" type="text" autoComplete="name" required />
            </label>
            <label className="act-campo">
              <span>{actContacto.campos.email}</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label className="act-campo">
              <span>{actContacto.campos.empresa}</span>
              <input name="empresa" type="text" autoComplete="organization" />
            </label>

            <fieldset className="act-casos">
              <legend>{actContacto.necesidadLabel}</legend>
              {actContacto.necesidades.map((n, i) => (
                <label key={n} className="act-caso">
                  <input type="radio" name="caso" value={n} defaultChecked={i === 0} />
                  <span>{n}</span>
                </label>
              ))}
            </fieldset>

            <button type="submit" className="orb-btn act-enviar" onClick={reserva("act_form", "cierre")}>
              <span>{actContacto.enviar}</span>
              <i className="orb-btn-f" aria-hidden="true">→</i>
            </button>
          </form>
        </div>

        <div className="orb-cont">
          <div className="orb-pie">
            <span>©2026 — The AI Business</span>
            <span>Madrid · Miami · Dubái</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* La banda de llamada intermedia. Aparece tres veces entre secciones para que
   no haya que llegar al final para reservar. */
function Banda({ i, irA }: { i: number; irA: (d: string) => (e: React.MouseEvent) => void }) {
  const b = actBandas[i];
  return (
    <section className="act-banda">
      <div className="orb-cont act-banda-c">
        <p data-letras="" className="act-banda-l">{b.linea}</p>
        <a
          className="orb-pastilla act-banda-b"
          href="#contacto"
          onClick={(e) => { evento("act_banda", { i: String(i) }); irA("#contacto")(e); }}
        >
          <span>{b.boton}</span>
          <i className="orb-pastilla-i" aria-hidden="true">→</i>
        </a>
      </div>
    </section>
  );
}
