/* =========================================================================
   content.js — everything the site says, in both languages, in one file.
   -------------------------------------------------------------------------
   This is the only file Safa needs to open to change the site. No build
   step, no CMS. Edit, save, refresh.

   Every string is a pair: { en: "…", nl: "…" }. A missing Dutch string
   falls back to English rather than leaving a hole on the page.

   Project copy, imagery and contact details are her own, carried over from
   her live portfolio. The `details` arrays are the annotation layer: the
   decisions behind the work, disclosed only to visitors who look closer.
   Entries marked TODO are hers to write — nothing is invented for her.
   ========================================================================= */

export const meta = {
  name: "Safa Mohalaia",
  role:    { en: "UX / UI Designer", nl: "UX / UI Designer" },
  located: { en: "Amsterdam, NL",    nl: "Amsterdam, NL" },
  email: "safamuh98@icloud.com",
  phone: "+31 6 38 13 61 34",
  available: {
    en: "Open for freelance and full-time work",
    nl: "Open voor freelance en vast werk",
  },
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sofy-m-93474b174" },
    { label: "GitHub",   href: "https://github.com/sofy98" },
  ],
};

/* -------------------------------------------------------------------------
   THE OPENING QUESTION
   The site asks who is looking before it decides what to be. Human-centred
   design run on the visitor, live, instead of a paragraph claiming it.
   ------------------------------------------------------------------------- */
export const audiences = [
  {
    id: "hiring",
    label:  { en: "I'm hiring",          nl: "Ik werf" },
    detail: { en: "Forty seconds. Outcomes first, then the work, then how to reach me.",
              nl: "Veertig seconden. Eerst resultaten, dan het werk, dan hoe je me bereikt." },
    order: ["outcomes", "work", "skills", "contact"],
  },
  {
    id: "designer",
    label:  { en: "I'm a designer",      nl: "Ik ben ontwerper" },
    detail: { en: "Process, decisions, and the accessibility work underneath all of it.",
              nl: "Proces, keuzes, en het toegankelijkheidswerk daaronder." },
    order: ["work", "process", "accessibility", "detail-index", "about", "contact"],
  },
  {
    id: "client",
    label:  { en: "I have a project",    nl: "Ik heb een opdracht" },
    detail: { en: "What I do, how I work, and what it asks of you.",
              nl: "Wat ik doe, hoe ik werk, en wat het van jou vraagt." },
    order: ["outcomes", "skills", "work", "process", "contact"],
  },
  {
    id: "curious",
    label:  { en: "Just looking",        nl: "Ik kijk even rond" },
    detail: { en: "No order imposed. Everything is open.",
              nl: "Geen volgorde opgelegd. Alles staat open." },
    order: ["work", "about", "process", "accessibility", "skills", "detail-index", "contact"],
  },
];

export const intro = {
  kicker:  { en: "Portfolio · MMXXVI", nl: "Portfolio · MMXXVI" },
  statement: {
    en: "Turning complexity into clarity, one interface at a time.",
    nl: "Complexiteit omzetten in helderheid, één interface tegelijk.",
  },
  sub: {
    en: "UX / UI Designer in Amsterdam. Healthcare, civic infrastructure, community platforms — the kind of products where a confusing screen has a cost.",
    nl: "UX / UI Designer in Amsterdam. Zorg, publieke infrastructuur, communityplatforms — het soort producten waar een verwarrend scherm een prijs heeft.",
  },
  invitation: {
    en: "This site rearranges itself depending on who you are. Tell it, or don't — everything stays reachable either way.",
    nl: "Deze site herschikt zichzelf op basis van wie je bent. Vertel het, of niet — alles blijft hoe dan ook bereikbaar.",
  },
};

/* -------------------------------------------------------------------------
   OUTCOMES — the numbers, alone, for the visitor with forty seconds.
   Every figure here is from the work itself, not from a rounding-up.
   ------------------------------------------------------------------------- */
