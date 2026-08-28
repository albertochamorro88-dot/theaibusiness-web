"use client";

import { useEffect, useRef } from "react";
import type { Caso } from "./content";

type Props = { caso: Caso | null; onCerrar: () => void };

/**
 * La ficha de caso a pantalla completa.
 *
 * Se abre desde la retícula de casos. El medio manda —ocupa la mitad
 * izquierda— y el texto se lee en columna a la derecha. Cierra con la aspa,
 * con Escape o pulsando fuera del panel.
 */
export function CasoVentana({ caso, onCerrar }: Props) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!caso) return;

    const teclas = (e: KeyboardEvent) => { if (e.key === "Escape") onCerrar(); };
    document.addEventListener("keydown", teclas);

    /* Lenis se come los eventos de rueda, asi que no basta con `overflow:
       hidden` en el documento: hay que pararlo. `useSmoother` escucha estos
       dos eventos para eso. */
    window.dispatchEvent(new Event("ventana:abierta"));

    // El foco entra en el panel para que Escape y el tabulador se queden dentro.
    panel.current?.focus();

    return () => {
      document.removeEventListener("keydown", teclas);
      window.dispatchEvent(new Event("ventana:cerrada"));
    };
  }, [caso, onCerrar]);

  if (!caso) return null;

  const { nombre, media, video, sector, reto, solucion, resultados } = caso;
  const hayTexto = Boolean(reto || solucion || resultados?.length);

  return (
    <div className="caso-ventana" role="dialog" aria-modal="true" aria-label={nombre}>
      <div className="caso-ventana__fondo" onClick={onCerrar} />

      <div className="caso-ventana__panel" ref={panel} tabIndex={-1}>
        <button type="button" className="caso-ventana__cerrar" onClick={onCerrar} aria-label="Cerrar">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>

        <div className="caso-ventana__media">
          {video ? (
            <video src={media} autoPlay loop muted playsInline controls={false} />
          ) : (
            <img src={media} alt={nombre} />
          )}
        </div>

        <div className="caso-ventana__texto">
          {sector && <div className="caso-ventana__sector">{sector}</div>}
          <h2 className="caso-ventana__titulo">{nombre}</h2>

          {reto && (
            <div className="caso-ventana__bloque">
              <div className="caso-ventana__etiqueta">( El reto )</div>
              <p>{reto}</p>
            </div>
          )}

          {solucion && (
            <div className="caso-ventana__bloque">
              <div className="caso-ventana__etiqueta">( Lo que construimos )</div>
              <p>{solucion}</p>
            </div>
          )}

          {resultados?.length ? (
            <div className="caso-ventana__bloque">
              <div className="caso-ventana__etiqueta">( Resultados )</div>
              <div className="caso-ventana__cifras">
                {resultados.map((r) => (
                  <div key={r.concepto} className="caso-ventana__cifra">
                    <div className="dato">{r.cifra}</div>
                    <div className="caso-ventana__concepto">{r.concepto}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Sin copy todavia, el panel no se queda mudo. */}
          {!hayTexto && (
            <p className="caso-ventana__pendiente">Ficha en preparación.</p>
          )}
        </div>
      </div>
    </div>
  );
}
