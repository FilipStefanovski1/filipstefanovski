import type { MetadataRoute } from "next";
import { projects, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/about`, changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((p) => ({
      url: `${site.url}/work/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
