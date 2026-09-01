"use client";

import { useEffect, useRef } from "react";

import { MenuWrapper, Nav } from "./Chrome";
import { evento, reserva } from "./analytics";
import { enlaces, img, video, webs997 as w } from "./content";

import { useGlitch } from "@/motion/useGlitch";
import { useHoverFx } from "@/motion/useHoverFx";
import { useMenu } from "@/motion/useMenu";
import { useNavLogo } from "@/motion/useNavLogo";
import { useReveals, playIntroReveals } from "@/motion/useReveals";
import { useSmoother } from "@/motion/useSmoother";
import { useCintaScroll, useEntraDerecha, useHeroEntrada, useIncluye, useLetras, useMicro, useOrbita, useParalajeOrb, useTapado } from "@/motion/useOrbital";
import { useRodillo } from "@/motion/useDonut";

import "lenis/dist/lenis.css";
import "./webflow-base.css";
import "./site.css";

/* Las piezas de la orbita son webs, no casos de IA: esta pagina vende la linea
   de webs a precio cerrado. Solo hay dos maquetas reales; las tres restantes
   son huecos declarados, con su medida escrita dentro para sustituir. */
const G = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/media/img/estudio`;

/* La linea que se descompone bajo el cursor en la seccion del ascensor. Son
   las cuatro fases de la linea de webs, no el metodo de consultoria: la
   pagina vende webs. */
const LINEA_WEBS = (
  <>diagnóstico · diseño · desarrollo · online<br />diagnóstico · diseño · desarrollo · online<br />diagnóstico · diseño · desarrollo · online<br />997 € · precio cerrado · sin cuotas ocultas</>
);
/* Los enlaces del encabezado van a secciones de la propia pagina. Lenis lleva
   el scroll REAL de la ventana —no un contenedor propio—, asi que un
   `scrollIntoView` suave funciona sin pelearse con el. Sin esto el ancla salta
   de golpe, y con un encabezado `sticky` delante el salto se lee como un
   parpadeo. */
const irA = (destino: string) => (e: React.MouseEvent) => {
  const d = document.querySelector(destino);
  if (!d) return;
  e.preventDefault();
  d.scrollIntoView({ behavior: "smooth", block: "start" });
};

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
  const video1 = useRef<HTMLVideoElement>(null);

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
  useIncluye(true);
  useEntraDerecha(true);
  useMicro(true);
  useGlitch(true);
  useRodillo(true);

  useEffect(() => { playIntroReveals(); }, []);

  /* El video tiene `autoplay`, pero el navegador puede negarselo —ahorro de
     bateria, pestaña en segundo plano, ajustes de reproduccion—. Se le pide
     que arranque en cuanto hay datos y, si lo rechaza, se reintenta al primer
     gesto del lector, que es cuando el permiso ya existe. */
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

  return (
    <div className="orbital">
      <Nav cta={{ texto: "Cuéntanos tu caso", href: enlaces.email, evento: "orb_nav" }} />
      <MenuWrapper />

      {/* ------------------------------------------------------------ hero */}
      <header className="orb-hero">
        {/* El marco: una lamina de color a sangre sobre la que flota la
            tarjeta negra. La composicion deja de ser "texto sobre fondo" y
            pasa a ser un objeto con canto propio, que es de donde sale la
            sensacion de pieza impresa. Empieza por debajo de la barra de
            navegacion para que el logotipo y el menu sigan cayendo sobre
            negro: la barra va en `mix-blend-mode: difference` y sobre rojo
            el blanco se le volveria cian. */}
        <div className="orb-marco">
          {/* El propio personaje, desenfocado, dentro del marco. Sin esto el
              color queda plano; con esto el marco tiene materia y se entiende
              que la tarjeta esta recortada sobre la misma imagen. */}
          <div
            className="orb-marco-fondo"
            aria-hidden="true"
            style={{ backgroundImage: `url(${img.estudioHeroPoster})` }}
          />

          <div className="orb-tarjeta">
            {/* ---------------------------------------- columna izquierda */}
            <div className="orb-tj-copy">
              <div className="orb-tj-alto">
                <div className="orb-eti orb-eti-tj">
                  ( 00 — Estudio )
                  <i className="orb-eti-l" aria-hidden="true" />
                </div>
                {/* Justificado y en caja alta: el bloque se convierte en una
                    mancha rectangular con calles anchas entre palabras. Es un
                    recurso de maqueta, no de web, y es justo lo que hace que
                    la esquina se lea como una ficha tecnica. */}
                <p data-entra="" className="orb-just">
                  {w.subA} {w.subB}
                </p>
                <div data-entra="" className="orb-par">
                  <span>Trabajamos desde</span>
                  <span>Madrid · Miami · Dubái</span>
                </div>
              </div>

              {/* Las cuatro fases, en el hueco que en el original queda vacio.
                  Aqui el vacio era demasiado —la columna medía cuatrocientos
                  pixeles de nada— y esto es dato real, no relleno. */}
              <ol data-entra="" className="orb-fases">
                <li><i aria-hidden="true">01</i><span>Diagnóstico</span></li>
                <li><i aria-hidden="true">02</i><span>Diseño</span></li>
                <li><i aria-hidden="true">03</i><span>Desarrollo</span></li>
                <li><i aria-hidden="true">04</i><span>Online</span></li>
              </ol>

              <div className="orb-tj-bajo">
                <h1 className="orb-h1">
                  <span className="orb-h1-linea">
                    <span data-marca="" className="orb-h1-marca">websites</span>
                    {/* El guion del original, aqui trazado: en vez de un
                        caracter suelto es un filete que se dibuja de
                        izquierda a derecha hasta topar con el canto. */}
                    <i className="orb-h1-filete" aria-hidden="true" />
                  </span>
                  <span data-palabra="" className="orb-h1-sangra">que</span>
                  <span data-palabra="">convierten</span>
                </h1>
                <a
                  data-entra=""
                  className="orb-pastilla"
                  href="#trabajo"
                  onClick={(e) => { evento("orb_hero_ver"); irA("#trabajo")(e); }}
                >
                  <span>Ver el trabajo</span>
                  <i className="orb-pastilla-i" aria-hidden="true">→</i>
                </a>
              </div>
            </div>

            {/* -------------------------------------- la lamina del video.
                De canto a canto en vertical y sin margen: es la columna
                central del original, la que sostiene la composicion. */}
            <div className="orb-tj-lamina">
              <video
                ref={video1}
                className="orb-lienzo"
                preload="auto"
                src={video.estudioHero}
                poster={img.estudioHeroPoster}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
              />
              <i className="orb-lamina-vel" aria-hidden="true" />
            </div>

            {/* ------------------------------------------------ rail derecho */}
            <div className="orb-tj-rail">
              <nav data-entra="" className="orb-rail-nav" aria-label="Secciones">
                <a href="#trabajo" onClick={irA("#trabajo")}>Trabajo</a>
                <a href="#incluye" onClick={irA("#incluye")}>Incluye</a>
                <a href="#contacto" onClick={irA("#contacto")}>Contacto</a>
              </nav>
              {/* La cifra grande de la esquina. En el original es un numero
                  entre parentesis y no significa nada; aqui es el precio, que
                  es el argumento entero de esta pagina. */}
              <div data-entra="" className="orb-cifra">
                <span className="orb-cifra-n">
                  <i aria-hidden="true">(</i>
                  <span data-cuenta="997">997</span>
                  <em>€</em>
                  <i aria-hidden="true">)</i>
                </span>
                <span className="orb-cifra-p">Precio cerrado · sin cuotas</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --------------------------------------------------------- premisa */}
      <section className="orb-premisa">
        <div className="orb-cont">
          <div line="" className="orb-eti">( 01 — Premisa )<i className="orb-eti-l" aria-hidden="true" /></div>
          <h2 data-letras="" className="orb-h2">
            No vendemos webs bonitas. Vendemos webs que venden.
          </h2>
          {/* Entra por la derecha al llegar a ella; el recorte no lleva marco
              porque no le hace falta: el fondo del PNG es transparente. */}
          <figure className="orb-retrato" data-entra-der="">
            <img
              src={img.mockupPortatil}
              alt="Maqueta de una web nuestra en la pantalla de un portatil."
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      {/* ------------------------------------------------- galeria orbital */}
      {/* Se clava 4500 px y las piezas giran sobre una elipse; la que pasa por
          delante crece al doble. La medida sale de la referencia. */}
      <section id="trabajo" className="orb-galeria">
        <div className="orb-galeria-cab">
          <div className="orb-eti">( 02 — Trabajo )<i className="orb-eti-l" aria-hidden="true" /></div>
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

      {/* ---------------------------------------- proceso: el ascensor */}
      {/* Misma pieza que en la portada —imagen a pantalla completa, texto que
          se descompone bajo el cursor y se recompone con el scroll— con el
          contenido de la linea de webs. Ademas tapa un hueco: la pagina no
          contaba en ningun sitio COMO se trabaja. */}
      <section className="section glitch orb-brecha">
        <div className="glitch-img-w">
          <img
            src={img.mockupGrande}
            loading="lazy"
            alt="Maqueta de una web nuestra en la pantalla de un portátil, sobre luz roja y azul."
            className="img-ascenseur"
          />
        </div>
        <div className="glitch-text-w">
          <div className="glitch-text-sticky-w">
            {["_3", "_1", "_2", "_4", "", "_6"].map((mod, i) => (
              <div key={i} className={`div-block-5${mod === "" ? " none" : ""}`}>
                <div className={`text-block-6${mod ? ` ${mod}` : ""}`}>{LINEA_WEBS}</div>
              </div>
            ))}
            <div className="finaltext">
Diagnóstico. <br />Diseño. <br />Desarrollo. <br />Online.
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- capacidad */}
      <section id="incluye" className="orb-capacidad">
        <div className="orb-cont">
          <div line="" className="orb-eti">( 04 — Qué incluye )<i className="orb-eti-l" aria-hidden="true" /></div>
          {/* La segunda mitad va en degradado y NO se parte en letras: el
              recorte del degradado se aplica al texto del propio elemento, y
              al partirlo el texto pasa a los hijos —el padre se queda sin
              nada que recortar y la palabra desaparece. */}
          <h2 className="orb-h2 orb-h2-incluye">
            <span data-letras="">{w.pilaTitulo.split("\n")[0]}</span>
            <span className="orb-degradado">{w.pilaTitulo.split("\n")[1]}</span>
          </h2>
          <ul className="orb-lista">
            {w.incluye.map((it, i) => (
              <li key={it.nombre} className="orb-lista-fila orb-lista-fija">
                <span className="orb-lista-i">{String(i + 1).padStart(2, "0")}</span>
                <span className="orb-lista-n">{it.nombre}</span>
                <span className="orb-lista-d">{it.detalle}</span>
                <i className="orb-lista-filete" aria-hidden="true" />
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
          <figure><img src={img.cierre1} alt="" loading="lazy" data-orb-par="13" /></figure>
          <figure><img src={img.cierre2} alt="" loading="lazy" data-orb-par="15" /></figure>
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
            <span>Cuéntanos tu caso</span>
            <i className="orb-btn-f" aria-hidden="true">→</i>
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
