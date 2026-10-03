/** Outcome-led service offerings for /work-with-me (P5-02). */
export type ServiceOffering = {
  slug: string;
  title: string;
  forWhom: string;
  problem: string;
  deliver: string;
  timeline: string;
};

export const SERVICE_OFFERINGS: ServiceOffering[] = [
  {
    slug: "custom-ai",
    title: "Custom AI solutions",
    forWhom: "Product and engineering teams shipping AI features into real products.",
    problem: "Demos that never leave the notebook, or generic assistants that ignore your domain.",
    deliver:
      "A scoped AI slice: models, data path, evaluation, and a path your team can operate.",
    timeline: "Typical thin slice: 2 to 6 weeks after framing.",
  },
  {
    slug: "ai-customer-experience",
    title: "AI-driven customer experience",
    forWhom: "Teams that want assistants or support automation without ops chaos.",
    problem: "Support load grows faster than headcount; chatbots that frustrate customers.",
    deliver:
      "Assistants and workflows grounded in your content, with clear handoff to humans.",
    timeline: "Pilot in weeks; harden once the thin slice proves value.",
  },
  {
    slug: "cloud-integration",
    title: "Cloud integration",
    forWhom: "Teams modernizing systems that need room for AI and lower infra drag.",
    problem: "Legacy stacks that block releases, or cloud spend without clear ownership.",
    deliver: "Migration and integration on AWS, Azure, or GCP with operable defaults.",
    timeline: "Discovery in days; delivery phased by system boundary.",
  },
  {
    slug: "devops-automation",
    title: "DevOps and automation",
    forWhom: "Teams that need boring, repeatable releases.",
    problem: "Manual deploys, fragile pipelines, and slow feedback loops.",
    deliver: "CI/CD, containers, and orchestration that shorten time-to-market.",
    timeline: "Pipeline foundations often land in 1 to 3 weeks.",
  },
];
