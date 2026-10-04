import { Redis } from "@upstash/redis";

// Vercel's Upstash integration sets the KV_* names; a direct Upstash setup uses UPSTASH_*.
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

/** Null until a database is connected; every feature that uses it hides itself. */
export const redis = url && token ? new Redis({ url, token }) : null;

/** Local dev, previews and production share one database, so each keeps its own keys. */
export const ns = (key: string) => `${process.env.VERCEL_ENV ?? "local"}:${key}`;
