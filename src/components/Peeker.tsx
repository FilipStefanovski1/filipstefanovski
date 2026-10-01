"use client";

import { useEffect, useId, useRef } from "react";
import styles from "./Peeker.module.css";

/*
 * A three-eyed creature lurking just past the edge of the hero.
 * Drawn in a 200 x 320 box (y from -60). x = 200 is the page edge: the head is cropped there,
 * so the outline never runs along the viewport edge.
 */
const VB = { x: 0, y: -60, w: 200, h: 320 };

/** Eye geometry in SVG units. `travel` is how far the pupil may move; `lid` is its resting closure (0 open, 1 shut). */
const EYES = [
  // Big eye: a narrowed, predatory almond
  {
    cx: 74,
    cy: 101,
    shape: "M44 106 C 50 92, 74 84, 104 94 C 98 110, 70 120, 44 106 Z",
    top: 84,
    h: 36,
    pupil: { rx: 3.4, ry: 11 },
    travel: { x: 11, y: 3.5 },
    lid: 0.14,
  },
  // Second eye: suspicious, a heavy slanted lid
  {
    cx: 134,
    cy: 70,
    shape: "M118 72 C 118 58, 148 54, 151 70 C 152 82, 120 86, 118 72 Z",
    top: 56,
    h: 30,
    pupil: { rx: 2.6, ry: 7.5 },
    travel: { x: 7, y: 3 },
    lid: 0.28,
  },
  // Small eye: unnervingly wide open
  {
    cx: 128,
    cy: 124,
    shape: "M128 113 a 11 11 0 1 0 0.01 0 Z",
    top: 113,
    h: 22,
    pupil: { rx: 1.6, ry: 4.6 },
    travel: { x: 5, y: 4 },
    lid: 0,
  },
];

const HEAD =
  "M200 2 C 176 -4, 150 0, 128 10 C 108 20, 92 26, 68 30 C 46 34, 30 48, 25 66 L 33 72 C 24 92, 24 116, 32 134 C 38 146, 30 160, 33 172 C 37 188, 52 196, 72 195 C 98 194, 118 186, 140 196 C 158 204, 178 207, 200 205";

