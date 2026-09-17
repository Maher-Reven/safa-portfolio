/* =========================================================================
   main.js — renders the site from content.js, wires the attune panel, and
   boots the live ground only when the visitor is in full mode.
   ========================================================================= */

import { attune, AXES } from "./attune.js";
import { Router } from "./router.js";
import { makeTransition } from "./transitions.js";
import { Cat, PawTrail } from "./cat.js";
import * as C from "../content/content.js";

/* ---- i18n -------------------------------------------------------------
   Every string in content.js is { en, nl }. Fall back to English rather
   than rendering a hole, and pass plain strings straight through.        */
const t = (v) => (typeof v === "string" ? v : (v?.[attune.get("lang")] ?? v?.en ?? ""));

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  for (const kid of kids.flat()) if (kid != null) node.append(kid);
  return node;
};

/* =========================================================================
   SECTIONS
   Each returns a complete <section>. Order is decided by the audience;
   nothing is ever omitted, so every path can still reach everything.
   ========================================================================= */

const SECTIONS = {
  outcomes: () => section("outcomes",
    el("ul", { className: "outcomes" }, C.outcomes.map((o) =>
      el("li", {},
        el("span", { className: "outcome__figure", textContent: o.figure }),
        el("span", { className: "outcome__label", textContent: t(o.label) }))))),

  work: () => section("work",
    el("ul", { className: "work-list" }, C.projects.map(projectCard))),

  about: () => section("about",
    C.about.body[attune.get("lang")].map((para) => el("p", { textContent: para }))),

  process: () => section("process",
    el("ol", { className: "steps" }, C.process.steps.map((st) =>
      el("li", {},
        el("h3", {}, el("span", { className: "steps__n", textContent: st.n + " " }), t(st.title)),
        el("p", { textContent: t(st.body) }))))),

  skills: () => section("skills",
    el("div", { className: "skills" }, C.skills.columns.map((col) =>
      el("div", {},
        el("p", { className: "skills__eyebrow" },
          el("span", { className: "skills__key", textContent: col.key }),
          el("span", { textContent: t(col.eyebrow) })),
        el("h3", { textContent: t(col.title) }),
        el("ul", {}, col.items.map((item, i) =>
          el("li", {},
            el("span", { textContent: t(item) }),
            el("span", { textContent: String(i + 1).padStart(2, "0") }))))))),
    el("p", { className: "skills__note", textContent: t(C.skills.note) })),

  /* The chapter that explains why the site behaves the way it does.
     Real findings from her own first accessibility audit, with the source. */
  accessibility: () => section("accessibility",
    el("p", { className: "intro__sub", textContent: t(C.accessibility.lead) }),
    el("ul", { className: "findings" }, C.accessibility.findings.map((f) =>
      el("li", {},
        el("span", { className: "findings__value", textContent: t(f.value) }),
        el("p", { textContent: t(f.note) })))),
    el("p", { textContent: t(C.accessibility.close) }),
    el("p", {}, el("a", { className: "detail-trigger",
                          href: C.accessibility.source.href,
                          textContent: C.accessibility.source.label }))),

  /* The footnotes, promoted to a chapter: every annotation on the site as
     one document, for the visitor who wants decisions without pictures. */
  "detail-index": () => section("detail-index",
    el("div", { className: "detail-index" },
      C.projects.flatMap((proj) => proj.details.map((d) =>
        el("div", { className: "detail-index__row" },
          el("span", { className: "detail-index__key",
                       textContent: `${d.kind}${d.value ? " · " + d.value : ""}` }),
          el("div", {},
            el("p", { textContent: t(d.note) }),
            el("p", { style: "color:var(--text-faint)", textContent: t(proj.title) }))))))),

  contact: () => section("contact",
    el("p", {}, el("a", { className: "contact__big",
                          href: `mailto:${C.meta.email}`, textContent: C.meta.email })),
    el("dl", { className: "contact__grid" },
      el("dt", { textContent: "Email" }),
      el("dd", {}, el("a", { href: `mailto:${C.meta.email}`, textContent: C.meta.email })),
      el("dt", { textContent: "Phone" }),
      el("dd", {}, el("a", { href: `tel:${C.meta.phone.replace(/\s/g, "")}`,
                             textContent: C.meta.phone })),
      el("dt", { textContent: t(C.ui.sections.contact) === "Contact" ? "Located" : "Locatie" }),
      el("dd", { textContent: t(C.meta.located) }),
      el("dt", { textContent: "Elsewhere" }),
      el("dd", {}, C.meta.links.map((l, i) =>
        el("span", {}, i ? " · " : "", el("a", { href: l.href, textContent: l.label + " \u2197" })))))),
};

