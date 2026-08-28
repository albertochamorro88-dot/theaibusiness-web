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
  title: "The AI Business — De la ineficiencia a la ejecución",
  description:
    "Firma de ejecución de IA. Diseñamos, construimos, desplegamos y transferimos sistemas de IA a medida. Diagnóstico en 72h, sin compromiso.",
  openGraph: {
    title: "The AI Business — De la ineficiencia a la ejecución",
    description:
      "Firma de ejecución de IA en Madrid, Miami y Dubái. Sistemas a medida, resultados medibles, transferencia de capacidades.",
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
