import { slugify } from "@/lib/articles";

/** Short series introductions, keyed by slugified series name. */
export const SERIES_INTROS: Record<string, string> = {
  "deep-learning":
    "Essays on how neural networks learn and why they work. They start with the basics of supervised learning and build toward modern architectures. Each piece explains the idea first, then the detail.",
  nlp: "Essays on how machines read, represent, and generate language. They cover the core ideas behind modern language models. Each piece is written to be followed without a research background.",
  rust: "Essays on Rust and the ideas behind it: memory safety, speed, and concurrency. They explain what the language guarantees and what it asks of you in return.",
  blockchain:
    "Essays on how blockchains work and why decentralization matters. They explain the core ideas in plain language and avoid hype.",
  "blockchain-101":
    "A plain-language introduction to how blockchains work. It starts with the core ideas and builds up one part at a time.",
  opinion:
    "Personal views on AI and software. These essays argue a position and say why. They are opinions, not documentation.",
};

export function seriesIntro(name: string | undefined | null): string | undefined {
  if (!name) return undefined;
  return SERIES_INTROS[slugify(name)];
}
