/* =========================================================================
   main.js — renders the site from content.js, wires the attune panel, and
   boots the live ground only when the visitor is in full mode.
   ========================================================================= */

import { attune, AXES } from "./attune.js";
import { Router } from "./router.js";
import { makeTransition } from "./transitions.js";
import { Cat, PawTrail } from "./cat.js";
import { CursorBadge } from "./cursor.js";
import { VisionLab as LabVision, ratio as labRatio, hexToRgb as labHex } from "./lab.js";
import { runAudit } from "./audit.js";
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
  /* SELECTED WORK, AS TYPE.
     The four projects set large, each line taking its own case colour, with
     the cover riding the pointer beside it. It replaced a row of business
     metrics — 13 cities, EUR 150K — which were the product's numbers rather
     than hers, and which asked a visitor to be impressed before they had
     seen anything. A list of the actual work asks them to look instead, and
     it gives the home page somewhere to lead.

     The preview is decoration: every row is a complete link, and deleting
     the image would lose nothing but the pleasure. */
  index: () => {
    const preview = el("figure", { className: "index__preview" });
    preview.setAttribute("aria-hidden", "true");
    const img = el("img", { alt: "", decoding: "async" });
    preview.append(img);

    const rows = C.projects.map((p, i) => {
      const row = el("li", {},
        el("a", { href: `#/work/${p.slug}`, className: "index__row" },
          el("span", { className: "index__n", textContent: String(i + 1).padStart(2, "0") }),
          el("span", { className: "index__name", textContent: t(p.title) }),
          el("span", { className: "index__meta", textContent: t(p.discipline) }),
          el("span", { className: "index__year", textContent: p.year })));
      row.style.setProperty("--case", p.colour);
      row.style.setProperty("--case-ink", p.ink);
      const link = row.querySelector("a");
      link.dataset.cursor = t(C.ui.cursorRead);
      link.addEventListener("pointerenter", () => {
        if (prefersStill()) return;
        img.src = p.cover.src;
        preview.dataset.on = "true";
      });
      link.addEventListener("pointerleave", () => { preview.dataset.on = "false"; });
      return row;
    });

    /* One delegated tracker rather than a listener per row, eased so the
       cover trails the hand the way the cursor badge does — the same
       object-with-weight language, so the two do not feel like two systems. */
    let at = { x: 0, y: 0 }, target = { x: 0, y: 0 }, raf = 0;
    const tick = () => {
      at.x += (target.x - at.x) * 0.14;
      at.y += (target.y - at.y) * 0.14;
      preview.style.transform = `translate3d(${at.x}px, ${at.y}px, 0) translate(-50%, -50%)`;
      raf = preview.dataset.on === "true" ? requestAnimationFrame(tick) : 0;
    };
    const list = el("ul", { className: "index" }, rows);
    list.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      target.x = e.clientX; target.y = e.clientY;
      if (!raf && preview.dataset.on === "true") {
        at = { ...target };
        raf = requestAnimationFrame(tick);
      }
    }, { passive: true });

    return section("index", list, preview);
  },

  work: () => section("work",
    el("ul", { className: "work-index" }, C.projects.map(caseCard))),

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
                          textContent: C.accessibility.source.label })),
    auditBlock()),

  /* The footnotes, promoted to a chapter: every annotation on the site as
     one document, for the visitor who wants decisions without pictures. */
  "detail-index": () => section("detail-index",
    el("div", { className: "detail-index" },
      C.projects.flatMap((proj) => proj.details.map((d) =>
        el("div", { className: "detail-index__row" },
          el("span", { className: "detail-index__key",
                       textContent: `${t(C.ui.detailKinds[d.kind]) || d.kind}${d.value ? " · " + d.value : ""}` }),
          el("div", {},
            el("p", { textContent: t(d.note) }),
            el("p", { style: "color:var(--text-faint)", textContent: t(proj.title) }))))))),

  /* THE LAB — instruments, each one operating on this page. */
  lab: () => {
    const wrap = section("lab", el("p", { className: "intro__sub", textContent: t(C.lab.lead) }));
    const list = el("ul", { className: "lab" });

    const builders = { vision: buildVision, contrast: buildContrast,
                       halftone: buildHalftone, type: buildType,
                       easing: buildEasing, focus: buildFocus };

    const cards = C.lab.experiments.map((exp) => {
      const body = el("div", { className: "lab__body" });
      const card = el("li", {},
        el("article", { className: "lab__card hoverable" },
          el("p", { className: "lab__meta" },
            el("span", { className: "lab__n", textContent: exp.n }),
            el("span", { textContent: t(exp.title) }),
            el("span", { className: "lab__topic",
                         textContent: t(C.lab.topics.find((x) => x.id === exp.topic)?.label) })),
          el("p", { className: "lab__note", textContent: t(exp.note) }),
          body));
      card.dataset.topic = exp.topic;
      if (exp.span) card.dataset.span = exp.span;
      builders[exp.id]?.(body);
      return card;
    });

    /* A filter rather than a longer list. Five instruments across five
       disciplines is a shelf; the same five with a way to say "just the type
       one" is a lab. Buttons, not a <select>, because the options are the
       navigation — hiding five words behind a dropdown to save a row is a
       trade nobody asked for. */
    const chips = C.lab.topics.map((topic) => {
      const b = el("button", { type: "button", className: "lab__chip",
                               textContent: t(topic.label) });
      b.dataset.filter = topic.id;
      b.setAttribute("aria-pressed", String(topic.id === "all"));
      b.addEventListener("click", () => {
        chips.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
        let shown = 0;
        cards.forEach((c) => {
          const on = topic.id === "all" || c.dataset.topic === topic.id;
          c.hidden = !on;
          if (on) shown++;
        });
        /* Said out loud, because filtering a list a screen reader cannot see
           change is the same as doing nothing. */
        attune.say(`${t(C.lab.ui.showing)}: ${t(topic.label)} — ${shown}`);
      });
      return b;
    });

    const bar = el("div", { className: "lab__filter" },
      el("span", { className: "lab__filter-label", textContent: t(C.lab.ui.filter) }),
      el("div", { className: "lab__choices" }, chips));
    bar.querySelector(".lab__choices").setAttribute("role", "group");
    bar.querySelector(".lab__choices").setAttribute("aria-label", t(C.lab.ui.filter));

    list.append(...cards);
    wrap.append(bar, list);
    return wrap;
  },

  /* THE CV.
     Built from the same content as the rest of the site, so a case study and
     the CV can never disagree, and printed by the browser rather than
     shipped as a file — a PDF in the repo goes stale the first time a fact
     changes, and hers was already a Download button pointing at href="#".

     window.print() on a page with a print stylesheet gives a real, selectable,
     accessible PDF through "Save as PDF" — searchable text rather than a
     picture of text, which is what a PDF generated from a canvas would be. */
  cv: () => {
    const wrap = section("cv",
      el("p", { className: "cv__hint" },
        el("button", { type: "button", className: "cv__print",
                       textContent: t(C.ui.cvDownload) }),
        el("span", { className: "cv__hint-text", textContent: t(C.ui.cvHint) })));

    const sheet = el("article", { className: "cv" });

    sheet.append(
      el("header", { className: "cv__head" },
        el("h3", { className: "cv__name", textContent: C.meta.name }),
        el("p", { className: "cv__role", textContent: `${t(C.meta.role)} — ${t(C.meta.located)}` }),
        el("p", { className: "cv__contacts" },
          el("a", { href: `mailto:${C.meta.email}`, textContent: C.meta.email }),
          el("span", { textContent: " · " }),
          el("a", { href: `tel:${C.meta.phone.replace(/\s/g, "")}`, textContent: C.meta.phone }),
          ...C.meta.links.flatMap((l) => [
            el("span", { textContent: " · " }),
            el("a", { href: l.href, textContent: l.label }),
          ]))),
      cvBlock(C.cv.sectionLabels.profile,
        el("p", { textContent: t(C.cv.summary) })),
    );

    /* Experience. An entry that names a project is read back out of it, so a
       case study and the CV cannot drift apart; an entry without one carries
       its own copy, because two of her roles have no case here and leaving
       them off would make the CV the incomplete document, not the site. */
    const jobs = C.cv.experience.map((e) => {
      const p = e.from ? C.projects.find((x) => x.slug === e.from) : null;
      return {
        year:       e.year       ?? p?.year,
        role:       e.role       ?? p?.role,
        title:      e.title      ?? p?.title,
        company:    e.company    ?? p?.company,
        discipline: e.discipline ?? p?.discipline,
        note:       e.note       ?? p?.sections?.result ?? p?.summary,
      };
    }).filter((j) => j.title);

    sheet.append(cvBlock(C.cv.sectionLabels.experience,
      el("ul", { className: "cv__list" }, jobs.map((j) =>
        el("li", {},
          el("p", { className: "cv__row" },
            el("span", { className: "cv__what", textContent: `${t(j.role)}, ${t(j.title)}` }),
            el("span", { className: "cv__when", textContent: t(j.year) })),
          el("p", { className: "cv__where", textContent: cvWhere(j) }),
          el("p", { className: "cv__note", textContent: t(j.note) }))))));

    sheet.append(cvBlock(C.cv.sectionLabels.education,
      el("ul", { className: "cv__list" }, C.cv.education.map((e) =>
        el("li", {},
          el("p", { className: "cv__row" },
            el("span", { className: "cv__what", textContent: t(e.what) }),
            el("span", { className: "cv__when", textContent: t(e.period) })),
          el("p", { className: "cv__where", textContent: t(e.where) }))))));

    sheet.append(cvBlock(C.cv.sectionLabels.skills,
      el("ul", { className: "cv__skills" }, C.skills.columns.map((col) =>
        el("li", {},
          el("span", { className: "cv__what", textContent: t(col.title) }),
          el("span", { className: "cv__note",
                       textContent: col.items.map((i) => t(i)).join(" · ") }))))));

    sheet.append(cvBlock(C.cv.sectionLabels.languages,
      el("ul", { className: "cv__skills cv__inline" }, C.cv.languages.map((l) =>
        el("li", {},
          el("span", { className: "cv__what", textContent: t(l.name) }),
          el("span", { className: "cv__note", textContent: t(l.level) }))))));

    wrap.append(sheet);
    wrap.querySelector(".cv__print").addEventListener("click", () => window.print());
    return wrap;
  },

  contact: () => section("contact",
    el("p", {}, el("a", { className: "contact__big",
                          href: `mailto:${C.meta.email}`, textContent: C.meta.email })),
    el("dl", { className: "contact__grid" },
      el("dt", { textContent: t(C.ui.contact.email) }),
      el("dd", {}, el("a", { href: `mailto:${C.meta.email}`, textContent: C.meta.email })),
      el("dt", { textContent: t(C.ui.contact.phone) }),
      el("dd", {}, el("a", { href: `tel:${C.meta.phone.replace(/\s/g, "")}`,
                             textContent: C.meta.phone })),
      el("dt", { textContent: t(C.ui.contact.located) }),
      el("dd", { textContent: t(C.meta.located) }),
      el("dt", { textContent: t(C.ui.contact.elsewhere) }),
      el("dd", {}, C.meta.links.map((l, i) =>
        el("span", {}, i ? " · " : "", el("a", { href: l.href, textContent: l.label + " \u2197" })))))),
};

