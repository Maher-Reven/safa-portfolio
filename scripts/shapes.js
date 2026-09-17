/* =========================================================================
   shapes.js — the three silhouettes, drawn once, used twice.
   -------------------------------------------------------------------------
   Plain 2D canvas drawing, deliberately kept away from any renderer. The
   particle swarm samples these to place 24,000 points; the print mode
   screens them into halftone dots. One drawing, two technologies, and the
   cat is identical in both — which is the whole claim the two modes make.

   Filled silhouettes rather than outlines, because a filled mass morphs
   legibly and an outline turns to soup halfway between two poses.
   ========================================================================= */

const DESIGN = { w: 320, h: 380 };   // the coordinate space the shapes are drawn in

/* -------------------------------------------------------------------------
   THE SHAPES
   Plain 2D canvas drawing. Filled silhouettes, because a filled mass morphs
   legibly and an outline turns to soup halfway between two poses.
   ------------------------------------------------------------------------- */

function fit(ctx, W, H) {
  const s = Math.min(W / DESIGN.w, H / DESIGN.h);
  ctx.setTransform(s, 0, 0, s, (W - DESIGN.w * s) / 2, (H - DESIGN.h * s) / 2);
}

function drawCat(ctx, W, H) {
  fit(ctx, W, H);
  ctx.fillStyle = "#fff";

  // tail, as a wide stroke rather than a filled outline
  ctx.lineWidth = 22;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#fff";
  ctx.beginPath();
  ctx.moveTo(214, 312);
  ctx.bezierCurveTo(272, 320, 306, 274, 292, 230);
  ctx.bezierCurveTo(285, 208, 262, 202, 254, 220);
  ctx.stroke();

  // body
  ctx.beginPath();
  ctx.moveTo(112, 176);
  ctx.bezierCurveTo(96, 214, 88, 268, 92, 306);
  ctx.bezierCurveTo(94, 324, 106, 334, 126, 334);
  ctx.lineTo(194, 334);
  ctx.bezierCurveTo(214, 334, 226, 324, 228, 306);
  ctx.bezierCurveTo(232, 268, 224, 214, 208, 176);
  ctx.closePath();
  ctx.fill();

  // ears, bases sitting on the skull
  ctx.beginPath();
  ctx.moveTo(119, 75); ctx.lineTo(108, 18); ctx.lineTo(156, 60); ctx.closePath();
  ctx.moveTo(201, 75); ctx.lineTo(212, 18); ctx.lineTo(164, 60); ctx.closePath();
  ctx.fill();

  // head
  ctx.beginPath();
  ctx.arc(160, 124, 64, 0, Math.PI * 2);
  ctx.fill();

  /* The eyes are punched out, not drawn on. Negative space means the cat is
     recognisable from its holes, which is how a silhouette works, and it
     gives the swarm somewhere to be empty. */
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.ellipse(135, 118, 17, 12, -0.18, 0, Math.PI * 2);
  ctx.ellipse(185, 118, 17, 12, 0.18, 0, Math.PI * 2);
  ctx.fill();
  // and the muzzle line, so the lower face is not one dumb lobe
  ctx.beginPath();
  ctx.ellipse(160, 158, 26, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

function drawPaw(ctx, W, H) {
  fit(ctx, W, H);
  ctx.fillStyle = "#fff";
  const pad = (cx, cy, rx, ry, rot) => {
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
    ctx.fill();
  };
  pad(160, 250, 86, 70, 0);                    // the main pad
  pad(66,  140, 34, 44, -0.32);                // toes
  pad(128, 96,  32, 42, -0.1);
  pad(192, 96,  32, 42, 0.1);
  pad(254, 140, 34, 44, 0.32);
}

function drawCursor(ctx, W, H) {
  fit(ctx, W, H);
  ctx.fillStyle = "#fff";
  /* The classic arrow, drawn large and slightly rotated so it reads as a
     pointer rather than as a triangle. */
  ctx.translate(160, 190);
  ctx.rotate(-0.12);
  ctx.translate(-160, -190);
  ctx.beginPath();
  ctx.moveTo(108, 60);
  ctx.lineTo(108, 300);
  ctx.lineTo(166, 244);
  ctx.lineTo(202, 322);
  ctx.lineTo(240, 302);
  ctx.lineTo(204, 226);
  ctx.lineTo(268, 218);
  ctx.closePath();
  ctx.fill();
}

export { DESIGN, fit, drawCat, drawPaw, drawCursor };
