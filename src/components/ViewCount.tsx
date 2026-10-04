"use client";

import { useEffect, useState } from "react";

/** "1,284 views" for a project page. Counts once per tab session; renders nothing without a database. */
export default function ViewCount({ slug, className }: { slug: string; className?: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    if (navigator.webdriver) return;
    const flag = `viewed:${slug}`;
    let seen = false;
    try {
      seen = sessionStorage.getItem(flag) === "1";
    } catch {}
    fetch(`/api/views/${slug}`, { method: seen ? "GET" : "POST" })
      .then((r) => r.json())
      .then((d: { views: number } | null) => {
        if (!d) return;
        setViews(d.views);
        try {
          sessionStorage.setItem(flag, "1");
        } catch {}
      })
      .catch(() => {});
  }, [slug]);

  if (views === null) return null;
  return (
    <div className={className}>
      <dt>Views</dt>
      <dd>{views.toLocaleString("en-US")}</dd>
    </div>
  );
}