function section(id, ...children) {
  return el("section", { className: "section rail", id },
    el("h2", { className: "section__label", textContent: t(C.ui.sections[id]) }),
    ...children);
}

/* ONE CARD PER PROJECT.
   The whole card is not wrapped in a link. A link containing a cover image,
   four metadata fields, a heading and a summary is announced as one enormous
   run-on link, and it takes the heading out of the page's outline. Instead
   the heading holds the only real link and a pseudo-element stretches its
   hit area over the card — so a pointer gets the whole card, a screen reader
   gets "VeloTech.AI, link", and the headings still form a list you can
   navigate by. */
function caseCard(p) {
  const article = el("article", { className: "case-card hoverable" });
  article.style.setProperty("--case", p.colour);
  article.style.setProperty("--case-ink", p.ink);
  /* Summons the cursor badge. The word is the promise the card is making. */
  article.dataset.cursor = t(C.ui.cursorRead);

  const link = el("a", { href: `#/work/${p.slug}`, className: "case-card__link" },
    t(p.title));
  /* The pointer-target overlay is decoration; the link is the control. */
  link.addEventListener("click", () => markSharedCover(article));

  const cover = el("figure", { className: "case-card__cover", style: "margin:0" },
    el("img", { src: p.cover.src, alt: t(p.cover.alt), loading: "lazy", decoding: "async" }));
  /* A portrait phone capture must not be cropped to a landscape thumbnail:
     it gets contained on a tinted ground instead of filling the frame. */
  if (p.coverDevice === "phone") cover.dataset.device = "phone";
  if (p.format) cover.append(el("span", { className: "case-card__format", textContent: t(p.format) }));

  article.append(
    cover,
    el("div", { className: "case-card__body" },
      el("p", { className: "project__meta" },
        el("span", { textContent: p.year }),
        el("span", { textContent: t(p.discipline) })),
      el("h3", {}, link),
      el("p", { className: "project__summary", textContent: t(p.summary) }),
      el("p", { className: "case-card__cue", textContent: t(C.ui.viewCase) })));

  return el("li", {}, article);
}

