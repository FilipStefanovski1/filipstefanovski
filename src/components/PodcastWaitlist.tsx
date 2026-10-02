"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import styles from "./Hero.module.css";

type State = "closed" | "open" | "sending" | "done" | "error";

/** "Podcast coming soon..." that opens, in place, into a one-field Buttondown signup. */
export default function PodcastWaitlist() {
  const [state, setState] = useState<State>("closed");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state === "open") input.current?.focus();
  }, [state]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = input.current?.value.trim();
    if (!email) return;
    setState("sending");
    try {
      // Buttondown's embed endpoint takes a plain form post; it sends its own confirmation email.
      await fetch(`https://buttondown.com/api/emails/embed-subscribe/${site.buttondown}`, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams({ email, tag: "podcast" }),
      });
      setState("done");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <p className={`${styles.teaser} ${styles.waitDone}`} role="status">
        You&rsquo;re in. Confirm in your inbox.
      </p>
    );
  }

  if (state === "closed") {
    return (
      <p className={styles.teaser}>
        <button type="button" className={styles.waitOpen} onClick={() => setState("open")}>
          {site.hero.teaser}
          <span className={styles.dots} aria-hidden>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
          <span className="visually-hidden"> Get notified when it drops</span>
        </button>
      </p>
    );
  }

  return (
    <form
      className={`${styles.teaser} ${styles.waitForm}`}
      onSubmit={submit}
      onKeyDown={(e) => e.key === "Escape" && setState("closed")}
    >
      <label htmlFor="podcast-email" className="visually-hidden">
        Email for the podcast waitlist
      </label>
      <input
        ref={input}
        id="podcast-email"
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="your@email.com"
        className={styles.waitInput}
        disabled={state === "sending"}
      />
      <button type="submit" className={styles.waitSubmit} disabled={state === "sending"}>
        {state === "sending" ? "Sending" : "Notify me"}
      </button>
      {state === "error" && (
        <span className={styles.waitError} role="alert">
          Didn&rsquo;t go through. Try again.
        </span>
      )}
    </form>
  );
}
