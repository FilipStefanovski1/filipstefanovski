"use client";

import dynamic from "next/dynamic";
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
            />
          </SceneBoundary>
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
