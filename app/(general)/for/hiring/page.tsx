import { permanentRedirect } from "next/navigation";

/** Legacy path. Prefer /about#hiring (P6-03). */
export default function LegacyHiringRedirect() {
  permanentRedirect("/about#hiring");
}
