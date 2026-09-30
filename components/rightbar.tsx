"use client";
import React from "react";

import Quote from "./quote";
import LinksPanel from "./LinksPanel";
import type { RandomQuote } from "@/types/types";

/** Legacy right rail - unused on public shell; kept for admin experiments. */
export default function Rightbar({ quote }: { quote?: RandomQuote | null }) {
  return (
    <div className='flex flex-col space-y-5 p-2'>
      <div className='flex flex-col gap-5'>
        <Quote quote={quote ?? null} />
        <LinksPanel />
      </div>
    </div>
  );
}
