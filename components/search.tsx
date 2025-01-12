"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Icons from "./Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";


function Search() {
  function SearchInput() {
    const router = useRouter();
    const [query, setQuery] = useState<string>("");
    function searchQuery(): void {
      router.push("/learning?query=" + query);
    }

    function handleChange(event: {
      target: { value: React.SetStateAction<string> };
    }): void {
      setQuery(event.target.value);
    }
    return (
      <>
        <Input
          type='text'
          placeholder='Quick Search...'
          className='rounded-l-lg rounded-r-none bg-accent text-primary w-full border border-secondary'
          onChange={handleChange}
          onKeyUp={(e) =>
            e.key == "Enter" && query.length > 1 ? searchQuery() : null
          }
          onFocus={(e) =>
            e.currentTarget.setSelectionRange(0, e.currentTarget.value.length)
          }
          onClick={(e) =>
            e.currentTarget.setSelectionRange(0, e.currentTarget.value.length)
          }
        />

        <Button
          disabled={query.length < 2 ? true : false}
          type='submit'
          className='rounded-l-none rounded-r-lg bg-cyan-400 border border-cyan-500'
          onClick={searchQuery}
        >
          <Icons.Search />
        </Button>
      </>
    );
  }

  return (
    <>
      <div className='flex flex-row items-center justify-center w-full'>
        <SearchInput />
      </div>
      {/* <div className='md:hidden flex items-center w-full justify-end px-2'>
        <Popover>
          <PopoverTrigger asChild>
            <Icons.Search className='hover:cursor-pointer' />
          </PopoverTrigger>
          <PopoverContent className='w-80'>
            <div className='flex flex-row items-center'>
              <SearchInput />
            </div>
          </PopoverContent>
        </Popover>
      </div> */}
    </>
  );
}

export default Search;
