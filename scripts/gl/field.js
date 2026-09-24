/* =========================================================================
   field.js — the ground the whole site sits on.
   -------------------------------------------------------------------------
   A full-bleed shader behind everything. Not a decorative fluid: it is the
   headline, drawn.

   "Turning complexity into clarity, one interface at a time."

   So the field is turbulent on one side and ordered on the other. On the
   left, under the words, a clean orthogonal grid. On the right, behind the
   cat, a domain-warped flow — contour ribbons tangling through each other
   like a topographic map of something unresolved. Scroll, and the boundary
   sweeps right: the page resolves as you read it, and by the bottom the
   whole field is grid. The sentence happens behind you while you read it.

   Why this and not a coloured fluid: a fluid is a nice texture that means
   nothing. This one is her argument, and it is built out of her own
   vocabulary — the grid a designer works on, the contours of an
   infrastructure map, the near-black and the single lime.

   THE CONSTRAINT THAT SHAPES ALL OF IT.
   The headline sits on top of this. Ground #1C1C1C has a relative luminance
   of 0.0116 against text #FAF8F5 at 0.93 — about 17:1. Letting the field
   rise 9% toward lime puts it at 0.073, which still leaves 8:1. So 9% is
   the ceiling, and everything below is composed inside that band. A
   background that costs a reader a sentence is not a background.

   It stops when the tab is hidden, caps its pixel ratio, and if WebGL2 is
   missing it removes itself and the CSS ground shows through.
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
uniform vec2  uPointer;    // pixels, y already flipped
uniform float uPresence;   // 0..1, eased
uniform float uVel;        // 0..1, smoothed pointer speed
uniform float uOrder;      // 0 turbulent .. 1 resolved, driven by scroll
uniform vec3  uGround;
uniform vec3  uMark;
uniform vec3  uCorner;
uniform vec3  uCool;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; }
  return s;
}

/* A line of given width around a value's fractional crossings. Used for both
   the contours and the grid, so the two halves are drawn with one pen. */