export const outcomes = [
  { figure: "13",     label: { en: "cities running VeloTech.AI",      nl: "steden draaien VeloTech.AI" } },
  { figure: "€150K+", label: { en: "early revenue it helped generate", nl: "vroege omzet mede gegenereerd" } },
  { figure: "7",      label: { en: "pilot clients",                    nl: "pilotklanten" } },
  { figure: "4",      label: { en: "products shipped since 2024",      nl: "producten opgeleverd sinds 2024" } },
];

/* -------------------------------------------------------------------------
   WORK — four real projects. Copy and imagery are hers.
   ------------------------------------------------------------------------- */
export const projects = [
  {
    slug: "velotech",
    colour: "var(--c-velotech)",
    year: "2025 — 2026",
    title:      { en: "VeloTech.AI", nl: "VeloTech.AI" },
    company:    { en: "VeloTech.AI · Freelance", nl: "VeloTech.AI · Freelance" },
    discipline: { en: "Dashboard · Civic infrastructure",
                  nl: "Dashboard · Publieke infrastructuur" },
    role:       { en: "Product Designer", nl: "Product Designer" },
    summary: {
      en: "Cities have a lot of infrastructure to maintain — road markings, street lights, signs. Inspecting all of it manually is slow, costly and hard to scale.",
      nl: "Steden hebben veel infrastructuur om te onderhouden — wegmarkeringen, straatverlichting, borden. Dit handmatig inspecteren is traag, duur en moeilijk schaalbaar.",
    },
    sections: {
      role: { en: "I designed the UI for the VeloTech.AI web app — the screens inspectors and city workers use to view and manage inspection results.",
              nl: "Ik ontwierp de UI voor de VeloTech.AI-webapp — de schermen die inspecteurs en gemeentemedewerkers gebruiken om inspectieresultaten te bekijken en te beheren." },
      process: { en: "I looked at how inspectors actually work, sketched out the main screens, and refined them against feedback and the real data the product uses.",
                 nl: "Ik bekeek hoe inspecteurs echt werken, schetste de belangrijkste schermen en verfijnde ze op basis van feedback en de echte data die het product gebruikt." },
      solution: { en: "A dashboard showing a live map, detected damage with severity scores, asset details and inspection history — plus reports and repair orders.",
                  nl: "Een dashboard met een live kaart, gedetecteerde schade met ernstscores, asset-details en inspectiegeschiedenis — plus rapporten en reparatieopdrachten." },
      result: { en: "The platform is now used in 13 cities with 7 pilot clients, and helped generate €150K+ in early revenue.",
                nl: "Het platform wordt nu gebruikt in 13 steden met 7 pilotklanten en hielp €150K+ aan vroege omzet te genereren." },
    },
    cover: { src: "assets/work/velotech-dashboard.png",
             alt: { en: "The VeloTech.AI dashboard: a live city map beside detected road damage with severity scores",
                    nl: "Het VeloTech.AI-dashboard: een live stadskaart naast gedetecteerde wegschade met ernstscores" } },
    shots: [
      { src: "assets/work/velotech-inspections.png", span: "half",
        alt: { en: "The inspections list, filtered by severity", nl: "De inspectielijst, gefilterd op ernst" } },
      { src: "assets/work/velotech-detail.png", span: "half",
        alt: { en: "A single asset's detail view with its inspection history", nl: "Detailweergave van één asset met inspectiegeschiedenis" } },
      { src: "assets/work/velotech-reports.png", span: "wide",
        alt: { en: "The reporting view, where inspections become repair orders", nl: "De rapportageweergave, waar inspecties reparatieopdrachten worden" } },
    ],
    details: [
      { kind: "colour", value: "#2F5D8C",
        note: { en: "Municipal blue, taken from the product's own chrome rather than assigned. On the dark ground it measures 3.1:1 — enough for a large surface, never enough for text, so no label is ever set in it.",
                nl: "Gemeenteblauw, genomen uit de chrome van het product zelf in plaats van toegewezen. Op de donkere ondergrond meet het 3,1:1 — genoeg voor een groot vlak, nooit genoeg voor tekst, dus geen enkel label is erin gezet." } },
      { kind: "constraint",
        note: { en: "Severity is never carried by colour alone. An inspector reading a map in daylight, or with any colour vision deficiency, still needs to rank damage — so severity is a score and a shape, and the colour is the third signal, not the first.",
                nl: "Ernst wordt nooit alleen door kleur gedragen. Een inspecteur die bij daglicht een kaart leest, of met welke kleurzichtstoornis dan ook, moet schade nog steeds kunnen rangschikken — dus ernst is een score en een vorm, en kleur is het derde signaal, niet het eerste." } },
    ],
  },

  {
    slug: "dentara",
    colour: "var(--c-dentara)",
    year: "2026",
    title:      { en: "Dentara", nl: "Dentara" },
    company:    { en: "Graduation project", nl: "Afstudeerproject" },
    discipline: { en: "Mobile · Healthcare", nl: "Mobiel · Zorg" },
    role:       { en: "Lead Designer", nl: "Lead Designer" },
    summary: {
      en: "Patients at a holistic dental practice felt overwhelmed by complex medical information, with no central place to review treatments or prepare for appointments.",
      nl: "Patiënten bij een holistische tandartspraktijk voelden zich overweldigd door complexe medische informatie, zonder centrale plek om behandelingen te bekijken of zich voor te bereiden op afspraken.",
    },
    sections: {
      role: { en: "Solo UX designer — research, concept, wireframes, visual design and prototype.",
              nl: "Solo UX-designer — onderzoek, concept, wireframes, visueel ontwerp en prototype." },
      process: { en: "Expert interviews, patient interviews, desk research, three concept directions, lo-fi and mid-fi testing, iterated into a full hi-fi prototype.",
                 nl: "Expertinterviews, patiëntinterviews, deskresearch, drie conceptrichtingen, lo-fi- en mid-fi-testen, geïtereerd naar een volledig hi-fi-prototype." },
      solution: { en: "A mobile app that guides patients through their care journey: a treatment preparation flow, an interactive tooth map, a personal health overview and a holistic care section.",
                  nl: "Een mobiele app die patiënten door hun zorgtraject begeleidt: een voorbereidingsflow voor behandelingen, een interactieve gebitskaart, een persoonlijk gezondheidsoverzicht en een holistische zorgsectie." },
      result: { en: "Patients understood the app quickly and valued the preparation feature most. The practice confirmed it would save time and strengthen the patient relationship.",
                nl: "Patiënten begrepen de app snel en waardeerden de voorbereidingsfunctie het meest. De praktijk bevestigde dat het tijd zou besparen en de band met de patiënt zou versterken." },
    },
    cover: { src: "assets/work/dentara-home.png",
             alt: { en: "Dentara's home screen: a personal greeting above the next appointment and a treatment progress summary",
                    nl: "Het startscherm van Dentara: een persoonlijke begroeting boven de volgende afspraak en een overzicht van de behandelvoortgang" } },
    shots: [
      { src: "assets/work/dentara-gebit.png", span: "half",
        alt: { en: "The interactive tooth map, where each tooth carries its own treatment history", nl: "De interactieve gebitskaart, waar elke tand zijn eigen behandelgeschiedenis draagt" } },
      { src: "assets/work/dentara-voorbereiden.png", span: "half",
        alt: { en: "The appointment preparation flow — the feature patients valued most", nl: "De voorbereidingsflow voor afspraken — de functie die patiënten het meest waardeerden" } },
      { src: "assets/work/dentara-historie.png", span: "half",
        alt: { en: "Treatment history, ordered by visit", nl: "Behandelgeschiedenis, geordend per bezoek" } },
      { src: "assets/work/dentara-holistisch.png", span: "half",
        alt: { en: "The holistic care section", nl: "De holistische zorgsectie" } },
    ],
    details: [
      { kind: "colour", value: "#E8A598",
        note: { en: "Blush, not clinical blue. Dental anxiety is the actual problem being designed against, and every convention of medical UI is a convention built for the practice, not the patient.",
                nl: "Blush, geen klinisch blauw. Tandartsangst is het werkelijke probleem waartegen ontworpen wordt, en elke conventie van medische UI is een conventie gebouwd voor de praktijk, niet voor de patiënt." } },
      { kind: "finding",
        note: { en: "Testing said the preparation flow mattered most — not the tooth map, which was the more impressive thing to build. The research disagreed with the instinct and the research won.",
                nl: "Uit de tests bleek de voorbereidingsflow het belangrijkst — niet de gebitskaart, die indrukwekkender was om te bouwen. Het onderzoek was het oneens met het instinct en het onderzoek won." } },
      /* TODO (Safa): the tooth map is the most interesting interaction in
         this project and the one thing a designer reading this will want to
         know about. One line on how a patient with limited dexterity or a
         screen reader reaches a single tooth would be the strongest
         annotation on the whole site. */
    ],
  },

  {
    slug: "pubhubs",
    colour: "var(--c-pubhubs)",
    year: "2024 — 2025",
    title:      { en: "PubHubs", nl: "PubHubs" },
    company:    { en: "PubHubs · Freelance", nl: "PubHubs · Freelance" },
    discipline: { en: "Community platform", nl: "Communityplatform" },
    role:       { en: "UX / UI Designer", nl: "UX / UI Designer" },
    summary: {
      en: "Students inside the organisation had no easy way to find each other — no central place to find communities, join discussions, or reach a fellow student.",
      nl: "Studenten binnen de organisatie hadden geen makkelijke manier om elkaar te vinden — geen centrale plek voor communities, discussies of medestudenten.",
    },
    sections: {
      role: { en: "I designed the full platform — from the community overview to the chat rooms and the search system.",
              nl: "Ik ontwierp het volledige platform — van het community-overzicht tot de chatrooms en het zoeksysteem." },
      process: { en: "I focused on how students find people and topics, and designed the search and filter system so the right room, topic or person is reachable quickly.",
                 nl: "Ik richtte me op hoe studenten mensen en onderwerpen vinden, en ontwierp het zoek- en filtersysteem zodat de juiste room, het juiste onderwerp of de juiste persoon snel bereikbaar is." },
      solution: { en: "A platform where students browse communities, join public rooms, filter by topic or level, and chat one to one — in one dark, quiet interface.",
                  nl: "Een platform waar studenten communities verkennen, openbare rooms joinen, filteren op onderwerp of niveau en één-op-één chatten — in één donkere, rustige interface." },
      result: { en: "A clear way for students to connect inside the organisation, with search and filtering at the core so nothing is hard to find.",
                nl: "Een duidelijke manier voor studenten om binnen de organisatie in contact te komen, met zoeken en filteren als kern zodat niets moeilijk te vinden is." },
    },
    cover: { src: "assets/work/pubhubs.png",
             alt: { en: "The PubHubs community platform: room list, active conversation and member sidebar",
                    nl: "Het PubHubs-communityplatform: roomlijst, actief gesprek en ledenzijbalk" } },
    shots: [
      { src: "assets/work/pubhubs-communities.png", span: "half",
        alt: { en: "The community overview, filterable by topic and level", nl: "Het community-overzicht, filterbaar op onderwerp en niveau" } },
      { src: "assets/work/pubhubs-rooms.png", span: "half",
        alt: { en: "Public rooms, ranked by activity", nl: "Openbare rooms, gerangschikt op activiteit" } },
      { src: "assets/work/pubhubs-chat.png", span: "wide",
        alt: { en: "One-to-one chat", nl: "Één-op-één chat" } },
    ],
    details: [
      { kind: "decision",
        note: { en: "Search and filter were designed first, before the rooms they search. In a platform whose whole purpose is finding people, the finding mechanism is the product and the rooms are its content.",
                nl: "Zoeken en filteren zijn als eerste ontworpen, vóór de rooms die ze doorzoeken. In een platform dat bestaat om mensen te vinden, is het vindmechanisme het product en zijn de rooms de inhoud." } },
    ],
  },

  {
    slug: "medialab",
    colour: "var(--c-medialab)",
    year: "2024 — 2025",
    title:      { en: "MediaLab", nl: "MediaLab" },
    company:    { en: "MediaLab · Internship", nl: "MediaLab · Stage" },
    discipline: { en: "Mobile + dashboard redesign", nl: "Mobiel + dashboard-herontwerp" },
    role:       { en: "UX Designer", nl: "UX Designer" },
    summary: {
      en: "MediaLab's existing app felt outdated and inconsistent. Users needed a cleaner way to manage and share media files.",
      nl: "De bestaande app van MediaLab voelde verouderd en inconsistent. Gebruikers hadden een strakkere manier nodig om mediabestanden te beheren en te delen.",
    },
    sections: {
      role: { en: "I redesigned the MediaLab mobile app and web dashboard — navigation, file browsing, and the overall visual style.",
              nl: "Ik herontwierp de MediaLab mobiele app en het webdashboard — navigatie, bestandsbeheer en de algehele visuele stijl." },
      process: { en: "I audited the existing app for what felt cluttered or confusing, then explored a darker direction and redesigned the folder view, file grid and main dashboard.",
                 nl: "Ik auditeerde de bestaande app op wat rommelig of verwarrend voelde, verkende een donkerdere richting en herontwierp het mapoverzicht, het bestandsraster en het hoofddashboard." },
      solution: { en: "A dark-themed redesign with cleaner folder navigation, a better grid for media files, and a dashboard showing connections, workflows and activity at a glance.",
                  nl: "Een herontwerp met donker thema, strakkere mapnavigatie, een beter raster voor mediabestanden en een dashboard dat connecties, workflows en activiteit in één oogopslag toont." },
      result: { en: "A more consistent product that sits closer to modern media tools, and makes files easier to find, manage and share.",
                nl: "Een consistenter product dat dichter bij moderne mediatools staat en bestanden makkelijker vindbaar, beheerbaar en deelbaar maakt." },
    },
    cover: { src: "assets/work/medialab-dashboard.png",
             alt: { en: "The redesigned MediaLab dashboard: connections, workflows and recent activity in one view",
                    nl: "Het herontworpen MediaLab-dashboard: connecties, workflows en recente activiteit in één weergave" } },
    shots: [
      { src: "assets/work/medialab-folders.png", span: "half",
        alt: { en: "Folder navigation after the redesign", nl: "Mapnavigatie na het herontwerp" } },
      { src: "assets/work/medialab-info.png", span: "half",
        alt: { en: "A file's detail panel", nl: "Het detailpaneel van een bestand" } },
      { src: "assets/work/medialab.png", span: "half",
        alt: { en: "The mobile app's media grid", nl: "Het mediaraster van de mobiele app" } },
      { src: "assets/work/medialab-2.png", span: "half",
        alt: { en: "Mobile file browsing", nl: "Bestanden bekijken op mobiel" } },
    ],
    details: [
      { kind: "constraint",
        note: { en: "A dark theme is a decision about someone's eyes, not a style. It suits a tool used for hours against bright media thumbnails; it suits low-vision readers far less. That is the trade this product made, and it is why this site refuses to make the same one for you.",
                nl: "Een donker thema is een keuze over iemands ogen, geen stijl. Het past bij een tool die uren wordt gebruikt tegen felle mediathumbnails; het past slechtzienden veel minder. Dat is de afweging die dit product maakte, en daarom weigert deze site die keuze voor jou te maken." } },
    ],
  },
];

