// Shared journal types used by API routes and the frontend.

export interface AuthorDTO {
  id: string;
  givenName: string;
  familyName: string;
  orcid: string;
  affiliation: string;
  department: string;
  country: string;
  email: string;
  order: number;
  isCorresponding: boolean;
}

export interface ArticleListItem {
  id: string;
  status: string;
  title: string;
  abstractText: string;
  keywords: string[];
  doi: string;
  volume: number;
  issue: number;
  year: number;
  month: string;
  pages: string;
  type: string;
  section: string;
  publishedDate: string;
  citations: number;
  downloads: number;
  authors: { id: string; name: string; isCorresponding: boolean }[];
}

export interface ArticleDetail extends ArticleListItem {
  receivedDate: string;
  acceptedDate: string;
  pdfPages: number;
  references: string[];
  correspondingEmail: string;
  authorDetails: AuthorDTO[];
  similar: {
    id: string; title: string; year: number; citations: number; section: string;
  }[];
}

export interface IssueDTO {
  id: string;
  volume: number;
  issue: number;
  year: number;
  month: string;
  theme: string;
  description: string;
  publishedDate: string;
  status: string;
  isSpecial: boolean;
  articleCount: number;
}

export interface JournalOverview {
  metrics: {
    citeScore: number;
    citeScoreHistory: { year: number; value: number }[];
    sjr: number;
    snip: number;
    hIndex: number;
    downloads2025: number;
    acceptanceRate: string;
    daysToFirstDecision: number;
    percentile: number;
    quartile: string;
  };
  stats: {
    totalArticles: number;
    totalAuthors: number;
    totalIssues: number;
    totalCountries: number;
    totalDownloads: number;
  };
  latestIssue: {
    id: string; volume: number; issue: number; year: number; month: string;
    theme: string; isSpecial: boolean; publishedDate: string;
  } | null;
  latestArticles: ArticleListItem[];
  mostCited: ArticleListItem[];
  mostDownloaded: ArticleListItem[];
  justAccepted: ArticleListItem[];
  announcements: { id: string; date: string; title: string; body: string; type: string }[];
  sections: { name: string; count: number }[];
  volumes: { volume: number; year: number; issueCount: number; articleCount: number }[];
}

export const ARTICLE_TYPES = ['Research Article', 'Review Article', 'Short Communication', 'Technical Note'];

export const SECTION_LIST = [
  'Artificial Intelligence & Machine Learning',
  'Computer Vision & Pattern Recognition',
  'Data Science & Big Data Analytics',
  'Computer Networks & Security',
  'Software Engineering & Systems',
  'Natural Language Processing',
  'Internet of Things & Embedded Systems',
  'Cloud & Distributed Computing',
  'Human–Computer Interaction',
  'Theoretical Computer Science',
  'Health & Bioinformatics',
];
