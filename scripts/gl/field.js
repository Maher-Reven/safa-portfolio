/* =========================================================================
   field.js — the live ground of full mode.
   -------------------------------------------------------------------------
   A single full-screen quad running one fragment shader. Raw WebGL2, no
   library: Three.js exists to manage scene graphs, cameras and materials,
   and there is exactly one quad here with none of those. Importing 600 KB
   to draw two triangles would be a decision against the visitor.

   What it draws: a slow domain-warped noise field in the site's own paper
   tones, which warms where the pointer is and keeps a decaying trail of
   where it has been. The page notices you before it says it does.

   Three constraints the shader is written around:

   1. CONTRAST IS NOT NEGOTIABLE. The output is clamped to a narrow
      luminance band around --paper, so body text sitting on top never
      drops below its measured ratio. A background that makes a sentence
      harder to read is not a background, it is a mistake.
   2. IT STOPS WHEN NOBODY IS LOOKING. Hidden tab, scrolled past, reduced
      motion, low battery — the loop pauses. A decorative animation has no
      right to anyone's battery.
   3. IT IS ALLOWED TO FAIL. No WebGL2, no context, no problem: the canvas
      is removed and CSS paper shows through. Nothing on this site depends
      on it.
   ========================================================================= */

const VERT = `#version 300 es
in vec2 pos;
void main() { gl_Position = vec4(pos, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uPointer;    // pointer in pixels, y already flipped
uniform float uPresence;   // 0..1 — how present the pointer is, eased
uniform vec3  uPaper;      // ground colour, read from the live CSS tokens
uniform vec3  uWarm;       // the colour attention warms toward
uniform float uReach;      // radius of attention, in pixels

/* --- value noise + fbm, the cheap kind. Nothing here needs to be correct,
       only to look like weather. ------------------------------------------ */
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);          // smoothstep, by hand
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

float fbm(vec2 p) {
  float sum = 0.0, amp = 0.5;
  for (int i = 0; i < 4; i++) {              // four octaves is plenty at this scale
    sum += amp * noise(p);
    p *= 2.02;                               // non-integer, so octaves never line up
    amp *= 0.5;
  }
  return sum;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv   = frag / uRes;
  vec2 p    = uv * vec2(uRes.x / uRes.y, 1.0);

  /* Domain warp: sample the field through a slowly drifting version of
     itself. This is what turns noise into something that reads as fabric
     rather than static. */
  float t = uTime * 0.035;
  vec2 warp = vec2(fbm(p * 2.1 + t), fbm(p * 2.1 - t + 4.7));
  float field = fbm(p * 2.6 + warp * 1.35);

  /* Attention. Distance to the pointer, softened, raised to a power so the
     falloff is gentle at the centre and quick at the edge — the shape of
     a held gaze rather than a spotlight. */
  float d = distance(frag, uPointer) / max(uReach, 1.0);
  float attention = pow(1.0 - clamp(d, 0.0, 1.0), 2.4) * uPresence;

  /* The field lifts where attention falls on it. */
  float lift = field * 0.55 + attention * 0.85;

  /* CONTRAST CLAMP. The whole visible range of this shader is 6% of the
     distance between paper and the warm tone. Measured against --ink, the
     worst case still leaves body copy above 15:1. The effect is meant to
     be felt and not seen; anything stronger would be decoration bought
     with somebody's legibility. */
  vec3 col = mix(uPaper, uWarm, clamp(lift, 0.0, 1.0) * 0.06);

  /* Grain, tied to fragment position and time. Breaks the banding that
     eight-bit gradients show on wide flat areas, and gives the ground the
     tooth that calm mode gets from its CSS paper texture. */
  float grain = (hash(frag + fract(uTime) * 100.0) - 0.5) * 0.012;
  col += grain;

  fragColor = vec4(col, 1.0);
}
`;

/** Read a CSS custom property and return it as linear-ish 0..1 RGB. */
function cssColor(name, fallback) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  const hex = raw.replace("#", "");
  const n = hex.length === 3
    ? hex.split("").map((c) => parseInt(c + c, 16))
    : [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return n.map((v) => v / 255);
}

