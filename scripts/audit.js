/* =========================================================================
   audit.js — the page measures itself, in front of you.
   -------------------------------------------------------------------------
   Every portfolio asserts rigour. This one lets you check it: the audit runs
   against the live DOM, right now, in whatever state you have put the site
   into — and it re-runs when you change a setting, so turning on high
   contrast visibly moves the numbers.

   Two rules, and the second is the only one that matters:

   1. It measures what is actually rendered. Resolved colours walked up the
      tree, real bounding boxes, the real heading sequence. Not a checklist
      someone ticked.
   2. IT REPORTS FAILURES. An audit that can only pass is marketing. If this
      page breaks one of its own rules, the number goes down and says so.
      That is the entire reason it is worth showing.

   These are a handful of checks that can be made honestly on the client.
   They are not a substitute for a real audit, and the copy says so.
   ========================================================================= */

/* ---- colour ------------------------------------------------------------ */
const parseColour = (c) => {
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b, a = 1] = m[1].split(",").map((v) => parseFloat(v));
  return { r, g, b, a };
};

const lum = ({ r, g, b }) => {
  const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

const contrast = (fg, bg) => {
  const [hi, lo] = [lum(fg), lum(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
};

/* The background an element is actually sitting on. A transparent background
   is not white — it is whatever is behind it, which means walking up until
   something opaque is found. Getting this wrong is how most naive contrast
   checkers report a perfect score on a broken page. */
function effectiveBg(el) {
  let node = el;
  while (node && node !== document.documentElement.parentNode) {
    const c = parseColour(getComputedStyle(node).backgroundColor);
    if (c && c.a > 0.85) return c;
    node = node.parentElement;
  }
  return parseColour(getComputedStyle(document.body).backgroundColor) || { r: 28, g: 28, b: 28, a: 1 };
}

const visible = (el) => {
  const s = getComputedStyle(el);
  if (s.display === "none" || s.visibility === "hidden" || +s.opacity === 0) return false;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
};

/* ---- the checks --------------------------------------------------------- */

function checkContrast() {
  const nodes = [...document.querySelectorAll("#view p, #view li, #view h1, #view h2, #view h3, #view h4, #view a, #view dd, #view dt")]
    .filter((el) => visible(el) && el.textContent.trim().length > 1)
    .filter((el) => ![...el.children].some((c) => c.textContent.trim() === el.textContent.trim()));

  let worst = Infinity, worstEl = null, fails = 0;
  for (const el of nodes) {
    const s = getComputedStyle(el);
    const fg = parseColour(s.color);
    if (!fg) continue;
    const r = contrast(fg, effectiveBg(el));
    /* WCAG's large-text allowance: 18.66px bold, or 24px. */
    const size = parseFloat(s.fontSize);
    const large = size >= 24 || (size >= 18.66 && +s.fontWeight >= 700);
    const need = large ? 3 : 4.5;
    if (r < need) fails++;
    if (r < worst) { worst = r; worstEl = el; }
  }
  return {
    id: "contrast",
    total: nodes.length,
    fails,
    detail: `${worst === Infinity ? "—" : worst.toFixed(2)}:1`,
    sample: worstEl ? worstEl.textContent.trim().slice(0, 40) : "",
    pass: fails === 0,
  };
}

function checkAlt() {
  const imgs = [...document.querySelectorAll("#view img")].filter(visible);
  /* alt="" is a decision (decorative), not an omission — a missing attribute
     is the failure, because it leaves a screen reader to read a filename. */
  const missing = imgs.filter((i) => !i.hasAttribute("alt"));
  return { id: "alt", total: imgs.length, fails: missing.length,
           detail: `${imgs.length - missing.length}/${imgs.length}`, pass: missing.length === 0 };
}

function checkHeadings() {
  const hs = [...document.querySelectorAll("#view h1, #view h2, #view h3, #view h4, #view h5, #view h6")]
    .filter(visible).map((h) => +h.tagName[1]);
  let skips = 0;
  for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) skips++;
  return { id: "headings", total: hs.length, fails: skips,
           detail: hs.join(" → ") || "—", pass: skips === 0 };
}

function checkTargets() {
  const controls = [...document.querySelectorAll("#view a, #view button, #view input, #view select, .site-head a, .site-head button")]
    .filter(visible)
    /* Inline links inside a sentence are exempt from WCAG 2.2 target size;
       counting them would manufacture failures that are not real. */
    .filter((el) => !(el.tagName === "A" && el.closest("p, li") && getComputedStyle(el).display.includes("inline")));
  const small = controls.filter((el) => {
    const r = el.getBoundingClientRect();
    return Math.min(r.width, r.height) < 24;
  });
  return { id: "targets", total: controls.length, fails: small.length,
           detail: `${controls.length - small.length}/${controls.length} ≥ 24px`, pass: small.length === 0 };
}

function checkNames() {
  const controls = [...document.querySelectorAll("#view button, #view a, .site-head button, .site-head a")].filter(visible);
  const nameless = controls.filter((el) => {
    const text = (el.textContent || "").trim();
    return !text && !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby") && !el.title;
  });
  return { id: "names", total: controls.length, fails: nameless.length,
           detail: `${controls.length - nameless.length}/${controls.length}`, pass: nameless.length === 0 };
}

function checkLang() {
  const l = document.documentElement.lang;
  return { id: "lang", total: 1, fails: l ? 0 : 1, detail: l || "—", pass: !!l };
}

export function runAudit() {
  const checks = [checkContrast(), checkAlt(), checkHeadings(), checkTargets(), checkNames(), checkLang()];
  const failed = checks.filter((c) => !c.pass).length;
  return { checks, failed, passed: checks.length - failed, total: checks.length };
}
