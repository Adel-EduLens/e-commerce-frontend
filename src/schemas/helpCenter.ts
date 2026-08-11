export interface HelpVideo {
  id: string;
  title: string;
  category: string;
  youtubeId: string;
}

export interface HelpCenterCategory {
  id: string;
  name: string;
}

export interface HelpCenterArticle {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  category?: HelpCenterCategory;
  createdAt: string;
}
