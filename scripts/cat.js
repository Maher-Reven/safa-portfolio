/* =========================================================================
   cat.js — the companion on the home page.
   -------------------------------------------------------------------------
   Safa is a cat person, and a cat is the right animal for this particular
   site rather than a decorative one. The whole thesis here is "design that
   notices the person using them" — and a cat watching you is the most
   honest picture of that there is. So the cat is not an illustration placed
   near the argument. It is the argument, drawn.

   It is a RIG, not a morph: head, ears, eyes, pupils, whiskers, body, tail
   and paws are separate groups, each transformed independently. Morphing
   between two hand-authored cat silhouettes means matching path points by
   hand and getting a slurred in-between; rigging means every pose is
   deliberate and every part can react to something different.

   What drives what:

     scroll   →  waking. Ears lift, eyes open, posture rises, tail wakes up.
     pointer  →  where it looks. Pupils track you, within reason.
     time     →  breathing, tail sway, and the slow blink.

   THE SLOW BLINK is the detail this whole thing is for. A cat closing its
   eyes slowly at you is not sleepiness, it is trust — cat people call it a
   cat kiss. It happens here roughly every twelve seconds, and it is the one
   piece of motion on this page that responds to nothing at all. It is just
   the cat liking you.

   Accessibility, which a decorative cat does not get to opt out of:
     · aria-hidden. It carries no information the text does not.
     · Calm mode and reduced motion get the cat as a printed line drawing:
       eyes open, still, no scroll dependency. An engraving instead of an
       animal, which is exactly what the two modes mean everywhere else.
     · It never gates content. Nothing is revealed by scrolling past it and
       nothing is hidden behind it. The page reads identically with the cat
       deleted.
   ========================================================================= */

const NS = "http://www.w3.org/2000/svg";

/* The cat, drawn once as markup. Monoline: every part is a stroke, so the
   whole animal inherits one colour and one weight and stays coherent at any
   size, in either mode, at any contrast setting. */
const CAT = `
<svg viewBox="0 0 320 380" fill="none" aria-hidden="true" focusable="false">
  <g class="cat__all" stroke="currentColor" stroke-width="3.5"
     stroke-linecap="round" stroke-linejoin="round">

    <!-- tail: drawn first so it sits behind the body -->
    <g class="cat__tail">
      <path d="M218 312 C 272 320 306 276 292 232 C 285 210 262 204 254 220" />
    </g>

    <!-- body -->
    <g class="cat__body">
      <path d="M112 176 C 96 214 88 268 92 306 C 94 322 106 330 126 330
               L 194 330 C 214 330 226 322 228 306 C 232 268 224 214 208 176" />
      <ellipse class="cat__paw" cx="126" cy="326" rx="17" ry="9" />
      <ellipse class="cat__paw" cx="194" cy="326" rx="17" ry="9" />
    </g>

    <!-- head group: everything above the shoulders moves together -->
    <g class="cat__head">
      <g class="cat__ear cat__ear--l">
        <path d="M119 75 L 108 20 L 154 60" />
        <path class="cat__ear-in" d="M128 68 L 122 38 L 146 60" />
      </g>
      <g class="cat__ear cat__ear--r">
        <path d="M201 75 L 212 20 L 166 60" />
        <path class="cat__ear-in" d="M192 68 L 198 38 L 174 60" />
      </g>

      <circle cx="160" cy="124" r="64" />

      <!-- Eyes. Openness is scaleY on the whole eye group: a closed cat eye
           really is just a horizontal line, so the closed state is the
           honest drawing rather than a lid pasted over it. -->
      <g class="cat__eye cat__eye--l">
        <path d="M118 120 C 124 106 146 106 152 120 C 146 134 124 134 118 120 Z" />
        <circle class="cat__pupil" cx="135" cy="120" r="6.5" fill="currentColor" stroke="none" />
      </g>
      <g class="cat__eye cat__eye--r">
        <path d="M168 120 C 174 106 196 106 202 120 C 196 134 174 134 168 120 Z" />
        <circle class="cat__pupil" cx="185" cy="120" r="6.5" fill="currentColor" stroke="none" />
      </g>

      <!-- nose and mouth -->
      <path d="M153 146 L 167 146 L 160 154 Z" fill="currentColor" stroke="none" />
      <path d="M160 154 L 160 160 M 160 160 C 154 168 146 166 144 160
               M 160 160 C 166 168 174 166 176 160" />

      <g class="cat__whiskers">
        <path d="M140 152 L 96 144 M 140 158 L 98 160 M 180 152 L 224 144 M 180 158 L 222 160" />
      </g>
    </g>
  </g>
</svg>`;

