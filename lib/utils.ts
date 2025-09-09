import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add to lib/utils.ts
export function extractTextFromHtml(html: string, maxLength: number = 160): string {
  return html.replace(/<[^>]*>/g, '').substring(0, maxLength).trim();
}

export function generateSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
