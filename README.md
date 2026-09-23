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

## How type arrives

The headline says *turning complexity into clarity*, so the words do that:
each one arrives **out of focus and resolves into sharpness**, left to right,
with the last word landing about half a second after the first. Then the lime
full stop on its own, because it is a mark rather than a word.

Not a fade — a fade says "loading". Not a slide — a slide says "this came from
somewhere else". Blur says the thing was always there and you are only now
able to read it, which is the whole claim of the sentence it is setting.

- **The text is never withheld.** Words are wrapped and then animated by
  script that has already confirmed it can un-hide them, so a failed script
  leaves a readable page and a screen reader never waits on an effect.
- **Nothing reflows.** Only opacity, transform and filter are touched.
  Animating letter-spacing would relayout the paragraph every frame.
- **Stillness skips it entirely** — no wrapping is applied at all.
- The **Access page has no reveal**, like it has no transition. It still
  refuses to make anyone wait.

## Six pages, each with its own arrival

Routes are hash-based (`#/work`), so every page has a shareable URL, the back
button works, and it deploys to GitHub Pages with no rewrite rules.

A transition is the last thing a visitor is told before they read anything, so
each one argues its own page's point rather than decorating the gap:

| page | crossing | what it says |
|---|---|---|
| **Home** | the page settles out of the lime mark; the work index arrives row by row | the site attuning itself — its whole thesis |
| **Work** | covers snap from scatter into alignment | interfaces are assembled out of parts |
| **A case** | the clicked cover morphs into the page hero | you opened *this* one, and it is the same object |
| **About** | paragraphs rise one line at a time | the cadence of someone talking, not a page loading |
| **Access** | **nothing at all** | the page about access refuses to make anyone wait |
| **Skills** | rows sweep in and their numbers count | an inventory being counted, not a list revealed |
| **Contact** | the address settles toward you, the mark pulses once | an invitation, offered rather than displayed |

**Access** is the only page identical in both modes, because it was always
designed for everyone. That is the point, and the site says so out loud the
first time you open it.

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

## Phone screens and desktop screens are different objects

Measured from the source images rather than guessed: Dentara is five 390×844
phone captures, MediaLab is genuinely mixed — four 440×956 phone shots plus a
1920px dashboard — and VeloTech and PubHubs are all 1280–1440px wide screens.

So the split is **per shot, not per project**:

- **Phone captures** go in a rail, at phone size, side by side — which is also
  how you would hold them. At desktop width all four fit at once; narrower,
  it becomes a real carousel with scroll-snap and arrows.
- **Desktop captures** keep the wide/half grid they were built for.
- A **format label** on the card and the case page says which kind of product
  it was, because a phone UI and a dashboard are not the same discipline.
- A portrait cover is *contained* on a tinted ground, never cropped to a
  landscape thumbnail, and shown near the size a phone actually is rather
  than as a billboard of one.

Native scroll-snap does the scrolling — a JS carousel that hijacks the wheel
and swallows touch is a worse version of what the browser already does well.
The arrows sit on top for people who cannot swipe, and **disappear when the
rail does not scroll**, along with the counter: a control that moves nothing
is lying, and "01 / 04" is meaningless when all four are on screen at once.
The rail is a focusable labelled region, since a scrollable box that cannot be
focused cannot be scrolled by keyboard at all.

## Selected work, as type

The home page closes on the four projects set large, each row taking its own
case colour, with the cover riding the pointer beside it.

It replaced a row of business metrics — 13 cities, €150K — which were the
*product's* numbers rather than hers, and which asked a visitor to be
impressed before they had seen anything. A list of the actual work asks them
to look instead, and it gives the home page somewhere to lead.

The preview is decoration: every row is already a complete link, and deleting
the image would lose nothing but the pleasure. It eases toward the pointer on
the same lag as the cursor badge, so the two read as one language rather than
two systems.

## The page audits itself, in front of you

Almost every portfolio *asserts* rigour. This one lets you check it. At the
foot of the Access page the site measures **the live DOM** — resolved colours
walked up the tree, real bounding boxes, the real heading sequence — and
publishes the score.

Two rules, and the second is the only one that matters:

