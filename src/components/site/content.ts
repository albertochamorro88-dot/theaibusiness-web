/** Rutas locales de los assets de marca. */
const MEDIA = "/media";
const IMG = "/media/img";
const VIDEO = "/media/video";

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

export const enlaces = {
  diagnostico: "https://theaibusiness.com/diagnostico",
  email: "mailto:info@theaibusiness.com",
  linkedin: "https://www.linkedin.com/company/the-ai-business",
  web: "https://theaibusiness.com",
} as const;

/**
 * Casos. El dato va primero — la cifra es la que sostiene la credibilidad,
 * la descripción solo la explica.
 */
const CASO = `${MEDIA}/casos`;

/**
 * Los seis trabajos reales. El titular es el nombre del proyecto; `resultado`
 * y `roi` quedan sin rellenar a proposito en los que no tengo la cifra: no se
 * inventan metricas y menos aun atribuidas a un cliente con nombre y logotipo.
 * La ficha se maqueta igual con o sin ellas.
 */
export type Caso = {
  nombre: string;
  href: string;
  media: string;
  video: boolean;
  /** Lo que se abre en la ventana. Los campos vacios no se pintan. */
  sector?: string;
  reto?: string;
  solucion?: string;
  resultados?: { cifra: string; concepto: string }[];
};

/**
 * Los cinco trabajos. `reto`, `solucion` y `resultados` los rellena el cliente:
 * no se inventan ni el planteamiento ni las cifras de un caso con nombre y
 * logotipo reales. La ventana se maqueta sola con los campos que haya.
 */
export const casos: Caso[] = [
  { nombre: "Santander", href: "/casos/santander", media: `${CASO}/santander.mp4`, video: true },
  { nombre: "Bidfuse",   href: "/casos/bidfuse",   media: `${CASO}/bidfuse.jpg`,   video: false },
  { nombre: "Sangi",     href: "/casos/sangi",     media: `${CASO}/sangi.mp4`,     video: true },
  { nombre: "Audi",      href: "/casos/audi",      media: `${CASO}/audi.mp4`,      video: true },
  { nombre: "App",       href: "/casos/app",       media: `${CASO}/app-verde.jpg`, video: false },
];

export const servicios = [
  "Estrategia y hoja de ruta",
  "Infraestructura de datos",
  "Automatización de procesos",
  "Inteligencia operacional",
  "Desarrollo de producto IA",
  "Revenue Intelligence",
] as const;

export const equipo = ["Brian Greenwalt — CEO", "Alejandro Rios Calera — CTO"] as const;
export const sedes = ["Madrid", "Miami", "Dubái"] as const;