/* The clicked cover and the case page's hero share a view-transition-name,
   so the browser morphs one into the other rather than crossfading two
   unrelated pictures. The name must be unique in a snapshot, so it is put
   on exactly one element and taken off as soon as the transition is over. */
function markSharedCover(scope) {
  document.querySelectorAll("[style*='view-transition-name']")
    .forEach((n) => n.style.removeProperty("view-transition-name"));
  const cover = scope.querySelector(".case-card__cover, .case__cover");
  if (cover) cover.style.viewTransitionName = "case-cover";
}

/* The full case. */
function caseDetail(slug) {
  const p = C.projects.find((x) => x.slug === slug);
  if (!p) return SECTIONS.work();

  const wrap = el("section", { className: "case rail", id: "case" });
  wrap.style.setProperty("--case", p.colour);
  wrap.style.setProperty("--case-ink", p.ink);

  const index = C.projects.indexOf(p);
  const next = C.projects[(index + 1) % C.projects.length];

  const cover = el("figure", { className: "case__cover", style: "margin:0" },
    el("img", { src: p.cover.src, alt: t(p.cover.alt), decoding: "async" }));
  if (p.coverDevice === "phone") cover.dataset.device = "phone";
  cover.style.viewTransitionName = "case-cover";

  wrap.append(
    el("p", { className: "case__back" },
      el("a", { href: "#/work", textContent: `\u2190 ${t(C.ui.sections.work)}` })),
    el("h2", { className: "case__title", textContent: t(p.title) }),
    p.format ? el("p", { className: "case__format" },
      el("span", { className: "case-card__format", textContent: t(p.format) })) : null,
    el("dl", { className: "case__facts" },
      fact(C.ui.caseFacts.year, p.year),
      fact(C.ui.caseFacts.role, t(p.role)),
      fact(C.ui.caseFacts.company, t(p.company)),
      fact(C.ui.caseFacts.type, t(p.discipline))),
    cover,
    el("p", { className: "case__lead", textContent: t(p.summary) }),
    el("div", { className: "case__sections" },
      ["role", "process", "solution", "result"].map((key) => {
        const copy = p.sections?.[key];
        if (!copy) return null;
        const block = el("div", { className: "case__section" },
          el("h3", { textContent: t(C.ui.caseLabels[key]) }),
          el("p", { textContent: t(copy) }));
        block.dataset.key = key;
        return block;
      })),
    ...p.details.flatMap((d) => detailPair(d, p.slug)),
  );

  /* Phone captures and desktop captures are different objects and want
     different furniture. A 390x844 screenshot dropped into a grid built for
     1440x900 dashboards either gets cropped to nonsense or stretches a
     column to the height of a phone. So they are split by what they
     actually are — measured from the source images, not guessed — and the
     phones go in a rail you scroll sideways, at phone size, side by side,
     which is also how you would hold them. */
  const phones = (p.shots || []).filter((sh) => sh.device === "phone");
  const screens = (p.shots || []).filter((sh) => sh.device !== "phone");

  if (phones.length) wrap.append(deviceRail(phones, p.slug));

  if (screens.length) {
    wrap.append(el("ul", { className: "shots" }, screens.map((sh) => {
      const li = el("li", {},
        el("img", { src: sh.src, alt: t(sh.alt), loading: "lazy", decoding: "async" }));
      li.dataset.span = sh.span || "half";
      return li;
    })));
  }

  wrap.append(
    el("nav", { className: "case__next" },
      el("a", { href: `#/work/${next.slug}` },
        el("span", { className: "case__next-label", textContent: t(C.ui.nextCase) }),
        el("span", { className: "case__next-name", textContent: t(next.title) }))));

  return wrap;
}