1. It measures what is actually rendered, not a checklist someone ticked.
2. **It reports failures.** An audit that can only pass is marketing.

It re-runs whenever an Attune axis changes, so switching to high contrast
visibly moves the numbers — which turns the whole adaptation system from a
claim into a measured one.

> Warm: worst text contrast **4.89:1**, 6/6 passing.
> High contrast: **10.34:1**.

**It immediately caught a real bug in this site.** `--text-faint` is documented
in `tokens.css` as 4.6:1 — measured against `--ground`. But nearly every faint
label sits on a card, where `--surface` is lighter and the same colour fell to
**4.29:1**, failing on five pages. The token is now `#948f87`: 5.3:1 on the
ground and 4.9:1 on the surface. A token has to clear its threshold on every
ground it is used on, not the one it was designed against.

## The Lab

Instruments, not screenshots. A lab of pictures would be a second Work tab; a
lab you can operate is an argument about how she works. Each one runs on
**this page**, and each belongs to a discipline:

| | discipline | |
|---|---|---|
| **01 See it the way they do** | Access | The colour-vision and blurred-vision simulations from her audit, as real `feColorMatrix` transforms on the live document |
| **02 Two words that failed** | Colour | A contrast checker opening on red over yellow — the exact pairing that failed her first audit, at 3.01:1 |
| **03 Screen angles** | Print | The two-colour riso screen this site prints in, with its angles exposed. Put them within 60° and watch moiré appear |
| **04 A typeface that changes its mind** | Type | Fraunces' optical-size, softness and WONK axes handed over, so one font can be found behaving like several |
| **05 The shape of a movement** | Motion | The site's own easing curves, drawn and raced side by side, with linear as the control that always looks wrong |

**Filtered, not piled.** Five instruments across five disciplines is a shelf;
the same five with a way to say *just the type one* is a lab. Buttons rather
than a `<select>`, because the options are the navigation — and the filter
announces its result, since filtering a list a screen reader cannot see change
is the same as doing nothing.

Under deuteranopia the red-on-yellow swatch collapses into two near-identical
yellows, which is the whole point made without a word of explanation.

An instrument that degrades the page must be impossible to get stuck inside,
so a fixed banner names the running simulation **and is itself the way out** —
reachable from anywhere, not just from the control you came in through. The
filter and its SVG defs are torn down when you leave the route, and the
contrast verdict is stated in words as well as colour, because a contrast tool
that signals only in colour is a joke at its own expense.

The filter sits on `<body>` rather than `<html>`: a filter on an ancestor makes
it a containing block, and every `position: fixed` element on the site would
jump.

## Graphic design

Thirty-five pieces across five sets: two educational carousels for a dental
practice, a brand book, campaign graphics, a social campaign, and a specimen
page for ITC Benguiat. It is a separate tab from Work because it is read
differently — a case study is an argument you follow from problem to result,
and a set of carousels is a body of work you look at.

**The filter is multi-select**, unlike the Lab's. The Lab's topics are a
taxonomy and you ask it one question at a time; these are five clients, and
"the two social ones" is an ordinary thing to want. Chips toggle, Everything
is the way back, and the count is announced, because filtering a list a
screen reader cannot see change is the same as doing nothing.

**Opening a set** morphs its cover into the viewer through a view transition
named on both ends, so the picture you pressed is visibly the picture you are
looking at. The viewer is a real dialog: `aria-modal`, focus moved in and
given back to the card you came from, Escape, arrows, Home and End, and the
tab order held inside it. The strip along the bottom is the whole set, the
current one marked by a border as well as opacity.

**The motion says which way you went.** Opening zooms: the browser tweens the
cover's rectangle into the stage's over 460ms while the two snapshots
cross-fade inside it in 200ms, so it reads as one picture growing rather than
two pictures mixing. The panel only fades while that happens — two zooms at
once is one too many — and an opening with no cover to grow from, a deep
link, gets the zoom on the panel instead. Closing is the same thing
backwards, into the card it came from, which answers the question a closing
dialog always raises: where did the thing I was looking at go.

