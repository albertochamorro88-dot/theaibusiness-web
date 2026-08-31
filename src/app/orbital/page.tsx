import type { Metadata } from "next";

import Orbital from "@/components/site/Orbital";

export const metadata: Metadata = {
  title: "The AI Business — propuesta orbital",
  description: "Dirección de diseño con galería orbital y encabezado en WebGL.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Orbital />;
}