/* A horizontal rail of phone screens.

   Native scrolling with scroll-snap does the work — a JS carousel that
   hijacks the wheel and swallows touch is a worse version of what the
   browser already does well. The arrows are added on top for people who
   cannot swipe and for anyone who would not guess the rail scrolls.

   The rail is a labelled region with tabindex 0, because a scrollable box
   that cannot be focused cannot be scrolled by keyboard at all. */
function deviceRail(shots, slug) {
  const railId = `screens-${slug}`;
  const list = el("ul", { className: "screens__track", id: railId },
    shots.map((sh) =>
      el("li", { className: "screens__item" },
        el("img", { src: sh.src, alt: t(sh.alt), loading: "lazy", decoding: "async" }))));

  const region = el("div", { className: "screens__scroll" }, list);
  region.tabIndex = 0;
  region.setAttribute("role", "region");
  region.setAttribute("aria-label", `${t(C.ui.screens)} — ${t(C.ui.railHint)}`);

  const step = (dir) => {
    const first = list.querySelector(".screens__item");
    const by = first ? first.getBoundingClientRect().width + 16 : region.clientWidth * 0.8;
    region.scrollBy({ left: dir * by, behavior: prefersStill() ? "auto" : "smooth" });
  };

  const arrow = (dir, label, glyph) => {
    const b = el("button", { type: "button", className: "screens__arrow", textContent: glyph });
    b.setAttribute("aria-label", label);
    b.setAttribute("aria-controls", railId);
    b.addEventListener("click", () => step(dir));
    return b;
  };

  const head = el("div", { className: "screens__head" },
    el("p", { className: "screens__label" },
      el("span", { className: "screens__chip", textContent: t(C.ui.screens) }),
      el("span", { className: "screens__count", textContent: `01 / ${String(shots.length).padStart(2, "0")}` })),
    el("div", { className: "screens__arrows" },
      arrow(-1, t(C.ui.prevShot), "\u2190"),
      arrow(1, t(C.ui.nextShot), "\u2192")));

  /* Arrows only exist while there is somewhere to go. At a desktop width all
     four phones fit side by side, so the rail does not scroll and a pair of
     arrows that move nothing is a control lying about what it does. The
     counter goes with them, since "01 / 04" is meaningless when all four are
     on screen at once. */
  const syncAffordance = () => {
    const scrollable = region.scrollWidth > region.clientWidth + 2;
    head.querySelector(".screens__arrows").hidden = !scrollable;
    head.querySelector(".screens__count").hidden = !scrollable;
    /* Nothing to scroll means nothing to focus, and a focus stop that does
       nothing is a keyboard user's dead end. */
    region.tabIndex = scrollable ? 0 : -1;
    region.dataset.scrollable = String(scrollable);
  };
  addEventListener("resize", syncAffordance, { passive: true });
  /* Images arrive after layout, so measure once they have. */
  requestAnimationFrame(syncAffordance);
  list.querySelectorAll("img").forEach((img) =>
    img.addEventListener("load", syncAffordance, { once: true }));

  /* The counter follows the rail rather than a click count, so dragging,
     swiping and arrow-pressing all report the same position. */
  const counter = head.querySelector(".screens__count");
  region.addEventListener("scroll", () => {
    const first = list.querySelector(".screens__item");
    if (!first) return;
    const by = first.getBoundingClientRect().width + 16;
    const i = Math.min(shots.length, Math.round(region.scrollLeft / by) + 1);
    counter.textContent = `${String(i).padStart(2, "0")} / ${String(shots.length).padStart(2, "0")}`;
  }, { passive: true });

  return el("div", { className: "screens" }, head, region);
}

