"use client";

import { SubTopic, Topic } from "@/types/types";
import { useAudience } from "@/hooks/useAudience";
import AudiencePicker from "./AudiencePicker";
import BrandHome from "./BrandHome";

type Props = {
  posts: SubTopic[];
  topics: Topic[];
};

export default function HomeGate({ posts, topics }: Props) {
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
      audience={audience}
      onChangePath={clearAudience}
    />
  );
}
