import { redis } from "@/lib/redis";

const KEY = "presence";
const WINDOW_MS = 45_000; // a visitor counts as here for 45s after their last heartbeat
const ID = /^[a-z0-9]{8,24}$/;

/** Heartbeat: records this visitor (random tab id + Vercel's city guess) and returns who's here. Nothing else is stored. */
export async function POST(request: Request) {
  if (!redis) return Response.json(null);
  let id = "";
  try {
    id = String((await request.json())?.id ?? "");
  } catch {}
  if (!ID.test(id)) return Response.json(null, { status: 400 });

  const raw = request.headers.get("x-vercel-ip-city");
  const city = raw ? decodeURIComponent(raw).replace(/\|/g, "").slice(0, 40) : "";
  const now = Date.now();

  const p = redis.pipeline();
  p.zadd(KEY, { score: now, member: `${id}|${city}` });
  p.zremrangebyscore(KEY, 0, now - WINDOW_MS);
  p.zrange(KEY, 0, -1);
  p.expire(KEY, 3600);
  const res = await p.exec();
  const members = (res[2] as string[]) ?? [];

  // One entry per tab; count each tab once even if its city guess changed
  const byId = new Map<string, string>();
  for (const m of members) {
    const [mid, mcity] = m.split("|");
    byId.set(mid, mcity ?? "");
  }
  const others: Record<string, number> = {};
  for (const [mid, mcity] of byId) {
    if (mid !== id && mcity) others[mcity] = (others[mcity] ?? 0) + 1;
  }
  return Response.json({ count: byId.size, city, others });
}
