# Afstemmen — portfolio for Safa Mohalaia

*Afstemmen* is Dutch for **to tune, to attune to someone**. It is the whole idea
of this site: the portfolio reconfigures itself around whoever opened it.

Three things about Safa are not three features here. They are one behaviour.

| | expressed as |
|---|---|
| **Human-first** | the site asks who is looking, then reorders and re-depths itself for them |
| **Extreme detail** | anything can be opened one level deeper — a hex and why, a margin and why, the draft that was rejected |
| **Accessibility** | every adaptation is also an access affordance, and the site says out loud what it changed |

## Hover

Every container shares one hover treatment rather than a different effect per
component:

- **A sweep.** A band of light crosses the card left to right, once, over
  900ms when you arrive. The transition is asymmetric on purpose — entering it
  eases across, leaving it snaps back, because a highlight easing in reverse
  reads as the card undoing itself.
- **A spotlight** that follows the pointer, eased rather than written straight
  to it: the raw position snapped frame to frame and jittered on any small
  hand movement. One rAF loop, running only while a card is under the pointer.
- The border takes the accent, and a small lift.
- **A cursor badge.** Over anything openable, a ring with crosshair ticks and
  a word in it appears and *trails* the pointer. The lag is the whole trick: a
  badge pinned exactly to the cursor is just a bigger cursor, while one that
  catches up a beat later reads as an object with weight following you.

Any element carrying `data-cursor="WORD"` summons the badge; nothing else has
to know it exists. It never replaces the real pointer — hiding the system
cursor to draw your own is a bet that your rAF loop never drops a frame, and
when it loses the visitor has no cursor at all. Touch never sees it, print
mode never shows it, and under reduced motion it is placed rather than trailed
with the ticks held still.

Focus gets everything hover gets — `:hover`, `:focus-visible` and
`:focus-within` are always written together, because a keyboard visitor who
cannot see the state a mouse user gets is being told the site was not built
for them. The lift is bound to `--motion-scale`, so print mode and reduced
motion get the border and the tint with nothing moving. `@media (hover: hover)`
guards it, or a tap would leave a card lit up on a phone.

In print the spotlight becomes a flat tint and the lift becomes a rule that
thickens — the same information, stated the way a printed page states things.

## Six pages, each with its own arrival

Routes are hash-based (`#/work`), so every page has a shareable URL, the back
button works, and it deploys to GitHub Pages with no rewrite rules.

A transition is the last thing a visitor is told before they read anything, so
each one argues its own page's point rather than decorating the gap:

| page | crossing | what it says |
|---|---|---|
| **Home** | the page settles out of the lime mark; outcome figures count up | the site attuning itself — its whole thesis |
| **Work** | covers snap from scatter into alignment | interfaces are assembled out of parts |
| **A case** | the clicked cover morphs into the page hero | you opened *this* one, and it is the same object |
| **About** | paragraphs rise one line at a time | the cadence of someone talking, not a page loading |
| **Access** | **nothing at all** | the page about access refuses to make anyone wait |
| **Skills** | rows sweep in and their numbers count | an inventory being counted, not a list revealed |
| **Contact** | the address settles toward you, the mark pulses once | an invitation, offered rather than displayed |

**Access** is the only page identical in both modes, because it was always
designed for everyone. That is the point, and the site says so out loud the
first time you open it.

The home page counts its figures up — the one effect Safa wrote in 2023 and
couldn't get working. It works now.

## The ground

A full-bleed shader behind everything, and it is the headline drawn:

> *Turning complexity into clarity, one interface at a time.*

It is **one orthogonal mesh whose coordinates are warped by a flow field**.
Where the warp is full the mesh tangles into turbulence; where it falls to
zero the same mesh relaxes into a perfect grid — the surface a designer
actually works on. Same object, two states.

Under the words: grid. Behind the cat: turbulence. **Scroll and the tideline
sweeps right**, so by the bottom of the page the whole field has resolved.
The sentence happens behind you while you read it.

**The cursor pushes the field, it does not light it.** A gaussian bump around
the pointer is added to the coordinates the flow field is sampled at, so the
mesh genuinely *bends* around you rather than glowing underneath you, and the
strength scales with how fast you are moving — sweep across and you drag a
wake through it, hold still and it settles to a standing ripple.

That push deliberately ignores the order gate, so it can bend the resolved
grid as well as the turbulent half: you disturb the clarity where it has
already been won, and it closes back behind you.

Two layers at different scales, the far one drifting slower, so the turbulence
has depth instead of being a flat pattern. The cool tone exists only in the
turbulent half, so resolving the field drains the confusion out of it.

**Loudness is a function of position, not a global clamp.** Clamping the whole
field kept it safe and made it invisible. The ceiling is not a property of the
shader — it is a property of whether there is text on top. So:

