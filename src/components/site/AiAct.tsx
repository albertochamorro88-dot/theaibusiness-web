"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { MenuWrapper, Nav } from "./Chrome";
import { evento, reserva } from "./analytics";
import { enlaces } from "./content";
import {
  EN_VIGOR_DESDE,
  actBandas,
  actContacto,
  actFicha,
  actHero,
  actHitos,
  actMedia,
  actMulta,
  actNiveles,
  actRivales,
  actSust,
  actVideo,
} from "./aiact-content";

import { useGlitch } from "@/motion/useGlitch";
import { useHoverFx } from "@/motion/useHoverFx";
import { useMenu } from "@/motion/useMenu";
import { useNavLogo } from "@/motion/useNavLogo";
import { useReveals, playIntroReveals } from "@/motion/useReveals";
import { useSmoother } from "@/motion/useSmoother";
import {
  useActo,
  useCintaScroll,
  useHeroEntrada,
  useLetras,
  useMicro,
  useTapado,
} from "@/motion/useOrbital";
import {
  useCaida,
  useMulta,
  usePila,
  useRefresco,
  useSala,
  useSustitucion,
} from "@/motion/useActoEscenas";
import { useRodillo } from "@/motion/useDonut";

import "lenis/dist/lenis.css";
import "./webflow-base.css";
import "./site.css";

/* El color del nivel viaja al CSS como variable, que es donde se usa: lo pinta
   el medidor, el numeral, el chip y el borde de la lamina. Pasarlo cuatro
   veces por separado seria escribir el mismo dato cuatro veces. */