/* -------------------------------------------------------------------------
   ACCESSIBILITY — where this site's behaviour comes from.
   These findings are real, from her own first accessibility audit in 2023:
   she tested her work with VoiceOver, a contrast checker, and Chrome's
   colour-vision and blurred-vision simulations, and wrote up what failed.
   Most portfolios claim accessibility. This one has the test notes.
   ------------------------------------------------------------------------- */
export const accessibility = {
  lead: {
    en: "In 2023, on a first-year assignment, I ran my own work through a screen reader, a contrast checker and Chrome's vision simulations, and wrote down everything that failed. Three things did. Every one of them taught me something I now build in from the start — including into this site.",
    nl: "In 2023, bij een eerstejaarsopdracht, haalde ik mijn eigen werk door een screenreader, een contrastchecker en de zichtsimulaties van Chrome, en schreef ik op wat er faalde. Drie dingen faalden. Elk daarvan leerde me iets dat ik nu vanaf het begin inbouw — ook in deze site.",
  },
  findings: [
    { value: { en: "red on yellow", nl: "rood op geel" },
      note: { en: "Failed contrast. It appeared twice on the entire site — which is exactly why it had survived every review. Nobody checks two words.",
              nl: "Zakte voor contrast. Het kwam twee keer voor op de hele site — en juist daarom was het door elke review geglipt. Niemand controleert twee woorden." } },
    { value: { en: "blurred vision", nl: "wazig zicht" },
      note: { en: "The only simulation the page failed. Full colour-blindness passed; reduced contrast passed. I wrote the failure down instead of quietly dropping it.",
              nl: "De enige simulatie waarvoor de pagina zakte. Volledige kleurenblindheid slaagde; verlaagd contrast slaagde. Ik schreef het falen op in plaats van het stil te laten vallen." } },
    { value: { en: "a missing button", nl: "een ontbrekende knop" },
      note: { en: "VoiceOver found a control I had built wrong in the HTML. The screen reader found it before I did. That is the whole lesson: the test is not a formality, it is a better reader than you are.",
              nl: "VoiceOver vond een element dat ik verkeerd in de HTML had gebouwd. De screenreader vond het eerder dan ik. Dat is de hele les: de test is geen formaliteit, het is een betere lezer dan jij bent." } },
  ],
  close: {
    en: "That is why this site asks your device what you need before it decides what to be, why it has two fully designed modes instead of one and a fallback, and why it tells you out loud whenever it changes something.",
    nl: "Daarom vraagt deze site aan je apparaat wat je nodig hebt voordat hij besluit wat hij wordt, daarom heeft hij twee volledig ontworpen modi in plaats van één plus een terugval, en daarom zegt hij hardop wanneer hij iets verandert.",
  },
  source: { label: "github.com/sofy98/Blokweb", href: "https://github.com/sofy98/Blokweb" },
};

