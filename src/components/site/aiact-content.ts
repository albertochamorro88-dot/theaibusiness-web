/**
 * El texto de la pagina del AI Act.
 *
 * Segunda pasada: el contenido aprobado, PODADO. La primera version traia los
 * parrafos enteros de la landing informativa y la lectura se hacia larga; aqui
 * cada seccion defiende UNA idea con las palabras justas y deja que la
 * animacion cuente el resto. No se ha inventado ningun argumento nuevo: lo que
 * queda son las frases aprobadas, recortadas.
 *
 * Fuente original: https://theaibusiness.com/es/ai-act
 */

const MEDIA = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/media`;

export const actMedia = {
  heroVideo: `${MEDIA}/video/aiact/hero.mp4`,
  heroPoster: `${MEDIA}/img/aiact/hero-poster.jpg`,
  /* La portada del video de YouTube, servida desde aqui y no desde ytimg: asi
     la pagina no pide nada a Google hasta que alguien le da al play. */
  videoPortada: `${MEDIA}/img/aiact/video-portada.jpg`,
  alejandro: `${MEDIA}/img/aiact/alejandro.jpg`,
} as const;

/* -------------------------------------------------------------- 00 · hero */

export const actHero = {
  eyebrow: "Reglamento UE 2024/1689",
  /* El titular se parte para la caida en domino: la primera palabra entra
     entera y en degradado —no se puede partir en letras sin perder el
     recorte—, las otras dos caen letra a letra. */
  marca: "AI Act",
  palabras: ["ya te", "obliga"],
  cta: "Ver el mapa",
} as const;

/** Desde cuando corre el contador de dias en vigor (Art. 4). */
export const EN_VIGOR_DESDE = "2025-02-02";

/** La entradilla de la tarjeta. Una frase: el resto lo dice el titular. */
export const actFicha =
  "Aplica por el uso, no por el tamaño. Si tu equipo usa IA —comprada o propia—, ya estás dentro.";

/* ------------------------------------------------------ 01 · que regula */

/**
 * La escena de la sustitucion. Una frase tacha a la otra: eso es literalmente
 * lo que hace la ley, y por eso la animacion es un reemplazo y no una entrada.
 */
export const actSust = {
  etiqueta: "Qué regula",
  fuera: "No regula la tecnología.",
  dentro: "Regula el uso.",
  cita: "Tener un informe no es cumplir.",
  citaAcento: "Cumplir es cambiar el sistema.",
  pie: ["20 %", "legal", "80 %", "técnico"],
} as const;

/* ---------------------------------------------------------- 02 · niveles */

export type Nivel = {
  index: string;
  titulo: string;
  cuerpo: string;
  etiqueta: string;
  /* El color del nivel en el medidor. Va de rojo a gris siguiendo el
     degradado de marca: cuanto mas arriba en la escala, mas rojo. */
  color: string;
};

/** Los cuatro niveles de riesgo en que la ley clasifica cada sistema de IA. */
export const actNiveles: Nivel[] = [
  {
    index: "01",
    titulo: "Riesgo inaceptable",
    cuerpo: "Puntuación social, manipulación, biometría sensible. Vetados desde febrero de 2025.",
    etiqueta: "Prohibido",
    color: "#FA4D4D",
  },
  {
    index: "02",
    titulo: "Alto riesgo",
    cuerpo: "RR. HH., crédito, salud, infraestructura. Documentación, trazabilidad y supervisión humana.",
    etiqueta: "Máxima obligación",
    color: "#A855C9",
  },
  {
    index: "03",
    titulo: "Riesgo limitado",
    cuerpo: "Chatbots, generadores, deepfakes. La persona tiene que saber que habla con una IA.",
    etiqueta: "Transparencia",
    color: "#5A70FA",
  },
  {
    index: "04",
    titulo: "Riesgo mínimo",
    cuerpo: "El resto. Hoy sin obligaciones, pero un sistema puede cambiar de categoría.",
    etiqueta: "Inventario",
    color: "#D7D9E6",
  },
];

/* --------------------------------------------------------- 03 · el reloj */

export type Hito = {
  fecha: string;
  corto: string;
  estado: string;
  titulo: string;
  nota: string;
  pasado: boolean;
};

/** El calendario del reglamento. Sin parrafos: fecha, estado y titular. */
export const actHitos: Hito[] = [
  {
    fecha: "2 feb 2025",
    corto: "feb 25",
    estado: "Vencido",
    titulo: "Formación obligatoria",
    nota: "Art. 4. La mayoría ya incumple.",
    pasado: true,
  },
  {
    fecha: "2 ago 2025",
    corto: "ago 25",
    estado: "Vigente",
    titulo: "Sanciones activas",
    nota: "Desde aquí, incumplir tiene precio.",
    pasado: true,
  },
  {
    fecha: "2 ago 2026",
    corto: "ago 26",
    estado: "En vigor",
    titulo: "Sistemas de alto riesgo",
    nota: "Documentación, riesgos y supervisión.",
    pasado: true,
  },
  {
    fecha: "2 ago 2027",
    corto: "ago 27",
    estado: "Próximo",
    titulo: "Productos regulados",
    nota: "Salud, automoción, industria.",
    pasado: false,
  },
];

/* ---------------------------------------------------------- 04 · la multa */

/** Una cifra sola, a pantalla completa. Es el numero que decide si sigues. */
export const actMulta = {
  etiqueta: "Lo que hay en juego",
  n: 35,
  sufijo: "M€",
  titulo: "Sanción máxima.",
  pie: "Art. 99 · o el 7 % de la facturación anual global, lo que sea mayor.",
  lados: [
    { n: 4, sufijo: "", etiqueta: "Niveles de riesgo" },
    { n: 7, sufijo: "%", etiqueta: "De facturación global" },
  ],
} as const;

/* ----------------------------------------------------------- 05 · video */

export const actVideo = {
  id: "T4eKjJMs9Ak",
  etiqueta: "Míralo explicado",
  titulo: "El AI Act, contado por quien construye los sistemas.",
  duracionAlt: "Ver el vídeo en YouTube",
  autor: {
    nombre: "Alejandro Ríos",
    rol: "Cofundador y CTO · The AI Business",
    bio: "IA implantada en más de 200 empresas. Traduce cada obligación en controles reales.",
  },
} as const;

/* --------------------------------------------------------- 06 · rivales */

/** Con quien te comparan cuando buscas como cumplir. */
export const actRivales = [
  { quien: "Bufetes", que: "Te dan un dictamen", cuerpo: "No entran en tu sistema." },
  { quien: "Big Four", que: "Auditan y se van", cuerpo: "Diagnostican caro. No construyen." },
  { quien: "Software", que: "Listas genéricas", cuerpo: "Marcan casillas. No resuelven." },
  {
    quien: "The AI Business",
    que: "Consultamos y construimos",
    cuerpo: "La conformidad se diseña dentro del sistema.",
  },
] as const;

/* ------------------------------------------------------------- llamadas */

/** Bandas de llamada intermedias, para no tener que llegar al final. */
export const actBandas = [
  { linea: "¿En qué nivel de riesgo cae tu empresa?", boton: "Descúbrelo en 15 min" },
  { linea: "Ya estás obligado. Empieza por saber cuánto.", boton: "Reservar diagnóstico" },
] as const;

export const actContacto = {
  titulo: ["No esperes a una inspección", "para saber qué IA usas."],
  texto: "Evaluación de 15 minutos. Si no encaja con tu empresa, te lo decimos en la llamada.",
  formTitulo: "Reserva tu diagnóstico.",
  formTexto: "15 minutos. Sin preparación previa.",
  campos: { nombre: "Nombre", email: "Email", empresa: "Empresa" },
  necesidadLabel: "¿Qué describe mejor tu caso?",
  necesidades: [
    "Usamos IA comprada",
    "Desarrollamos IA propia",
    "Alto riesgo (RR. HH., crédito, salud)",
    "No lo sé",
  ],
  enviar: "Reservar diagnóstico · 15 min",
} as const;
