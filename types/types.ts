export interface Topic {
  id: number;
  sbaTopicName: string;
  subTopicList: SubTopic[];
}

export interface SubTopic {
  id: number;
  heading: string;
  subHeading: string;
  slug: string;
  content: string;
  published: string;
  createDate: string;
  createdBy: string;
  updateDate: string;
  updatedBy: string;
  publishDate: string;
  publishedBy: string;
  topicId: string;
  imageUrl: string;
}

export interface RandomQuote {
  id: number;
  author: string;
  quoteText: string;
  category: string;
}

export interface Subscriber {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isArchived: boolean;
}
