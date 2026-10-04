/** Canonical About page narrative. Keep in sync with FALLBACK_ABOUT and backend defaults. */

export type AboutCredential = {
  label: string;
  href?: string;
};

const AMAZON_AUTHOR_URL =
  "https://www.amazon.com.au/stores/Syed-Baqir-Ali/author/B0G81DNV2T";

export const ABOUT_META_DESCRIPTION =
  "Principal engineer and AI practitioner in Sydney. Essays, shipped products, and practical delivery for teams.";

export const ABOUT_TITLE_LINE =
  "Principal engineer and AI practitioner in Sydney.";

export const ABOUT_BIO_PARAGRAPHS = [
  "I have built software since 2000. I started in enterprise Java, spent 16 years on large engineering systems, and now lead a software engineering practice. Along the way I moved from backend systems into AI engineering: RAG, agents, and cloud-native delivery.",
  "I write here to explain what I learn. Plain language, trade-offs included.",
  "I completed a Master of Artificial Intelligence in 2026. I also mentor students on software projects and review technical manuscripts for publication.",
] as const;

/** Single-string bio for API / admin (paragraphs joined). */
export const ABOUT_BIO = ABOUT_BIO_PARAGRAPHS.join("\n\n");

export const ABOUT_HOME_BLURB =
  "Principal engineer and AI practitioner in Sydney. I write to explain what I learn, and I ship products like Cobu and Blox. Plain language, trade-offs included.";

export const ABOUT_HIRING_BLURB =
  "Full history and recommendations are on LinkedIn. Case studies are under Work.";

export const ABOUT_WHAT_I_DO = [
  "Write about AI, software, and engineering practice.",
  "Build and ship products. Cobu is an AI brainstorming tool. Blox helps you plan goals and habits.",
  "Help teams modernize legacy systems and adopt AI safely.",
] as const;

export const ABOUT_CREDENTIALS: AboutCredential[] = [
  { label: "25+ years in software engineering" },
  { label: "Master of Artificial Intelligence (2026)" },
  { label: "MCS Computer Science" },
  { label: "PMP, PMI-ACP, PMI-PBA" },
  { label: "AWS Certified AI Practitioner" },
  {
    label: "Co-author, available on Amazon",
    href: AMAZON_AUTHOR_URL,
  },
  { label: "Technical manuscript reviewer" },
];