function section(id, ...children) {
  return el("section", { className: "section rail", id },
    el("h2", { className: "section__label", textContent: t(C.ui.sections[id]) }),
    ...children);
}

/* Each project renders as a full case: cover, the four written sections,
   then the gallery. Nothing is behind a click — a portfolio that hides its
   own work behind navigation is asking the visitor to do its job. */
function projectCard(p) {
  const article = el("article", { className: "project" });
  article.style.setProperty("--case", p.colour);

  const cover = el("figure", { className: "project__cover", style: "margin:0" },
    el("img", { src: p.cover.src, alt: t(p.cover.alt), loading: "lazy", decoding: "async" }));

  const body = el("div", {},
    el("p", { className: "project__meta" },
      el("span", { textContent: p.year }),
      el("span", { textContent: t(p.company) }),
      el("span", { textContent: t(p.discipline) })),
    el("h3", { textContent: t(p.title) }),
    el("p", { className: "project__summary", textContent: t(p.summary) }),
    ...p.details.flatMap((d) => detailPair(d, p.slug)));

  const written = el("div", { className: "case__sections" },
    ["role", "process", "solution", "result"].map((key) => {
      const copy = p.sections?.[key];
      if (!copy) return null;
      const block = el("div", { className: "case__section" },
        el("h4", { textContent: t(C.ui.caseLabels[key]) }),
        el("p", { textContent: t(copy) }));
      block.dataset.key = key;
      return block;
    }));

  const gallery = p.shots?.length
    ? el("ul", { className: "shots" }, p.shots.map((sh) => {
        const li = el("li", {},
          el("img", { src: sh.src, alt: t(sh.alt), loading: "lazy", decoding: "async" }));
        li.dataset.span = sh.span || "half";
        return li;
      }))
    : null;

  article.append(cover, body, written, ...(gallery ? [gallery] : []));
  return el("li", {}, article);
}

/* One annotation: a trigger and the note it discloses. Native aria-expanded
   plus the hidden attribute, rather than a custom widget, so it behaves the
   way a screen-reader user already expects a disclosure to behave. */
let detailSeq = 0;
function detailPair(d, slug) {
  const id = `detail-${slug}-${detailSeq++}`;
  const trigger = el("button", {
    type: "button",
    className: "detail-trigger",
    textContent: d.value || t(C.ui.detailHint),
  });
  trigger.dataset.kind = d.kind;
  if (d.kind === "colour") trigger.style.setProperty("--swatch", d.value);
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", id);

  const note = el("dl", { className: "detail-note", id, hidden: true },
    el("dt", { textContent: d.kind }),
    el("dd", { textContent: t(d.note) }));

  trigger.addEventListener("click", () => {
    const open = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!open));
    note.hidden = open;
  });

  return [trigger, note];
}

/* =========================================================================
   ROUTES — six pages. Each is a list of sections, composed from the same
   renderers the single-scroll version used, so nothing was rewritten to
   become routable: the sections never knew where they were.
   ========================================================================= */
