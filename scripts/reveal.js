/* =========================================================================
   reveal.js — how type arrives.
   -------------------------------------------------------------------------
   The headline says "turning complexity into clarity", so the words do that:
   each one arrives OUT OF FOCUS and resolves into sharpness. Not a fade —
   a fade says "loading". Not a slide — a slide says "this came from
   somewhere else". Blur says the thing was always here and you are only now
   able to read it, which is the entire claim of the sentence it is setting.

   Word by word, left to right, with the last word landing about half a
   second after the first. Then the lime full stop, which arrives on its own
   because it is a mark rather than a word.

   Three rules it is built around:

   1. THE TEXT IS NEVER WITHHELD. Words are wrapped and then animated by
      script that has already confirmed it can un-hide them. Nothing starts
      hidden in the markup, so a failed script leaves a readable page rather
      than a blank one, and a screen reader is never waiting on an effect.
   2. NOTHING REFLOWS. Only opacity, transform and filter are touched — all
      compositor properties. Animating letter-spacing or width would relayout
      the paragraph on every frame and drag the whole page with it.
   3. STILLNESS SKIPS IT ENTIRELY. Calm mode and prefers-reduced-motion get
      the text, immediately, with no wrapping applied at all.
   ========================================================================= */

const still = () =>
  document.documentElement.dataset.mode === "calm" ||
  matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Wrap every word of an element in a span, leaving existing child elements
 * (like the lime full stop) intact as units of their own.
 *
 * Inline spans do not change how the text is announced — the accessible name
 * of the heading is still its full text — so no aria patching is needed, and
 * adding aria-label here would in fact freeze a translation of it.
 */
function splitWords(el) {
  if (el.dataset.split === "true") return [...el.querySelectorAll("[data-word]")];

  const out = [];
  const walk = [...el.childNodes];
  for (const node of walk) {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      /* Split on the spaces themselves so they survive: dropping them and
         re-adding them collapses double spaces and kills nbsp. */
      for (const piece of node.textContent.split(/(\s+)/)) {
        if (!piece) continue;
        if (/^\s+$/.test(piece)) { frag.append(piece); continue; }
        const span = document.createElement("span");
        span.dataset.word = "";
        span.textContent = piece;
        frag.append(span);
        out.push(span);
      }
      node.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      node.dataset.word = "";
      out.push(node);
    }
  }
  el.dataset.split = "true";
  return out;
}

/**
 * Resolve an element's words from out-of-focus to sharp.
 * @param {Element} el
 * @param {{stagger?:number, duration?:number, blur?:number, rise?:number, delay?:number}} opts
 */
export function resolveText(el, opts = {}) {
  if (!el || still()) return;

  const {
    stagger = 58,
    duration = 760,
    blur = 10,
    rise = 12,
    delay = 0,
  } = opts;

  const words = splitWords(el);
  if (!words.length) return;

  words.forEach((word, i) => {
    /* inline-block so transform and filter apply to the word as a box;
       inline elements cannot be transformed. */
    word.style.display = "inline-block";
    word.style.willChange = "opacity, transform, filter";

    const anim = word.animate(
      [
        { opacity: 0, filter: `blur(${blur}px)`, transform: `translateY(${rise}px)` },
        { opacity: 1, filter: "blur(0px)", transform: "none" },
      ],
      {
        duration,
        delay: delay + i * stagger,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "backwards",
      },
    );
    /* will-change is a promise to the compositor, not a decoration: left on,
       it keeps a layer alive for every word on the page forever. */
    anim.finished.then(() => { word.style.willChange = ""; }).catch(() => {});
  });
}

/** Every heading and lead paragraph on a freshly rendered view. */
export function resolveView(view, { lead = true } = {}) {
  if (!view || still()) return;

  const h1 = view.querySelector("h1");
  if (h1) resolveText(h1, { stagger: 70, duration: 820, blur: 12 });

  view.querySelectorAll(".section__label, .case__title").forEach((n, i) =>
    resolveText(n, { stagger: 34, duration: 560, blur: 7, rise: 8, delay: i * 40 }));

  if (lead) {
    view.querySelectorAll(".intro__sub, .case__lead").forEach((n) =>
      /* The lead is a paragraph, not a headline: quicker, shallower, and
         started under the heading so the two do not race. */
      resolveText(n, { stagger: 14, duration: 520, blur: 5, rise: 6, delay: 260 }));
  }
}
