/* =========================================================================
   halftone.js — the companion in print mode.
   -------------------------------------------------------------------------
   Print mode used to get a flat line drawing of the cat, which was correct
   and lifeless. This is the same silhouette put through the process a
   printed image actually goes through: a halftone screen.

   It is drawn as a two-colour risograph proof.

     · Two ink passes, screened at 15° and 75°. Those angles are not
       decorative — they are the classic separation angles, chosen because
       screens 60° apart stop interfering with each other. Put two screens
       at the same angle and you get moiré.
     · The passes are offset by two pixels. Real riso misregisters, and a
       riso print that registers perfectly looks like a laser copy of one.
     · Dot radius follows tone, so the form has light in it. A hard
       silhouette screened at constant radius is a stencil, not a print.
     · Crop marks and an ink bar in the margin, because this is a proof and
       a proof says what it is made of.

   The same drawCat() the particle swarm samples. One cat, rendered in each
   medium's native texture: light on the screen, ink on the paper. That is
   the whole claim the two modes make, made literal.

   No animation, no listeners beyond resize. It is a printed thing.
   ========================================================================= */

import { DESIGN, fit, drawCat } from "./shapes.js";

/** Read a CSS custom property as [r,g,b] 0-255. */
function ink(name, fallback) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  const hex = raw.replace("#", "");
  return hex.length === 3
    ? hex.split("").map((c) => parseInt(c + c, 16))
    : [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

/* Draw the silhouette filled with a gradient, so the screen has tone to
   follow. Flat fill in, flat dots out. */
function tonePlate(W, H) {
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d", { willReadFrequently: true });

  drawCat(ctx, W, H);

  /* Light from the upper left, the way every engraver has lit a form since
     engraving existed. source-atop keeps it inside the silhouette. */
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-atop";
  const g = ctx.createLinearGradient(W * 0.2, 0, W * 0.85, H);
  /* The lightest stop is 205, not 236. At 236 the highlight tone fell to
     roughly 0.08 and the dots there dropped under the minimum radius, so
     the ears dissolved off the top of the print. A halftone highlight
     should be sparse, not absent — the form has to survive its own
     lightest area. */
  g.addColorStop(0.0, "rgb(205,205,205)");   // highlight: sparse, but present
  g.addColorStop(0.55, "rgb(115,115,115)");
  g.addColorStop(1.0, "rgb(24,24,24)");      // shadow: dots nearly touching
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = "source-over";

  return ctx.getImageData(0, 0, W, H);
}

/**
 * One screened pass.
 * @param angle  screen angle in degrees
 * @param pitch  distance between dot centres, in px
 */
function screenPass(ctx, plate, W, H, { angle, pitch, colour, alpha, offset }) {
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad), sin = Math.sin(rad);
  const { data } = plate;

  ctx.save();
  ctx.translate(offset[0], offset[1]);
  ctx.fillStyle = `rgb(${colour[0]},${colour[1]},${colour[2]})`;
  ctx.globalAlpha = alpha;
  /* multiply, so where the two passes overlap the ink builds the way ink
     does, instead of the second pass painting over the first. */
  ctx.globalCompositeOperation = "multiply";

  /* Walk a lattice rotated by `angle`, wide enough that the rotated grid
     still covers every corner of the canvas. */
  const reach = Math.ceil((W + H) / pitch);
  for (let j = -reach; j <= reach; j++) {
    for (let i = -reach; i <= reach; i++) {
      const x = (i * cos - j * sin) * pitch + W / 2;
      const y = (i * sin + j * cos) * pitch + H / 2;
      if (x < -pitch || y < -pitch || x > W + pitch || y > H + pitch) continue;

      const px = (Math.round(y) * W + Math.round(x)) * 4;
      const a = data[px + 3];
      if (!a) continue;                       // outside the silhouette: no ink

      /* Tone drives the dot. Dark plate, fat dot. */
      const lum = data[px] / 255;
      const tone = (1 - lum) * (a / 255);
      const r = tone * pitch * 0.78;
      if (r < 0.28) continue;                 // below this a dot is just dirt

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/* Crop marks and the ink bar. A proof states what it is made of. */
function proofMarks(ctx, W, H, inks) {
  const m = Math.max(10, Math.min(W, H) * 0.035);
  const len = m * 0.72;
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = `rgba(${inks.text.join(",")},0.5)`;
  ctx.lineWidth = 1;
  const corner = (cx, cy, sx, sy) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy + sy * len); ctx.lineTo(cx, cy);
    ctx.lineTo(cx + sx * len, cy);
    ctx.stroke();
  };
  corner(m, m, 1, 1);
  corner(W - m, m, -1, 1);
  corner(m, H - m, 1, -1);
  corner(W - m, H - m, -1, -1);

  // the two inks, as a printer's colour bar
  const sw = Math.max(9, m * 0.5);
  [inks.text, inks.accent].forEach((c, i) => {
    ctx.fillStyle = `rgb(${c.join(",")})`;
    ctx.fillRect(m, H - m - sw - 2, sw, sw);
    ctx.translate(sw + 5, 0);
  });
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = `rgba(${inks.text.join(",")},0.55)`;
  ctx.font = `${Math.max(8, m * 0.38)}px "DM Mono", ui-monospace, monospace`;
  ctx.fillText("2 INKS · 15° / 75°", m + sw * 2 + 14, H - m - 4);
  ctx.restore();
}

export class Halftone {
  constructor(host) {
    this.host = host;
  }

  start() {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    this.host.replaceChildren(canvas);
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.onResize = () => {
      clearTimeout(this.t);
      this.t = setTimeout(() => this.render(), 120);
    };
    addEventListener("resize", this.onResize, { passive: true });

    /* Follow a contrast change: the ink colours come from the live tokens. */
    this.observer = new MutationObserver(() => this.render());
    this.observer.observe(document.documentElement,
      { attributes: true, attributeFilter: ["data-contrast"] });

    this.render();
    return this;
  }

  render() {
    const r = this.host.getBoundingClientRect();
    if (!r.width || !r.height) return;

    /* Capped at 2: beyond that a halftone is finer than the screen it is
       being looked at on, which is a contradiction. */
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const W = Math.round(r.width * dpr);
    const H = Math.round(r.height * dpr);
    this.canvas.width = W;
    this.canvas.height = H;
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";

    const ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const inks = { text: ink("--text", "#14120f"), accent: ink("--accent", "#6f8a12") };

    /* Screen pitch in device pixels, so the dot size on a retina display
       matches the dot size everywhere else. */
    const pitch = Math.max(4, Math.min(9, (H / dpr) / 78)) * dpr;
    const plate = tonePlate(W, H);

    /* Accent first and slightly off-register, ink over it. Riso order:
       the lighter ink lays down before the darker one. */
    screenPass(ctx, plate, W, H, {
      angle: 75, pitch, colour: inks.accent, alpha: 0.85,
      offset: [2.5 * dpr, -1.5 * dpr],
    });
    screenPass(ctx, plate, W, H, {
      angle: 15, pitch, colour: inks.text, alpha: 0.9, offset: [0, 0],
    });

    proofMarks(ctx, W, H, inks);
  }

  destroy() {
    removeEventListener("resize", this.onResize);
    clearTimeout(this.t);
    this.observer?.disconnect();
  }
}