Between images the frames slide, out to the left and in from the right, or
the reverse going back. The outgoing frame is a real second image rather than
a cross-fade of one: fading a photograph into another photograph passes
through a midpoint where both are equally present and neither is legible.
Nothing animates until the incoming picture has decoded — sliding in an empty
box says the arrival is finished before it is — but the decode is raced
against 220ms, because the first version simply awaited it and on a machine
whose decoder was not running the counter said 2 of 14 while the picture on
screen was still 1. Long pages never slide: they are a scroll container, and
moving one sideways while it is scrolled down is a movement nobody can
follow.

**The URL changes but the route does not.** Opening pushes `#/graphic/<slug>`
with `pushState`, which fires no `hashchange`, so the wall underneath is never
re-rendered — and Back closes the viewer rather than leaving the page, which
is what Back means when something is open on top. The id is a real route as
well, so the link survives being sent to somebody.

Two things this page had to learn the hard way, both of which looked like the
viewer being broken:

- **A view transition is an enhancement, not a delivery mechanism.** The first
  version mounted the viewer inside the `startViewTransition` callback, which
  runs at the next rendering opportunity — and a document that is not being
  painted may not have one soon. The address bar said a set was open and the
  screen said nothing was. The mount is now guarded and also scheduled
  directly, so the transition can only make the opening prettier.
- **An element carrying a `view-transition-name` is not painted in place.**
  The browser paints its snapshot instead, so a name left on after the
  transition — or one that never ended — is an invisible element. That was a
  grey rectangle where the picture should have been, with every piece of
  chrome around it correct.

### The pictures

```sh
node tools/graphic-assets.mjs      # Digital design/ -> assets/graphic/
```

Safa drops work into `Digital design/` at whatever size it left Figma, Canva
or a phone — 16MB, four times the rest of the site. The tool resizes each
piece to a viewing image and a thumbnail, renders PDF carousels a page at a
time through PDFKit (`tools/pdf-pages.swift`), copies the original PDFs
through as downloads, and prints a manifest to check `content.js` against.
The originals are gitignored; what is committed is what somebody downloads.

It uses `sips` and PDFKit because both are already on the machine. A
portfolio that runs with no build step should not need a toolchain to add
pictures to it.

A long page is the exception to all of it. The specimen is 1920×8370, and
capping its long edge like everything else took it to 367px wide — every word
in it gone, to save bytes on a file whose entire content is words. Anything
taller than 2.5:1 is sized by width instead and scrolls inside its frame in
the viewer, the way the page it is a picture of would.

### The copy is a draft

Every title, summary and piece of alt text in `graphic` was written from what
is visibly in the images and nothing else, and says so in `content.js`. One
field is marked TODO — who the Benguiat specimen was made for — and a TODO is
a note to Safa, so the page renders one line less rather than printing the
word at a visitor.

## The CV

A `#/cv` route assembled from the same content as the rest of the site, so a
case study and the CV can never disagree — and **printed by the browser**
rather than shipped as a file. Her previous portfolio had a Download CV button
pointing at `href="#"` with nothing behind it; a PDF committed to the repo
would go stale the first time a fact changed.

`window.print()` on a page with a print stylesheet gives a real, selectable,
searchable PDF through *Save as PDF* — text, not a picture of text, which is
what a canvas-rendered PDF would be.

Experience is one list, newest first, and nothing in it is invented. An entry
that names a project is read straight back out of it — year, role, client,
result — so a case study and the CV cannot drift apart. The two roles with no
case study here carry their own copy instead of being left off, because a CV
that omits a job to protect an architectural invariant has the priorities the
wrong way round. The client's name is dropped from the line below the role,
where the project records it for readers who arrive at a case on its own: on
the CV it is already in the row above.

In print, the site's chrome goes (it is navigation, and paper does not
navigate), colour drops to black on white rather than being converted — a lime
heading costs real ink and reads as grey on the office laser printer this will
actually meet — and jobs get `break-inside: avoid`, because a CV that splits an
entry across two pages has failed at its one task. External links print their
address, since a printed word "LinkedIn" is a dead end.

It fits **one A4 page** — six roles, three education entries and all of it —
in both languages.

