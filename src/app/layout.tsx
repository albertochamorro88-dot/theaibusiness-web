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
  title: "The AI Business — AI that earns its place in the business",
  description:
    "Most companies are testing AI. We put it into production. 200+ companies audited across 7+ industries. Book a call.",
  openGraph: {
    title: "The AI Business — AI that earns its place in the business",
    description:
      "AI execution firm in Madrid, Miami and Dubai. Systems in production, measured outcomes, named clients.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
