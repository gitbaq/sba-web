import Link from "next/link";
import { Metadata } from "next";
import SubscribersAdminClient from "@/components/admin/SubscribersAdminClient";

export const metadata: Metadata = {
  title: "Manage subscribers",
  robots: { index: false, follow: false },
};

export default function AdminSubscribersPage() {
  return (
    <main className='mx-auto w-full max-w-5xl px-4 py-10 md:py-14'>
      <header className='mb-8'>
        <p className='accent-label mb-2'>Audience</p>
        <div className='flex flex-wrap items-end justify-between gap-3'>
          <div>
            <h1 className='display-title text-3xl md:text-4xl'>Subscribers</h1>
            <p className='mt-2 text-muted-foreground max-w-xl'>
              Search, filter, and manage newsletter subscriptions. Emails are
              shown in full for admin use only.
            </p>
          </div>
          <Link
            href='/admin/newsletter'
            className='text-sm font-semibold text-brand underline-offset-4 hover:underline'
          >
            Newsletter sends
          </Link>
        </div>
      </header>
      <SubscribersAdminClient />
    </main>
  );
}