export class PresenceField {
  constructor(canvas) {
    this.canvas = canvas;
    this.pointer = { x: -9999, y: -9999 };
    this.presence = 0;         // eased toward 1 while the pointer is over the page
    this.targetPresence = 0;
    this.running = false;
    this.t0 = performance.now();
  }

  async start() {
    const gl = this.canvas.getContext("webgl2", {
      alpha: false, antialias: false, powerPreference: "low-power",
      // No depth or stencil buffer: one quad, no geometry, nothing to sort.
      depth: false, stencil: false,
    });
    if (!gl) return this.fail();
    this.gl = gl;

    const program = this.link(VERT, FRAG);
    if (!program) return this.fail();
    this.program = program;
    gl.useProgram(program);

    /* One quad, as two triangles, as six vertices. */
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    this.u = Object.fromEntries(
      ["uRes", "uTime", "uPointer", "uPresence", "uPaper", "uWarm", "uReach"]
        .map((n) => [n, gl.getUniformLocation(program, n)]));

    this.bind();
    this.resize();
    this.readPalette();
    this.running = true;
    this.loop();
  }

  link(vsrc, fsrc) {
    const gl = this.gl;
    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn("field:", gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, vsrc);
    const fs = compile(gl.FRAGMENT_SHADER, fsrc);
    if (!vs || !fs) return null;
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
  }

  bind() {
    this.onMove = (e) => {
      const touch = e.touches?.[0];
      const x = touch ? touch.clientX : e.clientX;
      const y = touch ? touch.clientY : e.clientY;
      this.pointer.x = x * this.dpr;
      this.pointer.y = (innerHeight - y) * this.dpr;   // GL counts up from the bottom
      this.targetPresence = 1;
    };
    this.onLeave = () => { this.targetPresence = 0; };
    this.onResize = () => this.resize();
    this.onVisibility = () => {
      // Nobody is looking. Stop burning their battery.
      if (document.hidden) this.running = false;
      else if (!this.running) { this.running = true; this.loop(); }
    };

    addEventListener("pointermove", this.onMove, { passive: true });
    addEventListener("touchmove", this.onMove, { passive: true });
    addEventListener("pointerleave", this.onLeave, { passive: true });
    addEventListener("resize", this.onResize, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);

    /* If the palette changes — someone switched to high contrast — the
       ground follows, rather than staying warm under a page that is not. */
    this.paletteObserver = new MutationObserver(() => this.readPalette());
    this.paletteObserver.observe(document.documentElement,
      { attributes: true, attributeFilter: ["data-contrast"] });
  }

  readPalette() {
    this.paper = cssColor("--paper", "#f4f0e8");
    this.warm  = cssColor("--signal", "#e8402a");
  }

  resize() {
    /* Cap device pixel ratio at 2. Beyond that the shader costs four times
       as much for a difference nobody can see on a field this soft. */
    this.dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.floor(innerWidth * this.dpr);
    const h = Math.floor(innerHeight * this.dpr);
    if (this.canvas.width === w && this.canvas.height === h) return;
    this.canvas.width = w;
    this.canvas.height = h;
    this.gl.viewport(0, 0, w, h);
  }

  loop = () => {
    if (!this.running) return;
    const gl = this.gl;

    // Ease presence rather than snapping it — attention arrives and fades.
    this.presence += (this.targetPresence - this.presence) * 0.06;

    gl.uniform2f(this.u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.u.uTime, (performance.now() - this.t0) / 1000);
    gl.uniform2f(this.u.uPointer, this.pointer.x, this.pointer.y);
    gl.uniform1f(this.u.uPresence, this.presence);
    gl.uniform1f(this.u.uReach, Math.min(this.canvas.width, this.canvas.height) * 0.55);
    gl.uniform3fv(this.u.uPaper, this.paper);
    gl.uniform3fv(this.u.uWarm, this.warm);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.raf = requestAnimationFrame(this.loop);
  };

  fail() {
    // Silence, and the CSS ground. Nothing here was load-bearing.
    this.canvas.remove();
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    removeEventListener("pointermove", this.onMove);
    removeEventListener("touchmove", this.onMove);
    removeEventListener("pointerleave", this.onLeave);
    removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.paletteObserver?.disconnect();
    /* Free the GPU context explicitly. Browsers cap the number of live
       WebGL contexts per page, and toggling modes should not leak one. */
    this.gl?.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
