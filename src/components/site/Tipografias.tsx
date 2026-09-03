"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * El probador de tipografias.
 *
 * Toda la web se compone con una sola variable —`--tipo-texto`, que resuelve a
 * `--fuente-texto` y, si nadie la ha puesto, a la Inter de serie—, asi que
 * cambiar la tipografia entera es cambiar UNA propiedad en el elemento raiz.
 * Este panel no es mas que eso con una lista delante: elige familia, la carga
 * y la aplica en caliente. Los titulares tienen la suya, `--fuente-tit`, para
 * poder probar parejas.
 *
 * Dos decisiones que importan:
 *
 * 1. NO se ve nunca a menos que la URL lleve `?fuentes` (o `?fonts`). No es una
 *    funcion de la web, es una herramienta para elegir; un visitante no tiene
 *    por que encontrarsela, y asi no hay que acordarse de quitarla despues.
 *
 * 2. La eleccion se guarda y se vuelve a aplicar ANTES de pintar, desde un
 *    script en el `<head>`. Hace falta porque los titulares se parten en lineas
 *    al montar la pagina: si la fuente cambia despues del corte, las lineas se
 *    quedan medidas con la fuente vieja y lo que se ve no es lo que seria. Con
 *    el script, recargar da el render honesto.
 */

type Fuente = {
  nombre: string;
  pila: string;
  /** Hoja que hay que cargar. Inter no la necesita: ya viene con la pagina. */
  css?: string;
  nota: string;
};

const google = (familia: string) =>
  `https://fonts.googleapis.com/css2?family=${familia.replace(/ /g, "+")}:wght@400;500;600;700&display=swap`;

const fontshare = (slug: string) =>
  `https://api.fontshare.com/v2/css?f%5B%5D=${slug}@400,500,600,700&display=swap`;

/**
 * El catalogo. Ordenado de lo mas cercano a lo que hay hoy a lo mas lejos, que
 * es el orden en el que se decide: primero se descarta que Inter valga.
 */
const FUENTES: Fuente[] = [
  {
    /* Inter no lleva pila: elegirla es QUITAR el override, no ponerle uno.
       La pagina la sirve `next/font` con un nombre de familia generado
       («__Inter_a1b2c3»), asi que escribir aqui «Inter» a secas apuntaria a la
       que tuviera instalada cada ordenador, que no es la misma. */
    nombre: "Inter",
    pila: "",
    nota: "La de ahora. Neogrotesca neutra, dibujada para pantalla.",
  },
  {
    nombre: "Geist",
    pila: "'Geist', system-ui, sans-serif",
    css: google("Geist"),
    nota: "La de Vercel. Inter con las esquinas más secas; se nota en titular grande.",
  },
  {
    nombre: "Switzer",
    pila: "'Switzer', system-ui, sans-serif",
    css: fontshare("switzer"),
    nota: "Suiza moderna. Muy cerca de Inter pero con más vida en las curvas.",
  },
  {
    nombre: "Satoshi",
    pila: "'Satoshi', system-ui, sans-serif",
    css: fontshare("satoshi"),
    nota: "La favorita de los estudios. Geométrica y seca; sube el tono de firma.",
  },
  {
    nombre: "General Sans",
    pila: "'General Sans', system-ui, sans-serif",
    css: fontshare("general-sans"),
    nota: "Neutra con un punto más cálido que Inter. Aguanta texto largo.",
  },
  {
    nombre: "Schibsted Grotesk",
    pila: "'Schibsted Grotesk', system-ui, sans-serif",
    css: google("Schibsted Grotesk"),
    nota: "De prensa. Sobria y muy legible en párrafo.",
  },
  {
    nombre: "Instrument Sans",
    pila: "'Instrument Sans', system-ui, sans-serif",
    css: google("Instrument Sans"),
    nota: "Más estrecha. Mete más palabras por línea sin apretar.",
  },
  {
    nombre: "Archivo",
    pila: "'Archivo', system-ui, sans-serif",
    css: google("Archivo"),
    nota: "Más robusta y ancha. Pega en titulares de pantalla completa.",
  },
  {
    nombre: "Space Grotesk",
    pila: "'Space Grotesk', system-ui, sans-serif",
    css: google("Space Grotesk"),
    nota: "Técnica, con detalles raros. Suena a producto, no a consultora.",
  },
  {
    nombre: "Sora",
    pila: "'Sora', system-ui, sans-serif",
    css: google("Sora"),
    nota: "Geométrica. Titular limpísimo, texto algo frío.",
  },
  {
    nombre: "Plus Jakarta Sans",
    pila: "'Plus Jakarta Sans', system-ui, sans-serif",
    css: google("Plus Jakarta Sans"),
    nota: "Amable sin perder oficio. Baja un poco la dureza de la marca.",
  },
  {
    nombre: "Manrope",
    pila: "'Manrope', system-ui, sans-serif",
    css: google("Manrope"),
    nota: "Humanista y redonda. La más blanda de la lista.",
  },
  {
    nombre: "DM Sans",
    pila: "'DM Sans', system-ui, sans-serif",
    css: google("DM Sans"),
    nota: "Neutra y cómoda. También la más vista: no distingue.",
  },
  {
    nombre: "Onest",
    pila: "'Onest', system-ui, sans-serif",
    css: google("Onest"),
    nota: "Suave y actual. Punto medio entre Inter y Manrope.",
  },
  {
    nombre: "Bricolage Grotesque",
    pila: "'Bricolage Grotesque', system-ui, sans-serif",
    css: google("Bricolage Grotesque"),
    nota: "Con carácter y algo desobediente. Para titulares, no para párrafo.",
  },
  {
    nombre: "Funnel Display",
    pila: "'Funnel Display', system-ui, sans-serif",
    css: google("Funnel Display"),
    nota: "Display puro. Solo titulares; en texto pequeño se cae.",
  },
  {
    nombre: "Instrument Serif",
    pila: "'Instrument Serif', Georgia, serif",
    css: google("Instrument Serif"),
    nota: "Serif editorial. Solo para titulares, y el contraste es fuerte.",
  },
];

