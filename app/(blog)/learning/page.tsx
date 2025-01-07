"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { subtopics_url } from "@/utils/endpoints/endpoints";
import { SubTopic } from "@/types/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Icons from "@/components/Icons";
import parse from "html-react-parser";
import { toast } from "sonner";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const fetchURL = `${subtopics_url}/search?query=${query}`;

      const response = await fetch(fetchURL);

      if (!response.ok) {
        toast(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setSubTopics(result);
    };

    fetchData().catch((e) => {
      console.error("An error occurred while fetching data: ", e);
    });
  }, [query]);
  return (
    <section className='flex flex-col justify-start items-start lg:w-3/4 w-full h-full px-3'>
      {subTopics &&
        subTopics?.map((sub: SubTopic) => (
          <Tooltip key={sub.id}>
            <div className='w-full border-b border-slate-200 mb-3 py-3'>
              <div className='hover:bg-slate-100 rounded'>
                <TooltipTrigger asChild>
                  <span>
                    <a href={`/learning/${sub.id}`}>
                      <span>
                        <span className='font-semibold text-cyan-700 hover:underline'>
                          {sub.heading}
                        </span>
                        <br />
                        <span className='text-slate-400 hover:underline'>
                          {sub.subHeading}
                        </span>
                      </span>
                    </a>
                    <br />
                    <span className='line-clamp-3 overflow-y-hidden'>
                      {parse(sub.content)}
                    </span>
                  </span>
                </TooltipTrigger>
              </div>

              <TooltipContent className='tooltips'>
                <>
                  <span className='text-sky-800'>{sub.heading}</span>
                  <br />
                  {sub.subHeading}
                </>
              </TooltipContent>
            </div>
          </Tooltip>
        ))}
    </section>
  );
}

export default function LearningPage() {
  return (
    <main className='flex flex-col self-start items-center w-full min-h-full h-full p-2 overflow-auto'>
      <section className='bg-indigo-50 bg-opacity-60 flex flex-row h-full items-center p-2 gap-2 rounded-lg w-3/4'>
        <Icons.Search className='text-white p-1 rounded-full bg-sky-400 border-2 border-sky-500 min-h-6 min-w-6 h-6 w-6' />
        <h1 className='flex w-full font-semibold text-lg'>Search Results</h1>
      </section>
      <Suspense fallback='Loading...'>
        <SearchResults />
      </Suspense>
    </main>
  );
}
