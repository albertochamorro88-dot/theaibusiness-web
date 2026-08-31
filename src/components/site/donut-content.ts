/**
 * Copia de la pagina de estudio.
 *
 * La estructura viene de una referencia externa; el texto NO. La guia de voz
 * puntua la marca en 2 sobre 10 de juguetona y prohibe humor, emoji y signos de
 * exclamacion, y la referencia es justo lo contrario —se presenta con un chiste
 * y un guino—. Lo unico que se conserva de ella es el armazon: el epigrafe
 * numerado por seccion, la cinta infinita y el acordeon.
 *
 * El manifiesto sale literal de `_context/Brand_Context.md`: ya existia como
 * posicionamiento y encaja en el hueco donde la referencia pone su broma.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const G = `${BASE}/media/img/estudio`;

export const donut = {
  marca: "The AI Business",
  heroSuperior: "Sistemas de IA que ejecutan",
  heroInferior: "Baja para ver el trabajo",
  heroNucleo: `${G}/nucleo.png`,
  heroNucleoAlt: "Pieza central del encabezado.",

  manifiestoEpigrafe: "( Quiénes somos )",
  manifiestoNumero: "TAB — 02",
  manifiestoCategoria: "Posicionamiento",
  /* De `_context/Brand_Context.md`. Es la triple negacion con la que la marca
     ya se posiciona; no hace falta inventar nada para este hueco. */
  manifiestoNiegas: [
    "No somos un proveedor de software.",
    "No somos staff augmentation.",
    "No somos consultoría genérica.",
  ],
  manifiestoAfirma:
    "Construimos sistemas de IA a medida para tu realidad empresarial. Resolvemos problemas de negocio con ejecución, no con herramientas.",

  casosEpigrafe: "( Trabajo )",
  casosNumero: "TAB — 03",
  casosCategoria: "Casos",
  casosCinta: "Casos©",
  casosApoyo:
    "Cada uno arrancó con un problema de negocio medible y terminó con un sistema en producción.",
  casosEnlace: "Ver todos los casos",

  serviciosEpigrafe: "( Qué hacemos )",
  serviciosNumero: "TAB — 04",
  serviciosCategoria: "Servicios",

  enfoqueEpigrafe: "( Cómo trabajamos )",
  enfoqueNumero: "TAB — 05",
  enfoqueCategoria: "Método",
  /* El parrafo que se enciende palabra a palabra. Tiene que ser largo: si cabe
     de un vistazo, el revelado no tiene recorrido que hacer. */
  enfoqueTexto:
    "Primero se audita el negocio: procesos, datos y estrategia. Después se ordenan las oportunidades por impacto frente a complejidad, y las que no sostienen un caso económico se descartan ahí, antes de gastar nada. Lo que queda se construye, se mide y se entrega funcionando. El orden importa más que la herramienta.",
  enfoqueImagen: `${G}/enfoque.png`,
  enfoqueAlt: "Pieza de apoyo de la sección de método.",

  modelosEpigrafe: "( Cómo contratarnos )",
  modelosNumero: "TAB — 06",
  modelosCategoria: "Modelos",
  modelosApoyo:
    "Tres formas de trabajar juntos. La diferencia está en quién asume el alcance y durante cuánto tiempo.",

  cierreEpigrafe: "( Siguiente paso )",
  cierreNumero: "TAB — 07",
  cierreCategoria: "Contacto",
  cierreTitular: "Cuéntanos dónde pierde dinero tu empresa.",
  cierreApoyo: "Diagnóstico en 72 horas. Sin compromiso.",
  cierreMarca: "THEAIBUSINESS",

  /* La tira de piezas pequenas del pie. Ocho huecos, proporciones distintas a
     proposito: alineadas y del mismo tamano se leerian como una rejilla a la
     que le faltan huecos. */
  tira: [
    { src: `${G}/tira-01.png`, w: 193, h: 193 },
    { src: `${G}/tira-02.png`, w: 201, h: 139 },
    { src: `${G}/tira-03.png`, w: 150, h: 193 },
    { src: `${G}/tira-04.png`, w: 165, h: 245 },
    { src: `${G}/tira-05.png`, w: 193, h: 193 },
    { src: `${G}/tira-06.png`, w: 164, h: 220 },
    { src: `${G}/tira-07.png`, w: 207, h: 164 },
    { src: `${G}/tira-08.png`, w: 190, h: 258 },
  ],
} as const;
