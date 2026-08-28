"use client";

import { ADVECTION, CURL, DISPLAY, DIVERGENCE, GRADIENT_SUBTRACT, PRESSURE, SPLAT, VERTEX, VORTICITY } from "./shaders";

/** Settings lifted from the original bundle, unchanged. */
export const FLUID_SETTINGS = {
  simResolution: 256,
  dyeResolution: 512,
  velocityDissipation: 0.962,
  dyeDissipation: 0.988,
  pressureIterations: 20,
  curlStrength: 0,
  splatRadius: 6e-5,
  splatForce: 5900,
  revealSize: 3.9,
  edgeSoftness: 0.5,
  edgeWidth: 0.01,
};

type Settings = typeof FLUID_SETTINGS;

type FBO = { texture: WebGLTexture; fbo: WebGLFramebuffer; width: number; height: number; texelSizeX: number; texelSizeY: number; attach(id: number): number };
type DoubleFBO = { read: FBO; write: FBO; width: number; height: number; texelSizeX: number; texelSizeY: number; swap(): void };

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? "shader compile failed");
  }
  return shader;
}

class Program {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation> = {};

  constructor(private gl: WebGLRenderingContext, vertex: string, fragment: string) {
    this.program = gl.createProgram()!;
    gl.attachShader(this.program, compile(gl, gl.VERTEX_SHADER, vertex));
    gl.attachShader(this.program, compile(gl, gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(this.program) ?? "program link failed");
    }
    const count = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < count; i++) {
      const name = gl.getActiveUniform(this.program, i)!.name;
      this.uniforms[name] = gl.getUniformLocation(this.program, name)!;
    }
  }

  bind() { this.gl.useProgram(this.program); }
}

/**
 * The hero mask-reveal effect.
 *
 * A Navier–Stokes fluid solver runs on the pointer. Its dye channel is used as
 * a mask that mixes a *base* texture (the white plate carrying the NOTHIN'
 * wordmark) with a *reveal* texture (transparent) — so wherever the pointer has
 * stirred the fluid, the plate dissolves and the video behind the canvas shows
 * through.
 */
export class FluidReveal {
  private gl: WebGLRenderingContext;
  private canvas: HTMLCanvasElement;
  private settings: Settings;
  private raf = 0;
  private disposed = false;
  private lastTime = performance.now();

  private velocity!: DoubleFBO;
  private dye!: DoubleFBO;
  private pressure!: DoubleFBO;
  private divergence!: FBO;
  private curl!: FBO;

  private programs!: Record<string, Program>;
  private quadBuffer!: WebGLBuffer;

  private baseTexture: WebGLTexture | null = null;
  private revealTexture: WebGLTexture | null = null;
  private baseAspect = 1;
  private revealAspect = 16 / 9;

  private pointer = { x: 0.5, y: 0.5, dx: 0, dy: 0, moved: false, down: false };

  constructor(private container: HTMLElement, settings: Partial<Settings> = {}) {
    this.settings = { ...FLUID_SETTINGS, ...settings };

    this.canvas = document.createElement("canvas");
    this.canvas.className = "mask-reveal-canvas";
    container.appendChild(this.canvas);

    const gl = this.canvas.getContext("webgl", {
      alpha: true, premultipliedAlpha: false, antialias: false,
      depth: false, stencil: false, preserveDrawingBuffer: false,
    });
    if (!gl) throw new Error("WebGL unavailable");
    this.gl = gl;

    gl.getExtension("OES_texture_float");
    gl.getExtension("OES_texture_half_float");
    gl.getExtension("OES_texture_half_float_linear");
    gl.getExtension("OES_texture_float_linear");

    this.initQuad();
    this.initPrograms();
    this.resize();

    window.addEventListener("resize", this.onResize);
    container.addEventListener("pointermove", this.onPointerMove);
    container.addEventListener("pointerleave", this.onPointerLeave);

    this.raf = requestAnimationFrame(this.frame);
  }

  /* ------------------------------------------------------------------ setup */

