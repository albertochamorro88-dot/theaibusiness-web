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
  /* La marquesina del metro. El panel iluminado ocupa, sobre los 1536x1024 del
     original, de x=63 a x=1495 y de y=142 a y=702; esos cuatro numeros son los
     que colocan el texto DENTRO del cartel en cualquier pantalla, y por eso
     estan medidos y no estimados. Si se cambia la foto hay que volver a
     medirlos: van en `.act-cartel`. */
  cartel: `${MEDIA}/img/aiact/cartel.jpg`,
  /* La sala de exposicion. El muro de led ocupa, sobre los 1402x1122 del
     original, de x=98 a x=1281 y de y=266 a y=858. Las siluetas de la gente
     tapan el cuarto de abajo del muro, asi que el texto se queda arriba.
     Mismo aviso que con el cartel: si se cambia la foto, hay que volver a
     medir. Van en `.act-muro`. */
  sala: `${MEDIA}/img/aiact/sala.jpg`,
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
  /* La cinta del cierre. Ya no es adorno: es la oferta. Va con guiones
     largos porque la frase se repite en bucle y el guion es lo que empalma
     el final de una copia con el principio de la siguiente. */
  cinta: "Diagnóstico del AI Act — 15 minutos — Sin compromiso —",
  titulo: ["No esperes a una inspección", "para saber qué IA usas."],
  texto: "Evaluación de 15 minutos. Si no encaja con tu empresa, te lo decimos en la llamada.",
  /* Lo que pasa en la llamada, en el orden en que pasa. Es el dato que
     faltaba: hasta ahora el formulario pedia cuatro campos sin decir a cambio
     de que, y eso es exactamente donde se cae la gente. No hay promesa nueva
     —cada linea describe una seccion que ya esta mas arriba en la pagina. */
  agendaLabel: "Qué pasa en esos 15 minutos",
  agenda: [
    "Repasamos qué IA usa tu equipo hoy, comprada o propia.",
    "Te decimos en qué nivel de riesgo cae cada una.",
    "Sales con el orden de lo que te toca hacer, y cuándo.",
  ],
  formTitulo: "Reserva tu diagnóstico.",
  formTexto: "15 minutos. Sin preparación previa.",
  campos: { nombre: "Nombre", email: "Email", empresa: "Empresa (opcional)" },
  necesidadLabel: "¿Qué describe mejor tu caso?",
  necesidades: [
    "Usamos IA comprada",
    "Desarrollamos IA propia",
    "Alto riesgo (RR. HH., crédito, salud)",
    "No lo sé",
  ],
  enviar: "Reservar diagnóstico · 15 min",
  /* Debajo del boton, donde se decide el ultimo clic. */
  garantia: "Sin compromiso. No compartimos tus datos.",
} as const;
