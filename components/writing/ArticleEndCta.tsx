import Link from "next/link";
import { SubTopic, Topic } from "@/types/types";
import { articleHref } from "@/lib/articles";
import { LINKEDIN_URL } from "@/lib/audience";
import { seriesHref } from "@/utils/services/getTopics";
import Icons from "@/components/Icons";

type Props = {
  related: SubTopic[];
  series?: Topic | null;
};

export default function ArticleEndCta({ related, series }: Props) {
  return (
    <aside className='mt-16 pt-10 border-t border-border flex flex-col gap-10'>
      <div className='flex flex-col gap-3 max-w-xl'>
        <p className='accent-label'>Newsletter</p>
        <h2 className='display-title text-2xl md:text-3xl'>Stay in the loop</h2>
        <p className='text-muted-foreground leading-relaxed'>
          Get the next researched essay by email — about once a week. Or follow
          via RSS.
        </p>
        <div className='flex flex-wrap gap-3 pt-1'>
          <Link href='/subscribe' className='craft-cta-primary'>
            <Icons.Mail className='craft-cta-icon' aria-hidden />
            Subscribe
          </Link>
          <a href='/feed.xml' className='craft-cta-secondary'>
            <Icons.Rss className='craft-cta-icon' aria-hidden />
            RSS
          </a>
          <a
            href={LINKEDIN_URL}
            target='_blank'
            rel='noopener noreferrer'
            className='craft-cta-secondary'
          >
            <Icons.FaLinkedin className='craft-cta-icon' aria-hidden />
            LinkedIn
          </a>
        </div>
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