Getting there meant fixing something the first version only looked like it had
done. `body { font-size: 9.8pt }` set the body and nothing else: every size on
the sheet comes from a rem-based token, so the dates, the client lines and the
result notes went on printing at their screen size — 15px of secondary text
sitting under 9.8pt of primary. The print block now redeclares the type and
space scales in points, the unit paper actually uses.

The label gutter is 9rem on screen, where it sits in white space anyway; on
paper that width is taken from the only column that wraps, so it shrinks to the
width of the longest label. That label is Dutch — `VAARDIGHEDEN`, three
characters longer than `SKILLS` — and sizing the gutter to the English word
made it overlap the column beside it. A bilingual page has to be measured in
both languages, not translated once it fits.

## Both languages, all the way down

**EN / NL sits in the header**, visible without opening anything. It was only
in the Attune panel, 818px down inside a drawer nobody had opened — and the
panel is the wrong home for it. That is where someone goes to adjust how the
site behaves, and language is not a behaviour; for a bilingual city it is the
first thing a reader decides, before they have any reason to open settings.

Two buttons rather than one switch, because a single control labelled "NL"
never says whether it means *you are reading Dutch* or *press for Dutch*. Each
carries its own `lang` attribute so a screen reader pronounces Nederlands in
Dutch instead of reading it as English, `aria-pressed` states which one you
are in, and the active half is filled rather than tinted so the state survives
greyscale. The panel control stays and the two stay in sync.


Every string is a `{ en, nl }` pair, and the toggle in the Attune panel
switches the whole application, not just the prose:

- Headings, body, case copy, card cues, next-case labels
- The tab names and the document title
- The **annotation layer's own kind labels** — an English "constraint" heading
  over a Dutch note is worse than no heading
- The contact field labels and the panel's own controls
- The **skip link** and the meta description, which live in the markup rather
  than being rendered and are therefore the easiest to forget
- Every spoken announcement. The whole point of saying out loud what changed
  is that the person understands it, so saying it in English to someone
  reading Dutch defeats the feature entirely

A Dutch-locale visitor lands in Dutch without touching anything, and the
choice persists across reloads. `attune.js` keeps English fallbacks so it
still works as a standalone module; the page supplies the translations.

## Two modes, both signed

**Full** — a live WebGL ground that warms where your pointer is, display type at
Fraunces' optical extreme, content that arrives rather than appears.

**Calm** — not full mode with the effects stripped out. A different object: an
editorial grid, numbered sections, hairline rules, paper grain laid in CSS.

Neither is an apology for the other. If your device asks for reduced motion you
land in calm, and the site tells you it listened.

## Dark and light are a separate question

They used not to be. `full` meant dark **and** moving; `calm` meant paper **and**
still. So a visitor who wanted the work to hold still could not have it on her
dark ground, and a visitor reading on a light desktop in daylight could not have
the canvas. Nobody asked for either trade — it was an accident of two decisions
sharing one attribute.

`[data-theme]` now decides colour and `[data-mode]` decides behaviour, so all
four combinations exist and all four are designed. Calm on the dark theme —
Fraunces, numbered sections, the risograph cat, nothing moving, on her own
near-black — is a state the site could not previously say.

The theme follows `prefers-color-scheme`, on the same rule as the other axes:
the operating system is asked first and believed. A machine that expresses no
preference gets her dark ground.

**The control is in the header**, beside EN / NL, for the reason EN / NL is
there: someone deciding whether they can read this page in daylight is not
going to open a settings panel to find out. It lived only in Attune at first,
and the first person to want it could not find it — which is the whole
argument, made by the only test that counts.

It is the language pair's component, wearing drawn glyphs instead of two
letters: **two buttons, not one switch**, because a lone button showing a moon
never says whether it means *you are in the dark theme* or *press for the dark
theme*, and those are opposites. `aria-pressed` states which half you are in,
the active half is filled rather than tinted so the state survives greyscale,
and the glyphs are inline SVG rather than ☀ and ☾ — the same character arrives
as flat text on one machine and a colour pictograph on another, and a colour
pictograph cannot take `--accent-ink` when its half is filled.

