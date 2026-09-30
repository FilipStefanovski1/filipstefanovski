"use client";

import { useEffect, useState } from "react";
import styles from "./StageCounter.module.css";

/** The one live counter: which product is on stage right now. Decorative; headings carry the content. */
export default function StageCounter({ titles }: { titles: string[] }) {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const segments = [...document.querySelectorAll<HTMLElement>("[data-segment]")];
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.66;
      let found = -1;
      for (const el of segments) {
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) found = Number(el.dataset.segment);
      }
      setActive(found);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const n = active < 0 ? 0 : active;
  return (
    <div className={styles.counter} data-on={active >= 0 ? "true" : "false"} aria-hidden>
      <span className={`condensed ${styles.digit}`}>{String(n + 1).padStart(2, "0")}</span>
      <span className={styles.of}>/{String(titles.length).padStart(2, "0")}</span>
    </div>
  );
}
