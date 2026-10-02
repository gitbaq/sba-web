import Link from "next/link";
import { SubTopic, Topic } from "@/types/types";
import { articleHref } from "@/lib/articles";
import { CTA } from "@/lib/ctas";
import { seriesHref } from "@/utils/services/getTopics";
import SubscribeForm from "@/components/SubscribeForm";

type Props = {
  related: SubTopic[];
  series?: Topic | null;
};

export default function ArticleEndCta({ related, series }: Props) {
  return (
    <aside className='mt-16 pt-10 border-t border-border flex flex-col gap-10'>
      <div className='flex flex-col gap-3 max-w-xl'>
        <p className='accent-label'>Newsletter</p>
        <h2 className='display-title text-2xl md:text-3xl'>
          Get new essays by email
        </h2>
        <p className='text-muted-foreground leading-relaxed'>
          New essays as they publish. Unsubscribe anytime.
        </p>
        <SubscribeForm variant='footer' submitLabel={CTA.subscribe} />
        <p className='text-sm text-muted-foreground'>
          Prefer feeds?{" "}
          <a
            href='/feed.xml'
            className='font-semibold text-brand underline-offset-4 hover:underline'
          >
            {CTA.rss}
          </a>
        </p>
        {series && (
          <p className='text-sm text-muted-foreground pt-1'>
            More in{" "}
            <Link
              href={seriesHref(series)}
              className='text-brand font-semibold underline-offset-4 hover:underline'
            >
              {series.sbaTopicName}
            </Link>
          </p>
        )}
      </div>

      {related.length > 0 && (
        <div>
          <p className='accent-label mb-2'>Continue</p>
          <h2 className='display-title text-xl md:text-2xl mb-4'>
            Related reading
          </h2>
          <ul className='flex flex-col gap-3 list-none p-0 m-0'>
            {related.map((post) => (
              <li key={post.id}>
                <Link
                  href={articleHref(post)}
                  className='text-foreground hover:text-brand underline-offset-4 hover:underline'
                >
                  {post.subHeading || post.heading}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
