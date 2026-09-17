# Afstemmen — portfolio for Safa Mohalaia

*Afstemmen* is Dutch for **to tune, to attune to someone**. It is the whole idea
of this site: the portfolio reconfigures itself around whoever opened it.

Three things about Safa are not three features here. They are one behaviour.

| | expressed as |
|---|---|
| **Human-first** | the site asks who is looking, then reorders and re-depths itself for them |
| **Extreme detail** | anything can be opened one level deeper — a hex and why, a margin and why, the draft that was rejected |
| **Accessibility** | every adaptation is also an access affordance, and the site says out loud what it changed |

## Six pages, each with its own arrival

Routes are hash-based (`#/work`), so every page has a shareable URL, the back
button works, and it deploys to GitHub Pages with no rewrite rules.

A transition is the last thing a visitor is told before they read anything, so
each one argues its own page's point rather than decorating the gap:

| page | crossing | what it says |
|---|---|---|
| **Home** | the page settles out of the lime mark; outcome figures count up | the site attuning itself — its whole thesis |
| **Work** | covers snap from scatter into alignment | interfaces are assembled out of parts |
| **About** | paragraphs rise one line at a time | the cadence of someone talking, not a page loading |
| **Access** | **nothing at all** | the page about access refuses to make anyone wait |
| **Skills** | rows sweep in and their numbers count | an inventory being counted, not a list revealed |
| **Contact** | the address settles toward you, the mark pulses once | an invitation, offered rather than displayed |

**Access** is the only page identical in both modes, because it was always
designed for everyone. That is the point, and the site says so out loud the
first time you open it.

The home page counts its figures up — the one effect Safa wrote in 2023 and
couldn't get working. It works now.

## The cat

Safa is a cat person, and a cat is the right animal for *this* site rather than
a decorative one: the whole thesis here is "design that notices the person using
them", and a cat watching you is the most honest picture of that there is.

It is a **rig**, not a morph — head, ears, eyes, pupils, whiskers, body, tail
and paws are separate groups, each driven by something different:

- **scroll → waking.** Ears lift, eyes open, posture rises, the tail wakes up.
  It wakes because you arrived, which is the right causality for an animal and
  for an interface.
- **pointer → where it looks.** Pupils track you and the head turns with them,
  because eyes alone always look like a cardboard cut-out.
- **time → breathing, tail sway, and the slow blink.**

Eye openness is `scaleY`, so a shut eye is a horizontal line — which is how a
closed cat eye is actually drawn.

**The slow blink** is the detail the whole thing is for. A cat closing its eyes
slowly at you is not sleepiness, it is trust; cat people call it a cat kiss. It
happens about every twelve seconds and responds to nothing at all. Leave the
pointer alone for six seconds and the cat loses interest and looks at the lime
full stop instead, the way a real one gives up on a laser dot.

In **print mode** it becomes an engraving: ink instead of lime, thinner stroke,
awake, still. Exactly what the two modes mean everywhere else here.

It is `aria-hidden` and carries nothing the text does not. Delete it and the
page reads identically.

The scroll indicator is a **trail of paw prints** that fill in as you pass them,
alternating left and right of the line the way an animal actually walks.

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
scripts/router.js     hash routing, focus management, route announcements
scripts/transitions.js one choreography per page
scripts/main.js       rendering, route composition, disclosure
scripts/cat.js        the rigged cat and the paw-print scroll trail
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
5. **Navigation is links, not a tablist.** These look like tabs but they are
   destinations with addresses, so they are real `<a href>`: middle-click,
   copy-link, history and the announcement "link" all come free and correct.
6. **Every route change moves focus and is announced.** Without it a screen
   reader user hears nothing and stays on the link they pressed — the most
   common way a JavaScript-routed site locks somebody out.
7. **No value is off-scale, and no decision is unexplained.** The comments in
   `tokens.css` are not notes for developers — they are the source text for the
   detail layer.
