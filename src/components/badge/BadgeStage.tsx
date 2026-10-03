"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import StaticBadge from "./StaticBadge";
import styles from "./badge.module.css";

const BadgeScene = dynamic(() => import("./BadgeScene"), { ssr: false });

class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** A short reader beep, built with Web Audio so there's no file to load. */
function beep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 1760;
    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.13);
    osc.onended = () => ctx.close();
  } catch {}
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

type Mode = "pending" | "static" | "live";

export default function BadgeStage() {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("pending");
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [spin, setSpin] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [throws, setThrows] = useState(0);
  const [showThrows, setShowThrows] = useState(false);
  const hideThrows = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reader = useRef<HTMLDivElement>(null);
  const [scan, setScan] = useState<"idle" | "near" | "granted">("idle");
  const granted = useRef(false);
  const router = useRouter();

  // Decide between the live scene and the static badge.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setMode(reduce.matches || !hasWebGL() ? "static" : "live");
    decide();
    reduce.addEventListener("change", decide);
    return () => reduce.removeEventListener("change", decide);
  }, []);

  // Pause when offscreen or when the tab is hidden.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    const onVis = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const onReady = useCallback(() => setReady(true), []);
  const onThrow = useCallback(() => {
    setThrows((n) => n + 1);
    setShowThrows(true);
    clearTimeout(hideThrows.current);
    hideThrows.current = setTimeout(() => setShowThrows(false), 3200);
  }, []);
  useEffect(() => () => clearTimeout(hideThrows.current), []);

  // Scanner: drag the badge into the reader and it opens the About page.
  const onCardScreen = useCallback(
    (x: number, y: number) => {
      const el = reader.current;
      const stage = ref.current;
      if (!el || !stage || granted.current) return;
      const r = el.getBoundingClientRect();
      const s = stage.getBoundingClientRect();
      const left = r.left - s.left;
      const top = r.top - s.top;
      const inX = x > left - 50 && x < left + r.width + 50;
      const inY = y > top - 70 && y < top + r.height + 70;
      const nearX = x > left - 170 && x < left + r.width + 170;
      if (inX && inY) {
        granted.current = true;
        setScan("granted");
        beep();
        setTimeout(() => router.push("/about"), 1100);
      } else {
        setScan(nearX && inY ? "near" : "idle");
      }
    },
    [router],
  );
  useEffect(() => {
    if (!dragging && !granted.current) setScan("idle");
  }, [dragging]);
  const onError = useCallback(() => setMode("static"), []);
  const live = mode === "live";

  return (
    <div
      ref={ref}
      className={styles.stage}
      data-ready={live && ready ? "true" : "false"}
      data-dragging={dragging ? "true" : "false"}
    >
      <div className={styles.fallback} aria-hidden={live && ready}>
        <StaticBadge />
      </div>
      {live && (
        <div className={styles.canvas}>
          <SceneBoundary onError={onError}>
            <BadgeScene
              active={inView && pageVisible}
              spin={spin}
              onReady={onReady}
              onDragChange={setDragging}
              onThrow={onThrow}
              onCardScreen={onCardScreen}
            />
          </SceneBoundary>
        </div>
      )}
      {/* Card reader: swipe the badge through it */}
      {live && ready && (
        <div ref={reader} className={styles.reader} data-state={scan} aria-hidden>
          <span className={styles.readerLed} />
          <span className={styles.readerSlot} />
          <span className={styles.readerLabel}>{scan === "granted" ? "Access granted" : "Scan"}</span>
        </div>
      )}
      {/* Easter egg: flick the badge hard enough and it keeps count */}
      <p className={styles.throws} data-on={showThrows ? "true" : "false"} aria-live="polite">
        {throws > 0 && (
          <>
            thrown {throws === 1 ? "once" : `${throws} times`}.
            <br />
            still here.
          </>
        )}
      </p>
      {live && (
        <button
          type="button"
          className={styles.spin}
          onClick={() => setSpin((n) => n + 1)}
          disabled={!ready}
        >
          Spin the badge
        </button>
      )}
    </div>
  );
}
