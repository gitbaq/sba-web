import { permanentRedirect } from "next/navigation";

/** Legacy Learning Hub → Writing index */
export default function LearningRedirectPage() {
  permanentRedirect("/writing");
}
