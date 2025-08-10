export interface BlogPost {
  slug: string;
  title: string;
  date: Date;
  description?: string;
  type?: string;
  image?: string;
  categories?: string[];
  tags?: string[];
  content: string;
  url: string;
}