const LLAVE = "tab:fuentes";

/** Lo que se guarda. Deliberadamente tonto: el script del `<head>` lo aplica
    tal cual sin conocer el catalogo. */
type Guardado = {
  texto?: { pila: string; css?: string; nombre: string };
  titulares?: { pila: string; css?: string; nombre: string };
  track?: string;
};

/**
 * El script que corre antes de pintar. Va en el `<head>` del layout.
 *
 * Solo hace algo si hay una eleccion guardada, asi que para quien no ha abierto
 * el panel nunca es mas que un `try` vacio.
 */
export const PRE_FUENTES = `try{var s=localStorage.getItem(${JSON.stringify(LLAVE)});if(s){var c=JSON.parse(s),d=document,r=d.documentElement;[c.texto,c.titulares].forEach(function(f){if(f&&f.css&&!d.querySelector('link[data-fuente="'+f.css+'"]')){var l=d.createElement('link');l.rel='stylesheet';l.href=f.css;l.setAttribute('data-fuente',f.css);d.head.appendChild(l);}});if(c.texto&&c.texto.pila)r.style.setProperty('--fuente-texto',c.texto.pila);if(c.titulares&&c.titulares.pila)r.style.setProperty('--fuente-tit',c.titulares.pila);if(c.track)r.style.setProperty('--fuente-track',c.track);}}catch(e){}`;

const cargar = (css?: string) => {
  if (!css || typeof document === "undefined") return;
  if (document.querySelector(`link[data-fuente="${css}"]`)) return;
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = css;
  l.setAttribute("data-fuente", css);
  document.head.appendChild(l);
};

const leer = (): Guardado => {
  try {
    return JSON.parse(localStorage.getItem(LLAVE) ?? "{}") as Guardado;
  } catch {
    return {};
  }
};

