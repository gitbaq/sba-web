import Link from "next/link";
import { Metadata } from "next";
import NewsletterAdminClient from "@/components/admin/NewsletterAdminClient";

export const metadata: Metadata = {
  title: "Newsletter | Admin",
  robots: { index: false, follow: false },
};

export default function NewsletterAdminPage() {
  return (
    <main className='mx-auto w-full max-w-3xl px-4 py-10 md:py-14'>
      <nav aria-label='Breadcrumb' className='mb-6 text-sm text-muted-foreground'>
        <Link
          href='/admin'
          className='hover:text-brand underline-offset-4 hover:underline'
        >
          Admin
        </Link>
        <span aria-hidden className='mx-2'>
          /
        </span>
        <span className='text-foreground'>Newsletter</span>
      </nav>
      <header className='mb-8'>
        <p className='accent-label mb-2'>Ops</p>
        <h1 className='display-title text-3xl md:text-4xl'>Newsletter send</h1>
        <p className='mt-2 text-muted-foreground max-w-xl'>
          Email a published essay to confirmed subscribers.
        </p>
      </header>
      <NewsletterAdminClient />
    </main>
  );
}