export const ROUTES = [
  { id: "home",    label: { en: "Home",     nl: "Start" },   sections: ["intro", "outcomes"] },
  { id: "work",    label: { en: "Work",     nl: "Werk" },    sections: ["work"] },
  { id: "about",   label: { en: "About",    nl: "Over" },    sections: ["about", "process"] },
  { id: "access",  label: { en: "Access",   nl: "Toegang" }, sections: ["accessibility", "detail-index"] },
  { id: "skills",  label: { en: "Skills",   nl: "Kunde" },   sections: ["skills"] },
  { id: "contact", label: { en: "Contact",  nl: "Contact" }, sections: ["contact"] },
];

const ROUTE_IDS = ROUTES.map((r) => r.id);

/* Who the visitor said they were still decides order — it now orders the
   tabs rather than a scroll. Home and Contact are pinned: the first is
   where you land, the last is the thing every path should end at. */
function routesForAudience() {
  const audience = C.audiences.find((a) => a.id === attune.get("audience"));
  if (!audience) return ROUTES;

  const priority = new Map();
  audience.order.forEach((section, i) => {
    const route = ROUTES.find((r) => r.sections.includes(section));
    if (route && !priority.has(route.id)) priority.set(route.id, i);
  });

  const middle = ROUTES.filter((r) => r.id !== "home" && r.id !== "contact");
  middle.sort((a, b) => (priority.get(a.id) ?? 99) - (priority.get(b.id) ?? 99));

  return [ROUTES[0], ...middle, ROUTES.find((r) => r.id === "contact")];
}

function renderTabs() {
  const nav = document.getElementById("tabs");
  nav.replaceChildren(...routesForAudience().map((r) => {
    const a = el("a", { href: `#/${r.id}`, textContent: t(r.label) });
    a.dataset.route = r.id;
    if (router?.current === r.id) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "page");
    }
    return a;
  }));
}

/* The intro is a section like any other, so that home is composed the same
   way every other page is. */
SECTIONS.intro = () => {
  const words = el("div", { className: "cat-stage__words" },
    el("p", { className: "intro__kicker", textContent: t(C.intro.kicker) }),
    heroHeading(),
    el("p", { className: "intro__sub", textContent: t(C.intro.sub) }));

  /* The cat shares the headline's stage rather than sitting under it, so it
     reads as company rather than as a footnote. It is a <figure> with no
     caption and aria-hidden: it says nothing the words do not. */
  const figure = el("figure", { className: "cat-stage__figure" });
  figure.setAttribute("aria-hidden", "true");

  /* The stage says what it is doing. Without this the morph is a mystery
     the visitor has to solve; with it, it is a sequence they can follow —
     and the sequence is the argument the headline just made. */
  const caption = el("p", { className: "cat-stage__caption" });
  caption.setAttribute("aria-hidden", "true");
  const shapes = [
    { n: "01", label: { en: "it notices you", nl: "het merkt je op" } },
    { n: "02", label: { en: "it reaches for you", nl: "het reikt naar je" } },
    { n: "03", label: { en: "it becomes yours", nl: "het wordt van jou" } },
  ];
  caption.replaceChildren(
    el("span", { className: "cat-stage__n", textContent: shapes[0].n }),
    el("span", { className: "cat-stage__what", textContent: t(shapes[0].label) }));
  figure.dataset.shapeIndex = "0";
  figure._setShape = (i) => {
    const sh = shapes[Math.max(0, Math.min(2, i))];
    figure.dataset.shapeIndex = String(i);
    caption.children[0].textContent = sh.n;
    caption.children[1].textContent = t(sh.label);
  };

  const wrap = el("section", { className: "intro rail", id: "intro" },
    el("div", { className: "cat-stage" }, words,
      el("div", { className: "cat-stage__right" }, figure, caption)));

  const ask = el("div", { className: "ask" },
    el("p", { className: "ask__lead", textContent: t(C.ui.audienceLabel) }),
    el("ul", { className: "ask__options" }, C.audiences.map((a) => {
      const btn = el("button", { type: "button" },
        el("strong", { textContent: t(a.label) }),
        el("span", { textContent: t(a.detail) }));
      btn.addEventListener("click", () => attune.set("audience", a.id));
      return el("li", {}, btn);
    })),
    el("p", { className: "ask__note", textContent: t(C.intro.invitation) }));

  wrap.append(ask);
  return wrap;
};

