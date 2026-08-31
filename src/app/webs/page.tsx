import type { Metadata } from "next";

import Webs997 from "@/components/site/Webs997";

export const metadata: Metadata = {
  title: "Webs que convierten. Precio cerrado: 997 € — The AI Business",
  description:
    "Diseño, copy y desarrollo en una sola pieza. Sin sorpresas, sin cuotas ocultas. La estética es el mínimo; el trabajo real es que cada visita se convierta en cliente.",
  openGraph: {
    title: "Webs que convierten. Precio cerrado: 997 €",
    description: "Diseño, copy y desarrollo en una sola pieza. Sin cuotas ocultas.",
    type: "website",
  },
};

export default function Page() {
  return <Webs997 />;
}
