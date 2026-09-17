/* =========================================================================
   main.js — renders the site from content.js, wires the attune panel, and
   boots the live ground only when the visitor is in full mode.
   ========================================================================= */

import { attune, AXES } from "./attune.js";
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
   FLOW — order the sections for whoever is reading.
   ========================================================================= */
const DEFAULT_ORDER = ["work", "outcomes", "about", "process", "accessibility", "skills", "detail-index", "contact"];

function renderFlow() {
  const flow = $("#flow");
  const audience = C.audiences.find((a) => a.id === attune.get("audience"));
  const order = (audience?.order ?? DEFAULT_ORDER).filter((k) => k !== "intro");

  /* Anything the chosen order leaves out is appended rather than dropped.
     A reordering that quietly deletes content is not a reordering. */
  const full = [...order, ...DEFAULT_ORDER.filter((k) => !order.includes(k))];

  flow.replaceChildren(...full.map((key) => SECTIONS[key]?.()).filter(Boolean));
  armArrivals(flow);
}

/* =========================================================================
   ARRIVALS — full mode only, and only for people who did not ask for
   stillness. Elements start visible in the markup and are hidden here, so
   a JS failure leaves a complete, readable page rather than a blank one.
   ========================================================================= */
let arrivalObserver;
function armArrivals(root) {
  arrivalObserver?.disconnect();
  if (attune.get("mode") !== "full") {
    $$("[data-arrive]", root).forEach((n) => n.removeAttribute("data-arrive"));
    return;
  }
  const targets = $$(".section, .project", root);
  targets.forEach((n) => (n.dataset.arrive = ""));

  arrivalObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      entry.target.style.setProperty("--arrive-delay", `${Math.min(i, 4) * 70}ms`);
      entry.target.dataset.arrive = "in";
      obs.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px" });

  targets.forEach((n) => arrivalObserver.observe(n));
}

/* =========================================================================
   THE OPENING QUESTION
   ========================================================================= */
function renderAsk() {
  const ask = $("#ask");
  const list = $("#ask-options");
  list.replaceChildren(...C.audiences.map((a) => {
    const btn = el("button", { type: "button" },
      el("strong", { textContent: t(a.label) }),
      el("span", { textContent: t(a.detail) }));
    btn.addEventListener("click", () => {
      attune.set("audience", a.id);
      $("#flow").scrollIntoView({ behavior: attune.get("mode") === "calm" ? "auto" : "smooth" });
    });
    return el("li", {}, btn);
  }));
  ask.hidden = false;   // only shown once JS can make it work
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

  /* The headline gets one lime full stop — the entire brand mark, and the
     only place on the site where the accent is used purely as identity.
     Built from text nodes rather than innerHTML, so content.js can never
     become an injection surface. */
  const h1 = $("#intro-h");
  if (h1) {
    const line = t(C.intro.statement).replace(/\.$/, "");
    h1.replaceChildren(line, el("span", { className: "stop", textContent: "." }));
  }

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
function render() {
  renderStatic();
  renderAsk();
  renderFlow();
}

render();
renderAttune();
syncField();

attune.addEventListener("change", (e) => {
  const { changed } = e.detail;
  if (changed === "lang") { render(); renderAttune(); }
  else if (changed === "audience") renderFlow();
  else if (changed === "mode") { armArrivals(document); syncField(); }
});
