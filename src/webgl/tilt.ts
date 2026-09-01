"use client";

/**
 * El plano del encabezado: una imagen sobre un cuadrilatero que se inclina
 * hacia el cursor.
 *
 * La tecnica, escrita de cero: el vertice rota el plano en X e Y con dos
 * matrices alimentadas por la posicion del raton, y el fragmento muestrea la
 * textura encajandola por proporcion contra la resolucion real del lienzo —no
 * contra la del archivo—, que es lo que evita que la foto se estire cuando la
 * ventana cambia de forma.
 *
 * El rango de giro es corto a proposito (±0,22 rad, unos 12°). Mas que eso y
 * deja de leerse como una superficie que responde y empieza a parecer un
 * juguete.
 */

const VERT = `#version 300 es
precision highp float;
in vec2 aPos;
out vec2 vUV;
uniform vec2 uMouse;
void main() {
  /* Dos rotaciones sobre el plano, centradas en cero para que gire sobre si
     mismo y no describa un arco. */
  float ax = (uMouse.y - 0.5) * 0.44;
  float ay = (0.5 - uMouse.x) * 0.44;
  vec3 p = vec3(aPos, 0.0);
  p = vec3(p.x, p.y * cos(ax) - p.z * sin(ax), p.y * sin(ax) + p.z * cos(ax));
  p = vec3(p.x * cos(ay) + p.z * sin(ay), p.y, -p.x * sin(ay) + p.z * cos(ay));
  /* Perspectiva minima: sin ella la rotacion se ve plana y no hay volumen. */
  float w = 1.0 + p.z * 0.22;
  vUV = aPos * 0.5 + 0.5;
  gl_Position = vec4(p.xy / w, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vUV;
out vec4 fragColor;
uniform sampler2D uImg;
uniform vec2 uRes;      // resolucion del lienzo
uniform vec2 uImgRes;   // resolucion de la textura
uniform float uTime;
uniform float uEntrada;  // 0 -> 1 al aparecer

void main() {
  /* Encaje por proporcion (equivalente a object-fit: cover) calculado contra
     la resolucion del lienzo, no la del archivo. */
  float aImg = uImgRes.x / uImgRes.y;
  float aRes = uRes.x / uRes.y;
  vec2 escala = aRes < aImg ? vec2(aRes / aImg, 1.0) : vec2(1.0, aImg / aRes);
  vec2 uv = (vUV - 0.5) / escala + 0.5;

  /* Una ondulacion muy leve, atada al reloj: da vida sin llamar la atencion. */
  uv.y += sin(uv.x * 5.0 + uTime * 0.35) * 0.0035;

  vec3 col = texture(uImg, uv).rgb;

  /* Vineteado y entrada: la imagen aparece desde el centro hacia fuera.

     OJO con el orden de los bordes de smoothstep. En GLSL, si el primero es
     mayor que el segundo el resultado es INDEFINIDO —no es un error, no avisa,
     y la mayoria de controladores devuelven 0—, asi que el lienzo salia negro
     con el programa enlazado, la textura cargada y cero errores de GL. Se
     escribe siempre de menor a mayor y se invierte con 1.0 - x. */
  float d = length(vUV - 0.5) * 1.42;
  col *= 1.0 - smoothstep(0.25, 1.05, d);
  col *= smoothstep(0.0, 0.9, uEntrada * 1.6 - d * 0.6);

  fragColor = vec4(col, 1.0);
}`;

function compilar(gl: WebGL2RenderingContext, tipo: number, src: string) {
  const sh = gl.createShader(tipo)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(sh) || "shader");
  }
  return sh;
}

/**
 * `fuente` acepta imagen o video. Con video, cada cuadro se sube de nuevo a la
 * textura: es lo que permite que el plano siga inclinandose con el cursor
 * mientras el video corre por dentro, en vez de tener que elegir entre las dos
 * cosas.
 */