The panel control stays, and the two stay in sync — the panel's radios are
rendered once with their state baked in, so a change from anywhere now writes
back to them. That is written for every axis rather than for this one, because
the next control moved out of the panel would have the same bug and nobody
would think to look for it.

Adding a fourth item to the header meant admitting it already overflowed: at
430px the Attune button was cut in half, before any of this. The three
controls now travel as one group that will not shrink, so on a narrow phone
they wrap together to their own line instead of the last of them falling off
the edge — and below 40rem the opener drops to its glyph, keeping its name in
`aria-label`. It holds at 330px and at the largest text size, which the site
offers and which makes every one of these numbers bigger.

### The accent is three roles

The lime was one token doing two incompatible jobs. On the dark ground a single
value could be both a fill with text on it and a mark drawn on the page, which
is why it was never noticed. On paper it cannot be: `#C8E65A` is 12.1:1 against
the ink sitting on it and 1.2:1 against the paper beside it — a perfect button
and an invisible active-tab dot, from the same value.

| token | job | dark | light |
| --- | --- | --- | --- |
| `--accent` | the fill | `#C8E65A` | `#C8E65A` — the brand lime survives |
| `--accent-ink` | what sits on it | `#1C1C1C` | `#1C1C1C` — 12.1:1 |
| `--accent-text` | the mark on the page | `#C8E65A` | `#5C7210` — 4.8:1 |

Project colours split the same way, for the same reason: `--c-velotech` rules a
3px line across a card and `--c-velotech-ink` writes the project's name, and a
line needs 3:1 where a name needs 4.5:1.

### Every pairing is measured

```sh
node tools/contrast.mjs        # 144 pairings, four palettes, non-zero on failure
```

It reads `styles/tokens.css` rather than keeping its own copy of the palette —
a checker with its own copy is a checker that passes while the site fails — and
composites the translucent rules over the grounds they actually sit on. Running
it against the file for the first time turned up five things that were already
shipping:

- **The light accent was documented at 4.9:1 and measured 3.5:1.** It had never
  been run.
- **The light high-contrast accent was documented at 7.4:1 and measured 6.8:1.**
- **VeloTech's blue sat at 2.5:1 on the dark ground** — the identity of a whole
  case, on a rule you could not see. Its annotation on the Access page claimed
  3.1:1, which is the argument for the tool in one line.
- **The focus ring on the language toggle was drawn in the colour it was drawn
  on.** That ring is the one on this site that sits inset rather than on the
  page, so on the pressed half it landed on the lime fill — in the dark theme
  `--focus` *is* that lime. 1:1, on the only control in the header.
- **Printing in high contrast produced a blank page.** The print block's
  selector listed the two modes, which had exactly the same specificity as
  `[data-theme][data-contrast]` and lost to it, so `--text: #ffffff` went onto
  white paper. Someone would have found that by printing their own CV.

A sixth is a judgement rather than a failure: control borders were drawn with
`--line-strong` at 2.0:1. There is now a third weight, `--edge`, which clears
3:1 in all four palettes and is used only where a line is the boundary of
something you can press. `--line-strong` frames a card and `--line` divides a
list; the checker reports both without a target, because "not required here" is
a judgement worth being able to see and argue with.

### What the canvas had to learn

The live ground and the particle cat were both written against a dark sky, in
ways that are invisible until the sky changes.

The field added its mesh to the ground — the same thing as mixing, while the
ground is near-black, and nothing at all once it is paper, since adding lime to
`#F4F0E8` pushes every channel to 1.0. It mixes now, which lands within about 1%
of the dark values it was tuned at. Its vignette multiplied toward black, which
on paper is not a vignette but a smudge; it now mixes toward whichever end the
ground is not.

The swarm blended additively, so density read as light. Sixteen layers of
`#14120F` add up to cream: on the light theme the cat's eyes — the densest part
of the cloud — came out as two pale holes punched through its face. On ink the
particles still build light; on paper they build ink.

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
tools/contrast.mjs    every pairing in four palettes, measured from the tokens
tools/graphic-assets.mjs  the graphic design folder, made web-weight
tools/pdf-pages.swift     a PDF carousel, one image per page
styles/graphic.css    the wall and the viewer
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
