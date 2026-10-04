import { Metadata } from "next";
import SendLinksConfirmClient from "./SendLinksConfirmClient";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Confirm essay links",
  description: "Confirm to receive requested essay links by email.",
  path: "/subscribe/send-links/confirm",
});

export default function SendLinksConfirmPage() {
  return <SendLinksConfirmClient />;
}