export default function Tipografias() {
  const [abierto, setAbierto] = useState(false);
  const [plegado, setPlegado] = useState(false);
  const [texto, setTexto] = useState("Inter");
  const [titulares, setTitulares] = useState("Inter");
  /* Centesimas de em. `null` es «no lo he tocado», que no es lo mismo que
     cero: sin tocar, cada titular conserva el interletrado que ya tenia. */
  const [track, setTrack] = useState<number | null>(null);
  const [copiado, setCopiado] = useState(false);

  /* Solo aparece si lo has pedido por la URL. */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (!q.has("fuentes") && !q.has("fonts")) return;
    setAbierto(true);
    const g = leer();
    if (g.texto?.nombre) setTexto(g.texto.nombre);
    if (g.titulares?.nombre) setTitulares(g.titulares.nombre);
    if (g.track) setTrack(Math.round(parseFloat(g.track) * 100));
  }, []);

  const aplicar = useCallback((nTexto: string, nTit: string, nTrack: number | null) => {
    const fTexto = FUENTES.find((f) => f.nombre === nTexto) ?? FUENTES[0];
    const fTit = FUENTES.find((f) => f.nombre === nTit) ?? FUENTES[0];
    cargar(fTexto.css);
    cargar(fTit.css);

    const raiz = document.documentElement;
    /* Sin pila —Inter— se retira la propiedad y la hoja vuelve sola a su
       valor por defecto. Escribirle un valor «neutro» seria mentir: no existe
       tal cosa, porque el nombre real de la familia lo genera el build. */
    if (fTexto.pila) raiz.style.setProperty("--fuente-texto", fTexto.pila);
    else raiz.style.removeProperty("--fuente-texto");
    if (fTit.pila) raiz.style.setProperty("--fuente-tit", fTit.pila);
    else raiz.style.removeProperty("--fuente-tit");

    /* El interletrado se inyecta aparte y solo cuando se toca: asi, sin tocarlo,
       cada titular conserva el suyo en vez de recibir uno igual para todos. */
    let hoja = document.getElementById("fuentes-track");
    const em = nTrack === null ? "" : `${(nTrack / 100).toFixed(2)}em`;
    if (nTrack === null) {
      hoja?.remove();
    } else {
      if (!hoja) {
        hoja = document.createElement("style");
        hoja.id = "fuentes-track";
        document.head.appendChild(hoja);
      }
      hoja.textContent = `h1,h2,h3,h4,h5,h6{letter-spacing:${em} !important}`;
    }

    const guardado: Guardado = {
      texto: { nombre: fTexto.nombre, pila: fTexto.pila, css: fTexto.css },
      titulares: { nombre: fTit.nombre, pila: fTit.pila, css: fTit.css },
      track: nTrack === null ? undefined : em,
    };
    try { localStorage.setItem(LLAVE, JSON.stringify(guardado)); } catch { /* modo privado */ }
  }, []);

  useEffect(() => {
    if (!abierto) return;
    aplicar(texto, titulares, track);
  }, [abierto, texto, titulares, track, aplicar]);

  if (!abierto) return null;

  const fTexto = FUENTES.find((f) => f.nombre === texto) ?? FUENTES[0];
  const fTit = FUENTES.find((f) => f.nombre === titulares) ?? FUENTES[0];

  const css = [
    "/* pegar en site.css */",
    ":root{",
    `  --fuente-texto: ${fTexto.pila || "/* Inter, la de serie */"};`,
    `  --fuente-tit: ${fTit.pila || "/* Inter, la de serie */"};`,
    "}",
    ...(fTexto.css ? [`/* hoja texto:     ${fTexto.css} */`] : []),
    ...(fTit.css && fTit.css !== fTexto.css ? [`/* hoja titulares: ${fTit.css} */`] : []),
    ...(track !== null ? [`h1,h2,h3,h4,h5,h6{letter-spacing:${(track / 100).toFixed(2)}em}`] : []),
  ].join("\n");

  const limpiar = () => {
    try { localStorage.removeItem(LLAVE); } catch { /* nada */ }
    document.getElementById("fuentes-track")?.remove();
    const raiz = document.documentElement;
    raiz.style.removeProperty("--fuente-texto");
    raiz.style.removeProperty("--fuente-tit");
    setTexto("Inter"); setTitulares("Inter"); setTrack(null);
  };

  return (
    <aside className="tipo-panel" data-plegado={plegado ? "" : undefined}>
      <header className="tipo-cab">
        <button
          type="button" className="tipo-plegar"
          onClick={() => setPlegado((p) => !p)}
          aria-label={plegado ? "Abrir el probador" : "Plegar el probador"}
        >
          <span className="tipo-punto" aria-hidden="true" />
          Tipografías
        </button>
        <span className="tipo-par">{titulares === texto ? texto : `${titulares} / ${texto}`}</span>
      </header>

      <div className="tipo-cuerpo">
        <label className="tipo-campo">
          <span>Titulares</span>
          <select value={titulares} onChange={(e) => setTitulares(e.target.value)}>
            {FUENTES.map((f) => <option key={f.nombre} value={f.nombre}>{f.nombre}</option>)}
          </select>
        </label>
        <p className="tipo-nota">{fTit.nota}</p>

        <label className="tipo-campo">
          <span>Texto</span>
          <select value={texto} onChange={(e) => setTexto(e.target.value)}>
            {FUENTES.map((f) => <option key={f.nombre} value={f.nombre}>{f.nombre}</option>)}
          </select>
        </label>
        <p className="tipo-nota">{fTexto.nota}</p>

        <label className="tipo-campo tipo-track">
          <span>Interletrado {track === null ? "· sin tocar" : `· ${(track / 100).toFixed(2)}em`}</span>
          <input
            type="range" min={-6} max={2} step={1} value={track ?? -1}
            onChange={(e) => setTrack(Number(e.target.value))}
          />
        </label>

        <div className="tipo-botones">
          <button type="button" onClick={() => window.location.reload()}>
            Recargar limpio
          </button>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(css).then(
                () => { setCopiado(true); setTimeout(() => setCopiado(false), 1600); },
                () => { /* sin permiso de portapapeles */ },
              );
            }}
          >
            {copiado ? "Copiado ✓" : "Copiar CSS"}
          </button>
          <button type="button" onClick={limpiar}>Volver a Inter</button>
        </div>

        {/* Los titulares se parten en lineas al cargar la pagina. Si cambias la
            fuente sin recargar, las lineas siguen medidas con la anterior. */}
        <p className="tipo-aviso">
          Recarga antes de juzgar un titular: los cortes de línea se calculan al
          abrir la página.
        </p>
      </div>
    </aside>
  );
}
