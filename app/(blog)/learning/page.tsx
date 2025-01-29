"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SubTopic } from "@/types/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Icons from "@/components/Icons";
import parse from "html-react-parser";
import Search from "@/components/search";
import { getSearchSubtopics } from "@/utils/services/getAllSubtopics";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      setSubTopics(await getSearchSubtopics(query + ""));
    };

    fetchData().catch((e) => {
      console.error("An error occurred while fetching data: ", e);
    });
  }, [query]);

  return (
    <div className='flex flex-col'>
      <section className='bg-accent flex md:flex-row flex-col w-full items-center p-2 gap-2 rounded-lg justify-between'>
        <div className='flex flex-row items-center gap-2 w-full'>
          <div className='flex items-center text-accent rounded-full bg-cyan-400 border border-cyan-500 min-h-6 min-w-6 h-6 w-6'>
            <Icons.Search className='icons-size' />
          </div>
          <h1 className='flex w-full font-semibold text-lg text-nowrap'>
            Search Results
          </h1>
          {subTopics && (
            <span className='text-nowrap text-xs text-cyan-600 dark:text-cyan-400'>
              ({subTopics.length} matches found)
            </span>
          )}
        </div>
        <div>
          <Search />
        </div>
      </section>
      <section className='flex flex-col justify-start items-center w-full h-full py-1 gap-2'>
        {subTopics &&
          subTopics?.map((sub: SubTopic) => (
            <Tooltip key={sub.id}>
              {/* <div className='w-full border-slate-200 mb-3 py-3 bg-indigo-300'> */}
              {/* <div className='hover:bg-slate-300 rounded'> */}
              <TooltipTrigger asChild>
                <div className='flex flex-row p-1 gap-1 rounded w-full bg-background hover:bg-accent hover:text-accent-foreground bg-gradient-to-r from-transparent via-transparent to-slate-50 dark:to-slate-800'>
                  <div
                    style={{
                      backgroundImage: `url(${
                        sub.imageUrl === null ? "/ai4.png" : sub.imageUrl
                      })`,
                    }}
                    className={`flex justify-center items-center
              bg-center bg-cover self-center 
              max-w-24 min-w-24 w-24 max-h-24 min-h-24 h-24 my-1 rounded-lg`}
                  >
                    &nbsp;
                  </div>
                  <div className='py-1 px-2 w-full'>
                    <a href={`/learning/${sub.id}`}>
                      <span>
                        <span className='text-slate-400 dark:text-slate-300 hover:underline'>
                          {sub.sbaTopicName} | {sub.heading}
                        </span>
                        <br />
                        <span className='font-semibold text-cyan-700 dark:text-cyan-400 hover:underline'>
                          {sub.subHeading}
                        </span>
                      </span>
                    </a>
                    <br />
                    <span className='line-clamp-3 overflow-y-hidden'>
                      {parse(sub.content)}...
                    </span>
                  </div>
                </div>
              </TooltipTrigger>
              {/* </div> */}

              <TooltipContent className='tooltips'>
                <>
                  <span className='text-cyan-700'>{sub.heading}</span>
                  <br />
                  {sub.subHeading}
                </>
              </TooltipContent>
              {/* </div> */}
            </Tooltip>
          ))}
      </section>
    </div>
  );
}

export default function LearningPage() {
  return (
    <main className='flex flex-col self-start gap-5 items-center w-full min-h-screen h-full px-2 py-2 overflow-auto '>
      <Suspense fallback='Loading..'>
        <SearchResults />
      </Suspense>
    </main>
  );
}
