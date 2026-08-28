# The AI Business — portada

Portada de una sola página en Next.js 16 (App Router, React 19, TypeScript
estricto) con animación conducida por GSAP + ScrollTrigger, scroll suave con
Lenis y un simulador de fluido en WebGL para el hero.

## Arrancar

```bash
npm install
npm run dev      # http://localhost:3000
npm run check    # lint + typecheck + build de producción
```

## Cómo está organizado

```
src/app/                  entrada de Next
src/components/site/
  Home.tsx                monta las secciones y engancha los hooks de animación
  Sections.tsx            el marcado de las siete secciones
  Chrome.tsx              nav, menú y pantalla de carga
  CasoVentana.tsx         la ficha de caso a pantalla completa
  content.ts              TODO el contenido y las rutas de los assets
  site.css                hoja de estilos base + capa de marca al final
src/motion/               un hook por comportamiento (ver abajo)
public/media/             vídeo e imagen
```

**El contenido vive entero en `src/components/site/content.ts`.** Textos,
enlaces, casos y rutas de assets. Para cambiar la web no hace falta tocar
componentes.

## Los hooks de animación

| hook | qué hace |
|---|---|
| `useLoader` | pantalla de carga de 10,35 s: la marca se abre, desfilan los objetos, se cierra y sube la persiana |
| `useSmoother` | scroll suave con Lenis |
| `useReveals` | entradas por líneas/letras/opacidad, dirigidas por atributos en el HTML |
| `useParallax` | parallax genérico por atributos |
| `useHero` | simulador de fluido WebGL que disuelve la marca y descubre el vídeo |
| `useShowreel` | el vídeo del manifiesto se retira a una esquina al hacer scroll |
| `useWorks` | retícula de casos, palabra "CASOS" con GSAP Flip, cursor de hover |
| `useMusee` | sala de juntas: la pantalla se aleja y el reflejo del suelo va sincronizado |
| `useGlitch` | texto que se descompone según la velocidad del puntero |
| `useFormas` | el collage de objetos huye del ratón |
| `useVideos` | solo reproduce los vídeos que están en pantalla |
| `useEagerImages` | pasa las imágenes a `eager` y refresca ScrollTrigger |

## Cosas que conviene saber antes de tocar

- **`refreshPriority` en los `pin`.** Hay dos secciones ancladas: el manifiesto
  (`useShowreel`, prioridad 2) y la sala de juntas (`useMusee`, prioridad 1).
  GSAP refresca de mayor a menor, y el orden importa: el pin de arriba mete un
  espaciador que desplaza todo lo que va debajo. Si añades otro `pin`, dale
  prioridad según su posición en la página.
- **Versión de los assets de marca.** `content.ts` añade `?v=N` a los archivos
  del logotipo. Si sustituyes uno sin cambiarle el nombre, sube el número o los
  navegadores seguirán sirviendo el viejo.
- **La pantalla de carga se marca como vista en `sessionStorage`** al terminar,
  nunca al montar: React monta los efectos dos veces en desarrollo y marcarlo
  antes hace que se salte sola.
- **El logotipo sale de `_source/LOGO.pdf`**, que es vectorial. Los PNG de
  `public/media/img` están generados a partir de él; no los reescales hacia
  arriba, regenéralos desde el vector.

## Pendiente

- El círculo de abajo a la izquierda todavía lleva la marca de la plantilla de
  origen.
- Faltan los textos y las cifras de los casos: `content.ts` tiene los campos
  `sector`, `reto`, `solucion` y `resultados` vacíos, y la ficha se maqueta con
  los que haya. Dos casos siguen sin nombre real.
- Assets sin usar que se pueden borrar: `media/video/hero-gradiente.mp4`,
  `media/img/hero-elevator-execution-v1.png`, `marca-01.png`, `marca-04.png`.

## Origen

La estructura y la hoja de estilos derivan de un clon de **noth.in** hecho como
estudio de la técnica de animación; el GLSL del hero está tomado literalmente de
su bundle (`src/motion/shaders.ts`). Es material de terceros y este repositorio
es público: conviene sustituirlo antes de que el sitio salga a producción.

Los vídeos de `public/media/casos/` son trabajo de clientes reales.
