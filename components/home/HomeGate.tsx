"use client";

import { SubTopic, Topic, RandomQuote } from "@/types/types";
import { useAudience } from "@/hooks/useAudience";
import AudiencePicker from "./AudiencePicker";
import BrandHome from "./BrandHome";

type Props = {
  posts: SubTopic[];
  topics: Topic[];
  quote: RandomQuote | null;
};

export default function HomeGate({ posts, topics, quote }: Props) {
  const { audience, ready, setAudience, clearAudience } = useAudience();

  if (!ready) {
    return (
      <div
        className='life-hero flex w-full min-h-[50vh] items-center justify-center text-muted-foreground'
        aria-busy='true'
        aria-live='polite'
      >
        Loading…
      </div>
    );
  }

  if (audience === null) {
    return <AudiencePicker onSelect={setAudience} />;
  }

  return (
    <BrandHome
      posts={posts}
      topics={topics}
      quote={quote}
      audience={audience}
      onChangePath={clearAudience}
    />
  );
}
