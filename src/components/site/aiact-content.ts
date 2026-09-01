/**
 * El texto de la pagina del AI Act.
 *
 * Es el contenido APROBADO de la landing informativa
 * (albertochamorro88-dot.github.io/aiact-informativa), traido tal cual. Lo que
 * cambia es el diseno, no lo que dice: el copy no se toca sin que pase otra
 * vez por aprobacion.
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

/** El video de YouTube en el que Alejandro explica el reglamento. */
export const actVideo = {
  id: "T4eKjJMs9Ak",
  etiqueta: "Míralo explicado",
  titulo: "El AI Act, contado por quien construye los sistemas.",
  duracionAlt: "Ver el vídeo en YouTube",
  autor: {
    nombre: "Alejandro Ríos",
    rol: "Cofundador y CTO · The AI Business",
    bio: "Ha diseñado e implementado sistemas de IA en más de 200 empresas. Conoce la ley desde dentro: traduce cada obligación en controles reales, no en teoría jurídica.",
  },
} as const;

export const actHero = {
  eyebrow: "Reglamento UE 2024/1689",
  /* El titular se parte para la caida en domino: la primera palabra entra
     entera y en degradado —no se puede partir en letras sin perder el
     recorte—, las otras dos caen letra a letra. */
  marca: "AI Act",
  palabras: ["ya te", "obliga"],
  sub: "La nueva ley de la IA obliga a toda empresa que la use, propia o comprada.",
  cta: "Ver el mapa",
} as const;

/** Desde cuando corre el contador de dias en vigor (Art. 4). */
export const EN_VIGOR_DESDE = "2025-02-02";

export const actFicha =
  "El Reglamento de Inteligencia Artificial regula cómo tu empresa usa la IA. Aplica por el uso, no por el tamaño: si tu equipo usa un asistente comprado o un modelo propio, ya estás dentro. La mayoría ni lo sabe.";

export const actClaim = {
  etiqueta: "Por qué te afecta",
  lead: "No regula la tecnología. Regula el uso que haces de ella.",
  cita: "Tener un informe no es cumplir.",
  citaAcento: "Cumplir es cambiar el sistema.",
  cuerpo:
    "Cumplir el reglamento es un 20% legal y un 80% técnico: clasificar el riesgo de tus modelos, construir la trazabilidad y montar la supervisión humana que la ley exige. En la llamada de 15 minutos te damos el punto de partida, claro y sin jerga.",
} as const;

export type Nivel = { index: string; titulo: string; cuerpo: string; etiqueta?: string };

/** Los cuatro niveles de riesgo en que la ley clasifica cada sistema de IA. */
export const actNiveles: Nivel[] = [
  {
    index: "01",
    titulo: "Riesgo inaceptable",
    cuerpo:
      "Usos prohibidos: puntuación social, manipulación del comportamiento, categorización biométrica sensible. Vetados desde febrero de 2025.",
    etiqueta: "Prohibido",
  },
  {
    index: "02",
    titulo: "Alto riesgo",
    cuerpo:
      "IA en RR. HH., crédito, educación, salud o infraestructura crítica. Exige documentación técnica, trazabilidad y supervisión humana.",
    etiqueta: "Máxima obligación",
  },
  {
    index: "03",
    titulo: "Riesgo limitado",
    cuerpo:
      "Chatbots, generadores de contenido, deepfakes. Obligación de transparencia: la persona tiene que saber que habla con una IA.",
    etiqueta: "Transparencia",
  },
  {
    index: "04",
    titulo: "Riesgo mínimo",
    cuerpo:
      "El resto de usos. Hoy sin obligaciones específicas, pero conviene tener el inventario hecho: un sistema puede cambiar de categoría.",
  },
];

export type Hito = { fecha: string; corto: string; estado: string; titulo: string; cuerpo: string; pasado: boolean };

/** El calendario del reglamento. */
export const actHitos: Hito[] = [
  {
    fecha: "2 feb 2025",
    corto: "feb 25",
    estado: "Vencido",
    titulo: "Formación obligatoria",
    cuerpo:
      "Prohibiciones y alfabetización en IA (Art. 4). Toda empresa que usa IA debe formar a su equipo. La mayoría ya está en incumplimiento, y no lo sabe.",
    pasado: true,
  },
  {
    fecha: "2 ago 2025",
    corto: "ago 25",
    estado: "Vigente",
    titulo: "Sanciones activas",
    cuerpo:
      "Modelos de propósito general, gobernanza y régimen sancionador. Desde aquí, el incumplimiento tiene un precio.",
    pasado: true,
  },
  {
    fecha: "2 ago 2026",
    corto: "ago 26",
    estado: "En vigor",
    titulo: "Sistemas de alto riesgo",
    cuerpo:
      "Documentación técnica, gestión de riesgos, supervisión humana y registros. El plazo que ningún comité puede ignorar.",
    pasado: true,
  },
  {
    fecha: "2 ago 2027",
    corto: "ago 27",
    estado: "Próximo",
    titulo: "Productos regulados",
    cuerpo: "Cierre del calendario para los casos más complejos: salud, automoción, industria.",
    pasado: false,
  },
];

/** Con quien te comparan cuando buscas como cumplir. */
export const actRivales = [
  {
    quien: "Bufetes",
    que: "Te dan un dictamen",
    cuerpo:
      "Se conocen la ley. No pueden entrar en tu sistema, clasificar tus modelos ni construir la trazabilidad.",
  },
  {
    quien: "Big Four",
    que: "Auditan y se van",
    cuerpo:
      "Diagnóstico caro, propuesta lenta y cero capacidad de construir. La brecha entre consultor y ejecutor sigue abierta.",
  },
  {
    quien: "Software de compliance",
    que: "Listas genéricas",
    cuerpo:
      "No conocen tu negocio ni tus sistemas. Marcan casillas; no resuelven la conformidad real.",
  },
  {
    quien: "The AI Business",
    que: "Consultamos y construimos",
    cuerpo:
      "Entendemos los sistemas y los construimos. La conformidad se diseña dentro del sistema, no se añade por encima.",
  },
] as const;

/** Las cifras. `n` y `sufijo` van aparte para poder contarlas al entrar. */
export const actCifras = [
  { n: 4, sufijo: "", etiqueta: "Niveles de riesgo en los que la ley clasifica cada sistema" },
  { n: 7, sufijo: "%", etiqueta: "De la facturación anual global, sanción máxima" },
  { n: 35, sufijo: "M€", etiqueta: "Sanción máxima por prácticas prohibidas (Art. 99)" },
] as const;

/** Bandas de llamada intermedias, para no tener que llegar al final. */
export const actBandas = [
  { linea: "¿Y tú? ¿En qué nivel de riesgo cae tu empresa?", boton: "Descúbrelo en 15 min" },
  { linea: "Deja de suponer. Ponle cifras a tu exposición.", boton: "Reservar diagnóstico" },
  { linea: "Ya estás obligado. Empieza por saber cuánto.", boton: "Reservar mi diagnóstico" },
] as const;

export const actContacto = {
  titulo: ["No esperes a una inspección", "para saber qué IA usas."],
  texto:
    "Empieza con una evaluación de 15 minutos. Si el Sprint AI Act no encaja con tu empresa, te lo decimos durante la llamada. Sin preparación previa.",
  formTitulo: "Reserva tu diagnóstico.",
  formTexto: "Evaluación de 15 minutos. Sin compromiso.",
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
