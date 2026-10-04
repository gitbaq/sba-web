import { ESSAYS_CACHE_TAG } from "@/utils/services/getLatestSubtopics";

/** Data-cache tags used across public fetch helpers. */
export const CACHE_TAGS = [
  ESSAYS_CACHE_TAG,
  "work-projects",
  "about-config",
  "home-config",
] as const;

/** Core public paths to bust on a full revalidate (deploy or publish). */
export const CORE_PATHS = [
  "/",
  "/writing",
  "/writing/series",
  "/work",
  "/about",
  "/contact",
  "/subscribe",
  "/privacy",
  "/work-with-me",
  "/feed.xml",
  "/sitemap",
  "/sitemap.xml",
  "/robots.txt",
  "/llms.txt",
  "/llms-full.txt",
] as const;