  private initQuad() {
    const gl = this.gl;
    this.quadBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  }

  private initPrograms() {
    const gl = this.gl;
    const make = (frag: string) => {
      const p = new Program(gl, VERTEX, frag);
      gl.bindAttribLocation(p.program, 0, "aPosition");
      return p;
    };
    this.programs = {
      advection: make(ADVECTION),
      splat: make(SPLAT),
      curl: make(CURL),
      vorticity: make(VORTICITY),
      divergence: make(DIVERGENCE),
      pressure: make(PRESSURE),
      gradient: make(GRADIENT_SUBTRACT),
      display: make(DISPLAY),
    };
  }

  private createFBO(w: number, h: number, internal: number, format: number, type: number, filter: number): FBO {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);

    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return {
      texture, fbo, width: w, height: h,
      texelSizeX: 1 / w, texelSizeY: 1 / h,
      attach: (id: number) => { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, texture); return id; },
    };
  }

  private createDoubleFBO(w: number, h: number, internal: number, format: number, type: number, filter: number): DoubleFBO {
    let read = this.createFBO(w, h, internal, format, type, filter);
    let write = this.createFBO(w, h, internal, format, type, filter);
    return {
      width: w, height: h, texelSizeX: 1 / w, texelSizeY: 1 / h,
      get read() { return read; }, set read(v) { read = v; },
      get write() { return write; }, set write(v) { write = v; },
      swap() { const t = read; read = write; write = t; },
    };
  }

  private initFramebuffers() {
    const gl = this.gl;
    const half = gl.getExtension("OES_texture_half_float");
    const texType = half ? half.HALF_FLOAT_OES : gl.UNSIGNED_BYTE;
    const filter = gl.getExtension("OES_texture_half_float_linear") ? gl.LINEAR : gl.NEAREST;

    const sim = this.resolution(this.settings.simResolution);
    const dye = this.resolution(this.settings.dyeResolution);

    this.dye = this.createDoubleFBO(dye.width, dye.height, gl.RGBA, gl.RGBA, texType, filter);
    this.velocity = this.createDoubleFBO(sim.width, sim.height, gl.RGBA, gl.RGBA, texType, filter);
    this.pressure = this.createDoubleFBO(sim.width, sim.height, gl.RGBA, gl.RGBA, texType, gl.NEAREST);
    this.divergence = this.createFBO(sim.width, sim.height, gl.RGBA, gl.RGBA, texType, gl.NEAREST);
    this.curl = this.createFBO(sim.width, sim.height, gl.RGBA, gl.RGBA, texType, gl.NEAREST);
  }

  private resolution(res: number) {
    const gl = this.gl;
    const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
    const ratio = aspect < 1 ? 1 / aspect : aspect;
    const min = Math.round(res);
    const max = Math.round(res * ratio);
    return aspect > 1 ? { width: max, height: min } : { width: min, height: max };
  }

  /* ---------------------------------------------------------------- layers */

  /** Rasterise the wordmark onto a solid plate and use it as the base layer. */
  async setLayers({ base, baseBg = "#ffffff", reveal = "rgba(0,0,0,0)" }: { base?: Element | null; baseBg?: string; reveal?: string } = {}) {
    if (base) {
      const texture = await this.textureFromElement(base, baseBg);
      if (texture) { this.baseTexture = texture.tex; this.baseAspect = texture.aspect; }
    } else {
      this.baseTexture = this.textureFromColor(baseBg);
      this.baseAspect = 1;
    }
    this.revealTexture = this.textureFromColor(reveal);
  }

  private textureFromColor(css: string): WebGLTexture {
    const gl = this.gl;
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    return this.textureFromCanvas(c);
  }

  private textureFromCanvas(source: HTMLCanvasElement): WebGLTexture {
    const gl = this.gl;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    // GL sample space has its origin at the bottom-left; without this the
    // wordmark comes out mirrored vertically.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    return tex;
  }

  /** Rasterise an <svg> or <img> onto a solid plate, at its real layout position. */
  private async textureFromElement(el: Element, bg: string) {
    const rect = el.getBoundingClientRect();
    const host = this.container.getBoundingClientRect();
    if (!host.width || !host.height) return null;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(host.width * dpr));
    c.height = Math.max(1, Math.round(host.height * dpr));
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, c.width, c.height);

    // Draw the mark where it actually sits inside the section.
    let url: string;
    if (el instanceof HTMLImageElement) {
      url = el.currentSrc || el.src;
    } else {
      const clone = el.cloneNode(true) as SVGElement;
      clone.setAttribute("width", String(rect.width));
      clone.setAttribute("height", String(rect.height));
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(clone));
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    const loaded = new Promise<boolean>((res) => { img.onload = () => res(true); img.onerror = () => res(false); });
    img.src = url;
    if (!(await loaded)) return null;

    ctx.drawImage(img,
      (rect.left - host.left) * dpr, (rect.top - host.top) * dpr,
      rect.width * dpr, rect.height * dpr);

    return { tex: this.textureFromCanvas(c), aspect: c.width / c.height };
  }

  /* ------------------------------------------------------------------ loop */

  private blit(target: FBO | null) {
    const gl = this.gl;
    if (target) {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  private frame = () => {
    if (this.disposed) return;
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.016666);
    this.lastTime = now;

    this.applyPointer();
    this.step(dt);
    this.render();

    this.raf = requestAnimationFrame(this.frame);
  };

  /**
   * Deja de simular cuando el hero no se ve.
   *
   * El solver hace veinte iteraciones de presion por fotograma sobre dos
   * texturas de 512: en cuanto se pasa de largo el hero eso es trabajo tirado
   * que compite con el scroll el resto de la pagina.
   */
  setActivo(activo: boolean) {
    if (this.disposed) return;
    if (activo) {
      if (!this.raf) {
        // Sin reiniciar el reloj el primer dt seria el hueco entero de parada.
        this.lastTime = performance.now();
        this.raf = requestAnimationFrame(this.frame);
      }
    } else if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  private applyPointer() {
    if (!this.pointer.moved) return;
    this.pointer.moved = false;
    const { splatForce, splatRadius } = this.settings;
    this.splat(
      this.pointer.x, this.pointer.y,
      this.pointer.dx * splatForce, this.pointer.dy * splatForce,
      splatRadius,
    );
  }

  private splat(x: number, y: number, dx: number, dy: number, radius: number) {
    const gl = this.gl;
    const p = this.programs.splat;
    const aspect = this.canvas.width / this.canvas.height;

    p.bind();
    gl.uniform1i(p.uniforms.uTarget, this.velocity.read.attach(0));
    gl.uniform1f(p.uniforms.uAspectRatio, aspect);
    gl.uniform2f(p.uniforms.uPoint, x, y);
    gl.uniform3f(p.uniforms.uColor, dx, dy, 0);
    gl.uniform1f(p.uniforms.uRadius, radius);
    this.blit(this.velocity.write);
    this.velocity.swap();

    gl.uniform1i(p.uniforms.uTarget, this.dye.read.attach(0));
    gl.uniform3f(p.uniforms.uColor, 1, 1, 1);
    this.blit(this.dye.write);
    this.dye.swap();
  }

  private step(dt: number) {
    const gl = this.gl;
    const P = this.programs;
    const S = this.settings;
    gl.disable(gl.BLEND);

    if (S.curlStrength > 0) {
      P.curl.bind();
      gl.uniform2f(P.curl.uniforms.uTexelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
      gl.uniform1i(P.curl.uniforms.uVelocity, this.velocity.read.attach(0));
      this.blit(this.curl);

      P.vorticity.bind();
      gl.uniform2f(P.vorticity.uniforms.uTexelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
      gl.uniform1i(P.vorticity.uniforms.uVelocity, this.velocity.read.attach(0));
      gl.uniform1i(P.vorticity.uniforms.uCurl, this.curl.attach(1));
      gl.uniform1f(P.vorticity.uniforms.uCurlStrength, S.curlStrength);
      gl.uniform1f(P.vorticity.uniforms.uDt, dt);
      this.blit(this.velocity.write);
      this.velocity.swap();
    }

    P.divergence.bind();
    gl.uniform2f(P.divergence.uniforms.uTexelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    gl.uniform1i(P.divergence.uniforms.uVelocity, this.velocity.read.attach(0));
    this.blit(this.divergence);

    P.pressure.bind();
    gl.uniform2f(P.pressure.uniforms.uTexelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    gl.uniform1i(P.pressure.uniforms.uDivergence, this.divergence.attach(0));
    for (let i = 0; i < S.pressureIterations; i++) {
      gl.uniform1i(P.pressure.uniforms.uPressure, this.pressure.read.attach(1));
      this.blit(this.pressure.write);
      this.pressure.swap();
    }

    P.gradient.bind();
    gl.uniform2f(P.gradient.uniforms.uTexelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    gl.uniform1i(P.gradient.uniforms.uPressure, this.pressure.read.attach(0));
    gl.uniform1i(P.gradient.uniforms.uVelocity, this.velocity.read.attach(1));
    this.blit(this.velocity.write);
    this.velocity.swap();

    P.advection.bind();
    gl.uniform2f(P.advection.uniforms.uTexelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    gl.uniform1i(P.advection.uniforms.uVelocity, this.velocity.read.attach(0));
    gl.uniform1i(P.advection.uniforms.uSource, this.velocity.read.attach(0));
    gl.uniform1f(P.advection.uniforms.uDt, dt);
    gl.uniform1f(P.advection.uniforms.uDissipation, S.velocityDissipation);
    this.blit(this.velocity.write);
    this.velocity.swap();

    gl.uniform1i(P.advection.uniforms.uVelocity, this.velocity.read.attach(0));
    gl.uniform1i(P.advection.uniforms.uSource, this.dye.read.attach(1));
    gl.uniform1f(P.advection.uniforms.uDissipation, S.dyeDissipation);
    this.blit(this.dye.write);
    this.dye.swap();
  }

  private render() {
    const gl = this.gl;
    const p = this.programs.display;
    const S = this.settings;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    p.bind();
    gl.uniform1i(p.uniforms.uDye, this.dye.read.attach(0));
    if (this.baseTexture) { gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.baseTexture); gl.uniform1i(p.uniforms.uBaseTexture, 1); }
    if (this.revealTexture) { gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, this.revealTexture); gl.uniform1i(p.uniforms.uRevealTexture, 2); }
    gl.uniform1f(p.uniforms.uRevealSize, S.revealSize);
    gl.uniform1f(p.uniforms.uEdgeSoftness, S.edgeSoftness);
    gl.uniform1f(p.uniforms.uEdgeWidth, S.edgeWidth);
    gl.uniform1f(p.uniforms.uBaseImageAspect, this.baseAspect);
    gl.uniform1f(p.uniforms.uRevealImageAspect, this.revealAspect);
    gl.uniform1f(p.uniforms.uPlaneAspect, this.canvas.width / this.canvas.height);
    this.blit(null);
  }

  /* --------------------------------------------------------------- events */

  private onPointerMove = (e: PointerEvent) => {
    const rect = this.container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1 - (e.clientY - rect.top) / rect.height;
    this.pointer.dx = x - this.pointer.x;
    this.pointer.dy = y - this.pointer.y;
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.moved = Math.abs(this.pointer.dx) > 0 || Math.abs(this.pointer.dy) > 0;
  };

  private onPointerLeave = () => { this.pointer.moved = false; };

  private onResize = () => { this.resize(); };

  private resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (this.canvas.width === w && this.canvas.height === h && this.velocity) return;
    this.canvas.width = w;
    this.canvas.height = h;
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.gl.viewport(0, 0, w, h);
    this.initFramebuffers();
  }

  destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.onResize);
    this.container.removeEventListener("pointermove", this.onPointerMove);
    this.container.removeEventListener("pointerleave", this.onPointerLeave);
    this.canvas.remove();
  }
}
