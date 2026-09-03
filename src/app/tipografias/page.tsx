import type { Metadata } from "next";

import Muestrario from "@/components/site/Muestrario";

export const metadata: Metadata = {
  title: "Elige la letra — The AI Business",
  description:
    "El cierre de la portada en cada tipografía candidata, con el texto y los pesos reales.",
  /* Es una pagina de trabajo, no de publico: que no la indexe nadie. */
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Muestrario />;
}