export const about = {
  body: {
    en: [
      "I'm a UX/UI designer in Amsterdam, specialising in turning complexity into clarity. Whether it's a dashboard, a mobile app or a design system, I approach it the same way: understand it deeply, structure it carefully, design it beautifully.",
      "The products I've worked on share something. A city inspector ranking road damage, a patient trying to understand a treatment, a student looking for one person in a crowd — in all of them, a confusing screen has a cost that somebody other than me pays.",
      "So I spend a long time on things nobody is supposed to notice. The margin that makes a card readable at arm's length. The contrast ratio that decides whether a sentence exists for someone. The two words in a corner that fail a test everything else passed.",
    ],
    nl: [
      "Ik ben UX/UI-designer in Amsterdam, gespecialiseerd in het omzetten van complexiteit naar helderheid. Of het nu een dashboard, een mobiele app of een designsysteem is, ik pak het hetzelfde aan: diep begrijpen, zorgvuldig structureren, mooi ontwerpen.",
      "De producten waaraan ik werkte hebben iets gemeen. Een stadsinspecteur die wegschade rangschikt, een patiënt die een behandeling probeert te begrijpen, een student die één persoon zoekt in een menigte — in al die gevallen heeft een verwarrend scherm een prijs die iemand anders dan ik betaalt.",
      "Dus besteed ik lang aan dingen die niemand hoort op te merken. De marge die een kaart op armlengte leesbaar maakt. De contrastverhouding die bepaalt of een zin voor iemand bestaat. De twee woorden in een hoek die zakken voor een test die al het andere haalde.",
    ],
  },
};

