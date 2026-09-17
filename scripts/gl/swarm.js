/* =========================================================================
   swarm.js — the home page companion, as ~24,000 GPU particles.
   -------------------------------------------------------------------------
   The flat drawing this replaces was honest about the idea and dead on the
   screen. This is the same idea with a body: a cloud of particles that
   settles into a cat, and then, as you scroll, reaches for you as a paw and
   finally becomes the cursor you have been moving the whole time.

   CAT → PAW → CURSOR is the argument the site has been making since the
   first line of the headline: the thing you are looking at notices you,
   reaches for you, and ends up being yours.

   Everything moves, all the time, and everything you do changes it:

     always     every particle drifts on its own noise phase, so the shape
                breathes and shimmers instead of sitting there
     pointer    a repulsion field pushes particles out of your way and they
                spring back — the cloud parts as you sweep through it
     pointer    the whole swarm turns toward you in 3D, so it has depth
                rather than being a picture of depth
     click      a burst impulse blows the shape apart and it reassembles
     scroll     morphs between the three shapes, continuously

   The shapes are not modelled. They are drawn once to an offscreen 2D
   canvas, and the particles sample the opaque pixels — which means the cat
   is authored as a drawing, with its eyes punched out as real holes, and
   the GPU never needs to know what a cat is.

   Costs, and what is done about them:
     · three.js is 331 KB, vendored rather than fetched from a CDN so the
       site has no third-party runtime dependency and works offline. It is
       imported lazily: only in full mode, only on the home page. A visitor
       who lands in calm mode never downloads a byte of it.
     · Particle count and pixel ratio both scale down on smaller screens.
     · The loop stops when the tab is hidden or the canvas is scrolled away.
     · If WebGL2 is missing, the import fails, or the context is lost, the
       caller is told and the drawn cat takes over. Nothing here is
       load-bearing.
   ========================================================================= */

import { drawCat, drawPaw, drawCursor } from "../shapes.js";

/** Draw a shape, then hand back every opaque pixel as a world-space point. */
function sample(draw, count, { height = 1.85 } = {}) {
  const W = 300, H = 356;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  draw(ctx, W, H);

  const { data } = ctx.getImageData(0, 0, W, H);
  const hits = [];
  /* Step 2px: a full per-pixel sweep of 100k pixels buys nothing when we
     are picking 24k of them at random anyway. */
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (data[(y * W + x) * 4 + 3] > 128) hits.push(x, y);
    }
  }

  const out = new Float32Array(count * 3);
  const n = hits.length / 2;
  if (!n) return out;

  const scale = height / H;
  for (let i = 0; i < count; i++) {
    const k = (Math.random() * n) | 0;
    const px = hits[k * 2], py = hits[k * 2 + 1];
    out[i * 3 + 0] = (px - W / 2 + Math.random() * 2 - 1) * scale;
    out[i * 3 + 1] = (H / 2 - py + Math.random() * 2 - 1) * scale;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.30;   // depth, so rotation reads
  }
  return out;
}

/* ---- shaders ------------------------------------------------------------ */

const VERT = /* glsl */`
uniform float uTime;
uniform float uMorph;       // 0 cat … 1 paw … 2 cursor
uniform vec2  uPointer;     // world space
uniform float uPointerOn;
uniform float uBurst;
uniform float uSize;
uniform float uPixelRatio;

attribute vec3  aT0;
attribute vec3  aT1;
attribute vec3  aT2;
attribute float aSeed;

varying float vSeed;
varying float vGlow;

void main() {
  /* Three weights that always sum to one, so the cloud never loses or gains
     mass mid-morph. */
  float w0 = 1.0 - smoothstep(0.0, 1.0, uMorph);
  float w2 = smoothstep(1.0, 2.0, uMorph);
  float w1 = 1.0 - w0 - w2;
  vec3 p = aT0 * w0 + aT1 * w1 + aT2 * w2;

  /* Every particle drifts on its own phase. This is what stops a settled
     shape from looking like a photograph of a shape. */
  float t = uTime;
  p += vec3(sin(t * 0.72 + aSeed * 31.4),
            cos(t * 0.61 + aSeed * 17.3),
            sin(t * 0.53 + aSeed * 11.1)) * 0.016;

  /* Repulsion. The cloud parts around the pointer and springs back the
     moment you leave, because the displacement is computed fresh each frame
     rather than integrated — the shape is always the truth it returns to. */
  vec2 d = p.xy - uPointer;
  float dist = length(d);
  float f = smoothstep(0.30, 0.0, dist) * uPointerOn;
  p.xy += normalize(d + vec2(1e-5)) * f * 0.26;

  /* A click throws everything outward from its own centre. */
  p += normalize(p + vec3(1e-5)) * uBurst * (0.6 + aSeed * 0.8);

  vGlow = f;
  vSeed = aSeed;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.55 + aSeed * 0.9) * uPixelRatio * (1.0 + f * 2.2);
}
`;

