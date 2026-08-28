import type { Metadata } from "next";
import { Inter } from "next/font/google";

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
      <body>{children}</body>
    </html>
  );
}
