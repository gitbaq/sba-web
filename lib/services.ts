/** Outcome-led service offerings for /work-with-me (BL-02). */
export type RelatedLink = {
  label: string;
  href: string;
};

export type ServiceOffering = {
  slug: string;
  title: string;
  forWhom: string;
  problem: string;
  deliver: string;
  /** Visual accent for card distinction (left border + eyebrow). */
  accent: "ai" | "cloud" | "editorial" | "teach";
  indexLabel: string;
  /** Related case studies or essays. */
  related: RelatedLink[];
};

export const SERVICE_ACCENT_CLASS: Record<ServiceOffering["accent"], string> = {
  ai: "border-l-brand bg-brand-muted/40",
  cloud: "border-l-slate-600 bg-slate-50/90 dark:border-l-slate-300 dark:bg-slate-900/40",
  editorial:
    "border-l-amber-800 bg-amber-50/70 dark:border-l-amber-500/80 dark:bg-amber-950/25",
  teach:
    "border-l-emerald-800 bg-emerald-50/70 dark:border-l-emerald-500/80 dark:bg-emerald-950/25",
};

export const SERVICE_OFFERINGS: ServiceOffering[] = [
  {
    slug: "custom-ai",
    title: "Custom AI solutions",
    forWhom: "Product and engineering teams shipping AI features into real products.",
    problem: "Demos that never leave the notebook, or generic assistants that ignore your domain.",
    deliver:
      "A scoped AI slice: models, data path, evaluation, and a path your team can operate.",
    accent: "ai",
    indexLabel: "01",
    related: [
      { label: "Cobu case study", href: "/work/cobu" },
      { label: "Deep Learning series", href: "/writing/series" },
    ],
  },
  {
    slug: "cloud-integration",
    title: "Cloud integration",
    forWhom: "Teams modernizing systems that need room for AI and lower infra drag.",
    problem: "Legacy stacks that block releases, or cloud spend without clear ownership.",
    deliver: "Migration and integration on AWS, Azure, or GCP with operable defaults.",
    accent: "cloud",
    indexLabel: "02",
    related: [
      { label: "Blox case study", href: "/work/blox" },
      { label: "Cobu case study", href: "/work/cobu" },
    ],
  },
  {
    slug: "teaching-workshops",
    title: "Teaching and workshops",
    forWhom:
      "Engineering leads and teams who want a focused half-day on AI practice or modern delivery.",
    problem:
      "Teams need shared language and a practical starting point, not a multi-week course platform.",
    deliver:
      "A paid half-day workshop for engineering leads, built from the essay series on this site. Book a call to scope the day.",
    accent: "teach",
    indexLabel: "03",
    related: [
      { label: "Writing series", href: "/writing/series" },
      { label: "Book a call", href: "https://calendly.com/syedbaqirali/30min" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    slug: "book-review-authoring",
    title: "Book review and authoring",
    forWhom:
      "Book publishers and editors seeking technical manuscript review, and invitations to co-author or contribute chapters on AI and software.",
    problem:
      "Technical books need reviewers who know the craft, and authoring slots that need a clear practitioner voice.",
    deliver:
      "Manuscript review with concrete notes, or scoped authoring and co-authoring for AI and software titles.",
    accent: "editorial",
    indexLabel: "04",
    related: [
      {
        label: "Amazon author page",
        href: "https://www.amazon.com.au/stores/Syed-Baqir-Ali/author/B0G81DNV2T",
      },
      { label: "Contact", href: "/contact" },
    ],
  },
];