const FRAG = /* glsl */`
precision highp float;
uniform vec3 uColor;
uniform vec3 uColorAlt;
varying float vSeed;
varying float vGlow;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;                       // square points read as glitter
  float a = smoothstep(0.5, 0.12, d);

  vec3 col = mix(uColor, uColorAlt, vSeed * 0.75);
  col = mix(col, vec3(1.0), vGlow * 0.55);    // what you touch lights up
  gl_FragColor = vec4(col, a * (0.45 + 0.55 * vSeed));
}
`;

function cssRGB(name, fallback) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  const hex = raw.replace("#", "");
  const n = hex.length === 3
    ? hex.split("").map((ch) => parseInt(ch + ch, 16))
    : [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return n.map((v) => v / 255);
}

/* =========================================================================
   The swarm
   ========================================================================= */
export class Swarm {
  constructor(host, { onShape } = {}) {
    this.host = host;
    this.onShape = onShape;
    this.shapeIndex = -1;
    this.pointer = { x: 0, y: 0 };
    this.pointerOn = 0;
    this.pointerTarget = 0;
    this.morph = 0;
    this.morphTarget = 0;
    this.burst = 0;
    this.look = { x: 0, y: 0 };
    this.running = false;
    this.t0 = performance.now();
  }

  async start() {
    const THREE = await import("../../vendor/three.module.min.js");
    this.THREE = THREE;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    this.host.replaceChildren(canvas);
    this.canvas = canvas;

    this.renderer = new THREE.WebGLRenderer({
      canvas, alpha: true, antialias: false, powerPreference: "high-performance",
    });
    /* Two is already past the point where anyone can see the difference in a
       cloud this soft, and four times the fragments. */
    this.dpr = Math.min(devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(this.dpr);

    this.scene = new THREE.Scene();
    /* Orthographic: this is a 2D composition that turns in 3D. A perspective
       camera would put the particles nearest the lens at a different size
       from their neighbours for no reason a viewer could name. */
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
    this.camera.position.z = 2;

    /* Fewer particles on small screens: a phone GPU pushing 24k points is
       spending someone's battery on a hero animation. */
    const count = innerWidth < 760 ? 9000 : innerWidth < 1200 ? 16000 : 24000;
    this.count = count;

    const g = new THREE.BufferGeometry();
    const t0 = sample(drawCat, count);
    const t1 = sample(drawPaw, count);
    const t2 = sample(drawCursor, count);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) seed[i] = Math.random();

    g.setAttribute("position", new THREE.BufferAttribute(t0.slice(), 3));
    g.setAttribute("aT0", new THREE.BufferAttribute(t0, 3));
    g.setAttribute("aT1", new THREE.BufferAttribute(t1, 3));
    g.setAttribute("aT2", new THREE.BufferAttribute(t2, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    /* The bounding sphere cannot be derived from `position` here, because
       the real positions are computed in the shader. Setting it by hand
       stops three.js frustum-culling the whole cloud mid-morph. */
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4);

    const accent = cssRGB("--accent", "#c8e65a");
    const text   = cssRGB("--text", "#faf8f5");

    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      /* Additive on a near-black ground: overlapping particles build light,
         which is what gives the dense parts of the shape their body. */
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uPointer: { value: new THREE.Vector2(99, 99) },
        uPointerOn: { value: 0 },
        uBurst: { value: 0 },
        uSize: { value: 2.1 },
        uPixelRatio: { value: this.dpr },
        uColor: { value: new THREE.Vector3(...accent) },
        uColorAlt: { value: new THREE.Vector3(...text) },
      },
    });

    this.points = new THREE.Points(g, this.material);
    this.group = new THREE.Group();
    this.group.add(this.points);
    this.scene.add(this.group);

    this.bind();
    this.resize();
    this.running = true;
    this.loop();
    return this;
  }

  bind() {
    this.onPointer = (e) => {
      const r = this.canvas.getBoundingClientRect();
      if (!r.width) return;
      /* Screen pixels to the camera's world units. The frustum is 2 units
         tall and `scale` units wide, so this is a straight remap. */
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      this.pointer.x = (nx - 0.5) * 2 * this.aspect;
      this.pointer.y = (0.5 - ny) * 2;
      this.pointerTarget = 1;

      this.look.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (innerWidth / 2)));
      this.look.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (innerHeight / 2)));
    };
    this.onLeave = () => { this.pointerTarget = 0; };
    this.onDown = () => { this.burst = 0.34; };

    this.onScrollRaw = () => {
      if (this.queued) return;
      this.queued = true;
      requestAnimationFrame(() => { this.queued = false; this.onScroll(); });
    };
    this.onResizeRaw = () => { this.resize(); this.onScroll(); };
    this.onVisibility = () => {
      if (document.hidden) this.running = false;
      else if (!this.running) { this.running = true; this.loop(); }
    };
    this.onLost = (e) => { e.preventDefault(); this.running = false; this.host.dispatchEvent(new CustomEvent("swarm:lost")); };

    addEventListener("pointermove", this.onPointer, { passive: true });
    addEventListener("pointerleave", this.onLeave, { passive: true });
    addEventListener("pointerdown", this.onDown, { passive: true });
    addEventListener("scroll", this.onScrollRaw, { passive: true });
    addEventListener("resize", this.onResizeRaw, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);
    this.canvas.addEventListener("webglcontextlost", this.onLost);
    this.onScroll();
  }

  /* The morph tracks progress through the stage the companion lives in, not
     through the document. Tying it to the document meant the shapes kept
     morphing long after the figure had scrolled out of view, and finished
     somewhere nobody was looking. */
  onScroll() {
    const stage = this.host.closest(".cat-stage");
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    const travel = Math.max(r.height - innerHeight, 1);
    const p = Math.max(0, Math.min(1, -r.top / travel));
    this.morphTarget = p * 2;
  }

  resize() {
    const r = this.host.getBoundingClientRect();
    const w = Math.max(r.width, 1), h = Math.max(r.height, 1);
    this.aspect = w / h;
    this.camera.left = -this.aspect;
    this.camera.right = this.aspect;
    this.camera.top = 1;
    this.camera.bottom = -1;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    /* Point size tracks the canvas, or the cloud turns to dust on a laptop
       and to porridge on a display. */
    this.material.uniforms.uSize.value = Math.max(1.5, Math.min(3.4, h / 190));
  }

  loop = () => {
    if (!this.running) return;
    const u = this.material.uniforms;
    const t = (performance.now() - this.t0) / 1000;

    this.morph     += (this.morphTarget - this.morph) * 0.07;
    this.pointerOn += (this.pointerTarget - this.pointerOn) * 0.09;
    this.burst     *= 0.90;

    u.uTime.value = t;
    u.uMorph.value = this.morph;
    u.uPointerOn.value = this.pointerOn;
    u.uBurst.value = this.burst;
    u.uPointer.value.set(this.pointer.x, this.pointer.y);

    /* The swarm turns toward you. With real depth on every particle this is
       an actual rotation, not a parallax trick — which is the whole reason
       the shapes were sampled with a z spread in the first place. */
    this.group.rotation.y += (this.look.x * 0.30 - this.group.rotation.y) * 0.05;
    this.group.rotation.x += (this.look.y * 0.20 - this.group.rotation.x) * 0.05;
    const breathe = 1 + Math.sin(t * 0.9) * 0.012;
    this.group.scale.setScalar(breathe);

    /* Tell the page which shape it is currently reading as, so the stage can
       label it. Thresholds sit at the crossover points, not at the targets,
       so the caption changes when the shape does. */
    const idx = this.morph < 0.5 ? 0 : this.morph < 1.5 ? 1 : 2;
    if (idx !== this.shapeIndex) { this.shapeIndex = idx; this.onShape?.(idx); }

    this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame(this.loop);
  };

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    removeEventListener("pointermove", this.onPointer);
    removeEventListener("pointerleave", this.onLeave);
    removeEventListener("pointerdown", this.onDown);
    removeEventListener("scroll", this.onScrollRaw);
    removeEventListener("resize", this.onResizeRaw);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.canvas?.removeEventListener("webglcontextlost", this.onLost);
    this.points?.geometry.dispose();
    this.material?.dispose();
    this.renderer?.dispose();          // frees the GPU context rather than leaking it
  }
}
