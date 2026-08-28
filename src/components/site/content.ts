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
  brujula: `${IMG}/cargando/brujula.webp`,
  esfera: `${IMG}/cargando/esfera.webp`,
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

/**
 * La oferta: que construimos y como se contrata.
 *
 * Cada linea tiene su propia ficha, con el mismo formato que las de caso. El
 * texto sale de `_context/Product_Offerings.md`, que es la fuente de la casa;
 * las dos lineas que ese documento NO recoge van marcadas con `sinFuente` y
 * estan escritas al nivel de principio, sin prometer entregables concretos ni
 * cifras. No se publican metricas aqui: las unicas aprobadas son las del
 * handoff y viven en las fichas de caso.
 */
export type Oferta = {
  slug: string;
  nombre: string;
  numero: string;
  tipo: "servicio" | "modelo";
  /** El objeto del collage que ilustra la ficha. */
  objeto: string;
  alt: string;
  epigrafe: string;
  titular: string;
  contexto: string;
  planteamiento: string;
  incluye: string[];
  entregable: string;
  /** Sin respaldo en `_context`: requiere visto bueno antes de publicar. */
  sinFuente?: boolean;
};

export const ofertas: Oferta[] = [
  {
    slug: "estrategia-ia",
    nombre: "Estrategia y asesoría en IA",
    numero: "S'01",
    tipo: "servicio",
    objeto: img.brujula,
    alt: "Brújula metalizada sobre fondo oscuro.",
    epigrafe: "Servicio / Estrategia",
    titular: "La mayoría invierte en IA a ciegas. Primero hay que saber dónde.",
    contexto:
      "Para empresas que arrancan en IA, que no tienen claras sus prioridades de inversión o que ya han visto fracasar una iniciativa anterior.",
    planteamiento:
      "El orden importa más que la herramienta. Se audita el negocio —procesos, datos y estrategia—, se identifican las áreas donde la IA puede intervenir y se ordenan por impacto frente a complejidad de implantación. Las que no sostienen un caso económico se descartan ahí, antes de gastar nada.",
    incluye: [
      "Auditoría de procesos, datos y estrategia",
      "Identificación de oportunidades de IA",
      "Priorización por impacto y viabilidad",
      "Hoja de ruta con calendario y arquitectura",
      "Caso de negocio y alineación de responsables",
    ],
    entregable: "Una hoja de ruta de iniciativas ordenada por retorno y viabilidad.",
  },
  {
    slug: "software-y-agentes",
    nombre: "Software a medida y agentes de IA",
    numero: "S'02",
    tipo: "servicio",
    objeto: img.raton,
    alt: "Ratón de ordenador de papel de aluminio arrugado.",
    epigrafe: "Servicio / Construcción",
    titular: "El software se adapta a tu operación. No al revés.",
    contexto:
      "Sistemas y agentes construidos sobre los procesos que ya existen, en lugar de obligar a la organización a encajar en una herramienta de catálogo.",
    planteamiento:
      "Un producto de catálogo impone su manera de trabajar, y cuando la operación es específica esa manera cuesta más de lo que ahorra. Aquí se construye a medida, se integra con lo que ya está en marcha y se entrega documentado. El código es vuestro y vuestro equipo puede mantenerlo sin nosotros.",
    incluye: [
      "Diseño del sistema sobre procesos reales",
      "Agentes de IA dentro del flujo de trabajo",
      "Integración con ERP, CRM y sistemas existentes",
      "Documentación y traspaso al equipo",
      "Propiedad íntegra del código",
    ],
    entregable: "Un sistema en producción, documentado y en propiedad.",
  },
  {
    slug: "productos-y-mvps",
    nombre: "Productos de IA y MVPs",
    numero: "S'03",
    tipo: "servicio",
    objeto: img.tele,
    alt: "Televisor hinchable azul.",
    epigrafe: "Servicio / Producto",
    titular: "Un producto con IA dentro, no una demo con IA encima.",
    contexto:
      "Para empresas de software, plataformas y productos digitales que necesitan incorporar capacidades de IA sin comprometer lo que ya funciona.",
    planteamiento:
      "Incorporar IA a un producto no es añadir un chat en una esquina. Hay que decidir qué capacidad aporta valor real —conversacional, analítica o predictiva—, elegir y ajustar el modelo que la sostiene, y diseñar una experiencia de uso que aguante los fallos del sistema, porque los va a tener.",
    incluye: [
      "Estrategia de producto con IA",
      "Diseño de la funcionalidad y del modelo que la sostiene",
      "Selección y ajuste de modelos",
      "Experiencia de uso pensada para IA",
      "Lanzamiento y soporte de adopción",
    ],
    entregable: "Un producto o una funcionalidad en el mercado, con su estrategia de adopción.",
  },
  {
    slug: "automatizacion-e-integraciones",
    nombre: "Automatización e integraciones",
    numero: "S'04",
    tipo: "servicio",
    objeto: img.engranaje,
    alt: "Engranaje de vidrio translúcido.",
    epigrafe: "Servicio / Operaciones",
    titular: "El proceso manual no escala. El error, sí.",
    contexto:
      "Para operaciones con mucho volumen manual, aprobaciones lentas o cuellos de botella en la entrada de datos. Y para los datos repartidos en sistemas que no se hablan.",
    planteamiento:
      "Antes de automatizar hay que rediseñar: automatizar un proceso malo solo consigue que falle más rápido. Se audita, se rediseña el flujo, se construye, se prueba contra la realidad y se entrena al equipo que se queda con él. Si los datos están dispersos, la capa de datos entra en el alcance — sin datos limpios no hay IA que funcione.",
    incluye: [
      "Auditoría de procesos y candidatos a automatizar",
      "Rediseño del flujo de trabajo",
      "Consolidación e integración de datos",
      "Construcción, pruebas e iteración",
      "Formación del equipo y traspaso",
    ],
    entregable: "Procesos automatizados en marcha y un equipo formado para operarlos.",
  },
  {
    slug: "ciberseguridad",
    nombre: "Ciberseguridad",
    numero: "S'05",
    tipo: "servicio",
    objeto: img.candado,
    alt: "Candado de papel de aluminio arrugado.",
    epigrafe: "Servicio / Seguridad",
    titular: "Un sistema que decide solo amplía la superficie de ataque.",
    contexto:
      "La seguridad no es una capa que se añade al final. Entra en el diseño, junto con los accesos, la trazabilidad y el tratamiento del dato.",
    planteamiento:
      "Cada sistema que se pone en producción abre una puerta: consume datos, toma decisiones y se conecta con lo que ya había. Tratar eso como un trámite posterior es lo que convierte un proyecto de IA en un incidente. La revisión va desde el primer diseño, no desde la auditoría final.",
    incluye: [
      "Diseño seguro desde el primer día",
      "Control de accesos y trazabilidad de decisiones",
      "Tratamiento del dato conforme a normativa",
      "Revisión de la superficie que abre cada sistema",
    ],
    entregable: "Sistemas en producción con su seguridad documentada y revisable.",
    sinFuente: true,
  },
  {
    slug: "ai-act-y-gobernanza",
    nombre: "AI Act y gobernanza",
    numero: "S'06",
    tipo: "servicio",
    objeto: img.asterisco,
    alt: "Asterisco de globo metalizado en rojo y azul.",
    epigrafe: "Servicio / Cumplimiento",
    titular: "La norma no frena el proyecto. Llegar tarde a ella, sí.",
    contexto:
      "Qué sistemas de IA hay en uso, qué obligaciones les aplican y cómo cumplirlas sin parar lo que ya está en producción.",
    planteamiento:
      "El AI Act clasifica por riesgo, y de esa clasificación cuelga todo lo demás: qué hay que documentar, qué hay que poder explicar y qué no se puede desplegar. Lo primero es saber qué se tiene, porque en la mayoría de las organizaciones ya hay más IA en marcha de la que el comité cree.",
    incluye: [
      "Inventario y clasificación de los sistemas en uso",
      "Obligaciones aplicables por nivel de riesgo",
      "Gobernanza del dato y trazabilidad",
      "Plan de adecuación con calendario",
      "Documentación exigible",
    ],
    entregable: "Un plan de adecuación con calendario y la documentación que exige la norma.",
    sinFuente: true,
  },
  {
    slug: "proyecto-cerrado",
    nombre: "Proyecto cerrado",
    numero: "M'01",
    tipo: "modelo",
    objeto: img.esfera,
    alt: "Esfera metalizada sobre fondo oscuro.",
    epigrafe: "Modelo / Alcance cerrado",
    titular: "Alcance, plazo y precio cerrados antes de empezar.",
    contexto:
      "El encargo se define en el diagnóstico y se firma con precio cerrado. No se factura por horas ni por persona.",
    planteamiento:
      "Facturar por horas premia la lentitud. Cerrar el alcance obliga a decidir antes de construir: qué entra, qué no, con qué hitos y con qué criterio se da por terminado. Al final del recorrido el sistema se transfiere, con su documentación, para que la organización pueda operarlo por su cuenta.",
    incluye: [
      "Diagnóstico y alcance definidos antes de firmar",
      "Precio cerrado, no por horas ni por persona",
      "Calendario con hitos y criterio de cierre",
      "Transferencia del sistema y de su documentación",
    ],
    entregable: "Un sistema entregado, transferido y en vuestra propiedad.",
  },
  {
    slug: "ingenieros-en-tu-equipo",
    nombre: "Ingenieros de IA en tu equipo",
    numero: "M'02",
    tipo: "modelo",
    objeto: img.perro,
    alt: "Perro de globos rojo.",
    epigrafe: "Modelo / Equipo integrado",
    titular: "A veces no necesitas un proveedor. Necesitas el equipo dentro.",
    contexto:
      "Perfiles de IA, software y ciberseguridad integrados en tu organización, con tus tiempos, tus procesos y tus prioridades.",
    planteamiento:
      "Hay trabajo que no cabe en un proyecto cerrado: el que cambia de dirección cada trimestre, el que depende de decisiones que aún no están tomadas o el que hay que sostener durante años. Ahí lo que hace falta no es un entregable, es capacidad — y perfiles que no existían hace tres años, porque el mercado todavía los está definiendo.",
    incluye: [
      "Perfiles multidisciplinares: IA, software y ciberseguridad",
      "Integración en vuestros procesos y vuestra cadencia",
      "Continuidad más allá de un entregable concreto",
      "Transferencia de criterio, no solo de código",
    ],
    entregable: "Capacidad de ingeniería dentro de tu organización.",
    sinFuente: true,
  },
  {
    slug: "consultoria-y-acompanamiento",
    nombre: "Consultoría y acompañamiento",
    numero: "M'03",
    tipo: "modelo",
    objeto: img.bombilla,
    alt: "Bombilla de papel de aluminio arrugado.",
    epigrafe: "Modelo / Acompañamiento",
    titular: "El sistema entra en producción. La decisión sigue siendo tuya.",
    contexto:
      "Acompañamiento continuo para las organizaciones que ya tienen equipo y lo que necesitan es criterio: qué construir, qué comprar y qué no hacer.",
    planteamiento:
      "Terminado el traspaso, la relación no tiene por qué terminar. Cambia de forma: de construir a decidir. Revisar arquitectura antes de comprometerla, contrastar la propuesta de un proveedor, decidir si una iniciativa merece la inversión o si conviene pararla a tiempo.",
    incluye: [
      "Revisión de arquitectura y de decisiones técnicas",
      "Contraste de propuestas de terceros",
      "Priorización de la inversión en IA",
      "Cadencia acordada, sin proyecto abierto",
    ],
    entregable: "Criterio disponible cuando hay que decidir.",
  },
];

export const ofertaPorSlug = (slug: string) => ofertas.find((o) => o.slug === slug);

/**
 * Que construimos.
 *
 * OJO: el handoff fija un maximo de cinco lineas y aqui hay seis. La sexta es
 * ciberseguridad, que faltaba y es una capacidad real de la casa. Si marketing
 * quiere respetar el limite, hay que fusionar dos, no quitar esta.
 */
export const servicios = ofertas.filter((o) => o.tipo === "servicio");

/**
 * Como se contrata.
 *
 * La lista de arriba responde a "que construimos"; esta responde a "como
 * trabajamos", que es un eje distinto. Sin ella la web se lee como si solo
 * hubiera proyectos cerrados.
 */
export const modelos = ofertas.filter((o) => o.tipo === "modelo");

export const equipo = ["Brian Greenwalt — CEO", "Alejandro Rios Calera — CTO"] as const;
export const sedes = ["Madrid", "Miami", "Dubái"] as const;

/** Prueba global del hero. */
export const pruebaGlobal = "+200 empresas auditadas · 7+ sectores";
