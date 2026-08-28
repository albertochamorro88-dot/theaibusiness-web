"use client";

/**
 * Eventos del checklist de lanzamiento.
 *
 * No hay etiqueta de analitica instalada todavia, asi que esto no envia nada
 * por si solo: empuja al `dataLayer` y llama a `gtag` SI EXISTEN. En cuanto el
 * dev meta GTM o gtag en el layout, los eventos empiezan a llegar sin tocar
 * ningun componente.
 *
 * Los CTA de reserva llevan ademas la posicion (`nav`, `hero`, `final`), que
 * es lo que pide el handoff para poder comparar de donde sale cada llamada.
 */
type Datos = Record<string, string>;

type ConDataLayer = Window & {
  dataLayer?: Datos[];
  gtag?: (tipo: "event", nombre: string, datos?: Datos) => void;
};

export function evento(nombre: string, datos: Datos = {}) {
  if (typeof window === "undefined") return;
  const w = window as ConDataLayer;
  w.dataLayer?.push({ event: nombre, ...datos });
  w.gtag?.("event", nombre, datos);
}

/** Un CTA de reserva. `posicion` distingue nav / hero / final. */
export const reserva = (nombre: string, posicion: string) => () => {
  evento(nombre, { cta_position: posicion });
  evento("scheduler_open", { cta_position: posicion });
};
