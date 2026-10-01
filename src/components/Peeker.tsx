"use client";

import { useEffect, useRef } from "react";
import styles from "./Peeker.module.css";

/** Eye centres and pupil travel, in the SVG's own units. */
/** Extra room above the body for the horns. */
const VB_Y = -56;
const VB_H = 296;

const EYES = [
  { cx: 62, cy: 92, r: 21, pr: 9, travel: 9 },
  { cx: 108, cy: 70, r: 15, pr: 6.5, travel: 6 },
  { cx: 104, cy: 120, r: 11, pr: 5, travel: 4.5 },
];

/**
 * A three-eyed blob peeking in from the edge of the hero.
 * Its eyes follow the pointer (or finger) while the hero is on screen. Decorative only.
 */
export default function Peeker() {
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const pupils = useRef<(SVGGElement | null)[]>([]);
  const body = useRef<SVGGElement>(null);

  useEffect(() => {
    const el = root.current;
    const s = svg.current;
    if (!el || !s) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let target = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
    const current = EYES.map(() => ({ x: 0, y: 0 }));
    let lean = 0;
    let raf = 0;
    let active = true;

    // Peek from the right, duck out, come back mirrored from the left, repeat.
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const SHOW = 7600;
    const SWAP = 900;
    const cycle = () => {
      el.dataset.state = "in";
      later(() => {
        el.dataset.state = "out";
        later(() => {
          el.dataset.side = el.dataset.side === "left" ? "right" : "left";
          cycle();
        }, SWAP);
      }, SHOW);
    };
    el.dataset.side = "right";
    if (reduce) {
      el.dataset.state = "in";
    } else {
      el.dataset.state = "out";
      later(cycle, 1200);
    }

    const onMove = (e: PointerEvent) => {
      target = { x: e.clientX, y: e.clientY };
    };

    const tick = () => {
      raf = 0;
      if (!active) return;
      const box = s.getBoundingClientRect();
      const scale = box.width / 160; // viewBox width
      const mirrored = el.dataset.side === "left";
      EYES.forEach((eye, i) => {
        const ex = mirrored ? box.right - eye.cx * scale : box.left + eye.cx * scale;
        const ey = box.top + (eye.cy - VB_Y) * scale;
        const dx = target.x - ex;
        const dy = target.y - ey;
        const d = Math.hypot(dx, dy) || 1;
        const reach = Math.min(1, d / 260) * eye.travel;
        // Mirrored with CSS, so screen-x runs the other way inside the SVG
        const tx = (dx / d) * reach * (mirrored ? -1 : 1);
        const ty = (dy / d) * reach;
        const c = current[i];
        const k = reduce ? 1 : 0.18;
        c.x += (tx - c.x) * k;
        c.y += (ty - c.y) * k;
        pupils.current[i]?.setAttribute("transform", `translate(${c.x.toFixed(2)} ${c.y.toFixed(2)})`);
      });
      // Lean a little toward the pointer's height
      const mid = box.top + box.height * 0.45;
      const want = Math.max(-1, Math.min(1, (target.y - mid) / 400)) * 6;
      lean += (want - lean) * (reduce ? 1 : 0.08);
      body.current?.setAttribute("transform", `rotate(${lean.toFixed(2)} 160 130)`);
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(el);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} className={styles.peeker} aria-hidden>
      <svg ref={svg} viewBox={`0 ${VB_Y} 160 ${VB_H}`} className={styles.svg}>
        <g ref={body}>
          <g className={styles.bob}>
            {/* Horns and back spikes sit behind the body so its fill hides their bases */}
            <path className={styles.horn} d="M50 42 C 38 22, 30 0, 14 -22 C 40 -12, 62 6, 78 28 Z" />
            <path className={styles.horn} d="M98 20 C 102 -4, 112 -26, 132 -46 C 132 -20, 130 0, 126 16 Z" />
            <path className={styles.horn} d="M26 96 L 6 104 L 24 114 Z" />
            <path className={styles.horn} d="M24 128 L 2 138 L 22 148 Z" />
            <path className={styles.horn} d="M26 160 L 8 172 L 28 178 Z" />
            {/* Body: an uneven blob that runs off the right edge */}
            <path
              className={styles.fill}
              d="M170 18 C 128 10, 92 14, 64 30 C 30 48, 16 80, 22 112 C 26 136, 16 152, 24 176 C 34 206, 70 226, 112 228 C 132 229, 150 226, 170 222 Z"
            />
            <path
              className={styles.line}
              d="M170 18 C 128 10, 92 14, 64 30 C 30 48, 16 80, 22 112 C 26 136, 16 152, 24 176 C 34 206, 70 226, 112 228 C 132 229, 150 226, 170 222"
            />
            {/* Fingers gripping the edge */}
            <path className={styles.line} d="M40 186 c -14 2 -20 12 -12 18 c 8 6 18 0 22 -8" />
            <path className={styles.line} d="M56 196 c -12 6 -14 16 -5 20 c 9 4 17 -4 18 -12" />
            {/* Toothy grin */}
            <path className={styles.mouth} d="M54 152 L 104 146 Q 84 182 54 152 Z" />
            <path className={styles.tooth} d="M60 152 l 4 9 l 4 -9.4 Z" />
            <path className={styles.tooth} d="M71 151 l 4.5 10 l 4.5 -10.6 Z" />
            <path className={styles.tooth} d="M83 149.6 l 4.5 10 l 4.5 -10.6 Z" />
            <path className={styles.tooth} d="M95 148.4 l 3.5 7 l 3.5 -7.6 Z" />
            {/* Angry brows */}
            <path className={styles.line} d="M38 62 L 82 74" />
            <path className={styles.line} d="M94 56 L 128 46" />
            {/* Three eyes */}
            {EYES.map((eye, i) => (
              <g key={i} className={styles.eye} style={{ ["--d" as string]: `${i * 90}ms` }}>
                <circle className={styles.sclera} cx={eye.cx} cy={eye.cy} r={eye.r} />
                <g
                  ref={(n) => {
                    pupils.current[i] = n;
                  }}
                >
                  <ellipse className={styles.pupil} cx={eye.cx} cy={eye.cy} rx={eye.pr * 0.42} ry={eye.pr * 1.25} />
                  <circle className={styles.glint} cx={eye.cx - eye.pr * 0.1} cy={eye.cy - eye.pr * 0.6} r={eye.pr * 0.18} />
                </g>
                <circle className={styles.lid} cx={eye.cx} cy={eye.cy} r={eye.r} />
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
