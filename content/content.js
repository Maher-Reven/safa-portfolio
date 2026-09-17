/* =========================================================================
   content.js — everything the site says, in both languages, in one file.
   -------------------------------------------------------------------------
   This is the only file Safa needs to open to update the site. No build
   step, no CMS, no markdown pipeline. Edit, save, refresh.

   Every string is a pair: { en: "...", nl: "..." }
   If a Dutch string is missing the site falls back to English rather than
   showing an empty space.

   PROJECTS marked `placeholder: true` are scaffolding. Replace them with
   real work — the shape is the contract, the content is yours.
   ========================================================================= */

export const meta = {
  name: "Safa Mohalaia",
  role: {
    en: "Digital designer",
    nl: "Digitaal ontwerper",
  },
  location: "Amsterdam",
  email: "hello@example.com",           // TODO: real address
  links: [
    { label: "Behance",  href: "#" },   // TODO: real links
    { label: "LinkedIn", href: "#" },
    { label: "GitHub",   href: "https://github.com/sofy98" },
  ],
};

/* -------------------------------------------------------------------------
   THE OPENING QUESTION
   The site asks who is looking before it decides what to be. This is the
   human-centred process run on the visitor, live, rather than described
   in a paragraph about human-centred process.
   ------------------------------------------------------------------------- */
export const audiences = [
  {
    id: "hiring",
    label:  { en: "I'm hiring",          nl: "Ik werf" },
    detail: { en: "Forty seconds. CV first, three projects, done.",
              nl: "Veertig seconden. Eerst het cv, drie projecten, klaar." },
    order: ["intro", "cv", "work", "contact"],
    depth: "brief",
  },
  {
    id: "designer",
    label:  { en: "I'm a designer",      nl: "Ik ben ontwerper" },
    detail: { en: "The process, the rejected drafts, the decisions and why.",
              nl: "Het proces, de afgekeurde schetsen, de keuzes en waarom." },
    order: ["intro", "work", "process", "detail-index", "about", "contact"],
    depth: "deep",
  },
  {
    id: "client",
    label:  { en: "I have a project",    nl: "Ik heb een opdracht" },
    detail: { en: "What I do, how I work, and what it asks of you.",
              nl: "Wat ik doe, hoe ik werk, en wat het van jou vraagt." },
    order: ["intro", "services", "work", "process", "contact"],
    depth: "brief",
  },
  {
    id: "curious",
    label:  { en: "Just looking",        nl: "Ik kijk even rond" },
    detail: { en: "No order imposed. Everything is open.",
              nl: "Geen volgorde opgelegd. Alles staat open." },
    order: ["intro", "work", "about", "process", "detail-index", "cv", "contact"],
    depth: "deep",
  },
];

/* -------------------------------------------------------------------------
   INTRO — the only text on the first screen.
   ------------------------------------------------------------------------- */
export const intro = {
  statement: {
    en: "I design digital things that notice the person using them.",
    nl: "Ik ontwerp digitale dingen die de mens die ze gebruikt opmerken.",
  },
  sub: {
    en: "Human-centred by training, obsessive by temperament, accessible because anything else is a design that decided some people don't count.",
    nl: "Human-centred opgeleid, obsessief van aard, toegankelijk omdat alles daarbuiten een ontwerp is dat besloot dat sommige mensen niet meetellen.",
  },
  /* Shown once, on first visit, under the audience question. */
  invitation: {
    en: "This site rearranges itself depending on who you are. Tell it, or don't — everything stays reachable either way.",
    nl: "Deze site herschikt zichzelf op basis van wie je bent. Vertel het, of niet — alles blijft hoe dan ook bereikbaar.",
  },
};

/* -------------------------------------------------------------------------
   WORK
   `details` are the annotation layer: the things only a person who looks
   closely would ever find. Each one is a real decision with a real reason.
   ------------------------------------------------------------------------- */
