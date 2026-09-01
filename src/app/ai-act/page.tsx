import type { Metadata } from "next";

import AiAct from "@/components/site/AiAct";

export const metadata: Metadata = {
  title: "AI Act — The AI Business",
  description:
    "El Reglamento UE 2024/1689 obliga a toda empresa que use IA, propia o comprada. Los cuatro niveles de riesgo, el calendario y qué hacer.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AiAct />;
}
