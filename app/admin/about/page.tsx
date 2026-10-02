import { Metadata } from "next";
import Link from "next/link";
import AboutAdminClient from "@/components/admin/AboutAdminClient";

export const metadata: Metadata = {
  title: "About | Admin",
  robots: { index: false, follow: false },
};

export default function AdminAboutPage() {
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
        <span className='text-foreground'>About</span>
      </nav>
      <header className='mb-8'>
        <p className='accent-label mb-2'>Content ops</p>
        <h1 className='display-title text-3xl md:text-4xl'>About</h1>
        <p className='mt-2 text-muted-foreground max-w-xl'>
          Photo, bio, home blurb, hiring copy, and credentials.
        </p>
      </header>
      <AboutAdminClient />
    </main>
  );
}
