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

/** Deterministic barcode from a string. */
function barcode(ctx: CanvasRenderingContext2D, seed: string, x: number, y: number, w: number, h: number) {
  let s = 0;
  for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1000) / 1000;
  };
  let cx = x;
  while (cx < x + w) {
    const bw = 3 + Math.floor(rnd() * 4) * 3;
    if (cx + bw > x + w) break;
    ctx.fillRect(cx, y, bw, h);
    cx += bw + 4 + Math.floor(rnd() * 3) * 4;
  }
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

export function drawFront(f: Fonts) {
  const { c, ctx } = makeCanvas(ART_W, ART_H);
  const P = PALETTE;
  const M = 72; // margin
  const W = ART_W - M * 2;

  ctx.fillStyle = P.paper;
  ctx.fillRect(0, 0, ART_W, ART_H);

  // Header row
  ctx.fillStyle = P.ink;
  ctx.font = `500 30px ${f.mono}`;
  tracked(ctx, "DESIGNER & BUILDER", M, 120, 3);
  tracked(ctx, "MK / BE", ART_W - M, 120, 3, "right");
  ctx.fillRect(M, 148, W, 3);

  // Name block
  ctx.font = `800 300px ${f.display}`;
  fitText(ctx, "FILIP", M - 6, 450, W * 0.62);
  ctx.font = `800 210px ${f.display}`;
  fitText(ctx, "STEFANOVSKI", M - 4, 660, W + 6);

  // Accent dot next to FILIP
  ctx.fillStyle = P.accent;
  ctx.beginPath();
  ctx.arc(M + W * 0.62 + 90, 380, 62, 0, Math.PI * 2);
  ctx.fill();

  // Serif role line
  ctx.fillStyle = P.ink;
  ctx.font = `italic 400 104px ${f.serif}`;
  ctx.fillText("Designer", M, 830);
  ctx.font = `400 104px ${f.serif}`;
  const dw = ctx.measureText("Designer ").width;
  ctx.fillStyle = P.accent;
  ctx.fillText("&", M + dw, 830);
  const aw = ctx.measureText("& ").width;
  ctx.fillStyle = P.ink;
  ctx.font = `italic 400 104px ${f.serif}`;
  ctx.fillText("Builder", M + dw + aw, 830);

  // Field table
  const rows: [string, string][] = [
    ["FROM", "Macedonia"],
    ["STUDIED", "Belgium"],
    ["WORKS IN", "Product, Frontend, AI"],
    ["LANGUAGES", "04"],
  ];
  let y = 930;
  rows.forEach(([k, v]) => {
    ctx.fillStyle = P.ink;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(M, y, W, 2);
    ctx.globalAlpha = 1;
    ctx.font = `500 26px ${f.mono}`;
    ctx.fillStyle = P.inkSoft;
    tracked(ctx, k, M, y + 62, 3);
    ctx.fillStyle = P.ink;
    ctx.font = `500 44px ${f.sans}`;
    ctx.fillText(v, M + 300, y + 66);
    y += 100;
  });
  ctx.fillRect(M, y, W, 2);

  // Accent footer band
  const bandY = ART_H - 300;
  ctx.fillStyle = P.accent;
  ctx.fillRect(0, bandY, ART_W, 300);
  ctx.fillStyle = P.ink;
  barcode(ctx, "filip-stefanovski", M, bandY + 56, 420, 150);
  ctx.font = `500 26px ${f.mono}`;
  tracked(ctx, "FS-DXD-180", M, bandY + 250, 3);
  ctx.font = `800 170px ${f.display}`;
  ctx.textAlign = "right";
  ctx.fillText("ALL", ART_W - M, bandY + 150);
  ctx.fillText("ACCESS", ART_W - M, bandY + 262);
  ctx.textAlign = "left";

  grain(ctx, ART_W, ART_H, 0.035);
  return c;
}

export function drawBack(f: Fonts) {
  const { c, ctx } = makeCanvas(ART_W, ART_H);
  const P = PALETTE;
  const M = 72;
  const W = ART_W - M * 2;

  ctx.fillStyle = P.ink;
  ctx.fillRect(0, 0, ART_W, ART_H);

  ctx.fillStyle = P.paper;
  ctx.font = `500 30px ${f.mono}`;
  tracked(ctx, "REVERSE", M, 120, 3);
  tracked(ctx, "FS / 2026", ART_W - M, 120, 3, "right");
  ctx.globalAlpha = 0.5;
  ctx.fillRect(M, 148, W, 2);
  ctx.globalAlpha = 1;

  ctx.font = `italic 400 132px ${f.serif}`;
  ctx.fillText("If found,", M, 340);
  ctx.font = `400 132px ${f.serif}`;
  ctx.fillText("please return", M, 470);
  ctx.fillText("to Filip.", M, 600);

  ctx.fillStyle = P.accent;
  ctx.fillRect(M, 680, 120, 10);

  ctx.fillStyle = P.paper;
  const list: [string, string][] = [
    ["01", "Q4"],
    ["02", "Q4 Internal"],
    ["03", "SMCC"],
    ["04", "Nordgate"],
  ];
  let y = 800;
  ctx.font = `500 26px ${f.mono}`;
  ctx.globalAlpha = 0.6;
  tracked(ctx, "SELECTED WORK", M, y, 3);
  ctx.globalAlpha = 1;
  y += 40;
  list.forEach(([n, t]) => {
    ctx.globalAlpha = 0.28;
    ctx.fillRect(M, y, W, 2);
    ctx.globalAlpha = 1;
    ctx.font = `500 26px ${f.mono}`;
    ctx.fillStyle = P.accent;
    ctx.fillText(n, M, y + 64);
    ctx.fillStyle = P.paper;
    ctx.font = `800 64px ${f.display}`;
    ctx.fillText(t.toUpperCase(), M + 110, y + 72);
    y += 100;
  });
  ctx.globalAlpha = 0.28;
  ctx.fillRect(M, y, W, 2);
  ctx.globalAlpha = 1;

  ctx.font = `500 26px ${f.mono}`;
  ctx.globalAlpha = 0.6;
  tracked(ctx, "THOMAS MORE UNIVERSITY", M, ART_H - 240, 3);
  tracked(ctx, "DIGITAL EXPERIENCE DESIGN / 180 ECTS", M, ART_H - 196, 3);
  ctx.globalAlpha = 1;

  // MK / BE roundel
  const cx = ART_W - M - 110;
  const cy = ART_H - 230;
  ctx.strokeStyle = P.paper;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = P.accent;
  ctx.beginPath();
  ctx.arc(cx, cy, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = P.ink;
  ctx.font = `800 54px ${f.display}`;
  ctx.textAlign = "center";
  ctx.fillText("MK", cx, cy - 4);
  ctx.fillText("BE", cx, cy + 46);
  ctx.textAlign = "left";

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
