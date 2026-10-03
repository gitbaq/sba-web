import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Unsubscribe",
  description: "Confirm newsletter unsubscribe for syedbaqirali.com.",
  path: "/unsubscribe",
  noIndex: true,
});

export default function UnsubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
