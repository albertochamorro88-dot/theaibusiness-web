import type { NextConfig } from "next";

/**
 * Prefijo de la ruta cuando el sitio no cuelga de la raiz del dominio.
 *
 * En GitHub Pages la pagina vive en `/<repo>/`, asi que tanto los assets de
 * Next como las rutas de `content.ts` tienen que llevar ese prefijo delante.
 * En local queda vacio y no cambia nada.
 */
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // `export` escribe HTML estatico en `out/`: es todo cliente, no hay servidor
  // que desplegar. `standalone` solo hace falta para el contenedor.
  output: process.env.NEXT_EXPORT ? "export" : "standalone",
  basePath: base || undefined,
  assetPrefix: base || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
