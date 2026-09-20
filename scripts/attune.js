/* =========================================================================
   attune.js — the mechanic the whole site is built on.
   -------------------------------------------------------------------------
   One store holds every way the site can adapt to the person reading it.
   Seven independent axes, composable in any combination:

     theme     dark | light       what colour everything is
     mode      full | calm        which of the two art directions
     audience  who is looking     reorders and re-depths the content
     reading   default | legible  Atkinson Hyperlegible for the text face
     textsize  default|large|larger
     contrast  normal | high      AAA pairings, warmth removed
     lang      en | nl

   Three rules this file exists to enforce:

   1. The operating system is asked first, and believed. If someone has
      already told their machine they want reduced motion or more contrast,
      they should not have to tell us again.
   2. Every change is announced. A sighted visitor sees the page change; a
      screen-reader user is told, in words, what changed and why.
   3. Choices persist. Nobody should have to re-state an access need on
      every page load.
   ========================================================================= */

const STORE_KEY = "afstemmen.v1";

/** The axes, their allowed values, and how to describe a change out loud. */
const AXES = {
  /* Colour and behaviour were one axis until they were pulled apart. "Calm"
     meant paper AND stillness, so wanting the work to hold still meant
     giving up her dark ground, and reading the site in daylight meant
     giving up the canvas. Nobody asked for either trade. */
  theme: {
    values: ["dark", "light"],
    announce: {
      dark:  "Dark theme.",
      light: "Light theme. The same work on paper.",
    },
  },
  mode: {
    values: ["full", "calm"],
    announce: {
      full: "Full mode. Motion and the live canvas are on.",
      calm: "Calm mode. The canvas is off and the page is set as print.",
    },
  },
  audience: {
    values: ["open", "hiring", "designer", "client", "curious"],
    announce: {
      open:     "Showing everything, in the default order.",
      hiring:   "Reordered for hiring: the short version, with the CV first.",
      designer: "Reordered for designers: process, rejected drafts and decisions first.",
      client:   "Reordered for clients: what I do, how I work, what it costs you in time.",
      curious:  "No order imposed. Wander.",
    },
  },
  reading:  { values: ["default", "legible"],
    announce: { default: "Reading type back to Inter.",
                legible: "Reading type is now Atkinson Hyperlegible, with looser lines." } },
  textsize: { values: ["default", "large", "larger"],
    announce: { default: "Text at default size.",
                large: "Text enlarged.", larger: "Text at the largest size." } },
  contrast: { values: ["normal", "high"],
    announce: { normal: "Contrast back to warm default.",
                high: "High contrast. Warmth removed, every pairing above 7 to 1." } },
  lang:     { values: ["en", "nl"],
    announce: { en: "Language set to English.", nl: "Taal ingesteld op Nederlands." } },
};

/* -------------------------------------------------------------------------
   Defaults: ask the machine before assuming anything.
   ------------------------------------------------------------------------- */
function systemDefaults() {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const moreContrast  = matchMedia("(prefers-contrast: more)").matches;
  const prefersDark   = matchMedia("(prefers-color-scheme: dark)").matches;
  const prefersNL     = (navigator.language || "").toLowerCase().startsWith("nl");

  return {
    /* Rule 1 applies to colour as much as to motion: a laptop set to light
       has said something, and arguing with it on the grounds that the brand
       is dark would be the site talking over the reader on its first
       sentence. Her dark ground is what a machine that said nothing gets,
       and it is one press away from anywhere. */
    theme:    prefersDark ? "dark" : "light",
    mode:     reducedMotion ? "calm" : "full",
    audience: "open",
    reading:  "default",
    textsize: "default",
    contrast: moreContrast ? "high" : "normal",
    lang:     prefersNL ? "nl" : "en",
  };
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null; // private windows, blocked storage — carry on with defaults
  }
}

function writeStored(state) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* fine */ }
}

/* -------------------------------------------------------------------------
   The store
   ------------------------------------------------------------------------- */
