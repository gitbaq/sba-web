import { ImageResponse } from "next/og";
import {
  findSeriesTopic,
  getAllTopicsSafe,
} from "@/utils/services/getTopics";
import { seriesIntro } from "@/lib/seriesIntros";
import { isIndexable } from "@/lib/articles";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

type Params = Promise<{ topicSlug: string }>;

export default async function Image({ params }: { params: Params }) {
  const { topicSlug } = await params;
  const topics = await getAllTopicsSafe();
  const topic = findSeriesTopic(topics, topicSlug);
  const title = topic?.sbaTopicName || "Series";
  const count = (topic?.subTopicList || []).filter(
    (s) =>
      (s.isPublished === true ||
        s.isPublished === "true" ||
        s.isPublished === "1") &&
      isIndexable(s)
  ).length;
  const dek =
    seriesIntro(topic?.sbaTopicName) ||
    (count
      ? `${count} ${count === 1 ? "essay" : "essays"} in this series`
      : "Essays by Syed Baqir Ali");

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
          background:
            "linear-gradient(145deg, #0f172a 0%, #1e293b 55%, #0b1220 100%)",
          color: "#f8fafc",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#94a3b8",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
          }}
        >
          Series
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 40 ? 52 : 64,
              lineHeight: 1.15,
              fontWeight: 700,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              lineHeight: 1.4,
              color: "#cbd5e1",
              maxWidth: 920,
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
            }}
          >
            {dek.slice(0, 180)}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#e2e8f0",
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
