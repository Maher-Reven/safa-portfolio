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
  ctx.moveTo(137, 162);                              // shoulders, drawn IN
  ctx.bezierCurveTo(114, 194, 100, 246, 101, 292);   // back line, haunch
  ctx.bezierCurveTo(102, 316, 113, 330, 134, 332);
  ctx.lineTo(190, 332);
  ctx.bezierCurveTo(210, 330, 220, 316, 221, 292);
  ctx.bezierCurveTo(222, 246, 208, 194, 183, 162);
  ctx.closePath();
  ctx.fill();

  /* EARS — taller, with a real inner notch cut back in below. */
  ctx.beginPath();
  ctx.moveTo(122, 72); ctx.lineTo(103, 8);  ctx.lineTo(157, 54); ctx.closePath();
  ctx.moveTo(198, 72); ctx.lineTo(217, 8);  ctx.lineTo(163, 54); ctx.closePath();
  ctx.fill();

  /* WHISKERS — drawn as part of the silhouette, reaching out past the
     cheek, not cut into it. As negative space they did almost nothing: they
     ran from x=66 to x=254 while the face only spans 97 to 223, so most of
     each whisker was outside the shape and cut nothing at all. Positive,
     they read immediately, and edge-weighted sampling keeps them crisp
     because a thin stroke is all boundary. */
  ctx.lineCap = "round";
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(126, 148); ctx.bezierCurveTo(100, 144, 78, 138, 58, 130);
  ctx.moveTo(126, 156); ctx.bezierCurveTo(100, 158, 76, 162, 54, 166);
  ctx.moveTo(126, 163); ctx.bezierCurveTo(100, 170, 80, 180, 62, 192);
  ctx.moveTo(194, 148); ctx.bezierCurveTo(220, 144, 242, 138, 262, 130);
  ctx.moveTo(194, 156); ctx.bezierCurveTo(220, 158, 244, 162, 266, 166);
  ctx.moveTo(194, 163); ctx.bezierCurveTo(220, 170, 240, 180, 258, 192);
  ctx.stroke();

  /* HEAD — slightly smaller than the body is wide, so a neck exists. */
  ctx.beginPath();
  ctx.arc(160, 116, 59, 0, Math.PI * 2);
  ctx.fill();

  /* CHEEKS — a cat's face is wider than it is round. Kept shallower than
     the head is tall so a neck survives underneath it; at ry 44 the cheeks
     reached the shoulders and the head merged into the body. */
  ctx.beginPath();
  ctx.ellipse(160, 130, 63, 36, 0, 0, Math.PI * 2);
  ctx.fill();

  /* ---- negative space. Everything below is cut OUT of the silhouette, and
     it is what turns a mass into a face. ---- */
  ctx.globalCompositeOperation = "destination-out";

  // inner ears
  ctx.beginPath();
  ctx.moveTo(128, 66); ctx.lineTo(115, 30); ctx.lineTo(148, 57); ctx.closePath();
  ctx.moveTo(192, 66); ctx.lineTo(205, 30); ctx.lineTo(172, 57); ctx.closePath();
  ctx.fill();

  /* Eye sockets. Rotated so the outer corners lift — a round eye is a
     kitten or an owl; the angle is most of what makes it read as a cat. */
  ctx.beginPath();
  ctx.ellipse(135, 111, 21, 13, -0.28, 0, Math.PI * 2);
  ctx.ellipse(185, 111, 21, 13, 0.28, 0, Math.PI * 2);
  ctx.fill();

  /* NOSE. A wedge, and a big one. Every cut below is sized against the
     particle spacing rather than against the drawing: a 2.6px line is
     invisible once 24,000 points are scattered over the shape, so anything
     meant to be seen has to be about twice the width that looks right on
     the plate. */
  ctx.beginPath();
  ctx.moveTo(149, 141); ctx.lineTo(171, 141); ctx.lineTo(160, 153); ctx.closePath();
  ctx.fill();

  ctx.lineCap = "round";
  ctx.strokeStyle = "#fff";

  // the mouth
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(160, 153); ctx.lineTo(160, 160);
  ctx.moveTo(160, 160); ctx.bezierCurveTo(151, 171, 141, 167, 139, 159);
  ctx.moveTo(160, 160); ctx.bezierCurveTo(169, 171, 179, 167, 181, 159);
  ctx.stroke();

  // the two front legs
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(145, 288); ctx.lineTo(145, 332);
  ctx.moveTo(177, 288); ctx.lineTo(177, 332);
  ctx.stroke();

  /* The chest groove is gone. Drawn down one side it read as a scar rather
     than as anatomy, and the front legs already break up the front. */

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