const conColor = (c: string) => ({ "--c": c }) as React.CSSProperties;

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

  /* Lo que se hereda de la pagina de webs: el encabezado y sus detalles. */
  useCintaScroll(true);
  useTapado(true);
  useLetras(true);
  useHeroEntrada(true);
  useMicro(true);
  useActo(true);
  useGlitch(true);
  useRodillo(true);

  /* Lo propio del AI Act: una escena por seccion. */
  useSustitucion(true);
  usePila(true);
  useSala(true);
  useMulta(true);
  useCaida(true);
  useRefresco(true);

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
      {/* La portada ES el video. Detras corre el plano abstracto, muy bajado:
          esta para que la pantalla no parezca congelada, no para mirarlo. */}
      <header className="orb-hero act-hero">
        <div className="act-portada-fondo" aria-hidden="true">
          <video
            ref={video1}
            className="act-portada-f"
            preload="auto"
            src={actMedia.heroVideo}
            poster={actMedia.heroPoster}
            autoPlay
            muted
            loop
            playsInline
          />
          <i className="act-portada-vel" />
        </div>

        <div className="orb-cont act-portada" data-tapado="">
          <div className="orb-eti act-portada-eti">
            ( 00 — {actHero.eyebrow} )
            <i className="orb-eti-l" aria-hidden="true" />
          </div>

          <div className="act-portada-cab">
            <h1 className="orb-h1 act-portada-h">
              <span className="orb-h1-linea">
                <span data-marca="" className="orb-h1-marca">{actHero.marca}</span>
                <i className="orb-h1-filete" aria-hidden="true" />
              </span>
              <span data-palabra="">
                {actHero.palabras[0]} {actHero.palabras[1]}
              </span>
            </h1>

            <div data-entra="" className="act-portada-ficha">
              <p className="act-portada-p">{actFicha}</p>
              <p className="act-portada-fecha">
                En vigor desde 2 feb 2025
                {dias !== null && <> · <b className="act-dias">{dias} días</b></>}
              </p>
            </div>
          </div>

          <div data-entra="" className="act-portada-v">
            <Reproductor />
          </div>

          <div data-entra="" className="act-portada-pie">
            <div className="act-autor act-autor-pie">
              <img
                className="act-autor-f"
                src={actMedia.alejandro}
                alt={actVideo.autor.nombre}
                width={320}
                height={320}
              />
              <div className="act-autor-t">
                <p className="act-autor-n">{actVideo.autor.nombre}</p>
                <p className="act-autor-r">{actVideo.autor.rol}</p>
              </div>
            </div>

            <a
              className="orb-pastilla"
              href="#niveles"
              onClick={(e) => { evento("act_hero_ver"); irA("#niveles")(e); }}
            >
              <span>{actHero.cta}</span>
              <i className="orb-pastilla-i" aria-hidden="true">→</i>
            </a>
          </div>
        </div>
      </header>

      {/* ============================================ 01 · una frase tacha a otra */}
      {/* La escena entera es una marquesina de metro. El panel iluminado de la
          foto es el sitio donde va el texto, asi que no hay "fondo" y "texto
          encima": hay un cartel, y el cartel se escribe solo. */}
      <section className="act-sust act-tapa">
        <div className="act-sust-pin">
          <div className="act-escena">
            <img
              className="act-escena-f"
              src={actMedia.cartel}
              alt=""
              width={1536}
              height={1024}
              fetchPriority="high"
            />
            <i className="act-escena-vel" aria-hidden="true" />
            {/* El degradado que cose la foto con el negro de la seccion
                siguiente. Va DENTRO de la escena y antes del cartel: colgado
                del clavado y despues, se pintaba tambien sobre el titular y le
                comia medio blanco. */}
            <i className="act-fundido" aria-hidden="true" />

            <div className="act-cartel">
              <div line="" className="orb-eti act-cartel-eti">
                ( 01 — {actSust.etiqueta} )<i className="orb-eti-l" aria-hidden="true" />
              </div>

              <p className="act-sust-fuera">
                <span>{actSust.fuera}</span>
                <i className="act-tachon" aria-hidden="true" />
              </p>

              {/* Dos copias de la misma frase: una hueca, de contorno, y otra
                  llena de blanco que se descubre de izquierda a derecha. Lo que
                  se ve no es un texto que aparece, es un texto que SE LLENA,
                  como se enciende un cartel. La de contorno no se lee: es
                  decorado, y por eso esta oculta a los lectores de pantalla. */}
              <p className="act-sust-dentro">
                <span className="act-sust-borde" aria-hidden="true">{actSust.dentro}</span>
                <span className="act-sust-lleno">{actSust.dentro}</span>
              </p>
            </div>
          </div>

          <div className="orb-cont act-sust-bajo">
            <blockquote className="act-sust-cita">
              <p>{actSust.cita}</p>
              <p className="act-sust-acento">{actSust.citaAcento}</p>
            </blockquote>

            {/* La cifra manda y el rotulo la explica: por eso van uno encima
                del otro y no en la misma linea. */}
            <div className="act-sust-pie">
              <span><b>{actSust.pie[0]}</b><em>{actSust.pie[1]}</em></span>
              <i aria-hidden="true" />
              <span><b>{actSust.pie[2]}</b><em>{actSust.pie[3]}</em></span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================ 02 · la pila de niveles */}
      <section id="niveles" className="act-pila">
        <div className="act-pila-pin">
          <div className="orb-cont act-pila-c">
            <div className="act-pila-cab">
              <div line="" className="orb-eti">
                ( 02 — Niveles de riesgo )<i className="orb-eti-l" aria-hidden="true" />
              </div>
              <h2 className="act-pila-h">
                <span data-letras="">La ley no clasifica empresas.</span>
                <span className="orb-degradado">Clasifica sistemas.</span>
              </h2>
            </div>

            <div className="act-pila-cuerpo">
              {/* El medidor. Es la escala de riesgo hecha objeto: baja de rojo
                  a gris al mismo ritmo al que se apilan las laminas. */}
              <aside className="act-medidor" aria-hidden="true">
                <div className="act-medidor-v"><i className="act-medidor-f" /></div>
                <ol className="act-medidor-o">
                  {actNiveles.map((n) => (
                    <li key={n.index} className="act-medidor-i" style={conColor(n.color)}>
                      <i />
                      <span>{n.titulo}</span>
                    </li>
                  ))}
                </ol>
              </aside>

              <div className="act-pila-laminas">
                {actNiveles.map((n) => (
                  <article key={n.index} className="act-nivel" style={conColor(n.color)}>
                    <span className="act-nivel-i" aria-hidden="true">{n.index}</span>
                    <div className="act-nivel-t">
                      <b className="act-nivel-chip">{n.etiqueta}</b>
                      <h3 className="act-nivel-h">{n.titulo}</h3>
                      <p className="act-nivel-p">{n.cuerpo}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- banda 1 */}
      <Banda i={0} irA={irA} />

      {/* ======================================================== 03 · la sala */}
      {/* El calendario se exhibe. El muro de led de la sala muestra UNA fecha
          cada vez —la que toca— y las demas no estan: no hay lista que ojear,
          hay algo expuesto. El raíl de abajo dice por cual vas. */}
      <section id="calendario" className="act-sala">
        <div className="act-sala-pin">
          <div className="act-escenario">
            <img
              className="act-escenario-f"
              src={actMedia.sala}
              alt=""
              width={1402}
              height={1122}
              loading="lazy"
            />

            <div className="act-muro">
              <div className="act-muro-cab">
                <div line="" className="orb-eti act-muro-eti">
                  ( 03 — El calendario )<i className="orb-eti-l" aria-hidden="true" />
                </div>
                <p className="act-muro-h">Las fechas ya corren.</p>
              </div>

              <div className="act-rail" aria-hidden="true">
                <i className="act-rail-l" />
                <i className="act-rail-f" />
                {/* La posicion va en linea y no en la hoja de estilos: con
                    `nth-of-type` el navegador cuenta TODOS los <i> hermanos
                    —el rail y el relleno tambien lo son—, no los de esta
                    clase, y los puntos salian corridos dos sitios. */}
                {actHitos.map((h, i) => (
                  <i
                    key={h.fecha}
                    className="act-rail-p"
                    style={{ left: `${(i / (actHitos.length - 1)) * 100}%` }}
                  />
                ))}
              </div>

              <div className="act-vitrina">
                {actHitos.map((h) => (
                  <article key={h.fecha} className="act-fecha" data-pasado={h.pasado ? "" : undefined}>
                    <span className="act-fecha-e">{h.estado}</span>
                    <p className="act-fecha-f">{h.fecha}</p>
                    <h3 className="act-fecha-t">{h.titulo}</h3>
                    <p className="act-fecha-n">{h.nota}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <i className="act-sala-vel" aria-hidden="true" />
        </div>
      </section>

      {/* ========================================================= 04 · la multa */}
      <section className="act-multa">
        <div className="act-multa-pin">
          <div className="orb-cont act-multa-c">
            <div line="" className="orb-eti">
              ( 04 — {actMulta.etiqueta} )<i className="orb-eti-l" aria-hidden="true" />
            </div>

            <div className="act-multa-n">
              <i className="act-multa-brillo" aria-hidden="true" />
              <span data-multa={String(actMulta.n)}>{actMulta.n}</span>
              <em>{actMulta.sufijo}</em>
            </div>

            <p className="act-multa-t">{actMulta.titulo}</p>
            <p className="act-multa-pie">{actMulta.pie}</p>

            <div className="act-multa-lados">
              {actMulta.lados.map((l) => (
                <div key={l.etiqueta} className="act-lado">
                  <span className="act-lado-n">{l.n}<em>{l.sufijo}</em></span>
                  <span className="act-lado-e">{l.etiqueta}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- banda 2 */}
      <Banda i={1} irA={irA} />

      {/* ====================================================== 05 · la caida */}
      <section className="act-rivales">
        <div className="orb-cont">
          <div line="" className="orb-eti">
            ( 05 — Con quién nos comparan )<i className="orb-eti-l" aria-hidden="true" />
          </div>
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
                <i className="act-rival-l" aria-hidden="true" />
                <h3 className="act-rival-q">{r.quien}</h3>
                <p className="act-rival-w">{r.que}</p>
                <p className="act-rival-c">{r.cuerpo}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

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

/* El reproductor.
 *
 * Arranca como una imagen con su boton: la pagina no le pide NADA a Google
 * hasta que alguien decide ver el video. Al pulsar se cambia por el iframe con
 * `autoplay`, que es lo que hace que el gesto no se pierda por el camino.
 * `youtube-nocookie.com` para que el visionado no deje rastro de publicidad.
 */
function Reproductor() {
  const [puesto, setPuesto] = useState(false);
  return (
    <div className="act-video-m">
      {puesto ? (
        <iframe
          className="act-video-i"
          src={`https://www.youtube-nocookie.com/embed/${actVideo.id}?autoplay=1&rel=0&modestbranding=1`}
          title={actVideo.titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="act-video-b"
          onClick={() => { evento("act_video", { id: actVideo.id }); setPuesto(true); }}
          aria-label={actVideo.duracionAlt}
        >
          <img src={actMedia.videoPortada} alt="" loading="lazy" width={1000} height={563} />
          <span className="act-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26" focusable="false"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
          </span>
        </button>
      )}
    </div>
  );
}

/* La banda de llamada intermedia. Dos veces en toda la pagina: una despues de
   saber en que nivel caes y otra despues de ver cuanto cuesta no saberlo. */
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
