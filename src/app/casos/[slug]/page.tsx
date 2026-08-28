import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CasoPagina } from "@/components/site/CasoPagina";
import { casoPorSlug, casos } from "@/components/site/content";

type Props = { params: Promise<{ slug: string }> };

/* Sin esto el export estatico no sabe que rutas escribir: no hay servidor que
   resuelva `[slug]` al vuelo. */
export function generateStaticParams() {
  return casos.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const caso = casoPorSlug(slug);
  if (!caso) return {};
  const titulo = `${caso.nombre} — The AI Business`;
  return {
    title: titulo,
    description: caso.titular,
    openGraph: { title: titulo, description: caso.titular, type: "article" },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const caso = casoPorSlug(slug);
  if (!caso) notFound();
  return <CasoPagina caso={caso} />;
}
