# Afstemmen — portfolio for Safa Mohalaia

*Afstemmen* is Dutch for **to tune, to attune to someone**. It is the whole idea
of this site: the portfolio reconfigures itself around whoever opened it.

Three things about Safa are not three features here. They are one behaviour.

| | expressed as |
|---|---|
| **Human-first** | the site asks who is looking, then reorders and re-depths itself for them |
| **Extreme detail** | anything can be opened one level deeper — a hex and why, a margin and why, the draft that was rejected |
| **Accessibility** | every adaptation is also an access affordance, and the site says out loud what it changed |

## Two modes, both signed

**Full** — a live WebGL ground that warms where your pointer is, display type at
Fraunces' optical extreme, content that arrives rather than appears.

**Calm** — not full mode with the effects stripped out. A different object: an
editorial grid, numbered sections, hairline rules, paper grain laid in CSS.

Neither is an apology for the other. If your device asks for reduced motion you
land in calm, and the site tells you it listened.

## Running it

No build step, no dependencies, no tooling.

```sh
python3 -m http.server 8787   # then open http://localhost:8787
```

Deploys as-is to GitHub Pages.

## Editing it

`content/content.js` is the only file that needs touching to change what the site
says. Every string is a pair, `{ en: "…", nl: "…" }`; a missing Dutch string falls
back to English rather than leaving a hole.

Projects marked `placeholder: true` announce themselves as placeholders on the
page. Replace them — the shape is the contract, the content is yours.

## Where things are

```
index.html            structure only; everything else is rendered from content.js
content/content.js    ← the file to edit
styles/tokens.css     every design decision, with the reason written next to it
styles/base.css       reset + the accessibility primitives everything assumes
styles/layout.css     structure shared by both modes
styles/full.css       art direction one — the live surface
styles/calm.css       art direction two — the printed piece
styles/attune.css     the panel
styles/detail.css     the annotation layer
scripts/attune.js     the six adaptation axes, persistence, announcements
scripts/main.js       rendering, ordering, disclosure, arrivals
scripts/gl/field.js   the WebGL ground (raw WebGL2, no library)
```

## Rules this codebase keeps

1. **The operating system is asked first, and believed.** If someone already told
   their machine they want reduced motion or more contrast, they do not have to
   tell us again.
2. **Every change is announced.** Sighted visitors see the page change; screen
   reader users are told, in words, what changed.
3. **Nothing is load-bearing that can fail.** No WebGL, no JavaScript, no webfont
   — the page stays complete and readable.
4. **Contrast is not negotiable.** The shader is clamped to 6% of the distance
   between paper and the warm tone, so body copy never drops below 15:1.
5. **No value is off-scale, and no decision is unexplained.** The comments in
   `tokens.css` are not notes for developers — they are the source text for the
   detail layer.
