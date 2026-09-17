/* =========================================================================
   router.js — six pages, one document, no server.
   -------------------------------------------------------------------------
   Routes are hash-based (#/work) for three reasons, in this order:

   1. Every page gets its own URL, so a recruiter can send a colleague
      straight to one case instead of "scroll down about halfway".
   2. Back and forward work, because history is real history, not a
      simulation of it built on pushState and hope.
   3. It deploys to GitHub Pages with no rewrite rules, which keeps this
      site something Safa can host herself forever.

   THE NAVIGATION IS LINKS, NOT A TABLIST.
   These look like tabs and are often built with role="tablist", which is
   the wrong choice here. An ARIA tab is a control that swaps a panel
   inside the current page; these are destinations with addresses. Built as
   real <a href> they get, for free and correctly: middle-click to open in
   a new tab, copy-link, browser history, and the screen-reader announcement
   "link" rather than "tab" — which is the truth about what they are.
   What a tablist would have given us (arrow-key roving) is not owed to a
   list of links, and pretending otherwise trades a real affordance for a
   convention.

   ROUTE CHANGES ARE ANNOUNCED AND FOCUS IS MOVED.
   A sighted visitor sees the page change. Without this, a screen-reader
   user hears nothing at all and their focus stays on the link they just
   pressed — the single most common way a JavaScript-routed site locks
   somebody out. Focus moves to the new page's heading; the announcer says
   where they are.
   ========================================================================= */

export class Router extends EventTarget {
  /**
   * @param {object} opts
   * @param {string[]} opts.ids       every valid route id
   * @param {string}   opts.fallback  where an unknown hash lands
   * @param {Function} opts.render    (id) => void, paints the route
   * @param {Function} opts.announce  (message) => void
   * @param {Function} opts.transition (id, swap) => void|Promise
   */
  constructor({ ids, fallback, render, announce, transition }) {
    super();
    this.ids = ids;
    this.fallback = fallback;
    this.render = render;
    this.announce = announce;
    this.transition = transition;
    this.current = null;

    addEventListener("hashchange", () => this.resolve());
  }

  /** "#/work" -> "work". Anything unrecognised becomes the fallback. */
  parse(hash = location.hash) {
    const id = hash.replace(/^#\/?/, "").split("?")[0];
    return this.ids.includes(id) ? id : this.fallback;
  }

  go(id, { replace = false } = {}) {
    const next = this.ids.includes(id) ? id : this.fallback;
    if (next === this.current) return;
    const url = `#/${next}`;
    if (replace) history.replaceState(null, "", url);
    else location.hash = url;          // a real history entry
    if (replace) this.resolve();
  }

  async resolve() {
    const id = this.parse();
    if (id === this.current) return;
    const from = this.current;
    this.current = id;

    const swap = () => {
      this.render(id);
      this.dispatchEvent(new CustomEvent("navigate", { detail: { id, from } }));
    };

    await this.transition(id, swap, from);
    this.settle(id);
  }

  /* After the paint: put the visitor where they now are, in both senses. */
  settle(id) {
    const heading = document.querySelector("#view h1, #view h2");
    if (heading) {
      /* tabindex -1 makes it programmatically focusable without adding it
         to the tab order — the heading is a destination, not a control. */
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
    /* Scrolled, not smooth-scrolled: this is a new page, and easing to the
       top of a page you have already arrived at is a lie about distance. */
    scrollTo({ top: 0, behavior: "auto" });

    document.querySelectorAll("[data-route]").forEach((link) => {
      const active = link.dataset.route === id;
      link.classList.toggle("is-active", active);
      /* aria-current="page" is how a screen reader is told which of six
         links is the one you are standing on. Colour alone cannot say it. */
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  start() {
    if (!location.hash) history.replaceState(null, "", `#/${this.fallback}`);
    this.resolve();
  }
}
