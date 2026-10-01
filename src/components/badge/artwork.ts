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
  role: "Product Developer",
  from: "Macedonia",
  id: "FS 0001",
  currently: [
    { label: "Q4", style: "ink" as const },
    { label: "Playground AI", style: "ink" as const },
    { label: "Blockchain Skopje", style: "ink" as const },
  ],
  /** Player-card stat line */
  stats: [
    { label: "Shipped", value: "05" },
    { label: "Buried", value: "~20" },
    { label: "Hustle", value: "MAX" },
  ],
};

/** Deterministic barcode from a string. */
function barcode(ctx: CanvasRenderingContext2D, seed: string, x: number, y: number, w: number, h: number) {
  let n = 0;
  for (const ch of seed) n = (n * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => {
    n ^= n << 13;
    n ^= n >>> 17;
    n ^= n << 5;
    return ((n >>> 0) % 1000) / 1000;
  };
  let cx = x;
  while (cx < x + w) {
    const bw = 4 + Math.floor(rnd() * 4) * 3;
    if (cx + bw > x + w) break;
    ctx.fillRect(cx, y, bw, h);
    cx += bw + 4 + Math.floor(rnd() * 3) * 4;
  }
}

/** Holographic security sticker: an iridescent foil patch with a fine guilloche. */
function hologram(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 14);
  ctx.clip();
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, "#d9c2ff");
  g.addColorStop(0.25, "#9ff3ff");
  g.addColorStop(0.5, "#fdf7a8");
  g.addColorStop(0.75, "#ffc2e6");
  g.addColorStop(1, "#b6c8ff");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 1.5;
  for (let i = -h; i < w; i += 9) {
    ctx.beginPath();
    ctx.moveTo(x + i, y + h);
    ctx.lineTo(x + i + h, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(10,10,10,0.18)";
  for (let r = 10; r < w; r += 12) {
    ctx.beginPath();
    ctx.arc(x + w * 0.5, y + h * 0.5, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawFront(f: Fonts) {
  const { c, ctx } = makeCanvas(ART_W, ART_H);
  const P = PALETTE;
  const M = 72;
  const W = ART_W - M * 2;
  const cx = ctx as Ctx;

  // The card is the neon; everything printed on it is black.
  ctx.fillStyle = P.accent;
  ctx.fillRect(0, 0, ART_W, ART_H);

  // Header: role on the left, holographic sticker on the right
  ctx.fillStyle = P.ink;
  ctx.font = `700 40px ${f.name}`;
  ctx.textBaseline = "middle";
  ctx.fillText(CARD_COPY.role.toUpperCase(), M, 118);
  ctx.textBaseline = "alphabetic";
  hologram(ctx, ART_W - M - 150, 70, 150, 96);
  ctx.fillRect(M, 200, W, 4);

  // Name: FILIP fills the width, STEFANOVSKI sits under it.
  cx.fontStretch = "condensed";
  ctx.font = `800 640px ${f.name}`;
  const firstTop = 250;
  const firstAsc = ctx.measureText("FILIP").actualBoundingBoxAscent;
  fitText(ctx, CARD_COPY.first.toUpperCase(), M, firstTop + firstAsc, W);
  ctx.font = `800 224px ${f.name}`;
  const lastAsc = ctx.measureText("STEFANOVSKI").actualBoundingBoxAscent;
  const lastBase = firstTop + firstAsc + 36 + lastAsc;
  fitText(ctx, CARD_COPY.last.toUpperCase(), M, lastBase, W);
  cx.fontStretch = "normal";

  // Fields
  let y = lastBase + 110;
  ctx.fillRect(M, y - 60, W, 2);
  ctx.font = `600 34px ${f.name}`;
  ctx.fillStyle = P.inkSoft;
  ctx.fillText("From", M, y);
  ctx.fillStyle = P.ink;
  ctx.font = `600 52px ${f.name}`;
  ctx.fillText(CARD_COPY.from, M, y + 66);

  y += 160;
  ctx.font = `600 34px ${f.name}`;
  ctx.fillStyle = P.inkSoft;
  ctx.fillText("Currently", M, y);
  let x = M;
  let py = y + 30;
  const font = `600 34px ${f.name}`;
  for (const p of CARD_COPY.currently) {
    ctx.font = font;
    const w = ctx.measureText(p.label).width + 44;
    if (x + w > M + W) {
      x = M;
      py += 84;
    }
    x += pill(ctx, p.label, x, py, p.style, font) + 12;
  }

  // Stat line, like the back of a player card
  const sy = py + 66 + 38;
  ctx.fillStyle = P.ink;
  ctx.fillRect(M, sy, W, 2);
  CARD_COPY.stats.forEach((s, i) => {
    const sx = M + (i * W) / 3;
    ctx.font = `600 34px ${f.name}`;
    ctx.fillStyle = P.inkSoft;
    ctx.fillText(s.label, sx, sy + 50);
    ctx.fillStyle = P.ink;
    cx.fontStretch = "condensed";
    ctx.font = `800 84px ${f.name}`;
    ctx.fillText(s.value, sx, sy + 138);
    cx.fontStretch = "normal";
  });

  // Barcode and ID number along the bottom
  ctx.fillStyle = P.ink;
  ctx.fillRect(M, ART_H - 290, W, 2);
  barcode(ctx, "filip-stefanovski", M, ART_H - 250, 520, 150);
  ctx.textAlign = "right";
  ctx.font = `800 ${Math.round(64)}px ${f.name}`;
  cx.fontStretch = "condensed";
  ctx.fillText(CARD_COPY.id, ART_W - M, ART_H - 170);
  cx.fontStretch = "normal";
  ctx.font = `600 30px ${f.name}`;
  ctx.fillStyle = P.inkSoft;
  ctx.fillText("Valid while building", ART_W - M, ART_H - 118);
  ctx.textAlign = "left";

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
  // Near-black woven strap
  ctx.fillStyle = "#121212";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";
  ctx.globalAlpha = 0.045;
  for (let x = 0; x < w; x += 5) ctx.fillRect(x, 0, 2, h);
  ctx.globalAlpha = 0.03;
  for (let y = 0; y < h; y += 5) ctx.fillRect(0, y, w, 2);
  // Neon stitched edges
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = PALETTE.accent;
  for (let x = 0; x < w; x += 20) {
    ctx.fillRect(x, 12, 11, 3);
    ctx.fillRect(x, h - 15, 11, 3);
  }
  ctx.globalAlpha = 1;
  // The name is fitted to a fixed box so it never crosses the tile seam,
  // whether or not the browser supports condensed canvas text.
  ctx.textBaseline = "middle";
  (ctx as Ctx).fontStretch = "condensed";
  ctx.font = `800 76px ${f.name}`;
  ctx.fillStyle = PALETTE.accent;
  fitText(ctx, "FILIP STEFANOVSKI", w * 0.06, h / 2 + 4, w * 0.78);
  (ctx as Ctx).fontStretch = "normal";
  ctx.beginPath();
  ctx.arc(w * 0.93, h / 2, 9, 0, Math.PI * 2);
  ctx.fill();
  return c;
}
