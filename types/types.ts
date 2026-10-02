export interface Topic {
  id: number;
  sbaTopicName: string;
  subTopicList: SubTopic[];
  isPublished?: boolean | string;
}

export interface SubTopic {
  id: number;
  topicId: number;
  heading: string;
  subHeading: string;
  slug: string;
  content: string;
  isPublished: string | boolean;
  createDate: string;
  createdBy: string;
  updateDate: string;
  updatedBy: string;
  publishDate: string;
  publishedBy: string;
  imageUrl: string;
  sbaTopicName: string;
  dek?: string;
  tldr?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  noindex?: boolean | string;
  seriesOrder?: number;
  tags?: string;
  legacySlug?: string;
}

export interface RandomQuote {
  id: number;
  author: string;
  quoteText: string;
  category: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isArchived: boolean;
}
