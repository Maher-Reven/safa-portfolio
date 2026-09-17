/* =========================================================================
   cursor.js — the badge that follows the pointer over an openable thing.
   -------------------------------------------------------------------------
   A ring with crosshair ticks and a word in it, which appears when the
   pointer is over something that can be opened and trails slightly behind
   the hand. The lag is the whole trick: a badge pinned exactly to the
   cursor is just a bigger cursor, while one that catches up a beat later
   reads as an object with weight that is following you.

   Any element carrying data-cursor="WORD" summons it. Nothing else needs
   to know it exists.

   What it is careful about:

   · IT NEVER REPLACES THE REAL CURSOR. The system pointer stays visible
     and keeps its own shape. Hiding it to draw your own is a bet that your
     rAF loop will never drop a frame, and when it loses, the visitor has
     no pointer at all.
   · TOUCH NEVER SEES IT. There is no hover on a finger, and a badge that
     appears where you last tapped is a smudge.
   · STILLNESS IS HONOURED. In calm mode or under prefers-reduced-motion
     the badge is placed rather than trailed, and the ticks stop turning.
   · aria-hidden, and it carries no information that is not already in the
     link it is hovering. A screen reader gets "VeloTech.AI, link", which
     is the same promise the badge is making in pictures.
   ========================================================================= */

const MARKUP = `
<svg class="cursor__ticks" viewBox="0 0 100 100" aria-hidden="true">
  <g stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
    <path d="M50 2 V12 M50 88 V98 M2 50 H12 M88 50 H98" />
  </g>
  <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor"
          stroke-width="1" stroke-dasharray="2 5" opacity="0.5" />
</svg>
<span class="cursor__label"></span>`;

export class CursorBadge {
  constructor() {
    this.el = document.createElement("div");
    this.el.className = "cursor-badge";
    this.el.setAttribute("aria-hidden", "true");
    this.el.innerHTML = MARKUP;
    this.label = this.el.querySelector(".cursor__label");

    this.target = { x: -200, y: -200 };
    this.at = { x: -200, y: -200 };
    this.active = false;
    this.raf = 0;
  }

  get still() {
    return document.documentElement.dataset.mode === "calm" ||
           matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  mount(parent = document.body) {
    parent.append(this.el);

    this.onMove = (e) => {
      if (e.pointerType === "touch") return;
      this.target.x = e.clientX;
      this.target.y = e.clientY;

      const host = e.target.closest?.("[data-cursor]");
      if (host) this.show(host.dataset.cursor);
      else this.hide();

      if (!this.raf) this.raf = requestAnimationFrame(this.tick);
    };
    /* Leaving the window entirely fires no pointermove over any element, so
       the badge would sit lit in the corner of a page nobody is pointing at. */
    this.onOut = (e) => { if (!e.relatedTarget) this.hide(); };

    addEventListener("pointermove", this.onMove, { passive: true });
    document.addEventListener("pointerout", this.onOut, { passive: true });
    return this;
  }

  show(word) {
    if (this.label.textContent !== word) this.label.textContent = word;
    if (this.active) return;
    this.active = true;
    /* Placed at the pointer before it is revealed, so it does not fly in
       from wherever it was last hidden. */
    if (!this.still) { this.at.x = this.target.x; this.at.y = this.target.y; }
    this.el.dataset.on = "true";
  }

  hide() {
    if (!this.active) return;
    this.active = false;
    this.el.dataset.on = "false";
  }

  tick = () => {
    /* Placed, not trailed, when stillness was asked for: a lag is motion. */
    const k = this.still ? 1 : 0.16;
    this.at.x += (this.target.x - this.at.x) * k;
    this.at.y += (this.target.y - this.at.y) * k;
    this.el.style.transform = `translate3d(${this.at.x}px, ${this.at.y}px, 0) translate(-50%, -50%)`;

    const settled = Math.abs(this.target.x - this.at.x) < 0.3 &&
                    Math.abs(this.target.y - this.at.y) < 0.3;
    /* The loop only runs while there is something to catch up to. */
    this.raf = (this.active || !settled) ? requestAnimationFrame(this.tick) : 0;
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    removeEventListener("pointermove", this.onMove);
    document.removeEventListener("pointerout", this.onOut);
    this.el.remove();
  }
}
