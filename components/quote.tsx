import React, { useEffect, useState } from "react";
import { RandomQuote } from "@/types/types";

import { toast } from "sonner";
import { getRandomQuote } from "@/utils/services/getRandomQuote";
import Icons from "./Icons";

export default function Quote() {
  const [quote, setQuote] = useState<RandomQuote | null>(null);
  const runthis = 1;
  useEffect(() => {
    const fetchData = async () => {
      setQuote(await getRandomQuote());
    };

    fetchData().catch((e) => {
      toast("An error occurred while fetching data: ", e);
    });
  }, [runthis]);

  return (
    <div className='flex flex-col h-fit justify-center w-full p-2 items-center rounded-lg shadow'>
      {quote && (
        <div className='flex flex-col gap-2 py-5 px-2 '>
          <div className='flex flex-row gap-1'>
            <Icons.FaQuoteLeft className='text-cyan-600 min-h-4 min-w-4' />
            <span className='p-2  bg-accent rounded-lg text-sm'>
              {quote?.quoteText}
            </span>
            {/* <FaQuoteRight className='text-cyan-600  min-h-4 min-w-4 self-end' /> */}
          </div>

          <div className='text-cyan-900 dark:text-cyan-500 self-center text-xs'>
            {quote?.author}
          </div>
        </div>
      )}
    </div>
  );
}
