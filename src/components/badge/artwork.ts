/**
 * Draws the badge artwork (front, back, strap) onto 2D canvases.
 * Used as textures by the 3D scene. Fonts come from the CSS variables set by next/font.
 */

export const PALETTE = {
  paper: "#F2F2EE",
  ink: "#0A0A0A",
  /** Secondary type on the neon card: a deep green, not grey */
  inkSoft: "#17520A",
  accent: "#39FF14",
};

/** Card artwork aspect: 54 x 86 mm (CR80, portrait). */
export const ART_W = 1080;
export const ART_H = 1720;

/** Every face on the badge is Bricolage Grotesque, the site's one family. */
type Fonts = { name: string };

function readFonts(): Fonts {
  const cs = getComputedStyle(document.documentElement);
  return { name: cs.getPropertyValue("--font-name").trim() || "system-ui, sans-serif" };
}

export async function loadArtworkFonts(): Promise<Fonts> {
  const f = readFonts();
  if (typeof document !== "undefined" && document.fonts) {
    await Promise.allSettled([
      document.fonts.load(`800 120px ${f.name}`),
      document.fonts.load(`600 40px ${f.name}`),
      document.fonts.load(`400 40px ${f.name}`),
    ]);
  }
  return f;
}

type Ctx = CanvasRenderingContext2D & { fontStretch?: string };

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
  ctx.fillStyle = style === "ink" ? PALETTE.accent : PALETTE.ink;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + padX, y + h / 2 + 2);
  ctx.textBaseline = "alphabetic";
  return w;
}

export const CARD_COPY = {
  first: "Filip",
  last: "Stefanovski",
  from: "Macedonia, studied in Belgium",
  currently: [
    { label: "Playground AI", style: "ink" as const },
    { label: "Blockchain Skopje", style: "ink" as const },
  ],
};

export function drawFront(f: Fonts) {
  const { c, ctx } = makeCanvas(ART_W, ART_H);
  const P = PALETTE;
  const M = 72;
  const W = ART_W - M * 2;

  // The card is the neon; everything printed on it is black.
  ctx.fillStyle = P.accent;
  ctx.fillRect(0, 0, ART_W, ART_H);

  // Name: FILIP fills the width, STEFANOVSKI sits under it in the accent.
  const cx = ctx as Ctx;
  cx.fontStretch = "condensed";
  ctx.fillStyle = P.ink;
  ctx.font = `800 640px ${f.name}`;
  const firstTop = 104;
  const firstAsc = ctx.measureText("FILIP").actualBoundingBoxAscent;
  fitText(ctx, CARD_COPY.first.toUpperCase(), M, firstTop + firstAsc, W);
  ctx.fillStyle = P.ink;
  ctx.font = `800 224px ${f.name}`;
  const lastAsc = ctx.measureText("STEFANOVSKI").actualBoundingBoxAscent;
  fitText(ctx, CARD_COPY.last.toUpperCase(), M, firstTop + firstAsc + 40 + lastAsc, W);
  cx.fontStretch = "normal";

  // Footer
  let y = ART_H - 400;
  ctx.fillStyle = P.ink;
  ctx.font = `600 38px ${f.name}`;
  ctx.fillStyle = P.inkSoft;
  ctx.fillText("From", M, y);
  ctx.fillStyle = P.ink;
  ctx.font = `500 46px ${f.name}`;
  ctx.fillText(CARD_COPY.from, M, y + 66);

  y += 170;
  ctx.fillStyle = P.ink;
  ctx.font = `600 38px ${f.name}`;
  ctx.fillStyle = P.inkSoft;
  ctx.fillText("Currently", M, y);
  let x = M;
  let py = y + 34;
  const font = `600 31px ${f.name}`;
  for (const p of CARD_COPY.currently) {
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
  const cx = ctx as Ctx;

  ctx.fillStyle = P.ink;
  ctx.fillRect(0, 0, ART_W, ART_H);

  cx.fontStretch = "condensed";
  ctx.fillStyle = P.paper;
  ctx.font = `800 190px ${f.name}`;
  ["IF FOUND,", "PLEASE", "RETURN", "TO FILIP."].forEach((l, i) => {
    ctx.fillStyle = i === 3 ? P.accent : P.paper;
    ctx.fillText(l, M - 4, 300 + i * 168);
  });
  cx.fontStretch = "normal";

  ctx.fillStyle = P.paper;
  ctx.globalAlpha = 0.64;
  ctx.font = `500 40px ${f.name}`;
  ctx.fillText("Product Developer", M, ART_H - 190);
  ctx.fillText("Macedonia / Belgium", M, ART_H - 132);
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
  (ctx as Ctx).fontStretch = "condensed";
  ctx.font = `800 76px ${f.name}`;
  const label = "FILIP STEFANOVSKI";
  const lw = ctx.measureText(label).width;
  const gap = (w - lw) / 2;
  ctx.fillText(label, gap / 2, h / 2 + 4);
  ctx.beginPath();
  ctx.arc(w - gap / 2, h / 2, 10, 0, Math.PI * 2);
  ctx.fill();
  return c;
}