function prefersStill() {
  return document.documentElement.dataset.mode === "calm" ||
         matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* THE PAGE, MEASURED.
   Runs against the live DOM after the route has settled, and again whenever
   an Attune axis changes — so turning on high contrast visibly moves the
   numbers, which is the argument the whole adaptation system is making. */
function auditBlock() {
  const wrap = el("div", { className: "audit" });
  const head = el("div", { className: "audit__head" },
    el("h3", { className: "audit__title", textContent: t(C.accessibility.audit.title) }),
    el("p", { className: "audit__score" }));
  const list = el("ul", { className: "audit__list" });
  const button = el("button", { type: "button", className: "lab__chip",
                                textContent: t(C.accessibility.audit.rerun) });

  const paint = () => {
    const { checks, passed, total } = runAudit();
    head.querySelector(".audit__score").textContent =
      `${passed} / ${total} ${t(C.accessibility.audit.score)}`;
    head.querySelector(".audit__score").dataset.level = passed === total ? "pass" : "fail";

    list.replaceChildren(...checks.map((c) => {
      const li = el("li", {},
        el("span", { className: "audit__label",
                     textContent: t(C.accessibility.audit.labels[c.id]) }),
        el("span", { className: "audit__detail", textContent: c.detail }),
        el("span", { className: "audit__verdict",
                     textContent: c.pass ? t(C.accessibility.audit.pass)
                                         : `${c.fails} ${t(C.accessibility.audit.fail)}` }));
      li.dataset.level = c.pass ? "pass" : "fail";
      return li;
    }));
  };

  button.addEventListener("click", () => {
    paint();
    attune.say(head.querySelector(".audit__score").textContent);
  });

  wrap.append(head,
    el("p", { className: "audit__lead", textContent: t(C.accessibility.audit.lead) }),
    list, button,
    el("p", { className: "audit__caveat", textContent: t(C.accessibility.audit.caveat) }));

  /* Measured after layout has settled, or the bounding boxes it reads are
     from a page that has not finished arriving. */
  requestAnimationFrame(() => requestAnimationFrame(paint));
  auditRepaint = paint;
  return wrap;
}

/* ---- LAB 06 · the keyboard route ---------------------------------------
   The tab order is inherited from the markup and is the only route a
   keyboard user has. Drawing it shows whether the reading order and the
   operating order are the same thing. */
function buildFocus(host) {
  let overlay = null;
  const button = el("button", { type: "button", className: "lab__chip",
                                textContent: t(C.lab.ui.showPath) });
  const count = el("span", { className: "lab__readout" });

  const draw = () => {
    const stops = [...document.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')]
      .filter((el) => {
        const s = getComputedStyle(el);
        if (s.display === "none" || s.visibility === "hidden") return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight * 3;
      });

    const ns = "http://www.w3.org/2000/svg";
    overlay = document.createElementNS(ns, "svg");
    overlay.setAttribute("class", "focus-path");
    overlay.setAttribute("aria-hidden", "true");
    overlay.setAttribute("width", "100%");
    overlay.setAttribute("height", "100%");

    const pts = stops.map((el) => {
      const r = el.getBoundingClientRect();
      return [r.left + r.width / 2 + scrollX, r.top + r.height / 2 + scrollY];
    });

    if (pts.length > 1) {
      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" "));
      path.setAttribute("class", "focus-path__line");
      overlay.append(path);
    }
    pts.forEach(([x, y], i) => {
      const g = document.createElementNS(ns, "g");
      g.setAttribute("transform", `translate(${x} ${y})`);
      const c = document.createElementNS(ns, "circle");
      c.setAttribute("r", "11");
      c.setAttribute("class", "focus-path__dot");
      const tx = document.createElementNS(ns, "text");
      tx.setAttribute("class", "focus-path__n");
      tx.setAttribute("text-anchor", "middle");
      tx.setAttribute("dy", "3.5");
      tx.textContent = String(i + 1);
      g.append(c, tx);
      overlay.append(g);
    });

    document.body.append(overlay);
    count.textContent = `${pts.length} ${t(C.lab.ui.stops)}`;
    button.textContent = t(C.lab.ui.hidePath);
    button.setAttribute("aria-pressed", "true");
  };

  const clear = () => {
    overlay?.remove(); overlay = null;
    button.textContent = t(C.lab.ui.showPath);
    button.setAttribute("aria-pressed", "false");
    count.textContent = "";
  };

  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => (overlay ? clear() : draw()));
  focusPathClear = clear;
  host.append(el("div", { className: "lab__row" }, button, count));
}

/* ---- LAB 01 · vision ----------------------------------------------------
   The simulations run on the whole document, so the controls have to stay
   legible while everything around them degrades — and there must always be
   one obvious way back to normal. */
function buildVision(host) {
  const group = el("div", { className: "lab__choices" });
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", t(C.lab.experiments[0].title));

  const buttons = C.lab.vision.map((v) => {
    const b = el("button", { type: "button", className: "lab__chip", textContent: t(v.label) });
    b.dataset.vision = v.id;
    b.setAttribute("aria-pressed", String(v.id === "none"));
    b.addEventListener("click", () => {
      visionLab ??= new LabVision({ announce: (m) => attune.say(m), t, strings: C.lab });
      visionLab.apply(v.id);
      buttons.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
    });
    return b;
  });
  group.append(...buttons);
  host.append(group);
}

