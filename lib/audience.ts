export const AUDIENCE_STORAGE_KEY = "sba-audience";

export type AudienceId = "hiring" | "clients" | "readers";

export const AUDIENCES: {
  id: AudienceId;
  /** Function-oriented card title — what someone came to do */
  label: string;
  href: string;
  description: string;
  /** Short path name for “continuing as…” recall */
  pathName: string;
}[] = [
  {
    id: "hiring",
    label: "Review for a role",
    pathName: "hiring path",
    href: "/for/hiring",
    description: "Background, writing samples, and how I approach systems work.",
  },
  {
    id: "clients",
    label: "Explore the work",
    pathName: "client path",
    href: "/for/clients",
    description: "Delivery approach, outcomes, and selected case studies.",
  },
  {
    id: "readers",
    label: "Read the essays",
    pathName: "reading path",
    href: "/for/readers",
    description: "Research-depth writing on AI and software — newest first.",
  },
];

export function isAudienceId(value: string | null | undefined): value is AudienceId {
  return value === "hiring" || value === "clients" || value === "readers";
}

export function getAudience(id: AudienceId) {
  return AUDIENCES.find((a) => a.id === id)!;
}

/** LinkedIn follow URL used across CTAs */
export const LINKEDIN_URL =
  "https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=syedbaqirali";
