export interface DraftFrontmatter {
  title: string
  date: string
  lastUpdated: string
  description: string
  type: string
  tags: string[]
  categories: string[]
  image: string
}

export interface DraftFile {
  filepath: string
  title: string
  date: string
  description: string
  modifiedAt: string
}

export interface DraftDetail {
  filepath: string
  frontmatter: DraftFrontmatter
  content: string
}
