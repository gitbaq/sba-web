import { NextResponse } from "next/server";
import { entriesToXml, getSitemapEntries } from "@/lib/sitemapData";

/** Legacy `/sitemap` alias used by verify-live and older Search Console submits. */
export async function GET() {
  try {
    const entries = await getSitemapEntries();
    return new NextResponse(entriesToXml(entries), {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return new NextResponse("Sitemap generation failed", { status: 500 });
  }
}
