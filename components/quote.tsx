import React from "react";
import { RandomQuote } from "@/types/types";
import { quotes_url } from "@/utils/endpoints/endpoints";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";
import { toast } from "sonner";
async function getRandomQuote() {
  try {
    debugger;
    const res = await fetch(quotes_url);

    if (!res.ok) {
      toast(`HTTP error! status: ${res.status}`);
      return null;
      throw new Error(`HTTP error! status: ${res.status}`);
    } else {
      return res.json();
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}
export default async function Quote() {
  const quote: RandomQuote = await getRandomQuote();

  return (
    <div className='flex flex-col h-fit justify-center w-full items-center gap-1 text-sm text-slate-600 py-5 my-5 p-2 rounded bg-indigo-100 bg-opacity-100'>
      {quote && (
        <>
          <div className='flex flex-row gap-1'>
            <FaQuoteLeft className='text-indigo-600 min-h-4 min-w-4' />
            {quote?.quoteText}
            <FaQuoteRight className='text-indigo-600  min-h-4 min-w-4' />
          </div>
          <div className='text-stone-400 self-end'>{quote?.author}</div>
        </>
      )}
    </div>
  );
}