class Attune extends EventTarget {
  constructor() {
    super();
    const defaults = systemDefaults();
    const stored = readStored() || {};

    /** what the machine told us, kept so the panel can show "your system asked for this" */
    this.systemDefaults = defaults;

    /** (axis, value) => string. Set by the page to translate announcements. */
    this.describe = null;

    this.state = {};
    for (const axis of Object.keys(AXES)) {
      const candidate = stored[axis];
      this.state[axis] = AXES[axis].values.includes(candidate) ? candidate : defaults[axis];
    }

    this.apply({ announce: false });
    this.watchSystem();
  }

  get(axis) { return this.state[axis]; }

  /** Has the visitor overridden what their OS asked for on this axis? */
  isOverridden(axis) { return this.state[axis] !== this.systemDefaults[axis]; }

  /* Did the operating system actually express a preference on this axis?
     Only two axes can be set from outside the page, and only when the
     relevant media query matches. Matching the neutral default is not the
     machine asking for anything — it is the machine saying nothing, and
     claiming credit for it would be a lie in the interface. */
  systemAsked(axis) {
    if (axis === "mode")     return matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (axis === "contrast") return matchMedia("(prefers-contrast: more)").matches;
    /* Only dark can be claimed as a request. "(prefers-color-scheme: light)"
       also matches a machine with no preference at all, so treating it as an
       answer would put "your device asked for this" under a choice nobody
       made. */
    if (axis === "theme")    return matchMedia("(prefers-color-scheme: dark)").matches;
    return false;
  }

  /* Show the "your device already asked for this" note only where it is
     true: the OS asked, and we are still honouring it. */
  isFollowingSystem(axis) { return this.systemAsked(axis) && !this.isOverridden(axis); }

  set(axis, value, { announce = true } = {}) {
    if (!AXES[axis]) throw new Error(`attune: unknown axis "${axis}"`);
    if (!AXES[axis].values.includes(value)) throw new Error(`attune: "${value}" is not a ${axis}`);
    if (this.state[axis] === value) return;

    this.state[axis] = value;
    writeStored(this.state);
    this.apply({ announce, changed: axis });
  }

  /** Step an axis to its next value — for toggle buttons. */
  cycle(axis) {
    const values = AXES[axis].values;
    const next = values[(values.indexOf(this.state[axis]) + 1) % values.length];
    this.set(axis, next);
  }

  apply({ announce = true, changed = null } = {}) {
    const root = document.documentElement;
    for (const [axis, value] of Object.entries(this.state)) {
      root.dataset[axis] = value;
    }
    root.lang = this.state.lang;

    if (announce && changed) {
      /* The page can supply a translated line; the table below stays as the
         English fallback so this module still works on its own. Announcing a
         change in a language the reader did not choose defeats the feature. */
      const spoken = this.describe?.(changed, this.state[changed])
                  ?? AXES[changed].announce[this.state[changed]];
      this.say(spoken);
    }

    this.dispatchEvent(new CustomEvent("change", {
      detail: { state: { ...this.state }, changed },
    }));
  }

  /* The site tells you what it did. Most sites change under you silently. */
  say(message) {
    const live = document.getElementById("announcer");
    if (!live) return;
    // Clearing first forces assistive tech to re-read an identical message.
    live.textContent = "";
    requestAnimationFrame(() => { live.textContent = message; });

    document.dispatchEvent(new CustomEvent("attune:said", { detail: { message } }));
  }

  /* If the OS preference changes mid-visit and the visitor has not
     overridden that axis themselves, follow it. If they have, do not
     override their explicit choice — theirs is the later, louder signal. */
  watchSystem() {
    const bind = (query, axis, onMatch, onUnmatch) => {
      const mq = matchMedia(query);
      mq.addEventListener("change", (e) => {
        this.systemDefaults[axis] = e.matches ? onMatch : onUnmatch;
        const untouched = !this._touched?.has(axis);
        if (untouched) this.set(axis, this.systemDefaults[axis]);
      });
    };
    this._touched = new Set();
    this.addEventListener("change", (e) => {
      if (e.detail.changed) this._touched.add(e.detail.changed);
    });
    bind("(prefers-color-scheme: dark)", "theme", "dark", "light");
    bind("(prefers-reduced-motion: reduce)", "mode", "calm", "full");
    bind("(prefers-contrast: more)", "contrast", "high", "normal");
  }
}

export const attune = new Attune();
export { AXES };