/* ---- LAB 02 · contrast --------------------------------------------------
   Opens on red over yellow: the pairing that failed her first audit, and
   the reason the whole site is measured rather than eyeballed. */
function buildContrast(host) {
  const state = { fg: "#e8402a", bg: "#f2e14a" };

  const swatch = el("p", { className: "lab__swatch" },
    el("span", { textContent: t(C.lab.ui.sample) }));
  const verdict = el("p", { className: "lab__verdict" });

  const field = (key, label) => {
    const id = `lab-${key}`;
    const input = el("input", { type: "color", id, value: state[key] });
    input.addEventListener("input", () => { state[key] = input.value; paint(); });
    return el("label", { className: "lab__field", htmlFor: id },
      el("span", { textContent: t(label) }), input);
  };

  const paint = () => {
    swatch.style.background = state.bg;
    swatch.style.color = state.fg;
    const r = labRatio(labHex(state.fg), labHex(state.bg));
    const pass = r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "Large only" : "Fail";
    verdict.textContent = `${t(C.lab.ui.ratio)} ${r.toFixed(2)} : 1 — ${pass}`;
    verdict.dataset.level = pass === "Fail" ? "fail" : pass === "Large only" ? "warn" : "pass";
  };

  host.append(el("div", { className: "lab__row" },
    field("fg", C.lab.ui.fg), field("bg", C.lab.ui.bg)), swatch, verdict);
  paint();
}

/* ---- LAB 03 · halftone --------------------------------------------------
   The same screen the print mode uses, with its angles exposed so you can
   break the 60° rule on purpose and watch moire appear. */
function buildHalftone(host) {
  const state = { angleA: 15, angleB: 75, pitch: 6 };
  const canvas = el("canvas", { className: "lab__canvas" });
  canvas.setAttribute("aria-hidden", "true");
  const warn = el("p", { className: "lab__verdict", hidden: true });
  warn.dataset.level = "warn";

  const draw = async () => {
    const cs = getComputedStyle(document.documentElement);
    const ink = cs.getPropertyValue("--text").trim() || "#faf8f5";
    const acc = cs.getPropertyValue("--accent-text").trim() || "#c8e65a";
    const { renderScreen, isMoire } = await import("./lab.js");
    await renderScreen(canvas, { ...state, inkA: ink, inkB: acc });
    warn.hidden = !isMoire(state.angleA, state.angleB);
    warn.textContent = t(C.lab.ui.moire);
  };

  const slider = (key, label, min, max) => {
    const id = `lab-${key}`;
    const out = el("output", { htmlFor: id, textContent: String(state[key]) });
    const input = el("input", { type: "range", id, min, max, value: state[key] });
    input.addEventListener("input", () => {
      state[key] = +input.value; out.textContent = input.value; draw();
    });
    return el("label", { className: "lab__field", htmlFor: id },
      el("span", {}, t(label), " ", out), input);
  };

  host.append(el("div", { className: "lab__row" },
    slider("angleA", C.lab.ui.angleA, 0, 90),
    slider("angleB", C.lab.ui.angleB, 0, 90),
    slider("pitch", C.lab.ui.pitch, 3, 14)), canvas, warn);
  requestAnimationFrame(draw);
}

/* ---- LAB 04 · variable type --------------------------------------------
   Fraunces is already used on two settings by this site — print and screen.
   Here the axes are handed over, so the visitor can find the settings
   themselves and see that one file is several typefaces. */
function buildType(host) {
  const state = { opsz: 120, SOFT: 40, WONK: 1, wght: 400 };

  const specimen = el("p", { className: "lab__specimen", textContent: t(C.lab.ui.specimen) });
  const readout = el("p", { className: "lab__readout" });

  const paint = () => {
    specimen.style.fontVariationSettings =
      `"opsz" ${state.opsz}, "SOFT" ${state.SOFT}, "WONK" ${state.WONK}, "wght" ${state.wght}`;
    readout.textContent = `opsz ${state.opsz} · SOFT ${state.SOFT} · WONK ${state.WONK} · wght ${state.wght}`;
  };

  const slider = (key, label, min, max, step = 1) => {
    const id = `lab-type-${key}`;
    const input = el("input", { type: "range", id, min, max, step, value: state[key] });
    input.addEventListener("input", () => { state[key] = +input.value; paint(); });
    return el("label", { className: "lab__field", htmlFor: id },
      el("span", { textContent: t(label) }), input);
  };

  host.append(specimen,
    el("div", { className: "lab__row" },
      slider("opsz", C.lab.ui.optical, 9, 144),
      slider("SOFT", C.lab.ui.soft, 0, 100),
      slider("WONK", C.lab.ui.wonk, 0, 1),
      slider("wght", C.lab.ui.weight, 300, 600)),
    readout);
  paint();
}

/* ---- LAB 05 · easing ----------------------------------------------------
   The site's own curves, drawn and run side by side, with linear as the
   control that always looks wrong. */