export const process = {
  steps: [
    { n: "01", title: { en: "Research", nl: "Onderzoek" },
      body: { en: "Talk to users, dig into data, understand context.", nl: "Praat met gebruikers, duik in data, begrijp de context." } },
    { n: "02", title: { en: "Define", nl: "Definiëren" },
      body: { en: "Synthesise insights, sharpen the problem.", nl: "Inzichten samenbrengen, het probleem aanscherpen." } },
    { n: "03", title: { en: "Ideate", nl: "Ideeën" },
      body: { en: "Sketch, explore, diverge before committing.", nl: "Schetsen, verkennen, divergeren voor je kiest." } },
    { n: "04", title: { en: "Design", nl: "Ontwerpen" },
      body: { en: "Wireframes to hi-fi, inside the chosen system.", nl: "Van wireframes naar hi-fi, binnen het gekozen systeem." } },
    { n: "05", title: { en: "Test", nl: "Testen" },
      body: { en: "Usability sessions, iterate, refine.", nl: "Usability-sessies, itereren, verfijnen." } },
    { n: "06", title: { en: "Deliver", nl: "Opleveren" },
      body: { en: "Hand off with care — specs, docs, motion.", nl: "Zorgvuldig overdragen — specs, documentatie, motion." } },
  ],
};

