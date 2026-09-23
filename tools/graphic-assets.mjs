#!/usr/bin/env node
/* =========================================================================
   tools/graphic-assets.mjs — the graphic design folder, made web-weight.
   -------------------------------------------------------------------------
     node tools/graphic-assets.mjs            build assets/graphic/
     node tools/graphic-assets.mjs --check    report what would change

   Safa drops work into "Digital design/" at whatever size it came out of
   Figma, Canva or a phone. This turns that folder into something a page can
   load: one viewing image and one thumbnail per piece, PDFs rendered a page
   at a time, and a manifest printed at the end to paste into content.js.

   WHY THE ORIGINALS ARE NOT SHIPPED. The source folder is 16MB — four
   times the entire rest of this site. A 1920×8370 PNG is a beautiful thing
   to have and a rude thing to send down a phone connection. The originals
   stay on her machine (they are gitignored); what is committed is what
   somebody actually downloads.

   It uses sips and PDFKit, both already on the machine, because a portfolio
   that runs with no build step should not need a toolchain to add pictures
   to it. Re-run it whenever the folder changes; it is idempotent.
   ========================================================================= */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, copyFileSync, statSync } from "node:fs";
import { dirname, join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "Digital design");
const OUT = join(ROOT, "assets", "graphic");
const TMP = join(ROOT, ".graphic-tmp");

/* The long edge of the viewing image. A carousel on a 4K monitor shows one
   picture at a time and the frame is never more than about 1200px tall, so
   1600 is a generous ceiling rather than a compromise. */
const VIEW = 1600;
/* A long page is not a big picture. Capping the LONG edge of a 1920×8370
   web design took it to 367px wide — every word in it gone, to save bytes
   on a file whose entire content is words. Anything taller than this ratio
   is sized by its width instead and scrolls in the viewer, the way the page
   it is a picture of would. */
const TALL_RATIO = 2.5;
const TALL_WIDTH = 1400;
const THUMB = 480;      /* the strip along the bottom, at 2× for retina */
const Q_VIEW = 72;
const Q_THUMB = 60;

/* Source folder -> the slug the site knows it by. Adding a project means
   adding a folder and a line here, and writing its copy in content.js. */
const PROJECTS = [
  { slug: "velotech-brand",  from: "brand guide" },
  { slug: "medialab-social", from: "Medialab social" },
  { slug: "instituut-marie", from: "instituur marie pdf social" },
  { slug: "pulse-social",    from: "pulse" },
  { slug: "type-specimen",   from: ["Web 1920 – 19.png"] },
];

const sips = (args) => execFileSync("sips", args, { stdio: ["ignore", "pipe", "pipe"] });

function dimensions(file) {
  const out = sips(["-g", "pixelWidth", "-g", "pixelHeight", file]).toString();
  return {
    w: +(out.match(/pixelWidth:\s*(\d+)/)?.[1] ?? 0),
    h: +(out.match(/pixelHeight:\s*(\d+)/)?.[1] ?? 0),
  };
}

/* One source file becomes two JPEGs. JPEG rather than PNG because every one
   of these is a photograph or a flat colour illustration at display size,
   and JPEG at 72 is a quarter of the bytes with nothing visible lost; and
   JPEG rather than WebP because sips on this machine reads WebP and cannot
   write it, and a build that only runs on the author's laptop is not a
   build. */
function derive(source, outBase) {
  const { w, h } = dimensions(source);
  const long = Math.max(w, h);

  const tall = h / w > TALL_RATIO;
  const resize = tall
    ? (w > TALL_WIDTH ? ["--resampleWidth", String(TALL_WIDTH)] : [])
    : (long > VIEW ? ["-Z", String(VIEW)] : []);

  sips(["-s", "format", "jpeg", "-s", "formatOptions", String(Q_VIEW),
        ...resize, source, "--out", `${outBase}.jpg`]);
  /* A thumbnail of a long page, shrunk whole, is a grey sliver. The strip
     shows its head instead — which is what a thumbnail is for: recognising
     the thing, not containing it. */
  if (tall) {
    const cropH = Math.round(w * 0.75);
    sips(["-c", String(cropH), String(w), "--cropOffset", "0", "0", source,
          "--out", `${outBase}-t.jpg`]);
    sips(["-s", "format", "jpeg", "-s", "formatOptions", String(Q_THUMB),
          "-Z", String(THUMB), `${outBase}-t.jpg`, "--out", `${outBase}-t.jpg`]);
  } else {
    sips(["-s", "format", "jpeg", "-s", "formatOptions", String(Q_THUMB),
          "-Z", String(THUMB), source, "--out", `${outBase}-t.jpg`]);
  }

  const view = dimensions(`${outBase}.jpg`);
  return { w: view.w, h: view.h, tall, bytes: statSync(`${outBase}.jpg`).size };
}