export function montarTilt(lienzo: HTMLCanvasElement, fuente: string) {
  const gl = lienzo.getContext("webgl2", { antialias: true, alpha: false });
  if (!gl) return () => {};

  const prog = gl.createProgram()!;
  gl.attachShader(prog, compilar(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compilar(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  /* Comprobar el enlazado: si falla, WebGL no lanza nada y el lienzo se queda
     negro sin una sola pista en consola. */
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(prog);
    (window as unknown as Record<string, unknown>).__tilt = { error: "enlace: " + log };
    return () => {};
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  /* El sampler apunta explicitamente a la unidad 0. Por defecto vale 0 y suele
     funcionar, pero depender del valor por defecto es como no declararlo. */
  gl.activeTexture(gl.TEXTURE0);
  const uImg = gl.getUniformLocation(prog, "uImg");

  const u = {
    mouse: gl.getUniformLocation(prog, "uMouse"),
    res: gl.getUniformLocation(prog, "uRes"),
    imgRes: gl.getUniformLocation(prog, "uImgRes"),
    time: gl.getUniformLocation(prog, "uTime"),
    entrada: gl.getUniformLocation(prog, "uEntrada"),
  };

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([10, 10, 10, 255]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.uniform1i(uImg, 0);

  let imgRes: [number, number] = [1, 1];
  let cargada = false;
  const esVideo = /\.(mp4|webm|mov)(\?|$)/i.test(fuente);
  let video: HTMLVideoElement | null = null;
  if (esVideo) {
    video = document.createElement("video");
    video.src = fuente;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "auto";
    /* `crossOrigin` NO se pone: el video es del mismo origen y declararlo
       obliga a una peticion CORS que el hosting estatico no responde, y la
       textura se queda en negro sin decir por que. */
    video.addEventListener("loadeddata", () => {
      cargada = true;
      imgRes = [video!.videoWidth, video!.videoHeight];
    });
    video.addEventListener("error", () => {
      (window as unknown as Record<string, unknown>).__tilt = { error: "video: " + fuente };
    });
    /* Algunos navegadores rechazan la reproduccion automatica aunque este
       silenciado; se reintenta al primer gesto del lector. */
    const arrancar = () => { video?.play().catch(() => {}); };
    arrancar();
    window.addEventListener("pointerdown", arrancar, { once: true });
  } else {
    const img = new Image();
    img.onerror = () => {
      (window as unknown as Record<string, unknown>).__tilt = { error: "imagen: " + img.src };
    };
    img.onload = () => {
      cargada = true;
      imgRes = [img.naturalWidth, img.naturalHeight];
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    };
    img.src = fuente;
  }

  /* El raton se persigue con suavizado: leerlo en crudo hace que el plano
     salte, porque el puntero se mueve a tirones y el render va a 60 fps. */
  const raton = { x: 0.5, y: 0.5 };
  const destino = { x: 0.5, y: 0.5 };
  const mover = (e: PointerEvent) => {
    const r = lienzo.getBoundingClientRect();
    destino.x = (e.clientX - r.left) / r.width;
    destino.y = (e.clientY - r.top) / r.height;
  };
  window.addEventListener("pointermove", mover, { passive: true });

  const medir = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const r = lienzo.getBoundingClientRect();
    lienzo.width = Math.round(r.width * dpr);
    lienzo.height = Math.round(r.height * dpr);
    gl.viewport(0, 0, lienzo.width, lienzo.height);
  };
  medir();
  window.addEventListener("resize", medir);

  let vivo = true;
  const t0 = performance.now();
  const bucle = () => {
    if (!vivo) return;
    raton.x += (destino.x - raton.x) * 0.06;
    raton.y += (destino.y - raton.y) * 0.06;
    const t = (performance.now() - t0) / 1000;
    gl.uniform2f(u.mouse, raton.x, raton.y);
    gl.uniform2f(u.res, lienzo.width, lienzo.height);
    gl.uniform2f(u.imgRes, imgRes[0], imgRes[1]);
    gl.uniform1f(u.time, t);
    gl.uniform1f(u.entrada, Math.min(1, t / 1.6));
    gl.bindTexture(gl.TEXTURE_2D, tex);
    /* Con video hay que volver a subir la textura en CADA cuadro: subirla una
       vez deja el primer fotograma congelado. `readyState >= 2` es el minimo
       que garantiza que hay un fotograma que subir. */
    if (video && video.readyState >= 2) {
      /* WebGL tiene el origen de textura ABAJO-izquierda y el video arriba-
         izquierda: sin voltear, la escena sale del reves —el reflejo del suelo
         arriba y el cubo de agua abajo—. */
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    (window as unknown as Record<string, unknown>).__tilt = {
      ok: true, cargada, imgRes, err: gl.getError(),
      lienzo: lienzo.width + "x" + lienzo.height,
    };
    requestAnimationFrame(bucle);
  };
  requestAnimationFrame(bucle);

  return () => {
    vivo = false;
    window.removeEventListener("pointermove", mover);
    window.removeEventListener("resize", medir);
    if (video) { video.pause(); video.src = ""; video.load(); }
  };
}