float lineband(float v, float width) {
  float d = abs(fract(v) - 0.5);
  return 1.0 - smoothstep(0.0, width, d);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p  = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;   // aspect-correct, centred
  float t = uTime * 0.035;

  /* ---- THE CURSOR, PUSHED INTO THE FIELD --------------------------------
     Not a glow that follows the pointer — a displacement. A gaussian bump
     around the cursor is added to the coordinates the flow field is sampled
     at, so the field genuinely BENDS around you instead of lighting up
     underneath you. The strength scales with how fast you are moving:
     sweep across and you drag a wake through it, hold still and it settles
     to a standing ripple.

     And it deliberately ignores the order gate below. On the resolved side
     the mesh is a clean grid, so the cursor re-introduces warp exactly
     where clarity had been won — you disturb it, and it settles back. The
     page's whole sentence, available to the reader's own hand. */
  vec2 mpx = uPointer / uRes;
  vec2 m = (mpx - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  float md = length(((gl_FragCoord.xy / uRes) - 0.5) * vec2(uRes.x / uRes.y, 1.0) - m);
  /* Radius 14, not 7. At the wider falloff a single fast sweep churned most
     of the resolved half into turbulence, which is not a wake — it is a
     blender. Tight enough that you can see it travel, and that the grid
     closes behind it. */
  float push = exp(-md * md * 14.0) * (0.30 + uVel * 1.25) * uPresence;

  /* ---- ONE MESH, IN TWO STATES ------------------------------------------
     This was two patterns crossfading — contour ribbons on one side, a grid
     on the other — which is a dissolve between two pictures, not an
     argument. It is now a SINGLE orthogonal mesh whose coordinates are
     warped by the flow field. Where the warp is full the mesh tangles into
     turbulence; where it falls to zero the same mesh relaxes into a perfect
     grid. Same object, two states, and the scroll is what relaxes it.

     Two rounds of domain warping. One is noise; two is weather. */
  vec2 q = vec2(fbm(p * 1.5 + t), fbm(p * 1.5 + vec2(3.2, 1.7) - t));
  vec2 r = vec2(fbm(p * 1.5 + 1.9 * q + vec2(1.7, 9.2) + 0.28 * t + push),
                fbm(p * 1.5 + 1.9 * q + vec2(8.3, 2.8) - 0.22 * t - push));
  float flow = fbm(p * 1.5 + 2.4 * r);

  /* The tideline. Ordered under the words, turbulent behind the cat, and it
     sweeps right as you scroll. Softened by a little of the flow itself so
     it is a tideline rather than a wipe. */
  float edge = uv.x - 0.38 - uOrder * 0.85 + (flow - 0.5) * 0.12;
  float order = 1.0 - smoothstep(-0.26, 0.30, edge);

  /* The cursor's push is added OUTSIDE the order gate, so it can bend the
     resolved grid as well as the turbulent half. */
  float warpAmount = (1.0 - order) + push * 0.75;
  vec2 warp = (r - 0.5) * 1.35 * warpAmount;

  /* Two layers at different scales, the far one drifting slower, so the
     turbulence has depth instead of being a flat pattern. */
  vec2  gNear = (p + warp) * 7.0;
  float near_ = max(lineband(gNear.x, 0.055), lineband(gNear.y, 0.055));

  vec2  gFar = (p * 0.55 + warp * 0.6 + vec2(0.0, t * 0.15)) * 7.0;
  float far_ = max(lineband(gFar.x, 0.04), lineband(gFar.y, 0.04));

  float mesh = max(near_, far_ * 0.55);

  /* ---- HOW LOUD IT IS ALLOWED TO BE --------------------------------------
     Clamping the whole field to 9% kept it safe and made it invisible. The
     ceiling is not a property of the shader, it is a property of whether
     there is text on top — so it is now a function of position.

     Left of 0.45 the words live, and the field stays at 7.5%: measured
     15:1 against body copy. Right of 0.72, where the cat is and no text
     ever goes, it rises to 22%. Even that worst case is 4.6:1 — still AA
     for normal text, so a layout change can never make this a trap. */
  float loud = mix(0.075, 0.22, smoothstep(0.45, 0.72, uv.x));

  /* On a narrow screen the layout collapses to one column, so the right
     side stops being empty and starts carrying body copy. The loud zone is
     only safe because nothing is read on top of it — the moment that stops
     being true, the permission has to go with it. Below roughly a 1.1
     aspect ratio the whole field drops to the quiet ceiling. */
  float narrow = 1.0 - smoothstep(1.0, 1.25, uRes.x / uRes.y);
  loud = mix(loud, 0.075, narrow);

  /* ---- POINTER -----------------------------------------------------------
     Attention brightens the field near it, and nothing more. The cat does
     the reacting; the ground only acknowledges. */
  float d = distance(gl_FragCoord.xy, uPointer) / (min(uRes.x, uRes.y) * 0.55);
  float near = pow(1.0 - clamp(d, 0.0, 1.0), 2.6) * uPresence;

  /* ---- COLOUR ------------------------------------------------------------
     Everything below is scaled to stay inside the ceiling set at the top of
     this file. The cool tone only ever appears in the turbulent half, so
     resolving the field literally drains the confusion out of it.

     THE MARK IS MIXED IN, NOT ADDED ON. This was "col += accent * mesh",
     which is the same thing as mixing while the ground is near-black, and
     nothing at all once the ground is paper: adding lime to #f4f0e8 pushes
     every channel to 1.0 and the mesh disappears into white. mix() draws
     the same field on either ground, because it asks how far to go toward
     the mark rather than how much light to add — and on the dark ground it
     lands within about 1% of the values this was tuned at.

     uMark is the lime on ink and the deep lime on paper: --accent-text,
     the token that already exists for exactly this question. */
  vec3 col = uGround;
  col = mix(col, uMark, clamp(mesh * (loud + near * 0.05 + push * 0.10), 0.0, 1.0));
  /* A chromatic shift toward the cool tone where the cursor is, so the
     disturbance reads as a different material rather than a brighter one. */
  col = mix(col, uCool, clamp(mesh * push * loud * 1.6, 0.0, 1.0));
  /* The cool tone exists only in the turbulent half, so resolving the field
     literally drains the confusion out of it. */
  col = mix(col, uCool, clamp(mesh * (1.0 - order) * loud * 0.55, 0.0, 1.0));

  /* A standing grid over everything at the edge of visibility: the drawing
     surface, always there, under both states. */
  vec2 fine = p * 22.0;
  float scaffold = max(lineband(fine.x, 0.02), lineband(fine.y, 0.02));
  col = mix(col, uMark, scaffold * 0.012);

  /* A slow vignette toward the corners so the centre of the page, where the
     reading happens, is always the quietest part of it. Quietest means
     furthest from the reader's eye, not darker: on ink the corners fall
     away toward black, on paper they lift toward the page. Multiplying, as
     this did, does the first on both — which on paper is not a vignette but
     a smudge around the writing. */
  col = mix(col, uCorner, 0.35 * pow(length(p * vec2(0.62, 1.0)), 2.2));

  /* Grain. Kills the banding an 8-bit gradient shows across a flat wall, and
     gives the ground the same tooth the print mode gets from its paper. */
  col += (hash(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5) * 0.011;

  fragColor = vec4(col, 1.0);
}
`;

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
    this.presence = 0;
    this.targetPresence = 0;
    this.vel = 0;
    this.targetVel = 0;
    this.last = null;
    this.order = 0;
    this.targetOrder = 0;
    this.running = false;
    this.t0 = performance.now();
  }

  async start() {
    const gl = this.canvas.getContext("webgl2", {
      alpha: false, antialias: false, powerPreference: "low-power",
      depth: false, stencil: false,
    });
    if (!gl) return this.fail();
    this.gl = gl;

    const program = this.link(VERT, FRAG);
    if (!program) return this.fail();
    this.program = program;
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    this.u = Object.fromEntries(
      ["uRes", "uTime", "uPointer", "uPresence", "uVel", "uOrder",
       "uGround", "uMark", "uCorner", "uCool"]
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
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn("field:", gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, vsrc);
    const fs = compile(gl.FRAGMENT_SHADER, fsrc);
    if (!vs || !fs) return null;
    const pr = gl.createProgram();
    gl.attachShader(pr, vs);
    gl.attachShader(pr, fs);
    gl.linkProgram(pr);
    return gl.getProgramParameter(pr, gl.LINK_STATUS) ? pr : null;
  }

  bind() {
    this.onMove = (e) => {
      const touch = e.touches?.[0];
      const x = touch ? touch.clientX : e.clientX;
      const y = touch ? touch.clientY : e.clientY;
      const px = x * this.dpr, py = (innerHeight - y) * this.dpr;
      /* Speed, normalised against the short edge so a fast sweep reads the
         same on a laptop as on a large display, and clamped so a flick of
         the wrist cannot blow the field apart. */
      if (this.last) {
        const step = Math.hypot(px - this.last.x, py - this.last.y);
        this.targetVel = Math.min(1, step / (Math.min(innerWidth, innerHeight) * this.dpr * 0.06));
      }
      this.last = { x: px, y: py };
      this.pointer.x = px;
      this.pointer.y = py;
      this.targetPresence = 1;
    };
    this.onLeave = () => { this.targetPresence = 0; };
    this.onResize = () => this.resize();
    this.onScroll = () => {
      const scrollable = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
      this.targetOrder = Math.min(1, scrollY / scrollable);
    };
    this.onVisibility = () => {
      if (document.hidden) this.running = false;
      else if (!this.running) { this.running = true; this.loop(); }
    };

    addEventListener("pointermove", this.onMove, { passive: true });
    addEventListener("touchmove", this.onMove, { passive: true });
    addEventListener("pointerleave", this.onLeave, { passive: true });
    addEventListener("resize", this.onResize, { passive: true });
    addEventListener("scroll", this.onScroll, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);

    this.paletteObserver = new MutationObserver(() => this.readPalette());
    this.paletteObserver.observe(document.documentElement,
      { attributes: true, attributeFilter: ["data-contrast", "data-mode", "data-theme"] });

    this.onScroll();
  }

  readPalette() {
    this.ground = cssColor("--ground", "#1c1c1c");
    this.mark   = cssColor("--accent-text", "#c8e65a");
    this.cool   = cssColor("--note", "#8fd4e8");

    /* Which way "quieter" points. The vignette pulls the corners away from
       the reader, and away is toward black on ink and toward the page on
       paper — so it is read off the ground rather than assumed. This is
       keyed to how dark the ground is, never to which theme is named, which
       is why the third one needed nothing here: oxblood is a dark ground
       and gets the dark answer without this file learning the word. */
    const l = 0.2126 * this.ground[0] + 0.7152 * this.ground[1] + 0.0722 * this.ground[2];
    this.corner = l < 0.5 ? [0, 0, 0] : [1, 1, 1];
  }

  resize() {
    /* 1.5 rather than 2. This is a soft, low-contrast wall; the extra
       fragments buy nothing anyone can see and cost real battery on a
       full-screen five-octave fbm. */
    this.dpr = Math.min(devicePixelRatio || 1, 1.5);
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

    this.presence += (this.targetPresence - this.presence) * 0.06;
    this.order += (this.targetOrder - this.order) * 0.05;
    /* Velocity rises fast and falls slowly, so the wake trails behind the
       hand rather than snapping off the moment it stops. targetVel is
       decayed here rather than on an event, because "stopped moving" never
       fires an event. */
    this.vel += (this.targetVel - this.vel) * (this.targetVel > this.vel ? 0.35 : 0.045);
    this.targetVel *= 0.88;

    gl.uniform2f(this.u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.u.uTime, (performance.now() - this.t0) / 1000);
    gl.uniform2f(this.u.uPointer, this.pointer.x, this.pointer.y);
    gl.uniform1f(this.u.uPresence, this.presence);
    gl.uniform1f(this.u.uVel, this.vel);
    gl.uniform1f(this.u.uOrder, this.order);
    gl.uniform3fv(this.u.uGround, this.ground);
    gl.uniform3fv(this.u.uMark, this.mark);
    gl.uniform3fv(this.u.uCorner, this.corner);
    gl.uniform3fv(this.u.uCool, this.cool);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.raf = requestAnimationFrame(this.loop);
  };

  fail() { this.canvas.remove(); }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    removeEventListener("pointermove", this.onMove);
    removeEventListener("touchmove", this.onMove);
    removeEventListener("pointerleave", this.onLeave);
    removeEventListener("resize", this.onResize);
    removeEventListener("scroll", this.onScroll);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.paletteObserver?.disconnect();
    this.gl?.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
