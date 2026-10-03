import { permanentRedirect } from "next/navigation";

/** Legacy path. Prefer /work-with-me (P6-03). */
export default function LegacyClientsRedirect() {
  permanentRedirect("/work-with-me");
}
