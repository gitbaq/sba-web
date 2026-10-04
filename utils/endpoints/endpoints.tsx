export const baseURLAuth = "http://localhost:9292";


export const web_url = "https://www.syedbaqirali.com";
export const appBasePath = web_url;
// Local override: NEXT_PUBLIC_API_BASE_URL=http://localhost:7300 in .env.local
export const baseURL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.syedbaqirali.com"
).replace(/\/$/, "");
export const blox_url = "https://blox.syedbaqirali.com";
export const substack_url = "https://syedbaqirali.substack.com/";
export const github_url = "https://github.com/gitbaq";
export const substack_image_url = "/logos/substack.png";
export const cobu_url = "https://www.codingburo.com";
const bucket_url = "https://sbaweb-bucket.s3.ap-southeast-2.amazonaws.com";
export const bucket_url_public = bucket_url + "/public";

export const topics_url = baseURL + "/topics/v1";
export const topics_secure_url = baseURL + "/secure/topics/v1";

export const subtopics_url = baseURL + "/subtopics/v1";
export const subtopics_secure_url = baseURL + "/secure/subtopics/v1";

export const quotes_url = baseURL + "/quotes/v1";
export const quotes_secure_url = baseURL + "/secure/quotes/v1";

export const subs_url = baseURL + "/subs/v1";
export const newsletter_subscribe_url = baseURL + "/api/subscribe";
export const newsletter_confirm_url = baseURL + "/api/subscribe/confirm";
export const newsletter_unsubscribe_url = baseURL + "/api/unsubscribe";
export const newsletter_audience_url = baseURL + "/api/subscribe/audience";
export const newsletter_send_links_url = baseURL + "/api/subscribe/send-links";
export const newsletter_send_links_confirm_url =
  baseURL + "/api/subscribe/send-links/confirm";
export const newsletter_send_url = baseURL + "/secure/newsletter/v1/send";
export const newsletter_preview_url = baseURL + "/secure/newsletter/v1/preview";
export const newsletter_preview_send_url =
  baseURL + "/secure/newsletter/v1/preview-send";
export const newsletter_drafts_url = baseURL + "/secure/newsletter/v1/drafts";
export const newsletter_draft_url = (id: number) =>
  `${baseURL}/secure/newsletter/v1/drafts/${id}`;
export const newsletter_stats_url = baseURL + "/secure/newsletter/v1/stats";
export const newsletter_sends_url = baseURL + "/secure/newsletter/v1/sends";
export const newsletter_send_detail_url = (id: number) =>
  `${baseURL}/secure/newsletter/v1/sends/${id}`;
export const newsletter_subscribers_url =
  baseURL + "/secure/newsletter/v1/subscribers";
export const newsletter_subscribers_growth_url =
  baseURL + "/secure/newsletter/v1/subscribers/growth";
export const newsletter_subscriber_resend_url = (id: number) =>
  `${baseURL}/secure/newsletter/v1/subscribers/${id}/resend-confirmation`;
export const newsletter_subscriber_unsubscribe_url = (id: number) =>
  `${baseURL}/secure/newsletter/v1/subscribers/${id}/unsubscribe`;
export const newsletter_subscriber_delete_url = (id: number) =>
  `${baseURL}/secure/newsletter/v1/subscribers/${id}`;
export const home_config_url = baseURL + "/home/v1";
export const home_config_secure_url = baseURL + "/secure/home/v1";
export const work_projects_url = baseURL + "/work/v1";
export const work_projects_secure_url = baseURL + "/secure/work/v1";
export const about_config_url = baseURL + "/about/v1";
export const about_config_secure_url = baseURL + "/secure/about/v1";
export const media_upload_url = baseURL + "/secure/media/v1/upload";
export const media_list_url = baseURL + "/secure/media/v1";
export const contact_url = baseURL + "/contact/v1";
export const contact_secure_url = baseURL + "/secure/contact/v1";

export const essay_stats_url = (essayId: number) =>
  `${baseURL}/essays/v1/${essayId}/stats`;
export const essay_view_url = (essayId: number) =>
  `${baseURL}/essays/v1/${essayId}/view`;
export const essay_clap_url = (essayId: number) =>
  `${baseURL}/essays/v1/${essayId}/clap`;
export const essay_popular_url = `${baseURL}/essays/v1/popular`;

export const signup_url = baseURL + "/auth/v1/signup";
export const login_url = baseURL + "/auth/v1/login3";
// export const login_url = baseURLAuth + "/api/auth/signin";

export const ids_url = baseURL + "/subtopics/v1";
