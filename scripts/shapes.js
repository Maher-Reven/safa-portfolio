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

  /* TAIL — a filled taper, not a stroke. A constant-width stroke gives a
     tail the same thickness at the root as at the tip, which is the single
     most cartoon thing you can do to a cat. */
  ctx.beginPath();
  ctx.moveTo(206, 330);
  ctx.bezierCurveTo(268, 336, 300, 292, 288, 244);
  ctx.bezierCurveTo(283, 222, 266, 210, 252, 218);
  ctx.bezierCurveTo(264, 224, 270, 240, 268, 254);   // tip, narrow
  ctx.bezierCurveTo(274, 292, 252, 316, 204, 310);
  ctx.closePath();
  ctx.fill();

  /* BODY — narrower at the shoulders than at the haunches, with the chest
     carried forward. The old shape was a symmetrical trapezoid, which reads
     as a bell rather than as an animal sitting down. */
  ctx.beginPath();
  ctx.moveTo(128, 168);
  ctx.bezierCurveTo(112, 196, 100, 246, 101, 292);   // back line, haunch
  ctx.bezierCurveTo(102, 316, 113, 330, 134, 332);
  ctx.lineTo(190, 332);
  ctx.bezierCurveTo(210, 330, 220, 316, 221, 292);
  ctx.bezierCurveTo(222, 246, 208, 196, 192, 168);
  ctx.closePath();
  ctx.fill();

  /* EARS — taller, with a real inner notch cut back in below. */
  ctx.beginPath();
  ctx.moveTo(122, 72); ctx.lineTo(103, 8);  ctx.lineTo(157, 54); ctx.closePath();
  ctx.moveTo(198, 72); ctx.lineTo(217, 8);  ctx.lineTo(163, 54); ctx.closePath();
  ctx.fill();

  /* HEAD — slightly smaller than the body is wide, so a neck exists. */
  ctx.beginPath();
  ctx.arc(160, 116, 59, 0, Math.PI * 2);
  ctx.fill();

  /* CHEEKS — a cat's face is wider than it is round. */
  ctx.beginPath();
  ctx.ellipse(160, 136, 62, 44, 0, 0, Math.PI * 2);
  ctx.fill();

  /* ---- negative space. Everything below is cut OUT of the silhouette, and
     it is what turns a mass into a face. ---- */
  ctx.globalCompositeOperation = "destination-out";

  // inner ears
  ctx.beginPath();
  ctx.moveTo(128, 66); ctx.lineTo(115, 30); ctx.lineTo(148, 57); ctx.closePath();
  ctx.moveTo(192, 66); ctx.lineTo(205, 30); ctx.lineTo(172, 57); ctx.closePath();
  ctx.fill();

  // eye sockets — the pupils are a separate plate that tracks the pointer
  ctx.beginPath();
  ctx.ellipse(136, 112, 19, 13, -0.16, 0, Math.PI * 2);
  ctx.ellipse(184, 112, 19, 13, 0.16, 0, Math.PI * 2);
  ctx.fill();

  // nose and the muzzle split
  ctx.beginPath();
  ctx.moveTo(152, 142); ctx.lineTo(168, 142); ctx.lineTo(160, 151); ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 3.5; ctx.lineCap = "round"; ctx.strokeStyle = "#fff";
  ctx.beginPath();
  ctx.moveTo(160, 151); ctx.lineTo(160, 158);
  ctx.moveTo(160, 158); ctx.bezierCurveTo(152, 168, 143, 165, 141, 158);
  ctx.moveTo(160, 158); ctx.bezierCurveTo(168, 168, 177, 165, 179, 158);
  ctx.stroke();

  // whiskers, cut clean through the cheek
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(132, 150); ctx.lineTo(74, 138);
  ctx.moveTo(132, 157); ctx.lineTo(72, 158);
  ctx.moveTo(132, 163); ctx.lineTo(76, 177);
  ctx.moveTo(188, 150); ctx.lineTo(246, 138);
  ctx.moveTo(188, 157); ctx.lineTo(248, 158);
  ctx.moveTo(188, 163); ctx.lineTo(244, 177);
  ctx.stroke();

  // the neck, and the two front legs, as grooves
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(146, 296); ctx.lineTo(146, 330);
  ctx.moveTo(176, 296); ctx.lineTo(176, 330);
  ctx.stroke();

  // the chest, so the front is not one flat plane
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(161, 186); ctx.bezierCurveTo(150, 216, 148, 254, 152, 288);
  ctx.stroke();

  ctx.globalCompositeOperation = "source-over";
}

/* The pupils are their own plate so they can be moved independently of the
   face: in the swarm they track the pointer, which is the entire "it
   notices you" claim expressed in about forty particles each. */
function drawPupils(ctx, W, H) {
  fit(ctx, W, H);
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(136, 112, 9.5, 12, 0, 0, Math.PI * 2);
  ctx.ellipse(184, 112, 9.5, 12, 0, 0, Math.PI * 2);
  ctx.fill();
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

export { DESIGN, fit, drawCat, drawPupils, drawPaw, drawCursor };