/* The headline carries one lime full stop — the whole brand mark, and the
   only place the accent is used purely as identity. Built from text nodes
   rather than innerHTML, so content.js can never become an injection
   surface. */
function heroHeading() {
  const line = t(C.intro.statement).replace(/\.$/, "");
  return el("h1", { id: "intro-h" }, line, el("span", { className: "stop", textContent: "." }));
}

let cat = null;
let paws = null;
let swarm = null;
let halftone = null;

/* The home page companion.

   Full mode gets the particle swarm: three.js, ~24k points, morphing cat →
   paw → cursor as you scroll, parting around your pointer and turning to
   face you. Calm mode and reduced motion get the drawn cat, still, as an
   engraving — the same thing the two modes mean everywhere else here.

   The swarm is imported lazily inside start(), so a visitor who lands in
   calm mode never downloads 331 KB of three.js to look at a page they asked
   to hold still. If it cannot start — no WebGL, a failed import, a lost
   context — the drawn cat takes over and nothing is said about it, because
   nothing was lost. */
async function mountCompanion(host) {
  const still = document.documentElement.dataset.mode === "calm" ||
                matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (still) {
    /* Print gets a two-colour risograph halftone of the same silhouette the
       swarm is built from — light on the screen, ink on the paper. */
    try {
      const { Halftone } = await import("./halftone.js");
      if (!host.isConnected) return;
      halftone = new Halftone(host).start();
      host.dataset.swarm = "print";
      return;
    } catch (err) {
      console.warn("halftone unavailable, falling back to the drawing:", err);
    }
    cat = new Cat(host);
    cat.start();
    return;
  }

  paws = new PawTrail().mount(document.body);
  host.dataset.swarm = "loading";

  try {
    const { Swarm } = await import("./gl/swarm.js");
    /* The route may have changed while three.js was downloading. */
    if (!host.isConnected) return;
    swarm = new Swarm(host, { onShape: (i) => host._setShape?.(i) });
    host.addEventListener("swarm:lost", () => fallBackToDrawing(host), { once: true });
    await swarm.start();
    host.dataset.swarm = "ready";
  } catch (err) {
    console.warn("swarm unavailable, falling back to the drawing:", err);
    fallBackToDrawing(host);
  }
}

function fallBackToDrawing(host) {
  swarm?.destroy(); swarm = null;
  if (!host.isConnected) return;
  host.dataset.swarm = "off";
  cat = new Cat(host);
  cat.start();
}

function renderRoute(id) {
  const route = ROUTES.find((r) => r.id === id) ?? ROUTES[0];
  const view = document.getElementById("view");

  /* Tear the companion down before the markup it was rigged to is replaced,
     or its listeners keep running against elements that no longer exist. */
  cat?.destroy(); cat = null;
  paws?.destroy(); paws = null;
  swarm?.destroy(); swarm = null;
  halftone?.destroy(); halftone = null;

  view.replaceChildren(...route.sections.map((key) => SECTIONS[key]?.()).filter(Boolean));
  document.title = `${t(route.label)} — ${C.meta.name}, ${t(C.meta.role)}`;

  const host = view.querySelector(".cat-stage__figure");
  if (host) mountCompanion(host);
}

/* =========================================================================
   THE ATTUNE PANEL
   ========================================================================= */
