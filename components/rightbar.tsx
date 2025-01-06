"use client";
import React from "react";
import { Calendar } from "./ui/calendar";
import { DateRange } from "react-day-picker";
import Icons from "./Icons";

export default function Rightbar() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    to: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  });

  return (
    <div>
      <Calendar
        mode='range'
        selected={date}
        onSelect={(range) => setDate(range)}
        className='rounded-md border shadow bg-slate-50'
      />
      <div className=' flex flex-row gap-1 items-center py-2 text-xs w-full justify-center'>
        <Icons.Info className='h-4 w-4 min-h-4 min-w-4 text-amber-400' />
        <span>Choose date range to filter articles</span>
      </div>
    </div>
  );
}