function buildEasing(host) {
  const CURVES = [
    { name: "ease-out",  css: "cubic-bezier(0.16, 1, 0.3, 1)",    p: [0.16, 1, 0.3, 1] },
    { name: "ease-soft", css: "cubic-bezier(0.34, 0.6, 0.24, 1)", p: [0.34, 0.6, 0.24, 1] },
    { name: "ease-in",   css: "cubic-bezier(0.7, 0, 0.84, 0)",    p: [0.7, 0, 0.84, 0] },
    { name: "linear",    css: "linear",                            p: [0, 0, 1, 1] },
  ];

  const rows = CURVES.map((c) => {
    const dot = el("span", { className: "lab__dot" });
    const track = el("span", { className: "lab__track" }, dot);
    return { c, dot, row: el("li", {},
      el("span", { className: "lab__curve-name", textContent: c.name },
        curveSvg(c.p)),
      track) };
  });

  const play = () => {
    rows.forEach(({ c, dot }) => {
      dot.getAnimations().forEach((a) => a.cancel());
      dot.animate([{ transform: "translateX(0)" },
                   { transform: "translateX(calc(100% * 9))" }],
                  { duration: 1100, easing: c.css, fill: "forwards" });
    });
  };

  const button = el("button", { type: "button", className: "lab__chip",
                                textContent: t(C.lab.ui.replay) });
  button.addEventListener("click", play);

  host.append(el("ul", { className: "lab__curves" }, rows.map((r) => r.row)), button);

  /* Runs once on arrival — but only for someone who has not asked for
     stillness, for whom the drawn curves alone carry the comparison. */
  if (!prefersStill()) requestAnimationFrame(play);
}

/* The curve itself, drawn. Half the point of an easing is its shape. */
function curveSvg([x1, y1, x2, y2]) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("class", "lab__curve");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d",
    `M0 100 C ${x1 * 100} ${100 - y1 * 100}, ${x2 * 100} ${100 - y2 * 100}, 100 0`);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "4");
  svg.append(path);
  return svg;
}

/* "Product Designer, VeloTech.AI" followed by "VeloTech.AI · Freelance" says
   the client's name twice in two lines. The project records it that way because
   a case study is read on its own, where the company line is the only place the
   client appears; on the CV the name is already in the row above, so the second
   one is dropped and what is left is the shape of the engagement. */
function cvWhere(j) {
  const name = t(j.title);
  let where = t(j.company);
  if (where.startsWith(name)) where = where.slice(name.length).replace(/^\s*[·,-]\s*/, "");
  return [where, t(j.discipline)].filter(Boolean).join(" · ");
}

function cvBlock(label, ...children) {
  return el("section", { className: "cv__block" },
    el("h4", { className: "cv__label", textContent: t(label) }),
    el("div", {}, ...children));
}