function renderAttune() {
  const root = $("#attune-root");
  const scrim = el("div", { className: "attune__scrim" });
  const panel = el("aside", { className: "attune", id: "attune-panel" });
  panel.setAttribute("aria-label", t(C.ui.attuneTitle));
  panel.dataset.open = "false";
  scrim.dataset.open = "false";

  const log = el("ul", { className: "attune__log" });

  const axisGroup = (axisKey, labelKey, options) => {
    const fieldset = el("fieldset", { className: "axis" });
    const legend = el("legend", { className: "axis__label" },
      el("span", { textContent: t(C.ui[labelKey]) }));

    if (attune.isFollowingSystem(axisKey)) {
      legend.append(el("span", { className: "axis__system", textContent: t(C.ui.systemNote) }));
    }
    fieldset.append(legend);

    const ul = el("ul", { className: "choices" });
    for (const opt of options) {
      const inputId = `attune-${axisKey}-${opt.value}`;
      const input = el("input", {
        type: "radio", name: `attune-${axisKey}`, id: inputId, value: opt.value,
        checked: attune.get(axisKey) === opt.value,
      });
      input.addEventListener("change", () => attune.set(axisKey, opt.value));
      const label = el("label", { htmlFor: inputId, textContent: opt.label });
      ul.append(el("li", { className: "choice" }, input, label));
    }
    fieldset.append(ul);
    return fieldset;
  };

  panel.append(
    el("div", { className: "attune__head" },
      el("h2", { className: "attune__title", textContent: t(C.ui.attuneTitle) }),
      closeButton()),
    el("p", { className: "attune__intro", textContent: t(C.ui.attuneIntro) }),

    axisGroup("mode", "modeLabel", [
      { value: "full", label: t(C.ui.modeFull) },
      { value: "calm", label: t(C.ui.modeCalm) },
    ]),
    axisGroup("audience", "audienceLabel",
      [{ value: "open", label: "—" },
       ...C.audiences.map((a) => ({ value: a.id, label: t(a.label) }))]),
    axisGroup("reading", "readingLabel", [
      { value: "default", label: "Inter" },
      { value: "legible", label: "Atkinson Hyperlegible" },
    ]),
    axisGroup("textsize", "textsizeLabel", [
      { value: "default", label: "A" }, { value: "large", label: "A+" }, { value: "larger", label: "A++" },
    ]),
    axisGroup("contrast", "contrastLabel", [
      { value: "normal", label: "Warm" }, { value: "high", label: "High" },
    ]),
    axisGroup("lang", "langLabel", [
      { value: "en", label: "English" }, { value: "nl", label: "Nederlands" },
    ]),
    log,
  );

  root.replaceChildren(scrim, panel);

  /* Open / close, with focus handled properly: focus moves into the panel
     when it opens and returns to the button when it closes, and Escape
     always works. */
  const opener = $("#attune-open");
  const setOpen = (open) => {
    panel.dataset.open = String(open);
    scrim.dataset.open = String(open);
    opener.setAttribute("aria-expanded", String(open));
    if (open) panel.querySelector("input")?.focus();
    else opener.focus();
  };
  opener.onclick = () => setOpen(panel.dataset.open !== "true");
  scrim.onclick = () => setOpen(false);
  panel.querySelector("[data-close]").onclick = () => setOpen(false);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.dataset.open === "true") setOpen(false);
  });

  /* The panel keeps a visible record of what it changed, in words. */
  document.addEventListener("attune:said", (e) => {
    log.prepend(el("li", { textContent: e.detail.message }));
    while (log.children.length > 5) log.lastElementChild.remove();
  });
}

function closeButton() {
  const b = el("button", { type: "button", textContent: "✕" });
  b.dataset.close = "";
  b.setAttribute("aria-label", t(C.ui.closeLabel));
  return b;
}

/* =========================================================================
   STATIC STRINGS
   ========================================================================= */
