/* =========================================================================
   lab.js — instruments, not screenshots.
   -------------------------------------------------------------------------
   A lab of pictures would be a second Work tab. Each of these is a working
   tool for something Safa actually tests for, and each one runs on THIS
   page: the vision simulations point at her own portfolio, and the contrast
   checker opens on the exact pairing that failed her first audit.

   Everything here is careful about one thing above all: an instrument that
   degrades the page must be impossible to get stuck inside. Each one
   announces itself, is undone by a single control, and is torn down when
   you leave the route.
   ========================================================================= */

/* Colour-vision matrices (Machado, Oliveira & Fernandes, 2009 — the same
   family of transforms Chrome's own rendering emulation uses). */
const MATRICES = {
  protanopia:    "0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0",
  deuteranopia:  "0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0",
  tritanopia:    "0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0",
  achromatopsia: "0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0",
};

/* ---- contrast maths ----------------------------------------------------
   The same WCAG formula the whole site has been measured against, so the
   instrument and the claims cannot drift apart.                            */
export function luminance([r, g, b]) {
  const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
export function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
export const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  return h.length === 3
    ? h.split("").map((c) => parseInt(c + c, 16))
    : [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

/* =========================================================================
   VISION — the simulations, applied to the live page.
   ========================================================================= */
export class VisionLab {
  constructor({ announce, t, strings }) {
    this.announce = announce; this.t = t; this.s = strings;
    this.current = "none";
  }

  /* One SVG of filters, appended once, referenced by CSS filter: url(#id).
     Filters are defined rather than inlined so switching is a single
     attribute change instead of a re-parse. */
  ensureDefs() {
    if (document.getElementById("vision-defs")) return;
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.id = "vision-defs";
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    Object.entries(MATRICES).forEach(([id, values]) => {
      const filter = document.createElementNS(ns, "filter");
      filter.id = `v-${id}`;
      filter.setAttribute("color-interpolation-filters", "sRGB");
      const m = document.createElementNS(ns, "feColorMatrix");
      m.setAttribute("type", "matrix");
      m.setAttribute("values", values);
      filter.append(m);
      svg.append(filter);
    });
    document.body.append(svg);
  }

  apply(id) {
    this.ensureDefs();
    const root = document.documentElement;
    this.current = id;

    if (id === "none") root.style.removeProperty("--vision-filter");
    else if (id === "blur") root.style.setProperty("--vision-filter", "blur(2.4px)");
    else root.style.setProperty("--vision-filter", `url(#v-${id})`);

    root.dataset.vision = id;
    const label = this.s.vision.find((v) => v.id === id);

    /* A real element, not a CSS ::after with attr(). attr() reads the
       element's OWN attribute, and data-vision lives on <html>, so the badge
       rendered as an empty pill — a status indicator that silently says
       nothing is worse than none at all.

       It is also a live region and a button: while the page is degraded on
       purpose, there has to be one obvious way out of it that does not
       require finding the control you came in through. */
    this.banner ??= (() => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "vision-banner";
      b.addEventListener("click", () => {
        this.apply("none");
        document.querySelectorAll("[data-vision][aria-pressed]").forEach((n) =>
          n.setAttribute("aria-pressed", String(n.dataset.vision === "none")));
      });
      document.body.append(b);
      return b;
    })();

    if (id === "none") {
      this.banner.hidden = true;
      this.announce(this.t(this.s.ui.normal));
    } else {
      this.banner.hidden = false;
      this.banner.textContent = `${this.t(label.label)} — ${this.t(this.s.ui.stop)}`;
      this.announce(`${this.t(label.label)} — ${this.t(this.s.ui.running)}`);
    }
  }

  destroy() {
    document.documentElement.style.removeProperty("--vision-filter");
    delete document.documentElement.dataset.vision;
    document.getElementById("vision-defs")?.remove();
    this.banner?.remove(); this.banner = null;
  }
}

/* =========================================================================
   HALFTONE — the riso screen, with its angles exposed.
   Shares the drawing and the screening logic with print mode, so the lab
   and the page it describes cannot disagree.
   ========================================================================= */
export async function renderScreen(canvas, { angleA, angleB, pitch, inkA, inkB }) {
  const { DESIGN, fit, drawCat } = await import("./shapes.js");
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const W = Math.round(canvas.clientWidth * dpr);
  const H = Math.round(canvas.clientHeight * dpr);
  if (!W || !H) return;
  canvas.width = W; canvas.height = H;

  const plate = document.createElement("canvas");
  plate.width = W; plate.height = H;
  const pctx = plate.getContext("2d", { willReadFrequently: true });
  drawCat(pctx, W, H);
  pctx.setTransform(1, 0, 0, 1, 0, 0);
  pctx.globalCompositeOperation = "source-atop";
  const g = pctx.createLinearGradient(W * 0.2, 0, W * 0.85, H);
  g.addColorStop(0, "rgb(205,205,205)");
  g.addColorStop(0.55, "rgb(115,115,115)");
  g.addColorStop(1, "rgb(24,24,24)");
  pctx.fillStyle = g;
  pctx.fillRect(0, 0, W, H);
  const data = pctx.getImageData(0, 0, W, H).data;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, W, H);

  const pass = (angle, colour, alpha, offset) => {
    const rad = (angle * Math.PI) / 180, cos = Math.cos(rad), sin = Math.sin(rad);
    const p = pitch * dpr;
    ctx.save();
    ctx.translate(offset[0], offset[1]);
    ctx.fillStyle = colour;
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = "multiply";
    const reach = Math.ceil((W + H) / p);
    for (let j = -reach; j <= reach; j++) {
      for (let i = -reach; i <= reach; i++) {
        const x = (i * cos - j * sin) * p + W / 2;
        const y = (i * sin + j * cos) * p + H / 2;
        if (x < -p || y < -p || x > W + p || y > H + p) continue;
        const px = (Math.round(y) * W + Math.round(x)) * 4;
        const a = data[px + 3];
        if (!a) continue;
        const r = (1 - data[px] / 255) * (a / 255) * p * 0.78;
        if (r < 0.28) continue;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  };

  pass(angleB, inkB, 0.85, [2.5 * dpr, -1.5 * dpr]);
  pass(angleA, inkA, 0.9, [0, 0]);
}

/* Two screens closer than 60° interfere. This is the rule the print mode's
   15°/75° pairing exists to obey, so the lab can show you it failing. */
export function isMoire(a, b) {
  const d = Math.abs(((a - b) % 90) + 90) % 90;
  return Math.min(d, 90 - d) < 25;
}
