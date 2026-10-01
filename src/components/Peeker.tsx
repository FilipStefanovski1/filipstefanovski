"use client";

import { useEffect, useRef } from "react";
import styles from "./Peeker.module.css";

/** Eye centres and pupil travel, in the SVG's own units. */
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

    const onMove = (e: PointerEvent) => {
      target = { x: e.clientX, y: e.clientY };
    };

    const tick = () => {
      raf = 0;
      if (!active) return;
      const box = s.getBoundingClientRect();
      const scale = box.width / 160; // viewBox width
      EYES.forEach((eye, i) => {
        const ex = box.left + eye.cx * scale;
        const ey = box.top + eye.cy * scale;
        const dx = target.x - ex;
        const dy = target.y - ey;
        const d = Math.hypot(dx, dy) || 1;
        const reach = Math.min(1, d / 260) * eye.travel;
        const tx = (dx / d) * reach;
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
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} className={styles.peeker} aria-hidden>
      <svg ref={svg} viewBox="0 0 160 240" className={styles.svg}>
        <g ref={body}>
          <g className={styles.bob}>
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
            {/* Smirk */}
            <path className={styles.line} d="M62 158 q 16 12 34 2" />
            <path className={styles.line} d="M92 158 l 6 -4" />
            {/* Three eyes */}
            {EYES.map((eye, i) => (
              <g key={i} className={styles.eye} style={{ ["--d" as string]: `${i * 90}ms` }}>
                <circle className={styles.sclera} cx={eye.cx} cy={eye.cy} r={eye.r} />
                <g
                  ref={(n) => {
                    pupils.current[i] = n;
                  }}
                >
                  <circle className={styles.pupil} cx={eye.cx} cy={eye.cy} r={eye.pr} />
                  <circle className={styles.glint} cx={eye.cx - eye.pr * 0.35} cy={eye.cy - eye.pr * 0.4} r={eye.pr * 0.28} />
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