export default function Peeker() {
  const uid = useId().replace(/:/g, "");
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const head = useRef<SVGGElement>(null);
  const pupils = useRef<(SVGGElement | null)[]>([]);
  const lids = useRef<(SVGRectElement | null)[]>([]);
  const mouth = useRef<SVGGElement>(null);

  useEffect(() => {
    const el = root.current;
    const s = svg.current;
    if (!el || !s) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stage = () => document.querySelector<HTMLElement>("[data-dragging]");

    let target: { x: number; y: number } | null = null;
    const pupil = EYES.map(() => ({ x: 0, y: 0 }));
    let lean = 0;
    let squint = 0;
    let raf = 0;
    let visible = true;
    let pageShown = document.visibilityState === "visible";
    let touchReset = 0;

    // Blinks: one eye leads, the others follow a beat later
    const blink = EYES.map(() => 0);
    let nextBlink = performance.now() + 2500;
    const scheduleBlink = (now: number) => {
      const lead = Math.floor(Math.random() * EYES.length);
      EYES.forEach((_, i) => {
        blink[i] = now + (i === lead ? 0 : 110 + Math.random() * 90);
      });
      nextBlink = now + 4200 + Math.random() * 5200;
    };

    // Peek from the right, duck out, come back mirrored from the left, repeat.
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const cycle = () => {
      el.dataset.state = "in";
      later(() => {
        el.dataset.state = "out";
        later(() => {
          el.dataset.side = el.dataset.side === "left" ? "right" : "left";
          cycle();
        }, 900);
      }, 7600);
    };
    el.dataset.side = "right";
    if (reduce) el.dataset.state = "in";
    else {
      el.dataset.state = "out";
      later(cycle, 1200);
    }

    const onMove = (e: PointerEvent) => {
      // Touch only counts while a finger is down; mouse and pen always count
      if (e.pointerType === "touch" && e.type === "pointermove" && e.buttons === 0) return;
      target = { x: e.clientX, y: e.clientY };
      window.clearTimeout(touchReset);
    };
    const onEnd = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      // After a touch, settle back into a composed pose
      touchReset = window.setTimeout(() => (target = null), 700);
    };

    const tick = (now: number) => {
      raf = 0;
      if (!visible || !pageShown) return;
      const box = s.getBoundingClientRect();
      const scale = box.width / VB.w;
      const mirrored = el.dataset.side === "left";
      const dragging = stage()?.dataset.dragging === "true";
      const k = reduce ? 1 : dragging ? 0.32 : 0.14;

      // Distance from the pointer to the face drives the squint and the grin
      const faceX = mirrored ? box.right - 90 * scale : box.left + 90 * scale;
      const faceY = box.top + (110 - VB.y) * scale;
      const near = target ? Math.max(0, 1 - Math.hypot(target.x - faceX, target.y - faceY) / (260 * Math.max(1, scale))) : 0;
      const wantSquint = reduce ? 0 : Math.min(1, near * 1.2 + (dragging ? 0.35 : 0));
      squint += (wantSquint - squint) * 0.1;

      EYES.forEach((eye, i) => {
        // Pupils: aim at the pointer, each eye with its own reach; drift home with no pointer
        let tx = 0;
        let ty = 0;
        if (target) {
          const ex = mirrored ? box.right - eye.cx * scale : box.left + eye.cx * scale;
          const ey = box.top + (eye.cy - VB.y) * scale;
          const dx = target.x - ex;
          const dy = target.y - ey;
          const d = Math.hypot(dx, dy) || 1;
          const reach = dragging ? 1 : Math.min(1, d / 220);
          tx = (dx / d) * reach * eye.travel.x * (mirrored ? -1 : 1);
          ty = (dy / d) * reach * eye.travel.y;
        }
        const p = pupil[i];
        p.x += (tx - p.x) * k;
        p.y += (ty - p.y) * k;
        pupils.current[i]?.setAttribute("transform", `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`);

        // Lids: resting closure + squint + blink
        let b = 0;
        if (!reduce && blink[i] && now >= blink[i]) {
          const t = (now - blink[i]) / 170;
          b = t < 1 ? Math.sin(t * Math.PI) : 0;
          if (t >= 1) blink[i] = 0;
        }
        const close = Math.min(1, eye.lid + squint * (i === 2 ? 0.12 : 0.32) + b);
        lids.current[i]?.setAttribute("height", (eye.h * close).toFixed(2));
      });
      if (!reduce && now > nextBlink) scheduleBlink(now);

      // Lean the head toward the pointer, plus a rare slow tilt
      if (!reduce) {
        const mid = box.top + box.height * 0.42;
        const want = target ? Math.max(-1, Math.min(1, (target.y - mid) / 420)) * 7 : 0;
        lean += (want - lean) * 0.06;
        const tilt = Math.sin(now / 9000) > 0.985 ? Math.sin(now / 300) * 2 : 0;
        head.current?.setAttribute("transform", `rotate(${(lean + tilt).toFixed(2)} 200 150)`);
        mouth.current?.setAttribute(
          "transform",
          `translate(38 160) scale(${(1 + squint * 0.07).toFixed(3)} ${(1 + squint * 0.12).toFixed(3)}) translate(-38 -160)`,
        );
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf && visible && pageShown) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    io.observe(el);
    const onVis = () => {
      pageShown = document.visibilityState === "visible";
      start();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerup", onEnd, { passive: true });
    window.addEventListener("pointercancel", onEnd, { passive: true });
    start();
    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(touchReset);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} className={styles.peeker} aria-hidden>
      <svg ref={svg} viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} className={styles.svg}>
        <defs>
          {EYES.map((eye, i) => (
            <clipPath key={i} id={`${uid}-eye${i}`}>
              <path d={eye.shape} />
            </clipPath>
          ))}
        </defs>

        <g ref={head}>
          {/* Horns: unequal, curved and tapered; the big one is chipped */}
          <path
            className={styles.horn}
            d="M106 22 C 100 4, 94 -10, 88 -20 L 82 -18 L 85 -26 C 78 -38, 66 -48, 50 -56 C 70 -40, 92 -20, 132 8 Z"
          />
          <path className={styles.horn} d="M152 2 C 156 -14, 164 -26, 180 -36 C 176 -22, 174 -10, 176 2 Z" />

          {/* Backward-curving spikes on the crown, cheek and jaw */}
          <path className={styles.horn} d="M138 8 C 142 -2, 146 -8, 154 -12 C 152 -4, 150 2, 150 6 Z" />
          <path className={styles.horn} d="M30 142 C 20 144, 12 150, 6 160 C 16 158, 24 158, 32 156 Z" />
          <path className={styles.horn} d="M31 112 C 20 110, 13 112, 7 118 C 16 120, 23 122, 29 124 Z" />
          <path className={styles.horn} d="M118 191 C 120 204, 126 214, 138 220 C 134 208, 132 200, 132 194 Z" />

          {/* Head: fill closes along the page edge, the outline does not */}
          <path className={styles.fill} d={`${HEAD} L 200 2 Z`} />
          <path className={styles.outline} d={HEAD} />

          {/* Brow ridge carved into the face, a cheek crease under the big eye */}
          <path className={styles.detail} d="M33 78 C 52 70, 82 74, 110 88" />
          <path className={styles.hair} d="M112 60 C 124 46, 146 44, 158 56" />
          <path className={styles.hair} d="M52 122 C 64 128, 82 128, 94 120" />

          {/* Eyes */}
          {EYES.map((eye, i) => (
            <g key={i}>
              <path className={styles.sclera} d={eye.shape} />
              <g clipPath={`url(#${uid}-eye${i})`}>
                <g
                  ref={(n) => {
                    pupils.current[i] = n;
                  }}
                >
                  <ellipse className={styles.pupil} cx={eye.cx} cy={eye.cy} rx={eye.pupil.rx} ry={eye.pupil.ry} />
                  <circle className={styles.glint} cx={eye.cx - eye.pupil.rx * 0.2} cy={eye.cy - eye.pupil.ry * 0.55} r={Math.max(0.9, eye.pupil.rx * 0.38)} />
                </g>
                <rect
                  ref={(n) => {
                    lids.current[i] = n;
                  }}
                  className={styles.lid}
                  x={eye.cx - 40}
                  y={eye.top - 1}
                  width="80"
                  height={eye.h * eye.lid}
                />
              </g>
              <path className={styles.eyeRim} d={eye.shape} />
            </g>
          ))}

          {/* Crooked grin: cavity, uneven teeth, two fangs, one corner curling up */}
          <g ref={mouth}>
            <path className={styles.mouth} d="M38 160 C 62 168, 96 168, 124 152 C 120 170, 104 182, 82 186 C 62 188, 46 178, 38 160 Z" />
            <path className={styles.tooth} d="M45 162.4 l 3.5 6 l 3.5 -5.2 Z" />
            <path className={styles.fang} d="M53 164 l 5 19 l 5.5 -18 Z" />
            <path className={styles.tooth} d="M66 165.2 l 3.5 8 l 3.5 -8 Z" />
            <path className={styles.tooth} d="M75 165.6 l 3 5 l 3 -5 Z" />
            <path className={styles.tooth} d="M83 165.4 l 4 9 l 4 -9.4 Z" />
            <path className={styles.tooth} d="M93 164.4 l 3 5 l 3 -5.4 Z" />
            <path className={styles.fang} d="M100 162.6 l 5.5 20 l 5 -21.6 Z" />
            <path className={styles.tooth} d="M112 158.6 l 3.5 7 l 3 -8.4 Z" />
            <path className={styles.tooth} d="M60 182.6 l 3 -7 l 3.4 7.6 Z" />
            <path className={styles.tooth} d="M84 185.6 l 3 -6 l 3 6 Z" />
            <path className={styles.lip} d="M124 152 C 129 151, 133 148, 135 142" />
          </g>

          {/* Hand curled over the page edge: three fingers, hooked claws */}
          <g className={styles.hand}>
            <path className={styles.claw} d="M160 226 C 152 226, 147 232, 148 241 C 152 235, 157 233, 162 233 Z" />
            <path className={styles.finger} d="M200 214 C 186 208, 168 210, 161 221 C 157 228, 160 235, 167 234 C 174 233, 176 227, 184 225 C 190 223, 196 225, 200 227" />
            <path className={styles.claw} d="M153 246 C 144 247, 140 254, 142 262 C 145 256, 150 254, 156 254 Z" />
            <path className={styles.finger} d="M200 232 C 182 227, 162 229, 154 241 C 150 248, 153 255, 160 254 C 168 253, 170 246, 180 244 C 188 242, 195 244, 200 246" />
            <path className={styles.claw} d="M160 264 C 153 266, 150 271, 152 278 C 155 273, 159 271, 164 271 Z" />
            <path className={styles.finger} d="M200 251 C 186 248, 170 250, 163 259 C 159 265, 162 271, 168 270 C 175 269, 177 263, 185 262 C 191 261, 196 263, 200 264" />
          </g>
        </g>
      </svg>
    </div>
  );
}
