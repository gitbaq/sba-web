import { permanentRedirect } from "next/navigation";

/** Legacy path. Prefer /writing (P6-03). */
export default function LegacyReadersRedirect() {
  permanentRedirect("/writing");
}
