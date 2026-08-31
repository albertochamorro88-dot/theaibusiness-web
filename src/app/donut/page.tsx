import type { Metadata } from "next";

import Donut from "@/components/site/Donut";

export const metadata: Metadata = {
  title: "The AI Business — propuesta de portada",
  description:
    "Dirección de diseño alternativa para la portada: casos, servicios y modelos de contratación.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Donut />;
}
