import { blox_url, cobu_url, github_url } from "@/utils/endpoints/endpoints";

export type CaseStudy = {
  slug: string;
  title: string;
  tagline: string;
  href: string;
  externalUrl?: string;
  /** Brand mark path - shown as an icon tile, not a screenshot */
  mark: string;
  role: string;
  timeline: string;
  result: string;
  problem: string;
  approach: string[];
  outcome: string[];
  stack: string[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "cobu",
    title: "Cobu",
    tagline:
      "AI brainstorm buddy. Chat, explore ideas, and think with OpenAI or Anthropic.",
    href: "/work/cobu",
    externalUrl: cobu_url,
    mark: "/portfolio/cobu/mark.png",
    role: "Software engineer / subject-matter expert",
    timeline: "2025",
    // TODO(owner): one measurable result when available
    result:
      "A living product for brainstorming ideas (still maturing toward full capability).",
    problem:
      "Most AI chat tools are either generic assistants or opaque enterprise stacks. People need a focused place to brainstorm, discuss, and pressure-test ideas, with a real choice of models and fresh web context when it matters.",
    approach: [
      "Center the product on brainstorming and natural conversation, not command menus.",
      "Let people choose OpenAI or Anthropic so the model fits the task.",
      "Integrate web search when answers need current information.",
      "Ship as a living product at codingburo.com on a modern Angular + Spring AI stack.",
    ],
    outcome: [
      "A free-to-join AI brainstorm buddy with multi-provider chat and web search.",
      "Clear product story: discuss ideas, keep context, share direction.",
      "Demonstrates end-to-end AI product delivery beyond demos and slides.",
    ],
    stack: [
      "AI product design",
      "Angular 20",
      "Spring AI",
      "OpenAI & Anthropic",
      "Web search",
    ],
  },
  {
    slug: "blox",
    title: "Blox",
    tagline: "Productivity hub that helps you keep focus on the task.",
    href: "/work/blox",
    externalUrl: blox_url,
    mark: "/portfolio/blox/mark.png",
    role: "Software engineer / subject-matter expert",
    timeline: "2024",
    // TODO(owner): one measurable result when available
    result: "A focused hub for goals, habits, and staying on the task at hand.",
    problem:
      "Most productivity tools reward complexity: long setups, rigid systems, and guilt when life gets busy. People need a calm place to set achievable goals, build habits, and see what actually won the week.",
    approach: [
      "Start from outcomes: habits and weekly wins, not feature checklists.",
      "Keep the first session short. Goals that feel achievable on day one.",
      "Surface progress visually so momentum is obvious without dashboards.",
      "Ship iteratively as a real product at blox.syedbaqirali.com.",
    ],
    outcome: [
      "A focused productivity hub spanning goals, habits, and weekly tracking.",
      "Clear product narrative: start small, track what matters, win the week.",
      "Living portfolio piece that demonstrates end-to-end product thinking.",
    ],
    stack: [
      "Product design",
      "Full-stack web",
      "Habit & goals UX",
      "Iterative shipping",
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

export const CALENDLY_URL = "https://calendly.com/syedbaqirali/30min";

export const AMAZON_AUTHOR_URL =
  "https://www.amazon.com.au/stores/Syed-Baqir-Ali/author/B0G81DNV2T";

export const CREDENTIAL_LINKS = [
  { label: "GitHub", href: github_url },
  { label: "Cobu", href: cobu_url },
  { label: "Blox", href: blox_url },
  { label: "Amazon author", href: AMAZON_AUTHOR_URL },
] as const;

export type Credential = {
  label: string;
  href?: string;
};

/** Credentials for About / hiring strip.
 * Order is left/right pairs in a 2-column grid:
 * SWE+AI | Master of AI · PMP | AWS AI · Co-author | Book reviews · Casual Academic
 */
export const CREDENTIALS: Credential[] = [
  { label: "25+ years in SWE and AI" },
  { label: "Master of Artificial Intelligence, UNSW Sydney" },
  { label: "PMP, PMI-ACP, PMI-PBA" },
  { label: "AWS Certified AI Practitioner" },
  {
    label: "Co-author on Amazon",
    href: AMAZON_AUTHOR_URL,
  },
  { label: "Book reviewer, Manning Publications" },
  { label: "Casual Academic, UNSW CS/IT" },
];
