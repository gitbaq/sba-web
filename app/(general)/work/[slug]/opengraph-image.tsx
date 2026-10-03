import { ImageResponse } from "next/og";
import { getWorkProject } from "@/lib/work";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

type Params = Promise<{ slug: string }>;

export default async function Image({ params }: { params: Params }) {
  const { slug } = await params;
  const study = await getWorkProject(slug);
  const title = study?.title || "Case study";
  const dek = study?.tagline || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(145deg, #111827 0%, #1f2937 50%, #0b1220 100%)",
          color: "#f9fafb",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#9ca3af",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
          }}
        >
          Case study
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              lineHeight: 1.15,
              fontWeight: 700,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {dek ? (
            <div
              style={{
                display: "flex",
                fontSize: 28,
                lineHeight: 1.4,
                color: "#d1d5db",
                maxWidth: 920,
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
              }}
            >
              {dek.slice(0, 160)}
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#e5e7eb",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
          }}
        >
          Syed Baqir Ali
        </div>
      </div>
    ),
    { ...size }
  );
}