export const projects = [
  {
    slug: "placeholder-one",
    placeholder: true,
    year: "2025",
    title:      { en: "Project title",  nl: "Projecttitel" },
    discipline: { en: "Interaction design · Research", nl: "Interactieontwerp · Onderzoek" },
    role:       { en: "Design lead",    nl: "Ontwerplead" },
    summary: {
      en: "One paragraph: the problem as the people in it experienced it, not as the brief described it.",
      nl: "Eén alinea: het probleem zoals de mensen erin het ervoeren, niet zoals de briefing het omschreef.",
    },
    cover: { src: "assets/work/placeholder-1.svg", alt: { en: "", nl: "" } },
    details: [
      { kind: "colour", value: "#e8402a",
        note: { en: "Chosen for 3.6:1 against the ground — display type only. Body copy uses the deeper cut at 5.7:1.",
                nl: "Gekozen voor 3,6:1 op de ondergrond — alleen displaytekst. Broodtekst gebruikt de diepere versie op 5,7:1." } },
      { kind: "spacing", value: "24px",
        note: { en: "The one gap that made the card scannable at arm's length on a phone.",
                nl: "De ene marge die de kaart op armlengte op een telefoon scanbaar maakte." } },
      { kind: "rejected",
        note: { en: "The version before this one tested well and felt wrong. Kept here because the difference is the whole argument.",
                nl: "De versie hiervoor testte goed en voelde fout. Hier bewaard omdat het verschil het hele argument is." } },
    ],
  },
  {
    slug: "placeholder-two",
    placeholder: true,
    year: "2024",
    title:      { en: "Project title", nl: "Projecttitel" },
    discipline: { en: "Visual identity · Motion", nl: "Visuele identiteit · Motion" },
    role:       { en: "Designer", nl: "Ontwerper" },
    summary: { en: "", nl: "" },
    cover: { src: "assets/work/placeholder-2.svg", alt: { en: "", nl: "" } },
    details: [],
  },
  {
    /* The one real project we have. Kept because it is honest and because
       the accessibility audit inside it is genuinely unusual for a first
       year — most portfolios claim a11y, this one has the test notes. */
    slug: "cmd-rebuild",
    placeholder: false,
    year: "2023",
    title:      { en: "Rebuilding CMD Amsterdam, by hand",
                  nl: "CMD Amsterdam met de hand herbouwen" },
    discipline: { en: "Front-end · Accessibility audit",
                  nl: "Front-end · Toegankelijkheidsaudit" },
    role:       { en: "Everything", nl: "Alles" },
    summary: {
      en: "A first-year brief: rebuild your own school's website in hand-written HTML and CSS, no frameworks, no classes. I treated it as an accessibility audit instead of a copying exercise — VoiceOver pass, contrast measurement, colour-blindness and blurred-vision simulation, written up honestly including what I could not fix.",
      nl: "Een eerstejaarsopdracht: bouw de website van je eigen opleiding na in handgeschreven HTML en CSS, zonder frameworks, zonder classes. Ik behandelde het als een toegankelijkheidsaudit in plaats van een overschrijfoefening — VoiceOver-test, contrastmeting, kleurenblindheid- en wazigzichtsimulatie, eerlijk opgeschreven inclusief wat ik niet kon oplossen.",
    },
    cover: { src: "assets/work/cmd-rebuild.svg",
             alt: { en: "The rebuilt CMD Amsterdam homepage on a phone",
                    nl: "De nagebouwde CMD Amsterdam-homepage op een telefoon" } },
    href: "https://github.com/sofy98/Blokweb",
    details: [
      { kind: "finding", value: "red on yellow",
        note: { en: "Failed contrast. It appeared twice on the whole site, which is exactly why it had survived review — nobody looks at two words.",
                nl: "Zakte voor contrast. Het kwam twee keer voor op de hele site, en juist daarom was het door de review geglipt — niemand kijkt naar twee woorden." } },
      { kind: "finding", value: "blurred vision",
        note: { en: "The only simulation the page failed. Everything else passed, including full colour-blindness. I wrote it down rather than quietly dropping it.",
                nl: "De enige simulatie waarvoor de pagina zakte. Al het andere slaagde, inclusief volledige kleurenblindheid. Ik schreef het op in plaats van het stil te laten vallen." } },
      { kind: "finding", value: "a missing button",
        note: { en: "VoiceOver found a control I had built wrong in the HTML. The screen reader found it before I did. That is the lesson.",
                nl: "VoiceOver vond een element dat ik verkeerd in de HTML had gebouwd. De screenreader vond het eerder dan ik. Dat is de les." } },
      { kind: "rejected",
        note: { en: "I built the hamburger menu twice — once in CSS, then again in JavaScript — because I wanted to know which one a keyboard user would prefer.",
                nl: "Ik bouwde het hamburgermenu twee keer — eerst in CSS, daarna in JavaScript — omdat ik wilde weten welke een toetsenbordgebruiker zou verkiezen." } },
    ],
  },
];

/* -------------------------------------------------------------------------
   ABOUT / PROCESS / CV / SERVICES — kept short on purpose.
   ------------------------------------------------------------------------- */