const isImage = (f) => /\.(png|jpe?g|heic|tiff?)$/i.test(f);
const isPdf = (f) => /\.pdf$/i.test(f);
const listed = (dir) =>
  readdirSync(dir).filter((f) => !f.startsWith(".")).sort((a, b) =>
    /* "Slide 16_9 - 10" must come after "- 9", which a plain sort does not
       do. Numbers inside a name are compared as numbers. */
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

/* ------------------------------------------------------------------------ */
const check = process.argv.includes("--check");
if (!existsSync(SRC)) {
  console.error(`No source folder at ${SRC}`);
  process.exit(1);
}
if (!check) {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
}

const manifest = [];
let totalBytes = 0;

for (const project of PROJECTS) {
  const outDir = join(OUT, project.slug);
  if (!check) mkdirSync(outDir, { recursive: true });

  /* A project is either a folder of files or an explicit list of loose ones. */
  const sources = Array.isArray(project.from)
    ? project.from.map((f) => join(SRC, f))
    : listed(join(SRC, project.from)).map((f) => join(SRC, project.from, f));

  const pieces = [];
  let n = 0;

  for (const source of sources) {
    if (isPdf(source)) {
      /* Every page, in order, as its own picture — and the PDF itself
         copied through, because these are carousels somebody may want to
         keep rather than scroll past. */
      const pagesDir = join(TMP, `${project.slug}-${basename(source, ".pdf")}`);
      if (!check) {
        mkdirSync(pagesDir, { recursive: true });
        execFileSync("swift", [join(ROOT, "tools", "pdf-pages.swift"), source, pagesDir, "1.6"],
                     { stdio: ["ignore", "pipe", "pipe"] });
        copyFileSync(source, join(outDir, basename(source).replace(/\s+/g, "-").toLowerCase()));
      }
      const pages = check ? [] : listed(pagesDir);
      for (const page of pages) {
        const name = String(++n).padStart(2, "0");
        const d = derive(join(pagesDir, page), join(outDir, name));
        totalBytes += d.bytes;
        pieces.push({ file: `${name}.jpg`, ...d, from: `${basename(source)} p${page.match(/\d+/)[0]}` });
      }
      continue;
    }
    if (!isImage(source)) continue;

    const name = String(++n).padStart(2, "0");
    if (check) { pieces.push({ file: `${name}.jpg`, from: basename(source) }); continue; }
    const d = derive(source, join(outDir, name));
    totalBytes += d.bytes;
    pieces.push({ file: `${name}.jpg`, ...d, from: basename(source) });
  }

  manifest.push({ slug: project.slug, pieces });
}

if (!check) rmSync(TMP, { recursive: true, force: true });

/* The manifest is printed rather than written: content.js is hand-kept, and
   a generator that rewrites it would overwrite the copy Safa has edited. */
for (const { slug, pieces } of manifest) {
  console.log(`\n  ${slug} — ${pieces.length} pieces`);
  for (const p of pieces) {
    const size = p.w ? `${String(p.w).padStart(4)}×${String(p.h).padEnd(4)} ${(p.bytes / 1024).toFixed(0)}KB` : "";
    console.log(`    ${p.file}  ${size}${p.tall ? "  tall" : "      "}   ← ${p.from}`);
  }
}
console.log(`\n  ${manifest.reduce((n, m) => n + m.pieces.length, 0)} images, ` +
            `${(totalBytes / 1048576).toFixed(1)}MB total\n`);
