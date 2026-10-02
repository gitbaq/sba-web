import { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import ConfirmClient from "./ConfirmClient";

export const metadata: Metadata = pageMeta({
  title: "Confirm subscription",
  description: "Confirm your email subscription to essays by Syed Baqir Ali.",
  path: "/subscribe/confirm",
});

export default function SubscribeConfirmPage() {
  return <ConfirmClient />;
}
