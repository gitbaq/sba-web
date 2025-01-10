import Link from "next/link";
import React from "react";
import Icons from "./Icons";

const data = [
  {
    id: 1,
    url: "https://openai.com/news/",
    title: "Open AI News",
  },
  {
    id: 2,
    url: "https://blogs.nvidia.com/",
    title: "nVIDIA AI Blog",
  },
  {
    id: 3,
    url: "https://www.microsoft.com/en-us/ai/blog/",
    title: "Microsoft AI Blog",
  },
  {
    id: 4,
    url: "https://aws.amazon.com/blogs/machine-learning/",
    title: "AWS Machine Learning Blog",
  },
  {
    id: 5,
    url: "https://ai.google/latest-news/",
    title: "Google AI",
  },
];

function LinksPanel() {
  return (
    <div className='flex flex-col p-2 bg-white'>
      <div className='lead_text font-semibold mb-5'>AI Blogs</div>
      {data.map((d) => (
        <Link
          key={d.id}
          href={d.url}
          target='_blank'
          className='icons text-sm px-1 mb-1 flex flex-row items-cnter gap-1'
        >
          <Icons.ChevronsRight className='icons-size text-slate-600' />
          {d.title}
        </Link>
      ))}
      <div className='flex flex-row items-center text-xs text-cyan-600 mt-5'>
        <Link
          href='/contact'
          target='_self'
          className='icons px-1 mb-1 flex flex-row items-baseline gap-1'
        >
          Suggest More Blogs
        </Link>
      </div>
    </div>
  );
}

export default LinksPanel;
