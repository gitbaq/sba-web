"use client";
import React from "react";
import { Calendar } from "./ui/calendar";
import { DateRange } from "react-day-picker";
import Icons from "./Icons";
import Quote from "./quote";
import LinksPanel from "./LinksPanel";

export default function Rightbar() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    to: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  });

  return (
    <div className='flex flex-col h-full min-h-full space-y-1 bg-white'>
      <div className='flex flex-col gap-1'>
        <Calendar
          mode='range'
          selected={date}
          onSelect={(range) => setDate(range)}
          className='rounded-md border shadow'
        />
        <div className=' flex flex-row gap-1 items-center text-xs w-full p-1'>
          <Icons.Info className='h-4 w-4 min-h-4 min-w-4 text-slate-500' />
          <span>Choose date range to refine search</span>
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        <Quote />
        <LinksPanel />
      </div>
    </div>
  );
}
