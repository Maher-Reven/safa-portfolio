/* =========================================================================
   transitions.js — one choreography per page, each arguing that page's point.
   -------------------------------------------------------------------------
   A transition is not decoration between two screens. It is the last thing
   the visitor is told before they read anything, so each of these says
   something true about the page it opens:

     home     RESOLVE   the lime mark opens and the page settles out of it —
                        the site attuning itself, which is its whole thesis
     work     ASSEMBLE  case covers snap from scatter into alignment:
                        interfaces are assembled out of parts
     about    SPEAK     paragraphs rise one line at a time, at the cadence
                        of someone talking rather than a page loading
     access   NOTHING   the page about access refuses to make anyone wait.
                        It cuts. It is the only page identical in both modes,
                        because it was always designed for everyone.
     skills   TALLY     rows sweep in and their numbers count up: an inventory
                        being counted, not a list being revealed
     contact  REACH     the address settles toward you and the mark pulses
                        once — an invitation, offered rather than displayed

   Two rules hold across all of them:

   1. CALM MODE AND REDUCED MOTION GET A CUT, NOT A DEGRADED VERSION.
      Nothing here is "the animation, but less". The page simply is there.
   2. THE PAGE IS READABLE BEFORE IT IS FINISHED MOVING.
      Every element starts at its final position in the markup and is only
      displaced by script that has already confirmed it can put it back. A
      failure mid-choreography leaves a complete page, never a blank one.
   ========================================================================= */

const prefersStill = () =>
  document.documentElement.dataset.mode === "calm" ||
  matchMedia("(prefers-reduced-motion: reduce)").matches;

/* The one page that never animates, in any mode, for any visitor. */
const ALWAYS_INSTANT = new Set(["access"]);

/* ---- helpers -----------------------------------------------------------
   The Web Animations API rather than CSS classes: the stagger delays are
   computed from how many elements actually exist, which a stylesheet
   cannot know, and every animation returns a promise we can await.        */

const ease = "cubic-bezier(0.16, 1, 0.3, 1)";

function rise(nodes, { distance = 14, stagger = 55, duration = 620 } = {}) {
  [...nodes].forEach((node, i) => {
    node.animate(
      [{ opacity: 0, transform: `translateY(${distance}px)` },
       { opacity: 1, transform: "none" }],
      { duration, delay: i * stagger, easing: ease, fill: "backwards" },
    );
  });
}

/* Count a figure up to its written value, keeping whatever is wrapped
   around the number. "€150K+" counts the 150 and leaves "€" and "K+" alone.
   Intl.NumberFormat so a thousands separator is the reader's own, not
   a hard-coded comma. */
function countUp(node, { duration = 1100 } = {}) {
  const text = node.textContent;
  const match = text.match(/[\d.,]+/);
  if (!match) return;

  const target = parseFloat(match[0].replace(/,/g, ""));
  if (!Number.isFinite(target)) return;

  const before = text.slice(0, match.index);
  const after  = text.slice(match.index + match[0].length);
  const fmt = new Intl.NumberFormat(document.documentElement.lang || "en");

  /* The figure is in the accessibility tree the whole time as its final
     value; only the visible text counts. A screen reader announcing
     "one… four… nine… thirteen cities" would be a cruelty. */
  node.setAttribute("aria-label", text);
  const live = document.createElement("span");
  live.setAttribute("aria-hidden", "true");
  node.replaceChildren(live);

  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min((now - t0) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);          // ease-out cubic
    live.textContent = before + fmt.format(Math.round(target * eased)) + after;
    if (p < 1) requestAnimationFrame(step);
    else live.textContent = text;                  // land exactly on the written value
  };
  requestAnimationFrame(step);
}

/* Run something the first time an element is actually looked at.

   Anything below the fold has to be triggered by arrival, not by a timer
   started at page load. On a landing page three and a half viewports tall
   the difference is total: the outcome figures sit at 3.08vh, so a delay
   measured from route entry counted them up in an empty room. */
function whenSeen(nodes, fn, { threshold = 0.4 } = {}) {
  const list = [...nodes];
  if (!list.length) return;

  if (!("IntersectionObserver" in window)) {
    list.forEach(fn);                      // no observer: just do it
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);         // once only — a figure that counts twice is a bug
      fn(entry.target);
    });
  }, { threshold });
  list.forEach((n) => io.observe(n));
}