export const skills = {
  columns: [
    { key: "A", eyebrow: { en: "Methodology", nl: "Methodologie" },
      title: { en: "UX & design thinking", nl: "UX & design thinking" },
      items: [
        { en: "UX research", nl: "UX-onderzoek" },
        { en: "User-centred design", nl: "User-centred design" },
        { en: "Information architecture", nl: "Informatiearchitectuur" },
        { en: "Wireframing & prototyping", nl: "Wireframing & prototyping" },
        { en: "Interaction design", nl: "Interactieontwerp" },
        { en: "Visual interface", nl: "Visuele interface" },
        { en: "Design systems", nl: "Designsystemen" },
        { en: "Usability testing", nl: "Usability-testen" },
        { en: "Accessibility auditing", nl: "Toegankelijkheidsaudits" },
      ] },
    { key: "B", eyebrow: { en: "Daily drivers", nl: "Dagelijks gereedschap" },
      title: { en: "Tools & software", nl: "Tools & software" },
      items: ["Figma", "Webflow", "Framer", "Photoshop", "Illustrator",
              "InDesign", "After Effects", "Notion", "Miro"] },
    { key: "C", eyebrow: { en: "New literacy", nl: "Nieuwe geletterdheid" },
      title: { en: "AI tools", nl: "AI-tools" },
      items: ["Claude", "ChatGPT", "Midjourney", "Adobe Firefly", "Gemini"] },
  ],
  note: {
    en: "Actively exploring AI as a design tool — to move faster, think deeper, and push what's possible.",
    nl: "Actief bezig met AI als ontwerptool — om sneller te werken, dieper te denken en te verkennen wat mogelijk is.",
  },
};

