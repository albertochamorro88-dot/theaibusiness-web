/**
 * Rutas locales de los assets de marca.
 *
 * `BASE` es el prefijo de la ruta cuando el sitio no cuelga de la raiz del
 * dominio — en GitHub Pages vive en `/<repo>/`. Next reescribe solo lo suyo;
 * estas rutas las escribimos nosotros, asi que hay que prefijarlas a mano o
 * desplegado darian 404. En local la variable no existe y queda vacio.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const MEDIA = `${BASE}/media`;
const IMG = `${BASE}/media/img`;
const VIDEO = `${BASE}/media/video`;

/**
 * Version de los archivos de marca.
 *
 * Los PNG del logotipo se regeneraron desde el vector y pasaron de 900 px a
 * 2600, pero conservando el nombre: el navegador que ya tenia el viejo en
 * cache seguia pintando ese, y el hero se veia pixelado aunque en disco el
 * archivo fuese el bueno. Con el sufijo la URL cambia y no hay forma de que
 * sirva el anterior. Subir el numero cada vez que se sustituya un archivo de
 * marca sin cambiarle el nombre.
 */
const V = "?v=2";

export const img = {
  logo: `${IMG}/logo.png${V}`,
  marcaGradiente: `${IMG}/marca-02.png${V}`,
  marcaBlanca: `${IMG}/marca-03.png${V}`,

  casoSanidad: `${IMG}/caso-sanidad.jpg`,
  casoInmobiliario: `${IMG}/caso-inmobiliario.jpg`,
  casoEducacion: `${IMG}/caso-educacion.jpg`,
  casoAutomocion: `${IMG}/caso-automocion.jpg`,
  casoRetail: `${IMG}/caso-retail.jpg`,

  salaJuntas: `${IMG}/sala-juntas.jpg`,
  ejecutivo: `${IMG}/ejecutivo-1x1.jpg`,
  proyectoAutointel: `${IMG}/proyecto-autointel.jpg`,
  proyectoDermai: `${IMG}/proyecto-dermai.jpg`,
  proyectoBanca: `${IMG}/proyecto-banca.jpg`,
  proyectoFundos: `${IMG}/proyecto-fundos.jpg`,

  /* El collage flotante: los ocho objetos y las dos letras de la marca,
     recortadas del logotipo blanco real (marca-03), no redibujadas. */
  asterisco: `${IMG}/formas/asterisco.webp`,
  raton: `${IMG}/formas/raton.webp`,
  perro: `${IMG}/formas/perro.webp`,
  engranaje: `${IMG}/formas/engranaje.webp`,
  bombilla: `${IMG}/formas/bombilla.webp`,
  tele: `${IMG}/formas/tele.webp`,
  candado: `${IMG}/formas/candado.webp`,
  pompon: `${IMG}/formas/pompon.webp`,
  letraA: `${IMG}/formas/letra-a.png${V}`,
  letraI: `${IMG}/formas/letra-i.png${V}`,

  /* Los objetos que desfilan entre la A y la I en la pantalla de carga. */
  cargando: [
    `${IMG}/cargando/perro.webp`,
    `${IMG}/cargando/brujula.webp`,
    `${IMG}/cargando/candado.webp`,
    `${IMG}/cargando/raton.webp`,
    `${IMG}/cargando/esfera.webp`,
    `${IMG}/cargando/portatil.webp`,
  ],
} as const;

export const video = {
  heroFondo: `${VIDEO}/hero-fondo.mp4`,
  showreel: `${VIDEO}/showreel.mp4`,
  manifiesto: `${VIDEO}/manifiesto.mp4`,
  manifiestoReflejo: `${VIDEO}/manifiesto-reflejo.mp4`,
} as const;

/**
 * Destinos.
 *
 * `agenda` es el unico destino de reserva: el handoff exige que los tres CTA
 * —nav, hero y cierre— resuelvan al mismo sitio. Sigue apuntando a la pagina
 * de diagnostico porque todavia no hay URL de scheduler; cuando la haya, se
 * cambia AQUI y cambian los tres.
 */
export const enlaces = {
  agenda: "https://theaibusiness.com/diagnostico",
  email: "mailto:info@theaibusiness.com",
  linkedin: "https://www.linkedin.com/company/the-ai-business",
  web: "https://theaibusiness.com",
} as const;

const CASO = `${MEDIA}/casos`;

/**
 * Los cinco trabajos, en el orden del handoff: Santander, Audi, SANGI,
 * FuertaFit y BidFuse.
 *
 * `titular`, `descriptor` y `resultados` salen del handoff de copy del 28 de
 * agosto de 2026; las cifras son las de su pagina de "Proof control" y solo se
 * tocan con visto bueno de marketing. BidFuse va a proposito sin cifra: no hay
 * metrica atribuible a la casa.
 */
