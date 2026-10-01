"use client";

import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Skopje",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Filip's local time, with a nonchalant guess at what he's doing. Client only, so no hydration mismatch. */
export default function LocalTime() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  if (!now) return <span>Probably building.</span>;
  const time = fmt.format(now);
  const hour = Number(time.slice(0, 2));
  const late = hour < 6;
  return (
    <span>
      {time} in Skopje. Probably {late ? "still " : ""}building.
    </span>
  );
}