const I18N_PATHS = {
  "role": () => t(C.meta.role),
  "intro.statement": () => t(C.intro.statement),
  "intro.kicker": () => t(C.intro.kicker),
  "intro.sub": () => t(C.intro.sub),
  "intro.invitation": () => t(C.intro.invitation),
  "ui.audienceLabel": () => t(C.ui.audienceLabel),
  "attuneTitle": () => t(C.ui.attuneTitle),
};

function renderStatic() {
  $$("[data-i18n]").forEach((node) => {
    const fn = I18N_PATHS[node.dataset.i18n];
    if (fn) node.textContent = fn();
  });

  const banner = $("#banner");
  if (banner) {
    banner.replaceChildren(
      el("span", {}, el("span", { className: "banner__dot", "aria-hidden": "true" }),
                     t(C.meta.available)),
      el("span", { textContent: `${t(C.meta.located)} \u00b7 ${t(C.meta.role)}` }));
  }
  $("#colophon").textContent =
    attune.get("lang") === "nl"
      ? "Met de hand gebouwd in HTML, CSS en JavaScript, zonder build-stap. DM Sans, DM Mono, Fraunces en Atkinson Hyperlegible. Twee volledig ontworpen modi, geen van beide een excuus."
      : "Hand-built in HTML, CSS and JavaScript, no build step. DM Sans, DM Mono, Fraunces and Atkinson Hyperlegible. Two fully designed modes, neither one an apology.";
}

/* =========================================================================
   THE LIVE GROUND — loaded only if it will actually be used, so a calm-mode
   visitor never downloads a three-dimensional library to look at a page
   they asked to hold still.
   ========================================================================= */
let field = null;
async function syncField() {
  const wantsField = attune.get("mode") === "full";
  if (wantsField && !field) {
    const { PresenceField } = await import("./gl/field.js");
    field = new PresenceField(document.getElementById("field"));
    await field.start();
  } else if (!wantsField && field) {
    field.destroy();
    field = null;
  }
}

/* =========================================================================
   BOOT
   ========================================================================= */
let router;

renderStatic();
renderAttune();
syncField();

router = new Router({
  ids: ROUTE_IDS,
  fallback: "home",
  render: renderRoute,
  announce: (message) => attune.say(message),
  transition: makeTransition({ announce: (m) => attune.say(m), t }),
});

/* Tabs are painted before the first resolve so the active mark is correct
   on the very first frame, not one frame late. */
router.addEventListener("navigate", renderTabs);
renderTabs();
router.start();

attune.addEventListener("change", (e) => {
  const { changed } = e.detail;
  if (changed === "lang") { renderStatic(); renderAttune(); renderTabs(); renderRoute(router.current); }
  else if (changed === "audience") renderTabs();
  else if (changed === "mode") { syncField(); renderRoute(router.current); }
});

/* =========================================================================
   HOVER SPOTLIGHT
   One delegated listener for the whole document rather than two per card.
   It writes the pointer's position, as a percentage, into the card the
   pointer is actually inside; the gradient in hover.css does the rest.

   Skipped entirely when the visitor asked for stillness — there is nothing
   to track if nothing is going to move.
   ========================================================================= */
function armHoverSpotlight() {
  let active = null;

  addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;      // a finger has no hover
    const card = e.target.closest?.(".hoverable");

    if (card !== active) {
      active?.style.removeProperty("--mx");
      active?.style.removeProperty("--my");
      active = card;
    }
    if (!card) return;

    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  }, { passive: true });
}

/* Everything that reads as a container gets the shared treatment. Marked
   here rather than in each renderer so the list of what counts as a card
   lives in one place. */
const HOVERABLE = [
  ".ask__options button", ".outcomes > li", ".project",
  ".skills > div", ".findings > li", ".steps > li",
].join(", ");

function markHoverables(root = document) {
  root.querySelectorAll(HOVERABLE).forEach((n) => n.classList.add("hoverable"));
}

armHoverSpotlight();
markHoverables();
router.addEventListener("navigate", () => markHoverables());
