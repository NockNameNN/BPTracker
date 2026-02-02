import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BP Tracker — GTA 5 RP Bonus Points",
    short_name: "BP Tracker",
    description: "Отслеживание ежедневных заданий и Bonus Points в GTA 5 RolePlay",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#f59e0b",
    orientation: "portrait-primary",
    lang: "ru",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
    categories: ["games", "utilities"],
  };
}