export class Cat {
  constructor(host) {
    this.host = host;
    this.host.innerHTML = CAT;
    this.svg = host.querySelector("svg");

    this.head     = host.querySelector(".cat__head");
    this.body     = host.querySelector(".cat__body");
    this.tail     = host.querySelector(".cat__tail");
    this.ears     = [...host.querySelectorAll(".cat__ear")];
    this.eyes     = [...host.querySelectorAll(".cat__eye")];
    this.pupils   = [...host.querySelectorAll(".cat__pupil")];

    this.wake = 0;         // 0 asleep … 1 fully awake, driven by scroll
    this.look = { x: 0, y: 0 };
    this.blink = 1;        // 1 open, 0 shut
    this.lastAttention = performance.now();

    this.t0 = performance.now();
    this.running = false;
  }

  get still() {
    return document.documentElement.dataset.mode === "calm" ||
           matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  start() {
    /* Printed mode: one pose, drawn correctly, and then nothing. The cat is
       awake and looking straight out, because a still drawing of a sleeping
       animal is just a blob. */
    if (this.still) {
      this.wake = 1;
      this.blink = 1;
      this.look = { x: 0, y: 0 };
      this.pose();
      return;
    }

    this.bind();
    this.running = true;
    this.onScroll();
    this.loop();
  }

  bind() {
    this.onPointer = (e) => {
      const r = this.svg.getBoundingClientRect();
      if (!r.width) return;
      /* Where the pointer is, relative to the cat's head, clamped. A cat
         tracking your cursor to the edge of its skull looks possessed; a
         cat glancing looks like a cat. */
      const cx = r.left + r.width * 0.5;
      const cy = r.top + r.height * 0.33;
      /* Normalise against the distance from the cat to whichever edge the
         pointer is heading for. Dividing by a fixed fraction of the viewport
         meant a cat sitting near the right edge could only ever use a third
         of its travel, so it read as barely looking at you at all. */
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const spanX = dx >= 0 ? Math.max(innerWidth - cx, 1) : Math.max(cx, 1);
      const spanY = dy >= 0 ? Math.max(innerHeight - cy, 1) : Math.max(cy, 1);
      this.look.x = Math.max(-1, Math.min(1, dx / spanX));
      this.look.y = Math.max(-1, Math.min(1, dy / spanY));
      this.lastAttention = performance.now();
    };

    this.onScrollRaw = () => {
      if (this.scrollQueued) return;
      this.scrollQueued = true;
      requestAnimationFrame(() => { this.scrollQueued = false; this.onScroll(); });
    };

    this.onVisibility = () => {
      if (document.hidden) this.running = false;
      else if (!this.running && !this.still) { this.running = true; this.loop(); }
    };

    addEventListener("pointermove", this.onPointer, { passive: true });
    addEventListener("scroll", this.onScrollRaw, { passive: true });
    addEventListener("resize", this.onScrollRaw, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  /* Waking is tied to how far down the home page you have come, not to a
     timer: the cat wakes because you arrived, which is the correct causality
     for an animal and for an interface. */
  onScroll() {
    const span = Math.max(innerHeight * 0.8, 1);
    this.wakeTarget = Math.max(0, Math.min(1, scrollY / span));
  }

  loop = () => {
    if (!this.running) return;
    const now = performance.now();
    const t = (now - this.t0) / 1000;

    this.wake += ((this.wakeTarget ?? 0) - this.wake) * 0.08;

    /* The slow blink. Every twelve seconds or so, and it is not triggered by
       anything the visitor does — that is the whole point of it. */
    const phase = (t % 12) / 12;
    if (phase > 0.955) {
      const p = (phase - 0.955) / 0.045;              // 0…1 across the blink
      this.blink = Math.abs(Math.cos(p * Math.PI));   // shut and open again
    } else {
      this.blink = 1;
    }

    /* Attention decays. Leave the pointer alone for six seconds and the cat
       stops caring about it and looks at the lime full stop instead, the way
       a real one loses interest in a laser dot and finds a crumb. */
    const bored = now - this.lastAttention > 6000;
    if (bored) {
      this.look.x += (-0.35 - this.look.x) * 0.02;
      this.look.y += (0.15 - this.look.y) * 0.02;
    }

    this.pose(t);
    this.raf = requestAnimationFrame(this.loop);
  };

  pose(t = 0) {
    const w = this.wake;

    /* Ears. Flat back while asleep, upright once awake — the single clearest
       signal of a cat's state, and the first thing that moves when one
       notices you. */
    const earSleep = 26;
    this.ears[0].style.transform = `rotate(${earSleep * (1 - w) * -1}deg)`;
    this.ears[1].style.transform = `rotate(${earSleep * (1 - w)}deg)`;

    /* Eyes. Openness is scaleY, so shut is a line. Never fully zero: a cat
       with its eyes welded shut reads as unconscious, not asleep. */
    const open = (0.08 + 0.92 * w) * this.blink;
    this.eyes.forEach((eye) => { eye.style.transform = `scaleY(${Math.max(open, 0.06)})`; });

    /* Pupils. They move a little; the head turns a little more. A cat tracks
       with its whole face, which is why cursor-following eyes alone always
       look like a cardboard cut-out. */
    /* The pupil can travel about 8 units inside the eye before it clips the
       eyelid, so 7 is the whole expressive range with a unit to spare. */
    const px = this.look.x * 7 * w;
    const py = this.look.y * 4.5 * w;
    this.pupils.forEach((p) => { p.style.transform = `translate(${px}px, ${py}px)`; });
    this.head.style.transform =
      `translate(${this.look.x * 7 * w}px, ${this.look.y * 4 * w}px) rotate(${this.look.x * 4 * w}deg)`;

    /* Breathing: slow while asleep, quicker and shallower awake. */
    const breath = Math.sin(t * (1.1 + w * 0.7)) * (0.012 - w * 0.005);
    this.body.style.transform = `scaleY(${1 + breath}) translateY(${(1 - w) * 10}px)`;

    /* Tail. Still when asleep; once awake it sways, and it sways faster the
       more the cat is looking at something. Cats do not wag happily — a
       moving tail is interest, which is the correct note for a portfolio. */
    const interest = Math.abs(this.look.x) + Math.abs(this.look.y);
    const sway = Math.sin(t * (1.4 + interest * 0.9)) * 7 * w;
    this.tail.style.transform = `rotate(${sway}deg)`;
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    removeEventListener("pointermove", this.onPointer);
    removeEventListener("scroll", this.onScrollRaw);
    removeEventListener("resize", this.onScrollRaw);
    document.removeEventListener("visibilitychange", this.onVisibility);
  }
}

/* =========================================================================
   PawTrail — the scroll indicator, as a line of paw prints.
   -------------------------------------------------------------------------
   A page whose companion is a cat should not measure itself with a grey bar.
   Prints fill in as you pass them, alternating left and right of the line
   the way an animal actually walks, so the trail reads as a path rather
   than as a dotted rule.

   aria-hidden: it duplicates the scrollbar, which the browser already
   exposes correctly. Two announcements of the same fact is one too many.
   ========================================================================= */

const PAW = `
<svg viewBox="0 0 24 26" fill="currentColor" aria-hidden="true" focusable="false">
  <ellipse cx="12" cy="18" rx="7.5" ry="6"/>
  <ellipse cx="4"  cy="9"  rx="3"   ry="3.8" transform="rotate(-18 4 9)"/>
  <ellipse cx="10" cy="4.5" rx="2.8" ry="3.6"/>
  <ellipse cx="16" cy="4.5" rx="2.8" ry="3.6"/>
  <ellipse cx="21" cy="10" rx="3"   ry="3.8" transform="rotate(18 21 10)"/>
</svg>`;

export class PawTrail {
  constructor(count = 9) {
    this.el = document.createElement("ul");
    this.el.className = "paws";
    this.el.setAttribute("aria-hidden", "true");
    this.prints = Array.from({ length: count }, () => {
      const li = document.createElement("li");
      li.innerHTML = PAW;
      this.el.append(li);
      return li;
    });
    this.queued = false;
  }

  mount(parent = document.body) {
    parent.append(this.el);
    this.onScroll = () => {
      if (this.queued) return;
      this.queued = true;
      requestAnimationFrame(() => { this.queued = false; this.update(); });
    };
    addEventListener("scroll", this.onScroll, { passive: true });
    addEventListener("resize", this.onScroll, { passive: true });
    this.update();
    return this;
  }

  update() {
    const scrollable = document.documentElement.scrollHeight - innerHeight;
    /* A page too short to scroll has no progress to report, so the trail
       shows none rather than claiming you have finished. */
    const progress = scrollable > 40 ? scrollY / scrollable : 0;
    const reached = Math.round(progress * this.prints.length);
    this.prints.forEach((li, i) => {
      li.dataset.passed = String(i < reached);
    });
  }

  destroy() {
    removeEventListener("scroll", this.onScroll);
    removeEventListener("resize", this.onScroll);
    this.el.remove();
  }
}
