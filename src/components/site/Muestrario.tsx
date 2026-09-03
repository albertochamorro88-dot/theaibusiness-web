"use client";

import { useEffect, useState } from "react";

import { FUENTES, cargar } from "./Tipografias";
import { enlaces } from "./content";

import "./webflow-base.css";
import "./site.css";

/**
 * El muestrario de tipografias.
 *
 * Una pagina para decidir, no para navegar: el mismo bloque de cierre —el
 * titular y su bajada, que es donde una tipografia se retrata— repetido en
 * cada familia, uno debajo de otro.
 *
 * Se compara asi y no con el panel de la web porque comparar de memoria no
 * funciona: entre cambiar el desplegable y volver a mirar ya se ha olvidado
 * como era la anterior. Puestas una encima de otra, la diferencia se ve sin
 * tener que recordar nada.
 *
 * El texto es el real y los pesos son los reales —700 el titular, 300 la
 * bajada—. Un muestrario con «Lorem ipsum» y todo en Regular no decide nada:
 * lo que hay que juzgar es esta frase, en estos pesos.
 */

/* Los pesos del cierre. Van aqui repetidos y no heredados de `.h1-home`
   porque el muestrario los baja de tamano para que quepan dos por fila: la
   PROPORCION entre titular y bajada es lo que hay que conservar, no los 72 px. */
const TITULAR = 700;
const BAJADA = 300;

export default function Muestrario() {
  const [solas, setSolas] = useState(false);   // una por fila, a mayor tamano

  /* Se cargan todas de golpe: son 17 hojas y esta pagina existe justo para
     tenerlas delante a la vez. Cargarlas segun se ven dejaria las de abajo
     dibujandose mientras se comparan. */
  useEffect(() => { FUENTES.forEach((f) => cargar(f.css)); }, []);

  return (
    <main className="mues">
      <header className="mues-cab">
        <p className="mues-eti">( The AI Business · tipografía )</p>
        <h1 className="mues-tit">Elige la letra.</h1>
        <p className="mues-intro">
          El cierre de la portada, el mismo texto y los mismos pesos, en cada
          familia candidata. Todas son de palo seco y de la hornada actual.
          Cuando una te convenza, ábrela en la web entera y navégala: una
          tipografía no se decide en un titular, se decide leyendo.
        </p>
        <label className="mues-conmuta">
          <input type="checkbox" checked={solas} onChange={(e) => setSolas(e.target.checked)} />
          <span>Verlas de una en una, más grandes</span>
        </label>
      </header>

      <div className="mues-rejilla" data-solas={solas ? "" : undefined}>
        {FUENTES.map((f, i) => (
          <article key={f.nombre} className="mues-ficha">
            <div className="mues-ficha-cab">
              <span className="mues-n">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="mues-nombre">{f.nombre}</h2>
              {i === 0 && <span className="mues-actual">la de ahora</span>}
            </div>

            {/* La muestra. `fontFamily` sin valor —Inter— hereda, que es
                exactamente lo que hace la web cuando nadie la ha cambiado. */}
            <div className="mues-lienzo" style={f.pila ? { fontFamily: f.pila } : undefined}>
              <p className="mues-h" style={{ fontWeight: TITULAR }}>
                Empecemos por<br />el problema.
              </p>
              <p className="mues-p" style={{ fontWeight: BAJADA }}>
                En una llamada identificamos la oportunidad, la viabilidad y el
                siguiente paso.
              </p>
              <div className="mues-botones">
                <span className="mues-btn">Reservar llamada estratégica →</span>
                <span className="mues-btn">info@theaibusiness.com</span>
              </div>
              <p className="mues-micro">30 min · sin compromiso · 100% confidencial</p>
            </div>

            <div className="mues-pie">
              <p className="mues-nota">{f.nota}</p>
              <a
                className="mues-abrir"
                href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/?fuente=${encodeURIComponent(f.nombre)}`}
              >
                Ver la web entera así →
              </a>
            </div>
          </article>
        ))}
      </div>

      <footer className="mues-final">
        <p>
          ¿Ya está elegida? Dinos el nombre y la dejamos fija: se autoaloja la
          familia —como está Inter ahora— y deja de pedirse a un servidor de
          fuera en cada visita.
        </p>
        <a href={enlaces.email} className="mues-abrir">info@theaibusiness.com</a>
      </footer>
    </main>
  );
}
