import Layout from "@/app/layout";
import { web_url } from "@/utils/endpoints/endpoints";
import { ReactNode } from "react";

// //pages/sitemap.xml.js
// const EXTERNAL_DATA_URL = "https://jsonplaceholder.typicode.com/posts";

function generateSiteMap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
  <loc>${`${web_url}/`}</loc>
  <priority>0.2</priority>
  <changefreq>daily</changefreq>
</url>
<url>
  <loc>${`${web_url}/about}`}</loc>
  <priority>1.0</priority>
  <changefreq>daily</changefreq>
</url>
<url>
  <loc>${`${web_url}/contact`}</loc>
  <priority>0.3</priority>
  <changefreq>daily</changefreq>
</url>
<url>
  <loc>${`${web_url}/profile`}</loc>
  <priority>0.3</priority>
  <changefreq>daily</changefreq>
</url>
<url>
  <loc>${`${web_url}/login`}</loc>
  <priority>0.3</priority>
  <changefreq>daily</changefreq>
</url>
<url>
  <loc>${`${web_url}/learning?query=transform`}</loc>
  <priority>0.5</priority>
  <changefreq>daily</changefreq>
</url>
<url>
  <loc>${`${web_url}/learning/1`}</loc>
  <priority>0.5</priority>
  <changefreq>daily</changefreq>
</url>
<url>
  <loc>${`${web_url}/learning/5`}</loc>
  <priority>0.5</priority>
  <changefreq>daily</changefreq>
</url>
<url>
  <loc>${`${web_url}/learning/14`}</loc>
  <priority>0.5</priority>
  <changefreq>daily</changefreq>
</url>
<url>
  <loc>${`${web_url}/learning/15`}</loc>
  <priority>0.5</priority>
  <changefreq>daily</changefreq>
</url>
<url>
  <loc>${`${web_url}/learning/16`}</loc>
  <priority>0.5</priority>
  <changefreq>daily</changefreq>
</url>
<url>
  <loc>${`${web_url}/52`}</loc>
  <priority>0.5</priority>
  <changefreq>daily</changefreq>
</url>
    
      
   </urlset>
 `;
}

async function SiteMap() {
//   const request = await fetch(EXTERNAL_DATA_URL);
//   const posts = await request.json();

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap();
  return sitemap;
}

SiteMap.getLayout = function getLayout(sitemap:ReactNode) {
  return (
    <Layout>
      {sitemap}
    </Layout>
  );
};



export default SiteMap;