function fact(label, value) {
  return el("div", {},
    el("dt", { textContent: t(label) }),
    el("dd", { textContent: value }));
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

  const kind = t(C.ui.detailKinds[d.kind]) || d.kind;
  const note = el("dl", { className: "detail-note", id, hidden: true },
    el("dt", { textContent: kind }),
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
  { id: "home",    label: { en: "Home",     nl: "Start" },   sections: ["intro", "index"] },
  { id: "work",    label: { en: "Work",     nl: "Werk" },    sections: ["work"] },
  { id: "about",   label: { en: "About",    nl: "Over" },    sections: ["about", "process"] },
  { id: "access",  label: { en: "Access",   nl: "Toegang" }, sections: ["accessibility", "detail-index"] },
  { id: "skills",  label: { en: "Skills",   nl: "Kunde" },   sections: ["skills"] },
  { id: "lab",     label: { en: "Lab",      nl: "Lab" },     sections: ["lab"] },
  { id: "cv",      label: { en: "CV",       nl: "CV" },      sections: ["cv"] },
  { id: "contact", label: { en: "Contact",  nl: "Contact" }, sections: ["contact"] },
];

/* Every case is a real route with a real address, so a single project can be
   sent to someone on its own. */
const CASE_IDS = C.projects.map((p) => `work/${p.slug}`);
const ROUTE_IDS = [...ROUTES.map((r) => r.id), ...CASE_IDS];

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

/* THE LANGUAGE TOGGLE, IN THE HEADER.
   It is also in the Attune panel, but that is the wrong and only home for
   it: the panel is where someone goes to adjust how the site behaves, and
   language is not a behaviour — for a bilingual city it is the first thing a
   reader decides, before they have any reason to open a settings panel. It
   was 818px down inside a drawer nobody had opened.

   Two buttons rather than a single toggle, because a toggle labelled "NL"
   never says whether it means "you are reading Dutch" or "switch to Dutch".
   Each carries its own lang attribute so a screen reader pronounces
   Nederlands in Dutch rather than reading it as English, and aria-pressed
   states which one you are actually in. */
function renderLang() {
  const root = document.getElementById("lang-root");
  if (!root) return;

  const group = el("div", { className: "lang" });
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", t(C.ui.langLabel));

  for (const [code, label] of [["en", "EN"], ["nl", "NL"]]) {
    const on = attune.get("lang") === code;
    const btn = el("button", { type: "button", textContent: label });
    btn.lang = code;
    btn.dataset.lang = code;
    btn.setAttribute("aria-pressed", String(on));
    btn.addEventListener("click", () => attune.set("lang", code));
    group.append(btn);
  }
  root.replaceChildren(group);
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
let visionLab = null;
let auditRepaint = null;
let focusPathClear = null;

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
  const view = document.getElementById("view");

  if (id.startsWith("work/")) {
    cat?.destroy(); cat = null;
    paws?.destroy(); paws = null;
    swarm?.destroy(); swarm = null;
    halftone?.destroy(); halftone = null;
    const slug = id.slice(5);
    const p = C.projects.find((x) => x.slug === slug);
    view.replaceChildren(caseDetail(slug));
    document.title = `${t(p?.title) || "Work"} — ${C.meta.name}, ${t(C.meta.role)}`;
    return;
  }

  const route = ROUTES.find((r) => r.id === id) ?? ROUTES[0];

  /* Tear the companion down before the markup it was rigged to is replaced,
     or its listeners keep running against elements that no longer exist. */
  cat?.destroy(); cat = null;
  paws?.destroy(); paws = null;
  swarm?.destroy(); swarm = null;
  halftone?.destroy(); halftone = null;
  /* A vision simulation that outlived its own page would leave the whole
     site blurred with no visible way to undo it. */
  visionLab?.destroy(); visionLab = null;
  /* An overlay drawn over a page that no longer exists is just litter. */
  focusPathClear?.(); focusPathClear = null;
  auditRepaint = null;

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

    axisGroup("theme", "themeLabel", [
      { value: "dark", label: t(C.ui.themeDark) },
      { value: "light", label: t(C.ui.themeLight) },
    ]),
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
      { value: "normal", label: t(C.ui.contrastWarm) },
      { value: "high", label: t(C.ui.contrastHigh) },
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

/* Announcements come from content, so they follow the chosen language. */
attune.describe = (axis, value) => t(C.ui.announce?.[axis]?.[value]) || null;

function renderStatic() {
  /* Chrome outside #view that is written in the markup rather than rendered,
     and therefore easy to forget when the language changes. */
  const skip = $(".skip");
  if (skip) skip.textContent = t(C.ui.skip);
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", t(C.ui.metaDescription));

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
renderLang();
router.start();

attune.addEventListener("change", (e) => {
  const { changed } = e.detail;
  /* The audit is only interesting if it responds: switch to high contrast
     and the contrast row has to move, or the claim is decoration. */
  if (auditRepaint) requestAnimationFrame(() => requestAnimationFrame(auditRepaint));
  if (changed === "lang") {
    renderStatic(); renderAttune(); renderTabs(); renderLang(); renderRoute(router.current);
  }
  else if (changed === "audience") renderTabs();
  else if (changed === "mode") { syncField(); renderRoute(router.current); }
  /* Anything painted into a canvas read its colour once, at the moment it
     was drawn, and cannot hear a CSS variable change. The field watches the
     attribute itself; the drawn cat and the halftone screen are redrawn by
     re-rendering the route. */
  else if (changed === "theme") renderRoute(router.current);
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
  let target = { x: 50, y: 50 };
  let at = { x: 50, y: 50 };
  let raf = 0;

  /* The spotlight EASES toward the pointer rather than being written
     straight to it. Writing the raw position made the light snap frame to
     frame and jitter on any small hand movement; a lerp gives it weight, so
     it trails slightly behind and settles. One rAF loop, running only while
     a card is actually under the pointer. */
  /* Easing IS animation. Someone who asked for stillness gets the light
     placed, not glided — the indicator still works, it just does not move
     on its own. */
  const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches ||
                      document.documentElement.dataset.mode === "calm";

  const tick = () => {
    const k = still() ? 1 : 0.16;
    at.x += (target.x - at.x) * k;
    at.y += (target.y - at.y) * k;
    if (active) {
      active.style.setProperty("--mx", `${at.x.toFixed(2)}%`);
      active.style.setProperty("--my", `${at.y.toFixed(2)}%`);
    }
    const settled = Math.abs(target.x - at.x) < 0.1 && Math.abs(target.y - at.y) < 0.1;
    raf = (active && !settled) ? requestAnimationFrame(tick) : 0;
  };

  addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;      // a finger has no hover
    const card = e.target.closest?.(".hoverable");

    if (card !== active) {
      active?.style.removeProperty("--mx");
      active?.style.removeProperty("--my");
      active = card;
      if (card) {
        /* Start the light at the edge the pointer came in through, so it
           travels across the card rather than fading up in the middle. */
        const r = card.getBoundingClientRect();
        at.x = ((e.clientX - r.left) / r.width) * 100;
        at.y = ((e.clientY - r.top) / r.height) * 100;
      }
    }
    if (!card) return;

    const r = card.getBoundingClientRect();
    target.x = ((e.clientX - r.left) / r.width) * 100;
    target.y = ((e.clientY - r.top) / r.height) * 100;
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });
}

/* Everything that reads as a container gets the shared treatment. Marked
   here rather than in each renderer so the list of what counts as a card
   lives in one place. */
const HOVERABLE = [
  ".ask__options button", ".project", ".case-card",
  ".skills > div", ".findings > li", ".steps > li",
].join(", ");

function markHoverables(root = document) {
  root.querySelectorAll(HOVERABLE).forEach((n) => n.classList.add("hoverable"));
}

armHoverSpotlight();
new CursorBadge().mount();
markHoverables();
router.addEventListener("navigate", () => markHoverables());
