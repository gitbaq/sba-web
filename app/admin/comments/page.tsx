import { Metadata } from "next";
import CommentsAdminClient from "@/components/admin/CommentsAdminClient";

export const metadata: Metadata = {
  title: "Moderate comments",
  robots: { index: false, follow: false },
};

export default function AdminCommentsPage() {
  return (
    <main className='mx-auto w-full max-w-5xl px-4 py-10 md:py-14'>
      <header className='mb-8'>
        <p className='accent-label mb-2'>Audience</p>
        <h1 className='display-title text-3xl md:text-4xl'>Comments</h1>
        <p className='mt-2 max-w-xl text-muted-foreground'>
          Approve or reject reader comments. Only approved comments appear on
          essays.
        </p>
      </header>
      <CommentsAdminClient />
    </main>
  );
}