export const about = {
  body: {
    en: [
      "I studied Communication and Multimedia Design in Amsterdam, where the first thing they teach you is that the design process starts with the people, not the screen.",
      "In practice that means I spend a long time on things nobody is supposed to notice: the gap that makes a card readable at arm's length, the contrast ratio that decides whether a sentence exists for someone, the two words in a corner that fail a test everyone else passed.",
      "I am a perfectionist about detail and honest about what I could not get right. Both are on this site.",
    ],
    nl: [
      "Ik studeerde Communication and Multimedia Design in Amsterdam, waar ze je als eerste leren dat het ontwerpproces bij de mens begint, niet bij het scherm.",
      "In de praktijk betekent dat dat ik lang bezig ben met dingen die niemand hoort op te merken: de marge die een kaart op armlengte leesbaar maakt, de contrastverhouding die bepaalt of een zin voor iemand bestaat, de twee woorden in een hoek die zakken voor een test die iedereen verder haalde.",
      "Ik ben perfectionistisch over detail en eerlijk over wat ik niet goed kreeg. Beide staan op deze site.",
    ],
  },
};

export const process = {
  steps: [
    { title: { en: "Ask who",      nl: "Vraag wie" },
      body:  { en: "Before anything is drawn. The brief describes a problem; the people in it describe a different one.",
               nl: "Voor er iets getekend is. De briefing beschrijft een probleem; de mensen erin beschrijven een ander." } },
    { title: { en: "Make it badly, fast", nl: "Maak het slecht, snel" },
      body:  { en: "Prototypes exist to be wrong in public early, where being wrong is cheap.",
               nl: "Prototypes bestaan om vroeg en in het openbaar fout te zijn, waar fout zijn goedkoop is." } },
    { title: { en: "Test with the person it excludes", nl: "Test met wie het buitensluit" },
      body:  { en: "Screen reader, keyboard only, low vision, no colour, bad light, one hand. The edge is the design.",
               nl: "Screenreader, alleen toetsenbord, slechtziend, geen kleur, slecht licht, één hand. De rand is het ontwerp." } },
    { title: { en: "Then obsess",  nl: "Dan pas obsederen" },
      body:  { en: "Only once it works for everyone is it worth spending three days on a single margin. And it is worth it.",
               nl: "Pas als het voor iedereen werkt, is het waard om drie dagen aan één marge te besteden. En dat is het waard." } },
  ],
};

export const services = {
  items: [
    { en: "Interaction and interface design", nl: "Interactie- en interfaceontwerp" },
    { en: "Accessibility audits, written so a non-specialist can act on them",
      nl: "Toegankelijkheidsaudits, geschreven zodat een niet-specialist ermee aan de slag kan" },
    { en: "Design systems small enough that a team actually uses them",
      nl: "Designsystemen die klein genoeg zijn dat een team ze echt gebruikt" },
    { en: "Front-end, hand-written, when the design deserves it",
      nl: "Front-end, met de hand geschreven, als het ontwerp het verdient" },
  ],
};

export const cv = {
  /* TODO: replace with the real record */
  rows: [
    { period: "2022–2026", what: { en: "BA Communication and Multimedia Design, HvA Amsterdam",
                                   nl: "BA Communication and Multimedia Design, HvA Amsterdam" } },
  ],
};

export const ui = {
  attuneTitle:   { en: "Attune",            nl: "Afstemmen" },
  attuneIntro:   { en: "This is not a settings menu hidden in a footer. It is how the site works.",
                   nl: "Dit is geen instellingenmenu verstopt in een footer. Zo werkt deze site." },
  modeLabel:     { en: "Mode",              nl: "Modus" },
  modeFull:      { en: "Full",              nl: "Vol" },
  modeCalm:      { en: "Calm",              nl: "Rustig" },
  readingLabel:  { en: "Reading type",      nl: "Leesletter" },
  textsizeLabel: { en: "Text size",         nl: "Tekstgrootte" },
  contrastLabel: { en: "Contrast",          nl: "Contrast" },
  langLabel:     { en: "Language",          nl: "Taal" },
  audienceLabel: { en: "Who's looking",     nl: "Wie kijkt er" },
  systemNote:    { en: "Your device already asked for this.",
                   nl: "Je apparaat vroeg hier al om." },
  detailHint:    { en: "Look closer",       nl: "Kijk beter" },
  closeLabel:    { en: "Close",             nl: "Sluiten" },
};
