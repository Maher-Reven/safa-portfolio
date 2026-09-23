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
    { label: "LinkedIn", href: "https://www.linkedin.com/in/safa-m-93474b174/" },
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
    order: ["index", "work", "graphic", "cv", "skills", "contact"],
  },
  {
    id: "designer",
    label:  { en: "I'm a designer",      nl: "Ik ben ontwerper" },
    detail: { en: "Process, decisions, and the accessibility work underneath all of it.",
              nl: "Proces, keuzes, en het toegankelijkheidswerk daaronder." },
    order: ["work", "graphic", "process", "accessibility", "lab", "detail-index", "about", "contact"],
  },
  {
    id: "client",
    label:  { en: "I have a project",    nl: "Ik heb een opdracht" },
    detail: { en: "What I do, how I work, and what it asks of you.",
              nl: "Wat ik doe, hoe ik werk, en wat het van jou vraagt." },
    order: ["index", "work", "graphic", "skills", "process", "contact"],
  },
  {
    id: "curious",
    label:  { en: "Just looking",        nl: "Ik kijk even rond" },
    detail: { en: "No order imposed. Everything is open.",
              nl: "Geen volgorde opgelegd. Alles staat open." },
    order: ["work", "graphic", "about", "process", "accessibility", "lab", "skills", "detail-index", "contact"],
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
   WORK — four real projects. Copy and imagery are hers.
   ------------------------------------------------------------------------- */
/* Two colours per project, not one: `colour` rules the 3px line across the
   top of its card, `ink` writes its name. A line needs 3:1 against the page
   and a name needs 4.5:1, and no single value cleared both on both themes —
   see the PROJECT COLOURS note in tokens.css. */
export const projects = [
  {
    slug: "velotech",
    format: { en: "Web app", nl: "Webapp" },
    colour: "var(--c-velotech)",
    ink:    "var(--c-velotech-ink)",
    year: "2025 — 2026",
    title:      { en: "VeloTech.AI", nl: "VeloTech.AI" },
    company:    { en: "VeloTech.AI · Freelance", nl: "VeloTech.AI · Freelance" },
    discipline: { en: "Dashboard · Civic infrastructure",
                  nl: "Dashboard · Publieke infrastructuur" },
    role:       { en: "Product & Brand Designer", nl: "Product & Brand Designer" },
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
        note: { en: "Municipal blue, taken from the product's own chrome rather than assigned. It is the colour on paper; on the dark theme it is lifted to #4B739B, because the true blue measured 2.5:1 there — a case identified by a rule you cannot see. The claim on this card used to be 3.1:1, which is what makes a checker that reads the stylesheet worth more than a note that remembers it.",
                nl: "Gemeenteblauw, genomen uit de chrome van het product zelf in plaats van toegewezen. Dit is de kleur op papier; in het donkere thema wordt hij opgelicht naar #4B739B, want het echte blauw mat daar 2,5:1 — een case herkenbaar aan een lijn die je niet ziet. Op deze kaart stond 3,1:1, en juist daarom is een checker die de stylesheet leest meer waard dan een notitie die het zich herinnert." } },
      { kind: "constraint",
        note: { en: "Severity is never carried by colour alone. An inspector reading a map in daylight, or with any colour vision deficiency, still needs to rank damage — so severity is a score and a shape, and the colour is the third signal, not the first.",
                nl: "Ernst wordt nooit alleen door kleur gedragen. Een inspecteur die bij daglicht een kaart leest, of met welke kleurzichtstoornis dan ook, moet schade nog steeds kunnen rangschikken — dus ernst is een score en een vorm, en kleur is het derde signaal, niet het eerste." } },
    ],
  },

  {
    slug: "dentara",
    format: { en: "Mobile app", nl: "Mobiele app" },
    colour: "var(--c-dentara)",
    ink:    "var(--c-dentara-ink)",
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
    coverDevice: "phone",
    cover: { src: "assets/work/dentara-home.png",
             alt: { en: "Dentara's home screen: a personal greeting above the next appointment and a treatment progress summary",
                    nl: "Het startscherm van Dentara: een persoonlijke begroeting boven de volgende afspraak en een overzicht van de behandelvoortgang" } },
    shots: [
      { src: "assets/work/dentara-gebit.png", span: "half", device: "phone",
        alt: { en: "The interactive tooth map, where each tooth carries its own treatment history", nl: "De interactieve gebitskaart, waar elke tand zijn eigen behandelgeschiedenis draagt" } },
      { src: "assets/work/dentara-voorbereiden.png", span: "half", device: "phone",
        alt: { en: "The appointment preparation flow — the feature patients valued most", nl: "De voorbereidingsflow voor afspraken — de functie die patiënten het meest waardeerden" } },
      { src: "assets/work/dentara-historie.png", span: "half", device: "phone",
        alt: { en: "Treatment history, ordered by visit", nl: "Behandelgeschiedenis, geordend per bezoek" } },
      { src: "assets/work/dentara-holistisch.png", span: "half", device: "phone",
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
    format: { en: "Web app", nl: "Webapp" },
    colour: "var(--c-pubhubs)",
    ink:    "var(--c-pubhubs-ink)",
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
    format: { en: "Mobile + web", nl: "Mobiel + web" },
    colour: "var(--c-medialab)",
    ink:    "var(--c-medialab-ink)",
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
      { src: "assets/work/medialab-folders.png", span: "half", device: "phone",
        alt: { en: "Folder navigation after the redesign", nl: "Mapnavigatie na het herontwerp" } },
      { src: "assets/work/medialab-info.png", span: "half", device: "phone",
        alt: { en: "A file's detail panel", nl: "Het detailpaneel van een bestand" } },
      { src: "assets/work/medialab.png", span: "half", device: "phone",
        alt: { en: "The mobile app's media grid", nl: "Het mediaraster van de mobiele app" } },
      { src: "assets/work/medialab-2.png", span: "half", device: "phone",
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
   These findings are real, from her own first accessibility audit. No year
   and no "first-year assignment": the work is the point, and dating it to a
   student exercise invites the reader to discount it before reading it.
   It also stops the page ageing.
   she tested her work with VoiceOver, a contrast checker, and Chrome's
   colour-vision and blurred-vision simulations, and wrote up what failed.
   Most portfolios claim accessibility. This one has the test notes.
   ------------------------------------------------------------------------- */
export const accessibility = {
  lead: {
    en: "I put my own work through a screen reader, a contrast checker and Chrome's vision simulations, and wrote down everything that failed. Three things did. Every one of them taught me something I now build in from the start — including into this site.",
    nl: "Ik haalde mijn eigen werk door een screenreader, een contrastchecker en de zichtsimulaties van Chrome, en schreef op wat er faalde. Drie dingen faalden. Elk daarvan leerde me iets dat ik nu vanaf het begin inbouw — ook in deze site.",
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

  /* The page grades itself, live. */
  audit: {
    title: { en: "And this page, right now", nl: "En deze pagina, nu" },
    lead: {
      en: "Everything above is something I found in my own old work. Below is this page, measured against the live DOM as you are reading it — in whatever state you have put it into. Change a setting in Attune and the numbers move.",
      nl: "Alles hierboven vond ik in mijn eigen oude werk. Hieronder staat deze pagina, gemeten aan de live DOM terwijl je hem leest — in de staat waarin jij hem hebt gezet. Verander een instelling in Afstemmen en de cijfers bewegen.",
    },
    caveat: {
      en: "Six checks a browser can make honestly. Not a substitute for a real audit — no automated pass tells you whether a sentence made sense to the person reading it.",
      nl: "Zes controles die een browser eerlijk kan uitvoeren. Geen vervanging voor een echte audit — geen enkele geautomatiseerde test vertelt je of een zin klopte voor wie hem las.",
    },
    rerun: { en: "Measure again", nl: "Opnieuw meten" },
    score:  { en: "checks passing", nl: "controles geslaagd" },
    labels: {
      contrast: { en: "Text contrast",        nl: "Tekstcontrast" },
      alt:      { en: "Images with alt text", nl: "Afbeeldingen met alt-tekst" },
      headings: { en: "Heading order",        nl: "Kopvolgorde" },
      targets:  { en: "Target size",          nl: "Klikgebied" },
      names:    { en: "Controls with a name", nl: "Bedieningen met een naam" },
      lang:     { en: "Language declared",    nl: "Taal gedeclareerd" },
    },
    pass: { en: "pass", nl: "geslaagd" },
    fail: { en: "fail", nl: "gezakt" },
  },
};

/* -------------------------------------------------------------------------
   CV
   Assembled here rather than kept as a separate PDF, so there is exactly one
   copy of the facts. Her previous portfolio linked a "Download CV" button to
   href="#" with no file behind it — a dead promise a recruiter finds by
   clicking it. A CV built from the same content as the site can never be the
   stale one.

   Experience is one list, newest first. Where a role has a case study here it
   is read straight out of it; the two roles without one carry their own copy.
   Nothing is invented — entries without a case simply say less.
   ------------------------------------------------------------------------- */
export const cv = {
  summary: {
    en: "UX / UI designer in Amsterdam. Healthcare, civic infrastructure and community platforms — products where a confusing screen has a cost somebody else pays. Human-centred by training, accessibility-led by practice, and as comfortable in the brand layer around a product as in the product itself.",
    nl: "UX / UI-designer in Amsterdam. Zorg, publieke infrastructuur en communityplatforms — producten waar een verwarrend scherm een prijs heeft die iemand anders betaalt. Human-centred opgeleid, toegankelijkheid als uitgangspunt, en net zo thuis in de merklaag rondom een product als in het product zelf.",
  },

  /* EXPERIENCE
     One chronological list, newest first. An entry is either `{ from: slug }`
     — read straight back out of the project on this site, so a case study and
     the CV can never disagree — or a role that has no case here and carries
     its own fields. Nothing is invented for her either way; the freelance
     dates overlap because the work did. */
  experience: [
    {
      year: { en: "2026 — now", nl: "2026 — heden" },
      role:  { en: "Product & Brand Designer", nl: "Product & Brand Designer" },
      title: { en: "Instituut Marie", nl: "Instituut Marie" },
      company:    { en: "Freelance", nl: "Freelance" },
      discipline: { en: "Identity · Visual communication",
                    nl: "Identiteit · Visuele communicatie" },
      note: { en: "Identity and visual communication. Shaping content and campaigns across various channels.",
              nl: "Identiteit en visuele communicatie. Content en campagnes vormgeven over verschillende kanalen." },
    },
    { from: "dentara" },
    /* The four below are read out of their case studies, and where Safa's
       CV describes the engagement differently from the way the case tells
       its story, her line wins here: a case study explains what happened to
       somebody who is reading it, and a CV line says what the job was. */
    { from: "velotech",
      note: { en: "Designed the company website and platform with a focus on usability and visual clarity, plus brand identity assets and digital materials for marketing and sales.",
              nl: "Ontwierp de bedrijfswebsite en het platform met focus op usability en visuele helderheid, plus merkidentiteitsmiddelen en digitaal materiaal voor marketing en sales." } },
    { from: "medialab",
      note: { en: "Improved user flows and customer journeys, and contributed to the redesign of the mobile app's navigation, structure and usability within a cross-functional team, alongside marketing design.",
              nl: "Verbeterde user flows en klantreizen, en droeg bij aan het herontwerp van de navigatie, structuur en usability van de mobiele app binnen een multidisciplinair team, naast marketingdesign." } },
    { from: "pubhubs",
      note: { en: "A community platform for companies and organisations: forum structure, search optimisation and UX/UI improvements.",
              nl: "Een communityplatform voor bedrijven en organisaties: forumstructuur, zoekoptimalisatie en UX/UI-verbeteringen." } },
    {
      year: { en: "2023 — 2024", nl: "2023 — 2024" },
      role:  { en: "UX / UI & Marketing Designer", nl: "UX / UI & Marketing Designer" },
      title: { en: "Pulse Sport Amsterdam", nl: "Pulse Sport Amsterdam" },
      company:    { en: "Freelance", nl: "Freelance" },
      discipline: { en: "Dashboard · Social", nl: "Dashboard · Social" },
      note: { en: "Designed a coach dashboard that clearly visualises complex player data — usability and information architecture, plus social media content and consistency.",
              nl: "Ontwierp een coachdashboard dat complexe spelersdata helder visualiseert — usability en informatiearchitectuur, plus social-mediacontent en consistentie." },
    },
  ],

  education: [
    { period: { en: "2022 — 2026", nl: "2022 — 2026" },
      what:  { en: "BA Communication and Multimedia Design",
               nl: "BA Communication and Multimedia Design" },
      where: { en: "Amsterdam University of Applied Sciences (HvA)",
               nl: "Hogeschool van Amsterdam (HvA)" } },
    /* The school is named in full once, above. Repeating it twice more would
       cost two lines of a page that has to end at one, and say nothing. */
    { period: { en: "Feb — Aug 2025", nl: "feb — aug 2025" },
      what:  { en: "Minor Visual Interface Design", nl: "Minor Visual Interface Design" },
      where: { en: "HvA · graded 8.5", nl: "HvA · cijfer 8,5" } },
    { period: { en: "Sep 2024 — Feb 2025", nl: "sep 2024 — feb 2025" },
      what:  { en: "Minor User Experience Design", nl: "Minor User Experience Design" },
      where: { en: "HvA · graded 8.5", nl: "HvA · cijfer 8,5" } },
  ],

  languages: [
    { name: { en: "Dutch",   nl: "Nederlands" }, level: { en: "Fluent",       nl: "Vloeiend" } },
    { name: { en: "English", nl: "Engels" },     level: { en: "Professional", nl: "Professioneel" } },
    { name: { en: "Arabic",  nl: "Arabisch" },   level: { en: "Native",       nl: "Moedertaal" } },
  ],

  sectionLabels: {
    profile:    { en: "Profile",    nl: "Profiel" },
    experience: { en: "Experience", nl: "Ervaring" },
    education:  { en: "Education",  nl: "Opleiding" },
    skills:     { en: "Skills",     nl: "Vaardigheden" },
    languages:  { en: "Languages",  nl: "Talen" },
    contact:    { en: "Contact",    nl: "Contact" },
  },
};

/* -------------------------------------------------------------------------
   LAB
   Working instruments rather than a gallery of screenshots. Each one is a
   tool for something Safa actually tests for, and each runs on THIS page —
   the vision simulations on her own portfolio, the contrast checker loaded
   with the pairing that failed her first audit.

   A lab of pictures would be a second Work tab. A lab you can operate is an
   argument about how she works.
   ------------------------------------------------------------------------- */
export const lab = {
  lead: {
    en: "Accessibility is usually described. Here you can run it. Every instrument below works on this page, right now — including the ones that will make it harder to read, which is the point.",
    nl: "Toegankelijkheid wordt meestal beschreven. Hier kun je het uitvoeren. Elk instrument hieronder werkt op deze pagina, nu — ook de instrumenten die haar moeilijker leesbaar maken, en dat is precies de bedoeling.",
  },
  experiments: [
    {
      id: "vision",
      n: "01",
      topic: "access",
      span: "wide",
      title: { en: "See it the way they do", nl: "Zie het zoals zij het zien" },
      note: {
        en: "The colour-vision and blurred-vision simulations from my first accessibility audit, pointed at this portfolio instead of at someone else's. Blurred vision is the one my old site failed.",
        nl: "De kleurzicht- en wazigzichtsimulaties uit mijn eerste toegankelijkheidsaudit, nu gericht op dit portfolio in plaats van op dat van iemand anders. Wazig zicht is degene waarvoor mijn oude site zakte.",
      },
    },
    {
      id: "contrast",
      n: "02",
      topic: "colour",
      title: { en: "Two words that failed", nl: "Twee woorden die zakten" },
      note: {
        en: "Red on yellow appeared twice on my first site and failed contrast, which is exactly why it survived every review — nobody checks two words. Drag the colours and watch the ratio decide whether a sentence exists for someone.",
        nl: "Rood op geel kwam twee keer voor op mijn eerste site en zakte voor contrast — en juist daarom overleefde het elke review, want niemand controleert twee woorden. Sleep aan de kleuren en zie de verhouding bepalen of een zin voor iemand bestaat.",
      },
    },
    {
      id: "halftone",
      n: "03",
      topic: "print",
      title: { en: "Screen angles", nl: "Rasterhoeken" },
      note: {
        en: "The two-colour risograph screen this site prints in. Two screens less than 60° apart interfere and produce moiré — set both to the same angle and watch it happen.",
        nl: "Het tweekleuren-risoraster waarin deze site afdrukt. Twee rasters met minder dan 60° verschil interfereren en geven moiré — zet ze op dezelfde hoek en kijk wat er gebeurt.",
      },
    },
    {
      id: "type",
      n: "04",
      topic: "type",
      title: { en: "A typeface that changes its mind", nl: "Een letter die van gedachten verandert" },
      note: {
        en: "Fraunces carries optical size, softness and a WONK axis — at display sizes its serifs sharpen and its curves go crooked on purpose. This site already moves it between print and screen. Drag the axes and watch one font behave like several.",
        nl: "Fraunces heeft assen voor optische grootte, zachtheid en WONK — op displaygrootte verscherpen de schreven en gaan de rondingen bewust scheef staan. Deze site verschuift hem al tussen print en scherm. Sleep aan de assen en zie één letter zich als meerdere gedragen.",
      },
    },
    {
      id: "easing",
      n: "05",
      topic: "motion",
      title: { en: "The shape of a movement", nl: "De vorm van een beweging" },
      note: {
        en: "Every curve below is one this site actually uses. Linear is in there as a control — it is the one that always looks wrong, because nothing in the physical world starts and stops at a constant speed.",
        nl: "Elke curve hieronder wordt echt op deze site gebruikt. Lineair staat er als controle bij — die ziet er altijd verkeerd uit, omdat niets in de fysieke wereld op constante snelheid begint en stopt.",
      },
    },
    {
      id: "focus",
      n: "06",
      topic: "access",
      span: "wide",
      title: { en: "The route a keyboard takes", nl: "De route die een toetsenbord neemt" },
      note: {
        en: "Nobody designs the tab order; it is inherited from the markup, and it is the only route a keyboard user has. Draw it over the page and you can see whether the reading order and the operating order are the same thing.",
        nl: "Niemand ontwerpt de tabvolgorde; die volgt uit de markup, en het is de enige route die een toetsenbordgebruiker heeft. Teken hem over de pagina en je ziet of de leesvolgorde en de bedieningsvolgorde hetzelfde zijn.",
      },
    },
  ],
  topics: [
    { id: "all",    label: { en: "Everything", nl: "Alles" } },
    { id: "access", label: { en: "Access",     nl: "Toegang" } },
    { id: "colour", label: { en: "Colour",     nl: "Kleur" } },
    { id: "type",   label: { en: "Type",       nl: "Letter" } },
    { id: "motion", label: { en: "Motion",     nl: "Beweging" } },
    { id: "print",  label: { en: "Print",      nl: "Druk" } },
  ],
  ui: {
    filter:     { en: "Filter",            nl: "Filter" },
    showing:    { en: "Showing",           nl: "Getoond" },
    run:        { en: "Run on this page",  nl: "Uitvoeren op deze pagina" },
    replay:     { en: "Play",              nl: "Afspelen" },
    optical:    { en: "Optical size",      nl: "Optische grootte" },
    soft:       { en: "Softness",          nl: "Zachtheid" },
    wonk:       { en: "Wonk",              nl: "Wonk" },
    weight:     { en: "Weight",            nl: "Gewicht" },
    specimen:   { en: "Clarity",           nl: "Helderheid" },
    showPath:   { en: "Draw the tab order", nl: "Teken de tabvolgorde" },
    hidePath:   { en: "Hide it",            nl: "Verberg" },
    stops:      { en: "stops",              nl: "stops" },
    stop:       { en: "Stop",              nl: "Stoppen" },
    normal:     { en: "Normal vision",     nl: "Normaal zicht" },
    ratio:      { en: "Contrast ratio",    nl: "Contrastverhouding" },
    fg:         { en: "Text",              nl: "Tekst" },
    bg:         { en: "Background",        nl: "Achtergrond" },
    sample:     { en: "Two words",         nl: "Twee woorden" },
    angleA:     { en: "Ink angle",         nl: "Inkthoek" },
    angleB:     { en: "Accent angle",      nl: "Accenthoek" },
    pitch:      { en: "Screen pitch",      nl: "Rasterfijnheid" },
    moire:      { en: "Moir\u00e9 \u2014 the screens are interfering",
                  nl: "Moir\u00e9 \u2014 de rasters interfereren" },
    running:    { en: "Simulation running on this page",
                  nl: "Simulatie actief op deze pagina" },
  },
  vision: [
    { id: "none",         label: { en: "Normal",            nl: "Normaal" } },
    { id: "protanopia",   label: { en: "Protanopia",        nl: "Protanopie" } },
    { id: "deuteranopia", label: { en: "Deuteranopia",      nl: "Deuteranopie" } },
    { id: "tritanopia",   label: { en: "Tritanopia",        nl: "Tritanopie" } },
    { id: "achromatopsia",label: { en: "No colour at all",  nl: "Geen kleur" } },
    { id: "blur",         label: { en: "Blurred vision",    nl: "Wazig zicht" } },
  ],
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

/* -------------------------------------------------------------------------
   GRAPHIC DESIGN
   The work that is not a product: identity, campaign, editorial, type. It
   sits apart from Work because it is read differently — a case study is an
   argument you follow from problem to result, and a set of social carousels
   is a body of work you look at.

   The images come out of "Digital design/" through tools/graphic-assets.mjs,
   which resizes them, renders PDF carousels a page at a time, and prints a
   manifest to check this list against. The originals are not committed;
   what is here is what a visitor's phone has to download.

   ALL COPY BELOW IS A DRAFT. It was written from what is visibly in the
   images — the client, the medium, the number of pieces — and nothing else.
   Safa: the titles, the summaries and the alt text are yours to correct, and
   the two things I could not read off the work are marked TODO.
   ------------------------------------------------------------------------- */
export const graphic = {
  lead: {
    en: "Identity, campaign and editorial work. Pick a project, or several, and open one to read it at size.",
    nl: "Identiteits-, campagne- en redactioneel werk. Kies een project, of meerdere, en open er een om het op formaat te bekijken.",
  },

  projects: [
    {
      slug: "instituut-marie",
      tags: ["social", "branding", "print"],
      title: { en: "Instituut Marie", nl: "Instituut Marie" },
      client:{ en: "Instituut Marie · Amsterdam", nl: "Instituut Marie · Amsterdam" },
      discipline: { en: "Brand & social media",
                    nl: "Merk & social media" },
      year: "2026",
      summary: {
        en: "Brand and graphic design for a medical spa in Amsterdam. I create their social media content, in-clinic print materials and visuals that clearly explain every treatment, plus carousels for Instagram and LinkedIn.",
        nl: "Merk- en grafisch ontwerp voor een medische spa in Amsterdam. Ik maak hun socialmediacontent, drukwerk voor in de kliniek en beeld dat elke behandeling helder uitlegt, plus carrousels voor Instagram en LinkedIn.",
      },
      /* The carousels people actually swipe through, kept as they were made. */
      downloads: [
        { file: "instituut-marie-(1)-1.pdf", label: { en: "Carousel 1 (PDF)", nl: "Carrousel 1 (pdf)" } },
        { file: "instituut-marie-(2)-1.pdf", label: { en: "Carousel 2 (PDF)", nl: "Carrousel 2 (pdf)" } },
      ],
      pieces: [
        { alt: { en: "Cover: Holistische tandheelkunde — what makes this approach different, beside a tooth labelled whole body, biocompatibel, fluoridevrij and metaalvrij",
                 nl: "Omslag: Holistische tandheelkunde — wat maakt onze aanpak anders, naast een kies met de labels whole body, biocompatibel, fluoridevrij en metaalvrij" } },
        { alt: { en: "What is in a conventional mouth: amalgam, titanium implants, BPA composite and fluoride, set around a dial",
                 nl: "Wat zit er in een conventionele mond: amalgaam, titanium implantaten, composiet met BPA en fluoride, rond een wijzerplaat" } },
        { alt: { en: "The biological mouth: ceramic composite, zirconia implants, BPA-free materials and fluoride-free prevention, labelled on a tooth",
                 nl: "De biologische mond: ceramic composiet, keramische implantaten, BPA-vrije materialen en fluoridevrije preventie, benoemd op een kies" } },
        { alt: { en: "Fillings compared in three columns: amalgam, standard composite, and Sarenco ceramic composite",
                 nl: "Vullingen in drie kolommen vergeleken: amalgaam, standaard composiet en Sarenco ceramic composiet" } },
        { alt: { en: "Implants: titanium and zirconia ceramic drawn side by side with their properties",
                 nl: "Implantaten: titanium en zirconia keramiek naast elkaar getekend, met hun eigenschappen" } },
        { alt: { en: "CBCT scanning: a radial diagram of 3D imaging, nerve paths, bone quality and hidden inflammation",
                 nl: "CBCT-scan: een radiaal diagram van 3D-beeld, zenuwbanen, botkwaliteit en verborgen ontstekingen" } },
        { alt: { en: "PRF in four steps: blood draw, centrifuge, concentrate, application",
                 nl: "PRF in vier stappen: bloedafname, centrifuge, concentraat, toepassing" } },
        { alt: { en: "Whole Body Dentistry: a tooth at the centre of immune system, gut, hormones, nervous system and energy",
                 nl: "Whole Body Dentistry: een kies in het midden van immuunsysteem, darmen, hormoonhuishouding, zenuwstelsel en energieniveau" } },
        { alt: { en: "Cover: what happens when you lie in a plasma field for thirty minutes",
                 nl: "Omslag: wat gebeurt er als je 30 minuten in een plasmaveld ligt" } },
        { alt: { en: "Step one, arrival: the medical spa on Reinwardtstraat in Amsterdam-Oost",
                 nl: "Stap 1, aankomst: de medische spa aan de Reinwardtstraat in Amsterdam-Oost" } },
        { alt: { en: "Step two, thirty minutes in the field — not invasive, no pain, no side effects",
                 nl: "Stap 2, dertig minuten in het veld — niet invasief, geen pijn, geen bijwerkingen" } },
        { alt: { en: "What the plasma field does: cell regeneration, circulation, inflammation, energy",
                 nl: "Wat het plasmaveld doet: celregeneratie, circulatie, ontsteking, energie" } },
        { alt: { en: "After the session: four client quotes set in boxes",
                 nl: "Na de sessie: vier cliëntcitaten in kaders" } },
        { alt: { en: "The last step: experience it yourself, over a drawn seed-of-life figure",
                 nl: "De laatste stap: ervaar het zelf, over een getekende levensbloem" } },
      ],
    },

    {
      slug: "velotech-brand",
      tags: ["branding", "print"],
      title: { en: "VeloTech.AI", nl: "VeloTech.AI" },
      client:{ en: "VeloTech.AI", nl: "VeloTech.AI" },
      discipline: { en: "Branding, brochures & pitch deck",
                    nl: "Branding, brochures & pitchdeck" },
      year: "2025 — 2026",
      summary: {
        en: "Brand identity for an AI company that inspects public infrastructure. I designed the logo, colour palette and typography and captured it all in brand guidelines. I also created brochures and a pitch deck the team uses to present their products to new clients.",
        nl: "Merkidentiteit voor een AI-bedrijf dat publieke infrastructuur inspecteert. Ik ontwierp het logo, het kleurenpalet en de typografie en legde alles vast in merkrichtlijnen. Daarnaast maakte ik brochures en een pitchdeck waarmee het team hun producten aan nieuwe klanten presenteert.",
      },
      /* The case study for this client is on the Work tab; the brand book is
         the other half of the same engagement. */
      caseSlug: "velotech",
      pieces: [
        { alt: { en: "Cover slide: BRAND GUIDELINES set in light grey on deep navy",
                 nl: "Omslagslide: BRAND GUIDELINES in lichtgrijs op donkerblauw" } },
        { alt: { en: "Index: 01 Introduction, 02 Logo, 03 Colors, 04 Typography",
                 nl: "Inhoud: 01 Introduction, 02 Logo, 03 Colors, 04 Typography" } },
        { alt: { en: "Vision slide: what the company does, beside the word VISION set large",
                 nl: "Visieslide: wat het bedrijf doet, naast het woord VISION groot gezet" } },
        { alt: { en: "The diamond mark beside the VELOTECH.AI wordmark, measured as mark and main logo",
                 nl: "Het ruitvormige merkteken naast het VELOTECH.AI-woordmerk, opgemeten als mark en main logo" } },
        { alt: { en: "Colour: four blocks with their hex values — #6399DF, #10377E, #EBEBEB, #1C2A33",
                 nl: "Kleur: vier vlakken met hun hexwaarden — #6399DF, #10377E, #EBEBEB, #1C2A33" } },
        { alt: { en: "The wordmark drawn as an outline with its construction points marked",
                 nl: "Het woordmerk als contour met zijn constructiepunten gemarkeerd" } },
        { alt: { en: "Title typeface: Montserrat from Thin to Black, with a large Aa",
                 nl: "Titelletter: Montserrat van Thin tot Black, met een grote Aa" } },
        { alt: { en: "Body typeface: Manrope from Light to Bold, the alphabet set at each weight",
                 nl: "Broodtekstletter: Manrope van Light tot Bold, het alfabet per gewicht gezet" } },
        { alt: { en: "Applications: the identity on a street sweeper with a tablet, and on a city billboard beside tram tracks",
                 nl: "Toepassingen: de identiteit op een veegwagen met tablet en op een stadsbillboard langs de tramrails" } },
        { alt: { en: "Applications: the app on a tablet held in two hands, beside the mark at size",
                 nl: "Toepassingen: de app op een tablet in twee handen, naast het merkteken op formaat" } },
      ],
    },

    {
      slug: "medialab-social",
      tags: ["social", "print"],
      /* Which piece fronts the set. The first one is the default and is
         usually right — a cover page is made to be a cover — but this set
         opens on a diagram, and a diagram at card size is a grey mesh. The
         Invictus frame is the one that reads at a glance. */
      cover: 3,
      title: { en: "MediaLab", nl: "MediaLab" },
      client:{ en: "MediaLab", nl: "MediaLab" },
      discipline: { en: "Social, video & print",
                    nl: "Social, video & druk" },
      year: "2024 — 2025",
      summary: {
        en: "Ongoing design work for a media management platform for sports. I design their social media content and edit videos, build presentations, and create magazine ads, event visuals and partnership announcements.",
        nl: "Doorlopend ontwerpwerk voor een mediamanagementplatform voor sport. Ik ontwerp hun socialmediacontent en monteer video's, bouw presentaties en maak magazineadvertenties, eventbeeld en aankondigingen van samenwerkingen.",
      },
      caseSlug: "medialab",
      pieces: [
        { alt: { en: "The MediaLab ecosystem: sources including Dropbox, Premiere, Avid and MASV feeding in on the left, AI enhancement, transcoding and delivery going out on the right",
                 nl: "Het MediaLab-ecosysteem: bronnen als Dropbox, Premiere, Avid en MASV links naar binnen, AI-verbetering, transcoding en levering rechts naar buiten" } },
        { alt: { en: "NIBC Tour of Holland: the MediaLab gallery laid over a cycling peloton",
                 nl: "NIBC Tour of Holland: de MediaLab-galerij over een wielerpeloton" } },
        { alt: { en: "Invictus Games Birmingham 2027: the gallery over wheelchair athletes, powered by Fabriq Media Group",
                 nl: "Invictus Games Birmingham 2027: de galerij over rolstoelatleten, powered by Fabriq Media Group" } },
        { alt: { en: "#NOCAP: unlimited media management for sport, with a QR code and the product over a road race",
                 nl: "#NOCAP: onbeperkt mediabeheer voor sport, met een QR-code en het product over een wegwedstrijd" } },
        { alt: { en: "New partnership: the MediaLab and MASV logos crossing on black",
                 nl: "Nieuwe samenwerking: de logo's van MediaLab en MASV die elkaar kruisen op zwart" } },
        { alt: { en: "Think Outside The Frame: MediaLab at the DPP Leaders' Briefing in London, over Westminster at dusk",
                 nl: "Think Outside The Frame: MediaLab op de DPP Leaders' Briefing in Londen, over Westminster in de schemering" } },
      ],
    },

    {
      slug: "pulse-social",
      tags: ["social"],
      title: { en: "PULSE", nl: "PULSE" },
      client:{ en: "Pulse Sport Amsterdam", nl: "Pulse Sport Amsterdam" },
      discipline: { en: "Social media & app content",
                    nl: "Social media & appcontent" },
      year: "2023 — 2024",
      summary: {
        en: "Social media content for a platform that personalises training and nutrition for athletes. I designed nutrition tips, reminders and questionnaire screens in a clean, dark style that matches the PULSE app.",
        nl: "Socialmediacontent voor een platform dat training en voeding voor atleten personaliseert. Ik ontwierp voedingstips, herinneringen en vragenlijstschermen in een strakke, donkere stijl die aansluit op de PULSE-app.",
      },
      pieces: [
        { alt: { en: "Did you know? A sprinter in a dark tunnel, over a note that every athlete has different training needs",
                 nl: "Wist je dat? Een sprinter in een donkere tunnel, met de notitie dat elke atleet andere trainingsbehoeften heeft" } },
        { alt: { en: "Food enjoyment question: the in-app questionnaire with star-rated answers, over a road cyclist",
                 nl: "Vraag over eetplezier: de vragenlijst in de app met sterbeoordelingen, over een wielrenner" } },
        { alt: { en: "Reminder to fill in the questionnaire after a training session, over a gym scene",
                 nl: "Herinnering om de vragenlijst na een training in te vullen, over een sportschoolscène" } },
        { alt: { en: "What you need to know about nutrition: a plated salad annotated with protein, complex carbs and taste",
                 nl: "Wat je moet weten over voeding: een bord salade met aanwijzingen naar eiwitten, complexe koolhydraten en smaak" } },
      ],
    },

    {
      slug: "type-specimen",
      tags: ["typography"],
      title: { en: "ITC Benguiat", nl: "ITC Benguiat" },
      /* TODO (Safa): who this was made for — a course, a client, your own
         shelf. The typeface names itself at the top of the page, so that one
         is not a guess; this one would be. */
      client:{ en: "TODO", nl: "TODO" },
      discipline: { en: "Typography",
                    nl: "Typografie" },
      summary: {
        en: "A typography project on the typeface by Ed Benguiat. A long web poster that shows the history, character and uses of the letterforms, with an overview of the full character set and its details.",
        nl: "Een typografieproject over de letter van Ed Benguiat. Een lange webposter die de geschiedenis, het karakter en de toepassingen van de lettervormen laat zien, met een overzicht van de volledige tekenset en de details ervan.",
      },
      pieces: [
        { tall: true,
          alt: { en: "The full ITC Benguiat specimen page: the face named beside a photograph of Ed Benguiat, letterform samples called dynamic and suited to logos, three sample lock-ups, the Stranger Things logo as a horror example, the character set in blue and in black, and an anatomy diagram over the word Typography naming the angled top serifs, large x-height, short descenders, small loop on the g and hooked tail on the y",
                 nl: "De volledige ITC Benguiat-letterproef: de letter benoemd naast een foto van Ed Benguiat, letterstalen omschreven als dynamisch en geschikt voor logo's, drie voorbeeldlockups, het Stranger Things-logo als horrorvoorbeeld, de tekenset in blauw en in zwart, en een anatomiediagram over het woord Typography dat de schuine bovenschreven, grote x-hoogte, korte staarten, kleine lus op de g en gehaakte staart op de y benoemt" } },
      ],
    },
  ],

  /* The filter asks what kind of work, not which client. A client is already
     on every card; "the branding ones" is the question somebody browsing a
     graphic design page actually has, and it is the one a client name cannot
     answer — three of these five sets are print work and no two of them are
     for the same company. A set can be more than one thing, which is why
     these are tags rather than a folder each. */
  filters: [
    { id: "all",        label: { en: "All",          nl: "Alles" } },
    { id: "social",     label: { en: "Social media", nl: "Social media" } },
    { id: "branding",   label: { en: "Branding",     nl: "Branding" } },
    { id: "print",      label: { en: "Print",        nl: "Druk" } },
    { id: "typography", label: { en: "Typography",   nl: "Typografie" } },
  ],

  ui: {
    filter:    { en: "Filter",          nl: "Filter" },
    all:       { en: "All",             nl: "Alles" },
    showing:   { en: "Showing",         nl: "Getoond" },
    pieces:    { en: "pieces",          nl: "stuks" },
    piece:     { en: "piece",           nl: "stuk" },
    open:      { en: "Open",            nl: "Open" },
    close:     { en: "Close",           nl: "Sluiten" },
    next:      { en: "Next image",      nl: "Volgende afbeelding" },
    prev:      { en: "Previous image",  nl: "Vorige afbeelding" },
    counter:   { en: "of",              nl: "van" },
    thumbs:    { en: "All images",      nl: "Alle afbeeldingen" },
    scrollHint:{ en: "A long page — scroll inside the frame",
                 nl: "Een lange pagina — scroll in het kader" },
    opened:    { en: "Opened", nl: "Geopend" },
    closed:    { en: "Viewer closed.", nl: "Weergave gesloten." },
  },
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
        { en: "Design thinking", nl: "Design thinking" },
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
  themeLabel:    { en: "Theme",             nl: "Thema" },
  themeDark:     { en: "Dark",              nl: "Donker" },
  themeLight:    { en: "Light",             nl: "Licht" },
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
  screens:       { en: "Screens",            nl: "Schermen" },
  railHint:      { en: "Scroll or use the arrows", nl: "Scroll of gebruik de pijlen" },
  prevShot:      { en: "Previous screen",    nl: "Vorig scherm" },
  nextShot:      { en: "Next screen",        nl: "Volgend scherm" },
  nextCase:      { en: "Next case",          nl: "Volgende case" },
  cursorRead:    { en: "Read",               nl: "Lees" },
  indexHint:     { en: "Four projects", nl: "Vier projecten" },
  cvTitle:       { en: "Curriculum vitae",   nl: "Curriculum vitae" },
  cvDownload:    { en: "Download as PDF",    nl: "Download als PDF" },
  cvHint: {
    en: "Opens your browser's print dialogue — choose \u201cSave as PDF\u201d. The file is generated from this page, so it is never out of date.",
    nl: "Opent het printvenster van je browser — kies \u201cOpslaan als PDF\u201d. Het bestand komt van deze pagina en is dus nooit verouderd.",
  },
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
    theme: {
      dark:  { en: "Dark theme.", nl: "Donker thema." },
      light: { en: "Light theme. The same work on paper.",
               nl: "Licht thema. Hetzelfde werk op papier." },
    },
    mode: {
      full: { en: "Screen mode. Motion and the live canvas are on.",
              nl: "Schermmodus. Beweging en het levende canvas staan aan." },
      calm: { en: "Print mode. The canvas is off and the page is set as print.",
              nl: "Printmodus. Het canvas staat uit en de pagina is als drukwerk gezet." },
    },
    audience: {
      open:     { en: "Showing everything, in the default order.",
                  nl: "Alles wordt getoond, in de standaardvolgorde." },
      hiring:   { en: "Reordered for hiring: the work first, then the CV.",
                  nl: "Herschikt voor werving: eerst het werk, dan het cv." },
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
    index:         { en: "Selected work",  nl: "Geselecteerd werk" },
    about:         { en: "About",          nl: "Over" },
    process:       { en: "Process",        nl: "Proces" },
    skills:        { en: "Skills",         nl: "Vaardigheden" },
    accessibility: { en: "Accessibility",  nl: "Toegankelijkheid" },
    "detail-index":{ en: "Every decision on this site", nl: "Elke keuze op deze site" },
    cv:            { en: "Curriculum vitae", nl: "Curriculum vitae" },
    lab:           { en: "Lab",              nl: "Lab" },
    graphic:       { en: "Graphic design",   nl: "Grafisch ontwerp" },
    contact:       { en: "Contact",        nl: "Contact" },
  },
  caseLabels: {
    role:     { en: "My role",  nl: "Mijn rol" },
    process:  { en: "Process",  nl: "Proces" },
    solution: { en: "Solution", nl: "Oplossing" },
    result:   { en: "Result",   nl: "Resultaat" },
  },
};
