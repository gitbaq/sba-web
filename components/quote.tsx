import React, { useEffect, useState } from "react";
import { RandomQuote } from "@/types/types";
import { quotes_url } from "@/utils/endpoints/endpoints";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";
import { toast } from "sonner";

export default function Quote() {
  const [quote, setQuote] = useState<RandomQuote | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(quotes_url);

      if (!res.ok) {
        toast(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      setQuote(result);
    };

    fetchData().catch((e) => {
      toast("An error occurred while fetching data: ", e);
    });
  }, []);

  return (
    <div className='flex flex-col h-fit justify-center w-full items-center p-1'>
      {quote && (
        <div className='flex flex-col gap-2 py-5 px-2 rounded-lg borderx border-indigo-300x bg-gradient-to-t from-transparent to-cyan-50'>
          <div className='flex flex-row gap-1'>
            <FaQuoteLeft className='text-cyan-600 min-h-4 min-w-4' />
            <span className='p-2 border rounded-lg text-sm'>
              {quote?.quoteText}
            </span>
            <FaQuoteRight className='text-cyan-600  min-h-4 min-w-4 self-end' />
          </div>

          <div className='text-indigo-900 self-center text-xs'>
            {quote?.author}
          </div>
        </div>
      )}
    </div>
  );
}
