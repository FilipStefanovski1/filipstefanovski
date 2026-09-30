/**
 * Draws the badge artwork (front, back, strap) onto 2D canvases.
 * Used as textures by the 3D scene. Fonts come from the CSS variables set by next/font.
 */

export const PALETTE = {
  paper: "#F3EFE6",
  paperDeep: "#E7E1D4",
  ink: "#141412",
  inkSoft: "#5C5A54",
  accent: "#FF4A1C",
};

/** Card artwork aspect: 54 x 86 mm (CR80, portrait). */
export const ART_W = 1080;
export const ART_H = 1720;

type Fonts = { display: string; serif: string; sans: string; mono: string };

function readFonts(): Fonts {
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    display: v("--font-display", "Impact, sans-serif"),
    serif: v("--font-serif", "Georgia, serif"),
    sans: v("--font-sans", "Helvetica, Arial, sans-serif"),
    mono: v("--font-mono", "ui-monospace, monospace"),
  };
}

export async function loadArtworkFonts(): Promise<Fonts> {
  const f = readFonts();
  if (typeof document !== "undefined" && document.fonts) {
    await Promise.allSettled([
      document.fonts.load(`800 120px ${f.display}`),
      document.fonts.load(`400 120px ${f.serif}`),
      document.fonts.load(`italic 400 120px ${f.serif}`),
      document.fonts.load(`500 40px ${f.sans}`),
      document.fonts.load(`500 40px ${f.mono}`),
    ]);
  }
  return f;
}

function makeCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.textBaseline = "alphabetic";
  return { c, ctx };
}

/** Draws text scaled horizontally to fit an exact width. */
function fitText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number) {
  const m = ctx.measureText(text);
  const sx = width / m.width;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sx, 1);
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function tracked(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, tracking: number, align: "left" | "right" = "left") {
  const chars = [...text];
  const widths = chars.map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + tracking * (chars.length - 1);
  let cx = align === "right" ? x - total : x;
  chars.forEach((ch, i) => {
    ctx.fillText(ch, cx, y);
    cx += widths[i] + tracking;
  });
  return total;
}

function grain(ctx: CanvasRenderingContext2D, w: number, h: number, alpha: number) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 255 * alpha;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

function pill(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  style: "ink" | "accent" | "outline",
  font: string,
) {
  const h = 66;
  const padX = 22;
  ctx.font = font;
  const w = ctx.measureText(text).width + padX * 2;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, h / 2);
  if (style === "outline") {
    ctx.lineWidth = 3;
    ctx.strokeStyle = PALETTE.ink;
    ctx.stroke();
  } else {
    ctx.fillStyle = style === "ink" ? PALETTE.ink : PALETTE.accent;
    ctx.fill();
  }
  ctx.fillStyle = style === "ink" ? PALETTE.paper : PALETTE.ink;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + padX, y + h / 2 + 2);
  ctx.textBaseline = "alphabetic";
  return w;
}

export const CARD_COPY = {
  first: "Filip",
  last: "Stefanovski",
  from: "Macedonia, studied in Belgium",
  previously: [
    { label: "Playground AI", style: "ink" as const },
    { label: "Blockchain Skopje", style: "accent" as const },
    { label: "Thomas More", style: "outline" as const },
  ],
};

export function drawFront(f: Fonts) {
  const { c, ctx } = makeCanvas(ART_W, ART_H);
  const P = PALETTE;
  const M = 72;
  const W = ART_W - M * 2;

  ctx.fillStyle = "#FBFAF6";
  ctx.fillRect(0, 0, ART_W, ART_H);

  // Name: two lines that just touch, the surname in the accent.
  ctx.fillStyle = P.ink;
  ctx.font = `800 290px ${f.display}`;
  ctx.fillText(CARD_COPY.first.toUpperCase(), M - 6, 400);
  ctx.fillStyle = P.accent;
  ctx.font = `800 210px ${f.display}`;
  fitText(ctx, CARD_COPY.last.toUpperCase(), M - 4, 562, W + 4);

  // Footer
  let y = ART_H - 400;
  ctx.fillStyle = P.ink;
  ctx.font = `italic 400 56px ${f.serif}`;
  ctx.fillText("From", M, y);
  ctx.font = `500 46px ${f.sans}`;
  ctx.fillText(CARD_COPY.from, M, y + 66);

  y += 170;
  ctx.fillStyle = P.ink;
  ctx.font = `italic 400 56px ${f.serif}`;
  ctx.fillText("Previously", M, y);
  let x = M;
  let py = y + 34;
  const font = `500 31px ${f.sans}`;
  for (const p of CARD_COPY.previously) {
    ctx.font = font;
    const w = ctx.measureText(p.label).width + 44;
    if (x + w > M + W) {
      x = M;
      py += 88;
    }
    x += pill(ctx, p.label, x, py, p.style, font) + 10;
  }

  grain(ctx, ART_W, ART_H, 0.03);
  return c;
}

export function drawBack(f: Fonts) {
  const { c, ctx } = makeCanvas(ART_W, ART_H);
  const P = PALETTE;
  const M = 72;

  ctx.fillStyle = P.ink;
  ctx.fillRect(0, 0, ART_W, ART_H);

  ctx.fillStyle = P.paper;
  ctx.font = `italic 400 132px ${f.serif}`;
  ctx.fillText("If found,", M, 330);
  ctx.font = `400 132px ${f.serif}`;
  ctx.fillText("please return", M, 460);
  ctx.fillText("to Filip.", M, 590);

  ctx.fillStyle = P.accent;
  ctx.beginPath();
  ctx.arc(M + 22, ART_H - 150, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = P.paper;
  ctx.globalAlpha = 0.7;
  ctx.font = `500 30px ${f.mono}`;
  tracked(ctx, "MK / BE", M + 70, ART_H - 139, 4);
  ctx.globalAlpha = 1;

  grain(ctx, ART_W, ART_H, 0.03);
  return c;
}

/** Woven strap: one tile, repeated along the strap length. */
export function drawStrap(f: Fonts) {
  const w = 560;
  const h = 160;
  const { c, ctx } = makeCanvas(w, h);
  ctx.fillStyle = PALETTE.accent;
  ctx.fillRect(0, 0, w, h);
  // weave
  ctx.fillStyle = "#000";
  ctx.globalAlpha = 0.08;
  for (let x = 0; x < w; x += 5) ctx.fillRect(x, 0, 2, h);
  ctx.globalAlpha = 0.06;
  for (let y = 0; y < h; y += 5) ctx.fillRect(0, y, w, 2);
  // stitched edges
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = PALETTE.ink;
  for (let x = 0; x < w; x += 20) {
    ctx.fillRect(x, 12, 11, 3);
    ctx.fillRect(x, h - 15, 11, 3);
  }
  ctx.globalAlpha = 1;
  ctx.textBaseline = "middle";
  ctx.font = `800 70px ${f.display}`;
  const label = "FILIP STEFANOVSKI";
  const lw = ctx.measureText(label).width;
  const gap = (w - lw) / 2;
  ctx.fillText(label, gap / 2, h / 2 + 4);
  ctx.beginPath();
  ctx.arc(w - gap / 2, h / 2, 10, 0, Math.PI * 2);
  ctx.fill();
  return c;
}