/* ---- per-page choreography --------------------------------------------- */

const CHOREO = {
  /* RESOLVE — the page settles out of the mark. The outcome figures count
     up, which is the one effect Safa wrote in 2023 that she could not get
     working. It works now. */
  home(view) {
    rise(view.querySelectorAll(".intro__kicker, h1, .intro__sub"), { stagger: 90 });
    const marks = view.querySelectorAll(".stop");
    marks.forEach((m) => m.animate(
      [{ transform: "scale(0)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }],
      { duration: 520, delay: 240, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", fill: "backwards" }));
    /* The figures count when they are reached, not when the route opens. */
    whenSeen(view.querySelectorAll(".outcome__figure"),
             (f) => countUp(f), { threshold: 0.9 });

    /* Same for the audience question, which sits two viewports down. */
    whenSeen(view.querySelectorAll(".ask"), (n) => rise([n], { stagger: 0 }));
  },

  /* ASSEMBLE — the covers arrive from slightly different places and land
     square. Built from parts, then aligned. */
  work(view) {
    const covers = [...view.querySelectorAll(".project__cover")];
    covers.forEach((cover, i) => {
      const from = [-18, 14, -10, 20][i % 4];
      cover.animate(
        [{ opacity: 0, transform: `translate3d(${from}px, 26px, 0) scale(0.985)` },
         { opacity: 1, transform: "none" }],
        { duration: 760, delay: i * 110, easing: ease, fill: "backwards" });
    });
    rise(view.querySelectorAll(".project__meta, .project h3, .project__summary"),
         { stagger: 40, duration: 560 });
  },

  /* SPEAK — one line at a time, at the pace of a person, not a loader. */
  about(view) {
    rise(view.querySelectorAll("p"), { distance: 10, stagger: 140, duration: 700 });
  },

  /* PROCESS is on the about page: six steps drawing in order, because a
     process that arrived all at once would be lying about itself. */
  process(view) {
    rise(view.querySelectorAll(".steps > li"), { stagger: 95 });
  },

  /* TALLY — an inventory being counted. */
  skills(view) {
    view.querySelectorAll(".skills li").forEach((row, i) => {
      row.animate(
        [{ opacity: 0, transform: "translateX(-10px)" }, { opacity: 1, transform: "none" }],
        { duration: 420, delay: 60 + i * 26, easing: ease, fill: "backwards" });
    });
    rise(view.querySelectorAll(".skills__eyebrow, .skills h3"), { stagger: 70 });
  },

  /* REACH — offered, not displayed. */
  contact(view) {
    const big = view.querySelector(".contact__big");
    big?.animate(
      [{ opacity: 0, transform: "translateY(22px) scale(0.97)" },
       { opacity: 1, transform: "none" }],
      { duration: 820, easing: ease, fill: "backwards" });
    rise(view.querySelectorAll(".contact__grid > *"), { stagger: 45, duration: 520 });
  },
};

/* =========================================================================
   The transition the router actually calls.
   ========================================================================= */
export function makeTransition({ announce, t }) {
  return async function transition(id, swap) {
    const root = document.documentElement;

    /* The access page cuts, always, in every mode. The site says why the
       first time, because an absence that is a decision should not be
       mistaken for an absence that is an oversight. */
    if (ALWAYS_INSTANT.has(id)) {
      root.dataset.transition = "none";
      swap();
      announce(t({
        en: "Accessibility. This page does not make you wait for it.",
        nl: "Toegankelijkheid. Deze pagina laat je er niet op wachten.",
      }));
      return;
    }

    if (prefersStill()) {
      root.dataset.transition = "none";
      swap();
      return;
    }

    root.dataset.transition = id;

    /* View Transitions handle the crossing between the two pages; the
       choreography below handles what the arriving page then does. Where
       the API is missing, the swap is instant and only the choreography
       runs — which is a smaller effect, not a broken one. */
    if (document.startViewTransition) {
      const vt = document.startViewTransition(swap);
      try { await vt.ready; } catch { /* a skipped transition is fine */ }
    } else {
      swap();
    }

    const view = document.getElementById("view");
    if (view) CHOREO[id]?.(view);
    /* The about page carries the process list, so it gets both. */
    if (id === "about" && view) CHOREO.process(view);
  };
}

export { countUp };
