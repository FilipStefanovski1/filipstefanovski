import { redis } from "@/lib/redis";
import { projects } from "@/content/site";

const known = new Set(projects.map((p) => p.slug));
const key = (slug: string) => `views:${slug}`;

/** Current view count for a project page. */
export async function GET(_req: Request, ctx: RouteContext<"/api/views/[slug]">) {
  const { slug } = await ctx.params;
  if (!redis || !known.has(slug)) return Response.json(null);
  return Response.json({ views: (await redis.get<number>(key(slug))) ?? 0 });
}

/** Count one view. The client calls this once per tab session per project. */
export async function POST(_req: Request, ctx: RouteContext<"/api/views/[slug]">) {
  const { slug } = await ctx.params;
  if (!redis || !known.has(slug)) return Response.json(null);
  return Response.json({ views: await redis.incr(key(slug)) });
}
