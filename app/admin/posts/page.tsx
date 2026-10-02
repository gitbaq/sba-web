import { redirect } from "next/navigation";

/** Legacy path — essays are the canonical admin label. */
export default function AdminPostsRedirect() {
  redirect("/admin/essays");
}
