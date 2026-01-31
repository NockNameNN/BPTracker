import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://bp-tracker.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/all-tasks`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
