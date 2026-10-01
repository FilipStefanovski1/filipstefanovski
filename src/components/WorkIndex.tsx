"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/site";
import Icon from "./Icon";
import styles from "./Work.module.css";

/** One screen per project: floats beside the cursor on desktop, sits inline on touch. */
const covers: Record<string, { src: string; w: number; h: number; alt: string }> = {
  q4: { src: "/work/q4-laptop.jpg", w: 2000, h: 1422, alt: "Q4 on a laptop" },
  aminta: { src: "/work/aminta-hero.jpg", w: 2000, h: 1194, alt: "Aminta drafting a post inside X" },
  "blockchain-skopje": { src: "/work/bks-site.jpg", w: 1600, h: 1000, alt: "Blockchain Skopje website" },
};

export default function WorkIndex({ projects }: { projects: Project[] }) {
  const preview = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, fresh: true });
  const [active, setActive] = useState<string | null>(null);

  // The preview eases after the cursor and tilts with its speed. Runs only while a row is hovered.
  useEffect(() => {
    if (!active) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const tick = () => {
      const p = pos.current;
      const k = still ? 1 : 0.16;
      p.x += (p.tx - p.x) * k;
      p.y += (p.ty - p.y) * k;
      const tilt = still ? 0 : Math.max(-8, Math.min(8, (p.tx - p.x) * 0.05));
      if (preview.current) {
        preview.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const p = pos.current;
    p.tx = e.clientX + 40;
    p.ty = e.clientY;
    if (p.fresh) {
      p.x = p.tx;
      p.y = p.ty;
      p.fresh = false;
    }
  };

  return (
    <>
      <ul
        className={styles.list}
        onPointerMove={onMove}
        onPointerLeave={() => {
          setActive(null);
          pos.current.fresh = true;
        }}
      >
        {projects.map((p) => {
          const c = covers[p.slug];
          return (
            <li
              key={p.slug}
              className={styles.row}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(p.slug)}
            >
              <Link href={`/work/${p.slug}`} className={`wrap ${styles.rowLink}`}>
                <span className={styles.idx}>{p.index}</span>
                <h3 className={`condensed ${styles.name}`}>{p.title}</h3>
                <p className={styles.line}>{p.line}</p>
                <p className={styles.role}>{p.role}</p>
                <span className={styles.go} aria-hidden>
                  <Icon name="arrow-up-right" size={22} />
                </span>
                {c && (
                  <span className={styles.thumb} aria-hidden>
                    <Image src={c.src} alt="" width={c.w} height={c.h} sizes="92vw" />
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div ref={preview} className={styles.preview} data-on={active ? "true" : "false"} aria-hidden>
        {projects.map((p) => {
          const c = covers[p.slug];
          if (!c) return null;
          return (
            <Image
              key={p.slug}
              src={c.src}
              alt=""
              width={c.w}
              height={c.h}
              sizes="380px"
              data-show={active === p.slug ? "true" : "false"}
            />
          );
        })}
      </div>
    </>
  );
}