export const ui = {
  attuneTitle:   { en: "Attune",            nl: "Afstemmen" },
  attuneIntro:   { en: "This is not a settings menu hidden in a footer. It is how the site works.",
                   nl: "Dit is geen instellingenmenu verstopt in een footer. Zo werkt deze site." },
  modeLabel:     { en: "Mode",              nl: "Modus" },
  modeFull:      { en: "Screen",            nl: "Scherm" },
  modeCalm:      { en: "Print",             nl: "Print" },
  readingLabel:  { en: "Reading type",      nl: "Leesletter" },
  textsizeLabel: { en: "Text size",         nl: "Tekstgrootte" },
  contrastLabel: { en: "Contrast",          nl: "Contrast" },
  langLabel:     { en: "Language",          nl: "Taal" },
  audienceLabel: { en: "Who's looking",     nl: "Wie kijkt er" },
  systemNote:    { en: "Your device already asked for this.",
                   nl: "Je apparaat vroeg hier al om." },
  detailHint:    { en: "Look closer",       nl: "Kijk beter" },
  viewCase:      { en: "Read the case \u2192", nl: "Lees de case \u2192" },
  nextCase:      { en: "Next case",          nl: "Volgende case" },
  cursorRead:    { en: "Read",               nl: "Lees" },
  skip:          { en: "Skip to content",   nl: "Naar de inhoud" },
  metaDescription: {
    en: "Portfolio of Safa Mohalaia, a UX/UI designer in Amsterdam. Healthcare, civic infrastructure and community platforms.",
    nl: "Portfolio van Safa Mohalaia, UX/UI-designer in Amsterdam. Zorg, publieke infrastructuur en communityplatforms.",
  },

  /* The annotation layer labels its own kinds, so they have to translate
     too — an English "constraint" heading over a Dutch note is worse than
     no heading. */
  detailKinds: {
    colour:     { en: "colour",     nl: "kleur" },
    constraint: { en: "constraint", nl: "beperking" },
    finding:    { en: "finding",    nl: "bevinding" },
    decision:   { en: "decision",   nl: "keuze" },
    rejected:   { en: "rejected",   nl: "afgewezen" },
  },

  contact: {
    email:     { en: "Email",     nl: "E-mail" },
    phone:     { en: "Phone",     nl: "Telefoon" },
    located:   { en: "Located",   nl: "Locatie" },
    elsewhere: { en: "Elsewhere", nl: "Elders" },
  },

  contrastWarm: { en: "Warm", nl: "Warm" },
  contrastHigh: { en: "High", nl: "Hoog" },

  /* What the site says out loud when it changes something. The whole point
     of announcing a change is that the person understands it, so saying it
     in English to someone reading Dutch defeats the feature entirely. */
  announce: {
    mode: {
      full: { en: "Screen mode. Motion and the live canvas are on.",
              nl: "Schermmodus. Beweging en het levende canvas staan aan." },
      calm: { en: "Print mode. The canvas is off and the page is set as print.",
              nl: "Printmodus. Het canvas staat uit en de pagina is als drukwerk gezet." },
    },
    audience: {
      open:     { en: "Showing everything, in the default order.",
                  nl: "Alles wordt getoond, in de standaardvolgorde." },
      hiring:   { en: "Reordered for hiring: outcomes first, then the work.",
                  nl: "Herschikt voor werving: eerst resultaten, dan het werk." },
      designer: { en: "Reordered for designers: process, decisions and the accessibility work first.",
                  nl: "Herschikt voor ontwerpers: eerst proces, keuzes en het toegankelijkheidswerk." },
      client:   { en: "Reordered for clients: what I do, how I work, what it asks of you.",
                  nl: "Herschikt voor opdrachtgevers: wat ik doe, hoe ik werk, wat het van je vraagt." },
      curious:  { en: "No order imposed. Wander.", nl: "Geen volgorde opgelegd. Kijk rond." },
    },
    reading: {
      default: { en: "Reading type back to DM Sans.", nl: "Leesletter terug naar DM Sans." },
      legible: { en: "Reading type is now Atkinson Hyperlegible, with looser lines.",
                 nl: "Leesletter is nu Atkinson Hyperlegible, met ruimere regels." },
    },
    textsize: {
      default: { en: "Text at default size.", nl: "Tekst op standaardgrootte." },
      large:   { en: "Text enlarged.",        nl: "Tekst vergroot." },
      larger:  { en: "Text at the largest size.", nl: "Tekst op de grootste maat." },
    },
    contrast: {
      normal: { en: "Contrast back to warm default.", nl: "Contrast terug naar warm standaard." },
      high:   { en: "High contrast. Warmth removed, every pairing above 7 to 1.",
                nl: "Hoog contrast. Warmte verwijderd, elke combinatie boven 7 op 1." },
    },
    lang: {
      en: { en: "Language set to English.", nl: "Language set to English." },
      nl: { en: "Taal ingesteld op Nederlands.", nl: "Taal ingesteld op Nederlands." },
    },
  },
  caseFacts: {
    year:    { en: "Year",    nl: "Jaar" },
    role:    { en: "Role",    nl: "Rol" },
    company: { en: "Client",  nl: "Opdrachtgever" },
    type:    { en: "Type",    nl: "Type" },
  },
  closeLabel:    { en: "Close",             nl: "Sluiten" },
  sections: {
    work:          { en: "Work",           nl: "Werk" },
    outcomes:      { en: "Outcomes",       nl: "Resultaten" },
    about:         { en: "About",          nl: "Over" },
    process:       { en: "Process",        nl: "Proces" },
    skills:        { en: "Skills",         nl: "Vaardigheden" },
    accessibility: { en: "Accessibility",  nl: "Toegankelijkheid" },
    "detail-index":{ en: "Every decision on this site", nl: "Elke keuze op deze site" },
    contact:       { en: "Contact",        nl: "Contact" },
  },
  caseLabels: {
    role:     { en: "My role",  nl: "Mijn rol" },
    process:  { en: "Process",  nl: "Proces" },
    solution: { en: "Solution", nl: "Oplossing" },
    result:   { en: "Result",   nl: "Resultaat" },
  },
};