export type Caso = {
  nombre: string;
  href: string;
  media: string;
  alt: string;
  video: boolean;
  /** Cliente / sector, encima del nombre. */
  sector: string;
  /** El titular del caso. */
  titular: string;
  /** Contexto de lo construido. No es una metrica. */
  descriptor?: string;
  /** Prueba visible sin hover, tanto en la tarjeta como en la ficha. */
  prueba?: string;
  /** Texto del enlace: los casos sin case study aprobado van como proyecto. */
  enlace: string;
  resultados?: { cifra: string; concepto: string }[];
  /** Nombre del evento de analitica. */
  evento: string;
};

export const casos: Caso[] = [
  {
    nombre: "Santander",
    href: "/works/santander",
    media: `${CASO}/santander.mp4`,
    video: true,
    alt: "Santander — mapa de oportunidades de IA sobre procesos de banca.",
    sector: "Santander / Banking",
    titular: "Finding the AI opportunities worth building.",
    prueba: "+5% estimated operational efficiency",
    enlace: "View case",
    evento: "case_santander_open",
    resultados: [
      { cifra: "4", concepto: "Audited areas" },
      { cifra: "12", concepto: "Mapped processes" },
      { cifra: "€2.1M", concepto: "Estimated impact" },
      { cifra: "+5%", concepto: "Estimated operational efficiency" },
    ],
  },
  {
    nombre: "Audi",
    href: "/works/audi",
    media: `${CASO}/audi.mp4`,
    video: true,
    alt: "Audi — software interno a medida para operaciones de fabricacion premium.",
    sector: "Audi / Automotive",
    titular: "Specialized software for premium internal operations.",
    prueba: "+30% process efficiency · −25% cycle time",
    enlace: "View case",
    evento: "case_audi_open",
    resultados: [
      { cifra: "+30%", concepto: "Process efficiency" },
      { cifra: "−25%", concepto: "Cycle time" },
    ],
  },
  {
    nombre: "Sangi",
    href: "/works/sangi",
    media: `${CASO}/sangi.mp4`,
    video: true,
    alt: "Sangi — buscador con IA y panel de gestion del Luxury Shoe Observatory.",
    sector: "Sangi / Retail B2B",
    titular: "Making an entire industry searchable.",
    descriptor: "Luxury Shoe Observatory · AI search · Management dashboard",
    prueba: "−90% cataloging time · +40% publishing speed",
    enlace: "View case",
    evento: "case_sangi_open",
    resultados: [
      { cifra: "−90%", concepto: "Cataloging time" },
      { cifra: "+40%", concepto: "Publishing speed" },
    ],
  },
  {
    nombre: "FuertaFit",
    href: "/works/fuertafit",
    media: `${CASO}/app-verde.jpg`,
    video: false,
    alt: "FuertaFit — aplicacion de fitness de consumo construida para escalar.",
    sector: "FuertaFit / Fitness",
    titular:
      "Technology built to scale with the audience, while rebuilding trust in outsourcing as a driver of operational efficiency.",
    prueba: "+200K users · 4.8 App Store",
    enlace: "View case",
    evento: "case_fuertafit_open",
    resultados: [
      { cifra: "+200K", concepto: "Users" },
      { cifra: "4.8", concepto: "App Store rating" },
    ],
  },
  {
    nombre: "BidFuse",
    href: "/works/bidfuse",
    media: `${CASO}/bidfuse.jpg`,
    video: false,
    alt: "BidFuse — infraestructura programatica de puja en tiempo real.",
    sector: "BidFuse / Adtech",
    titular: "Intelligence where milliseconds matter.",
    descriptor: "Programmatic infrastructure · Real-time bidding · AI",
    /* Sin `prueba` ni `resultados` a proposito: el handoff prohibe presentar
       una cifra de BidFuse como resultado propio mientras no haya fuente. */
    enlace: "View project",
    evento: "project_bidfuse_open",
  },
];

/** Cinco lineas, sin descripciones debajo. */
export const servicios = [
  "AI Strategy & Advisory",
  "Custom Software & AI Agents",
  "AI Products & MVPs",
  "Automation & Integrations",
  "AI Act & Governance",
] as const;

export const equipo = ["Brian Greenwalt — CEO", "Alejandro Rios Calera — CTO"] as const;
export const sedes = ["Madrid", "Miami", "Dubai"] as const;

/** Prueba global del hero. */
export const pruebaGlobal = "200+ companies audited · 7+ industries";
