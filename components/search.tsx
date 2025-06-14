"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Icons from "./Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Search() {
  function SearchInput() {
    const router = useRouter();
    const [query, setQuery] = useState<string>("");
    function searchQuery(): void {
      router.push(`/learning?query=${query}`);
    }

    function handleChange(event: {
      target: { value: React.SetStateAction<string> };
    }): void {
      setQuery(event.target.value);
    }
    return (
      <div className='flex flex-row rounded border w-full h-full'>
        <Input
          type='text'
          placeholder='Quick Search...'
          className='rounded-l rounded-r-none text-primary w-full border border-accent focus-visible:ring-0'
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
          className='rounded-l-none rounded-r'
          onClick={searchQuery}
          name='submit'
        >
          <Icons.Search className=' icons-size' />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className='flex flex-row items-center justify-center w-full'>
        <SearchInput />
      </div>
    </>
  );
}

export default Search;
