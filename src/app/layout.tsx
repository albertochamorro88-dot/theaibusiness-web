import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Tipografias, { PRE_FUENTES } from "@/components/site/Tipografias";

/**
 * Shell deliberadamente desnudo: sin preflight de Tailwind ni tokens de
 * plantilla, para que nada altere la hoja de estilos de la marca.
 * Inter es la unica tipografia de The AI Business.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "The AI Business — IA que se gana su sitio en el negocio",
  description:
    "La mayoría de las empresas está probando IA. Nosotros la ponemos en producción. +200 empresas auditadas en 7+ sectores.",
  openGraph: {
    title: "The AI Business — IA que se gana su sitio en el negocio",
    description:
      "Firma de ejecución de IA en Madrid, Miami y Dubái. Sistemas en producción, resultados medidos, clientes con nombre.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        {/* El probador de tipografias vuelve a poner la fuente elegida ANTES de
            pintar. Los titulares se parten en lineas al montar la pagina, asi
            que una fuente aplicada despues deja las lineas medidas con la
            anterior. Sin eleccion guardada esto no hace nada. */}
        <script dangerouslySetInnerHTML={{ __html: PRE_FUENTES }} />
      </head>
      <body>
        {children}
        {/* Solo se dibuja si la URL lleva ?fuentes */}
        <Tipografias />
      </body>
    </html>
  );
}
