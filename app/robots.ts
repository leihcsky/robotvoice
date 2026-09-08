import type { MetadataRoute } from "next";
import { isMonetizationEnabled } from "@/lib/flags";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const disallow = ["/dashboard", "/api/"];
  if (!isMonetizationEnabled()) {
    disallow.push("/pricing");
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
