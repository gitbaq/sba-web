export interface Topic {
  id: number;
  sbaTopicName: string;
  subTopicList: SubTopic[];
}

export interface SubTopic {
  id: number;
  topicId: number;
  heading: string;
  subHeading: string;
  slug: string;
  content: string;
  isPublished: string;
  createDate: string;
  createdBy: string;
  updateDate: string;
  updatedBy: string;
  publishDate: string;
  publishedBy: string;
  imageUrl: string;
  sbaTopicName: string;
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
