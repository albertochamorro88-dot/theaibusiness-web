"use client";

import { Loader, MenuWrapper, Nav } from "./Chrome";
import { Brecha, Casos, Firma, Footer, Hero, SalaJuntas, Showreel } from "./Sections";

import { useEagerImages } from "@/motion/useEagerImages";
import { useFormas } from "@/motion/useFormas";
import { useGlitch } from "@/motion/useGlitch";
import { useHero } from "@/motion/useHero";
import { useHoverFx } from "@/motion/useHoverFx";
import { useLoader } from "@/motion/useLoader";
import { useMenu } from "@/motion/useMenu";
import { useMusee } from "@/motion/useMusee";
import { useNavLogo } from "@/motion/useNavLogo";
import { useParallax } from "@/motion/useParallax";
import { useReveals } from "@/motion/useReveals";
import { useShowreel } from "@/motion/useShowreel";
import { useSmoother } from "@/motion/useSmoother";
import { useVideos } from "@/motion/useVideos";
import { useWorks } from "@/motion/useWorks";

import "lenis/dist/lenis.css";
import "./webflow-base.css";
import "./site.css";

/**
 * Portada de The AI Business.
 *
 * El loader corre primero y el resto monta detras; al colapsar la placa se
 * liberan el scroll suave y los reveals marcados como `no-scroll`.
 */
export default function Home() {
  const cargado = useLoader();

  useEagerImages(true);
  useReveals(true);
  useParallax(true);
  useWorks(true);
  useMusee(true);
  useGlitch(true);
  useFormas(true);
  useVideos(true);
  useShowreel(true);
  useHoverFx(true);
  useMenu(true);
  useNavLogo(true);
  /* El simulador de fluido del hero espera a que termine la carga: durante
     esos diez segundos esta tapado por una placa opaca, y montarlo antes solo
     le quita fotogramas a la animacion de entrada. */
  useHero(cargado);
  useSmoother(true);


  return (
    <>
      <Nav />
      <MenuWrapper />
      <Loader />
      <div className="page-wrapper">
        <div className="main-wrapper">
          <div className="page_view">
            <Hero />
            <Showreel />
            <Casos />
            <SalaJuntas />
            <Firma />
            <Brecha />
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
