import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/*?track=",
    },
    sitemap: "https://minecraft-music.viktoor.ru/sitemap.xml",
  };
}
