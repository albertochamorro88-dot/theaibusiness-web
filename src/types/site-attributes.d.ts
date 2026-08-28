import "react";

/**
 * The noth.in markup drives its animations from bare HTML attributes
 * (`line`, `opacity`, `scale`, `delay`, `parallax-y`, …). They are read at
 * runtime by the reveal/parallax engines, so they have to survive into the DOM
 * exactly as authored — declaring them here keeps that valid in TSX.
 */
declare module "react" {
  interface HTMLAttributes<T> { // eslint-disable-line @typescript-eslint/no-unused-vars
    line?: string;
    letter?: string;
    opacity?: string;
    scale?: string;
    delay?: string;
    "no-scroll"?: string;
    parallax?: string;
    "parallax-x"?: string;
    "parallax-y"?: string;
    "parallax-scrub"?: string;
    "parallax-img"?: string;
    "parallax-img-y"?: string;
    "parallax-img-scrub"?: string;
  }
  interface SVGAttributes<T> { // eslint-disable-line @typescript-eslint/no-unused-vars
    line?: string;
    opacity?: string | number;
  }
}
