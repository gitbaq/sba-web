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
    <>
      <section className='bg-stone-100 bg-opacity-60 flex flex-row w-full items-center p-2 gap-2 rounded-lg'>
        <Icons.Search className='text-white p-1 rounded-full bg-cyan-400 border-2 border-cyan-500 min-h-6 min-w-6 h-6 w-6' />
        <h1 className='flex w-full font-semibold text-lg'>Search Results</h1>
        {subTopics && (
          <span className='text-nowrap text-xs text-cyan-600'>
            {subTopics.length} matches found
          </span>
        )}
      </section>
      <section className='flex flex-col justify-start items-center w-full h-full py-5 gap-2'>
        {subTopics &&
          subTopics?.map((sub: SubTopic) => (
            <Tooltip key={sub.id}>
              {/* <div className='w-full border-slate-200 mb-3 py-3 bg-indigo-300'> */}
              {/* <div className='hover:bg-slate-300 rounded'> */}
              <TooltipTrigger asChild>
                <div className='flex flex-row p-1 gap-1 rounded w-full hover:bg-slate-100'>
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
                  </div>
                </div>
              </TooltipTrigger>
              {/* </div> */}

              <TooltipContent className='tooltips'>
                <>
                  <span className='text-sky-800'>{sub.heading}</span>
                  <br />
                  {sub.subHeading}
                </>
              </TooltipContent>
              {/* </div> */}
            </Tooltip>
          ))}
      </section>
    </>
  );
}

export default function LearningPage() {
  return (
    <main className='flex flex-col self-start items-center w-full min-h-screen h-full px-2 py-3 overflow-auto'>
      <Suspense fallback='Loading..'>
        <SearchResults />
      </Suspense>
    </main>
  );
}
