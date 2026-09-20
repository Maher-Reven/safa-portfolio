#!/usr/bin/env node
/* =========================================================================
   tools/contrast.mjs — the palette, measured rather than believed.
   -------------------------------------------------------------------------
   Reads styles/tokens.css, resolves the four palettes the site can actually
   be in — dark and light, each at normal and high contrast — and checks
   every pairing that ends up in front of a reader.

     node tools/contrast.mjs          the table, and a non-zero exit if
                                      anything fails
     node tools/contrast.mjs --quiet  only the failures

   It reads the stylesheet rather than a copy of the values, because a
   checker with its own copy of the palette is a checker that passes while
   the site fails. Three things were wrong when this was first run against
   the file: the light accent was documented at 4.9:1 and measured 3.5:1,
   the light high-contrast accent was documented at 7.4:1 and measured
   6.8:1, and VeloTech's blue — the identity of an entire case — sat at
   2.5:1 on the ground it was drawn on.

   WHAT IT CANNOT TELL YOU. It measures pairs of flat colours. It does not
   know whether a colour is the only thing distinguishing two states, and
   it cannot see the live canvas behind the page. The canvas is bounded in
   its own shader; states are checked by eye and by the page's own audit.
   ========================================================================= */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const CSS = join(HERE, "..", "styles", "tokens.css");

/* ---------------------------------------------------------------------------
   Colour
   --------------------------------------------------------------------------- */
function parseColour(raw) {
  const v = raw.trim();
  const hexMatch = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    let h = hexMatch[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16),
             b: parseInt(h.slice(4, 6), 16), a: 1 };
  }
  const rgba = v.match(/^rgba?\(([^)]+)\)$/i);
  if (rgba) {
    const n = rgba[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { r: n[0], g: n[1], b: n[2], a: n.length > 3 ? n[3] : 1 };
  }
  return null;
}

/* A translucent rule is never seen as itself — it is seen over whatever is
   behind it. Checking the declared rgba would measure a colour that does
   not exist on screen. */
const over = (c, bg) => ({
  r: c.r * c.a + bg.r * (1 - c.a),
  g: c.g * c.a + bg.g * (1 - c.a),
  b: c.b * c.a + bg.b * (1 - c.a),
  a: 1,
});

const channel = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};
const luminance = (c) =>
  0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);

function contrast(fg, bg) {
  const a = luminance(fg.a < 1 ? over(fg, bg) : fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/* ---------------------------------------------------------------------------
   Reading the stylesheet
   --------------------------------------------------------------------------- */
function blocks(css) {
  /* Comments first: a hex inside a comment is prose, not a declaration. */
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const found = {};
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(clean))) {
    const selector = m[1].trim().replace(/\s+/g, " ");
    const decls = {};
    for (const line of m[2].split(";")) {
      const i = line.indexOf(":");
      if (i < 0) continue;
      const prop = line.slice(0, i).trim();
      if (prop.startsWith("--")) decls[prop] = line.slice(i + 1).trim();
    }
    if (Object.keys(decls).length) found[selector] = { ...(found[selector] || {}), ...decls };
  }
  return found;
}

function palette(all, theme, contrastLevel) {
  const layers = [
    ":root",
    `[data-theme="${theme}"]`,
    contrastLevel === "high" ? `[data-theme="${theme}"][data-contrast="high"]` : null,
  ].filter(Boolean);

  const flat = {};
  for (const layer of layers) Object.assign(flat, all[layer] || {});

  const out = {};
  for (const [k, v] of Object.entries(flat)) {
    const c = parseColour(v);
    if (c) out[k.slice(2)] = c;
  }
  return out;
}

/* ---------------------------------------------------------------------------
   What has to pass, and against what
   --------------------------------------------------------------------------- */
const CASES = ["dentara", "velotech", "medialab", "pubhubs"];

function checksFor(p, level) {
  const TEXT = level === "high" ? 7 : 4.5;   /* WCAG 1.4.3 / 1.4.6 */
  const MARK = level === "high" ? 4.5 : 3;   /* WCAG 1.4.11, non-text */
  const rows = [];
  const add = (token, groundName, target, kind) => {
    const fg = p[token], bg = p[groundName];
    if (!fg || !bg) return;
    rows.push({ token, ground: groundName, kind, target,
                ratio: Math.round(contrast(fg, bg) * 100) / 100 });
  };

  for (const t of ["text", "text-soft", "text-faint", "accent-text", "note"]) {
    add(t, "ground", TEXT, "text");
    add(t, "surface", TEXT, "text");
  }

  /* The fill and what sits on it. A pill's own edge against the page is
     allowed to be quiet — the text inside is what identifies it — but the
     text inside is not. */
  add("accent-ink", "accent", TEXT, "text");

  /* A focus ring is only a ring if it is visible where it lands. Every ring
     on this site sits outside its element on the page — except one, inset
     on the language toggle, which lands on the lime fill and therefore
     takes --accent-ink, checked above. */
  for (const g of ["ground", "surface"]) add("focus", g, MARK, "mark");
  add("accent-ink", "accent", MARK, "mark");

  /* Three weights of line, and only one of them is load-bearing. --edge
     draws the boundary of something you can press, so 1.4.11 applies to
     it; --line-strong frames a card and --line divides a list, and neither
     is the only thing telling you a control is there. They are reported
     without a target rather than left out, because "not required" is a
     judgement worth being able to see and argue with. */
  add("edge", "ground", MARK, "mark");
  add("edge", "surface", MARK, "mark");
  add("line-strong", "ground", 0, "frame");
  add("line-strong", "surface", 0, "frame");
  add("line", "ground", 0, "hairline");
  add("line", "surface", 0, "hairline");

  for (const c of CASES) {
    add(`c-${c}-ink`, "ground", TEXT, "text");
    add(`c-${c}-ink`, "surface", TEXT, "text");
    add(`c-${c}`, "ground", MARK, "mark");
    add(`c-${c}`, "surface", MARK, "mark");
  }
  return rows;
}

/* ---------------------------------------------------------------------------
   Run
   --------------------------------------------------------------------------- */
const quiet = process.argv.includes("--quiet");
const all = blocks(readFileSync(CSS, "utf8"));
let failures = 0;
let checked = 0;

for (const theme of ["dark", "light"]) {
  for (const level of ["normal", "high"]) {
    const p = palette(all, theme, level);
    const rows = checksFor(p, level);
    const bad = rows.filter((r) => r.target && r.ratio < r.target);
    failures += bad.length;
    checked += rows.length;

    if (!quiet) {
      console.log(`\n  ${theme.toUpperCase()} · contrast ${level}`);
      for (const r of rows) {
        const need = r.target ? `needs ${r.target.toFixed(1)}` : "no minimum";
        const mark = !r.target ? "  ·" : r.ratio >= r.target ? "  ✓" : "  ✗";
        console.log(`${mark} ${`--${r.token}`.padEnd(18)} on ${r.ground.padEnd(8)}` +
                    ` ${String(r.ratio.toFixed(2)).padStart(6)}:1   ${need}`);
      }
    } else {
      for (const r of bad) {
        console.log(`  ✗ ${theme}/${level}  --${r.token} on ${r.ground}` +
                    `  ${r.ratio.toFixed(2)}:1, needs ${r.target.toFixed(1)}`);
      }
    }
  }
}

console.log(`\n  ${checked} pairings checked across four palettes — ` +
            (failures ? `${failures} FAILING` : "all pass") + "\n");
process.exit(failures ? 1 : 0);
