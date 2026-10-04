/**
 * Legacy series URL suffixes (`name-id`) that must 301/308 to clean slugs.
 * Keep in sync with known Topic ids in production.
 */
export const LEGACY_SERIES_REDIRECTS: { source: string; destination: string }[] =
  [
    {
      source: "/writing/series/deep-learning-1",
      destination: "/writing/series/deep-learning",
    },
    {
      source: "/writing/series/nlp-3",
      destination: "/writing/series/nlp",
    },
    {
      source: "/writing/series/rust-4",
      destination: "/writing/series/rust",
    },
    {
      source: "/writing/series/blockchain-5",
      destination: "/writing/series/blockchain",
    },
    {
      source: "/writing/series/blockchain-101-5",
      destination: "/writing/series/blockchain-101",
    },
    {
      source: "/writing/series/opinion-99",
      destination: "/writing/series/opinion",
    },
  ];
