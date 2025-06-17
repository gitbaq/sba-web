import { SubTopic } from "@/types/types";
import { web_url, ids_url } from "@/utils/endpoints/endpoints";
import { NextResponse } from "next/server";



function generateSiteMap(posts:  SubTopic[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       
       <url>
         <loc>${`${web_url}`}</loc>
       </url>
       <url>
         <loc>${`${web_url}/about`}</loc>
       </url>
       <url>
         <loc>${`${web_url}/learning`}</loc>
       </url>
       ${posts
         .map((post:SubTopic, idx) => {
           return `
         <url>
             <loc key="${idx}">${`${web_url}/${post.id}`}</loc>
         </url>
       `;
         })
         .join("")}
     </urlset>
   `;
}

export async function GET() {
  debugger;
  const request = await fetch(ids_url);
  const posts = await request.json();
  

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(posts);

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
  
}
