import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServicioPagina } from "@/components/site/ServicioPagina";
import { ofertaPorSlug, ofertas } from "@/components/site/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ofertas.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const oferta = ofertaPorSlug(slug);
  if (!oferta) return {};
  const titulo = `${oferta.nombre} — The AI Business`;
  return {
    title: titulo,
    description: oferta.titular,
    openGraph: { title: titulo, description: oferta.titular, type: "article" },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const oferta = ofertaPorSlug(slug);
  if (!oferta) notFound();
  return <ServicioPagina oferta={oferta} />;
}
