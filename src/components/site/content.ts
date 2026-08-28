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
 * Un caso.
 *
 * `titular`, `descriptor` y las cifras salen del handoff de copy del 28 de
 * agosto de 2026 —las cifras, en concreto, de su pagina de "Proof control"— y
 * solo se tocan con visto bueno de marketing.
 *
 * `contexto` y `concepto` son los dos bloques largos de la ficha propia. Van
 * vacios en los casos cuyo relato todavia no ha aprobado el cliente: la ficha
 * se maqueta sola con los bloques que haya, y es preferible una pagina corta a
 * una inventada.
 */
export type Caso = {
  slug: string;
  nombre: string;
  /** El ordinal grande de la ficha: W'01, W'02... */
  numero: string;
  media: string;
  alt: string;
  video: boolean;
  /** Cliente / sector, encima del nombre. */
  sector: string;
  /** Disciplina, en el pie de la ficha. */
  categoria: string;
  /** El titular del caso. */
  titular: string;
  /** Contexto de lo construido. No es una metrica. */
  descriptor?: string;
  /** Prueba visible sin hover, tanto en la tarjeta como en la ficha. */
  prueba?: string;
  /** Texto del enlace: los casos sin case study aprobado van como proyecto. */
  enlace: string;
  /** Bloque de apertura de la ficha propia. */
  contexto?: string;
  /** Bloque "( El planteamiento )" de la ficha propia. */
  concepto?: string;
  resultados?: { cifra: string; concepto: string }[];
  /** Nombre del evento de analitica. */
  evento: string;
};

export const casos: Caso[] = [
  {
    slug: "santander",
    nombre: "Santander",
    numero: "C'01",
    media: `${CASO}/santander.mp4`,
    video: true,
    alt: "Santander — mapa de oportunidades de IA sobre procesos de banca.",
    sector: "Santander / Banca",
    categoria: "Estrategia / Auditoría",
    titular: "Encontrar las oportunidades de IA que merece la pena construir.",
    prueba: "+5% de eficiencia operativa estimada",
    enlace: "Ver caso",
    evento: "case_santander_open",
    contexto:
      "Una auditoría de IA sobre la operación del banco: cuatro áreas revisadas y doce procesos mapeados para separar dónde la IA crea ventaja real de dónde solo añade ruido.",
    resultados: [
      { cifra: "4", concepto: "Áreas auditadas" },
      { cifra: "12", concepto: "Procesos mapeados" },
      { cifra: "2,1 M€", concepto: "Impacto estimado" },
      { cifra: "+5%", concepto: "Eficiencia operativa estimada" },
    ],
  },
  {
    slug: "audi",
    nombre: "Audi España",
    numero: "C'02",
    media: `${CASO}/audi.mp4`,
    video: true,
    alt: "Audi — software interno a medida para operaciones de fabricación premium.",
    sector: "Audi España / Automoción premium",
    categoria: "Software especializado / Partnership estratégico",
    titular: "Un fabricante premium no baja el listón. El software tampoco.",
    descriptor: "Automoción premium · Partnership estratégico · Confidencial",
    prueba: "+30% de eficiencia de proceso · −25% de tiempo de ciclo",
    enlace: "Ver caso",
    evento: "case_audi_open",
    contexto:
      "Desarrollo tecnológico con Audi España en software especializado para la industria del automóvil. El alcance técnico y funcional no se detalla aquí: lo protege un acuerdo de confidencialidad.",
    concepto:
      "Entrar en una organización de este tamaño no se gana por precio. Se gana por estándar: la exigencia, la seguridad y la calidad tienen un mínimo que no se negocia, y que además se audita. Es la referencia que mejor mide lo que la casa es capaz de sostener dentro de una corporación grande, con sus tiempos, sus controles y su margen de error.",
    resultados: [
      { cifra: "+30%", concepto: "Eficiencia de proceso" },
      { cifra: "−25%", concepto: "Tiempo de ciclo" },
    ],
  },
  {
    slug: "sangi",
    nombre: "Sangi",
    numero: "C'03",
    media: `${CASO}/sangi.mp4`,
    video: true,
    alt: "Sangi — buscador con IA y panel de gestión del Luxury Shoe Observatory.",
    sector: "Sangi / Retail B2B",
    categoria: "Producto / Búsqueda con IA",
    titular: "Hacer que un sector entero se pueda buscar.",
    descriptor: "Luxury Shoe Observatory · Búsqueda con IA · Panel de gestión",
    prueba: "−90% de tiempo de catalogación · +40% de velocidad de publicación",
    enlace: "Ver caso",
    evento: "case_sangi_open",
    contexto:
      "El Luxury Shoe Observatory: un buscador con IA y un panel de gestión que convierten un catálogo disperso en un sector consultable, con la catalogación resuelta por el sistema y no a mano.",
    resultados: [
      { cifra: "−90%", concepto: "Tiempo de catalogación" },
      { cifra: "+40%", concepto: "Velocidad de publicación" },
    ],
  },
  {
    slug: "fuertafit",
    nombre: "FuertaFit",
    numero: "C'04",
    media: `${CASO}/app-verde.jpg`,
    video: false,
    alt: "FuertaFit — aplicación de fitness de consumo construida para escalar.",
    sector: "FuertaFit / Fitness",
    categoria: "Producto / Consumo",
    titular:
      "Tecnología construida para escalar con la audiencia, devolviendo la confianza en la externalización como palanca de eficiencia operativa.",
    prueba: "+200K usuarios · 4,8 en App Store",
    enlace: "Ver caso",
    evento: "case_fuertafit_open",
    contexto:
      "Un producto de consumo que tenía que aguantar el crecimiento de su audiencia sin rehacerse por el camino, y demostrar que externalizar la construcción puede ser una palanca de eficiencia y no una renuncia.",
    resultados: [
      { cifra: "+200K", concepto: "Usuarios" },
      { cifra: "4,8", concepto: "Valoración en App Store" },
    ],
  },
  {
    slug: "bidfuse",
    nombre: "BidFuse",
    numero: "C'05",
    media: `${CASO}/bidfuse.jpg`,
    video: false,
    alt: "BidFuse — infraestructura programática de puja en tiempo real.",
    sector: "BidFuse / Adtech",
    categoria: "Infraestructura / Adtech",
    titular: "Inteligencia donde los milisegundos importan.",
    descriptor: "Infraestructura programática · Puja en tiempo real · IA",
    /* Sin `prueba` ni `resultados` a proposito: el handoff prohibe presentar
       una cifra de BidFuse como resultado propio mientras no haya fuente. */
    enlace: "Ver proyecto",
    evento: "project_bidfuse_open",
    contexto:
      "Infraestructura programática de puja en tiempo real, donde la decisión se toma en milisegundos y el margen de error es el propio presupuesto del anunciante.",
  },
];

export const casoPorSlug = (slug: string) => casos.find((c) => c.slug === slug);

/** Cinco lineas, sin descripciones debajo. */
export const servicios = [
  "Estrategia y asesoría en IA",
  "Software a medida y agentes de IA",
  "Productos de IA y MVPs",
  "Automatización e integraciones",
  "AI Act y gobernanza",
] as const;

export const equipo = ["Brian Greenwalt — CEO", "Alejandro Rios Calera — CTO"] as const;
export const sedes = ["Madrid", "Miami", "Dubái"] as const;

/** Prueba global del hero. */
export const pruebaGlobal = "+200 empresas auditadas · 7+ sectores";