| zone | brightest pixel | contrast vs body text |
|---|---|---|
| left of 45%, where the words live | 0.032 | **12.0:1** — AAA |
| right of 72%, where the cat is and no text ever goes | 0.131 | **5.5:1** — AA |
| the same zone once resolved | 0.074 | **8.0:1** — AAA |

Measured by hiding every bit of foreground and reading the brightest pixel in
the rendered frame. Even the loud zone's worst case clears AA for normal text,
so a future layout change can never turn this into a trap.

## The cat, as 24,000 particles

Safa is a cat person, and a cat happens to be the right animal for *this*
site: the thesis is "design that notices the person using them", and a cat
watching you is the most honest picture of that there is.

It is a three.js particle system, and it never stops moving.

**CAT → PAW → CURSOR.** Scroll the home page and the swarm morphs through
three shapes — the thing you are looking at notices you, reaches for you, and
ends up being the cursor you have been moving the whole time.

Everything you do changes it:

| | |
|---|---|
| always | every particle drifts on its own noise phase, so the shape breathes rather than sitting there |
| pointer | a repulsion field parts the cloud around you and it springs back — displacement is recomputed each frame, never integrated, so the shape is always the truth it returns to |
| pointer | the whole swarm turns toward you in real 3D, which is why every particle was sampled with a z spread |
| click | a burst impulse blows the shape apart and it reassembles |
| scroll | morphs continuously across a deliberately tall stage, with the headline pinned beside it |

The cat is drawn with real anatomy — inner ear notches, cheeks carried wider
than the skull, a muzzle split, a chest line, front-leg grooves, a tail that
tapers from root to tip — and almost all of it is **negative space** cut back
out of the silhouette. That is what turns a mass into a face.

Sampling is **edge-weighted**: 42% of the particles are spent on the boundary,
with a fraction of the jitter the interior gets. Uniform sampling put nearly
every particle in the middle where they stack invisibly and left the outline
as thin as chance allowed, which is why it read as a blob.

**The eyes follow you.** The pupils are their own plate, sampled separately and
given their own slice of the particle budget, drawn brighter and larger than
anything else. They are exempt from the pointer field, so when you stir the
cloud the eyes hold their place and keep tracking — the cat goes on looking at
you *through* the disturbance. Tracking fades out as the swarm morphs away from
the cat, because a paw with eyes is a different animal.

The pointer **stirs** rather than pushes: a tangential term on a travelling
sine makes particles orbit it. A purely radial push cleared a clean circle,
which read as erasure — as if the cursor were a rubber.

The shapes are **not modelled**. They are drawn once to an offscreen 2D canvas
and the particles sample the opaque pixels — so the cat is authored as a
drawing, with its eyes and muzzle punched out as real holes, and the GPU never
needs to know what a cat is.

Three weights that always sum to one drive the morph, so the cloud never loses
or gains mass mid-transition.

**What it costs, and who pays.** three.js is vendored (708 KB across two
files, no CDN, works offline) and imported lazily — full mode on the home page
only. A visitor in calm mode downloads **zero bytes** of it and gets the cat as
a still engraving instead. Particle count scales 9k → 24k by screen width, the
pixel ratio caps at 2, and the loop stops when the tab is hidden. If WebGL is
missing or the context is lost, the drawn cat takes over silently.

`aria-hidden` throughout. Delete the whole thing and the page reads identically.

The scroll indicator is a trail of paw prints, alternating either side of the
line the way an animal actually walks.

## Work, and the cases

Work is an index of four cards; each case is its own page at its own address
(`#/work/velotech`), so one project can be sent to someone on its own.

Clicking a card **morphs its cover into the case hero** — both carry the same
`view-transition-name`, so the browser tweens the real element rather than
crossfading two unrelated pictures. The name is applied to exactly one element
on click and released once the transition ends, because a duplicate name makes
the next transition refuse to run.

The card is **not** wrapped in a link. A link containing a cover, four metadata
fields, a heading and a summary is announced as one enormous run-on link and
takes the heading out of the page's outline. The heading holds the only real
link and a pseudo-element stretches its hit area over the card: a pointer gets
the whole card, a screen reader gets "VeloTech.AI, link", and the headings
still form a list you can navigate by.

The index is the one place a cover is cropped — a card is a thumbnail and wants
a consistent shape. The case page shows the screenshot whole.

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
scripts/shapes.js     the three silhouettes, drawn once, used by both renderers
scripts/halftone.js   print mode: the two-colour riso halftone proof
scripts/cat.js        the line-drawn cat (last-resort fallback) and paw trail
scripts/gl/swarm.js   the three.js particle swarm: cat → paw → cursor
vendor/three.*        three.js r180, vendored so there is no CDN dependency
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
