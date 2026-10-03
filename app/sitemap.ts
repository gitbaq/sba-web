import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/sitemapData";

/** Next Metadata Route: served at `/sitemap.xml`. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemapEntries();
}
