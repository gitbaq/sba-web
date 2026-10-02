import { Metadata } from "next";
import ContactClient from "@/components/ContactClient";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description:
    "Questions about writing, work, or a possible engagement. Reply within 24 hours.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactClient />;
}
