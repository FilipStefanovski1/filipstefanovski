"use client";

import { useEffect, useState } from "react";
import styles from "./Hero.module.css";

function ago(iso: string, now: number) {
  const m = Math.max(0, Math.round((now - Date.parse(iso)) / 60000));
  if (m < 2) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

/** "Last shipped 3h ago", from public GitHub pushes. Relative time is computed on the client. */
export default function LastShipped({ at }: { at: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 60_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  if (now === null) return null;
  return (
    <span className={styles.shipped}>
      <span className={styles.liveDot} aria-hidden />
      Last shipped {ago(at, now)}
    </span>
  );
}
