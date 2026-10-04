"use client";

import { useEffect, useState } from "react";
import styles from "./Hero.module.css";

type Presence = { count: number; city: string; others: Record<string, number> } | null;

function line(p: NonNullable<Presence>) {
  if (p.count <= 1) return "Just you here.";
  const head = `${p.count} people here right now.`;
  const top = Object.entries(p.others).sort((a, b) => b[1] - a[1])[0];
  if (!top) return head;
  const [city, n] = top;
  const who = n === 1 ? "1" : String(n);
  return city === "Skopje" ? `${head} ${who} from Skopje, probably my mom.` : `${head} ${who} from ${city}.`;
}

/** Live headcount on the hero. Heartbeats every 20s while the tab is visible. */
export default function LiveVisitors() {
  const [p, setP] = useState<Presence>(null);

  useEffect(() => {
    if (navigator.webdriver) return;
    let id = "";
    try {
      id = sessionStorage.getItem("presence-id") ?? "";
      if (!id) {
        id = Math.random().toString(36).slice(2, 14).padEnd(10, "0");
        sessionStorage.setItem("presence-id", id);
      }
    } catch {
      id = Math.random().toString(36).slice(2, 14).padEnd(10, "0");
    }
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;
    const beat = async () => {
      if (document.visibilityState === "visible") {
        try {
          const r = await fetch("/api/presence", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });
          if (r.ok) setP(await r.json());
        } catch {}
      }
      if (!stopped) timer = setTimeout(beat, 20_000);
    };
    beat();
    const onVis = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(timer);
        beat();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stopped = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  if (!p) return null;
  return (
    <span className={styles.visitors} aria-live="polite">
      {line(p)}
    </span>
  );
}
