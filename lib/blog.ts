import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { siteUrl } from '@/src/config'

const postsDir = path.resolve(process.cwd(), '_posts')

export interface PostMeta {
  slug: string
  title: string
  date: string
  description: string
  type: string
  image: string
  categories: string[]
  tags: string[]
  url: string
  fullUrl: string
}

export interface BlogPost extends PostMeta {
  content: string
}

function slugFromFilePath(filePath: string): string {
  return path
    .relative(postsDir, filePath)
    .replace(/\\/g, '/')
    .replace(/\.md$/, '')
    .replace(/^(\d{4}-\d{2}-\d{2}-)/, '')
}

function buildUrlParts(date: unknown): { year: string; month: string } {
  if (date) {
    const d = new Date(date as string)
    if (!isNaN(d.getTime())) {
      return {
        year: String(d.getFullYear()),
        month: String(d.getMonth() + 1).padStart(2, '0'),
      }
    }
  }
  return { year: 'unknown', month: '01' }
}

function parsePostFile(filePath: string): BlogPost {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const slug = slugFromFilePath(filePath)
  const { year, month } = buildUrlParts(data.date)

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ? String(data.date) : '',
    description: data.description ?? '',
    type: data.type ?? '',
    image: data.image ?? '',
    categories: data.categories ?? [],
    tags: data.tags ?? [],
    content,
    url: `/blog/${year}/${month}/${slug}/`,
    fullUrl: `${siteUrl}/blog/${year}/${month}/${slug}/`,
  }
}

function getAllMarkdownFiles(dir: string): string[] {
  return fs.readdirSync(dir).flatMap((entry) => {
    const fullPath = path.join(dir, entry)
    if (fs.statSync(fullPath).isDirectory()) return getAllMarkdownFiles(fullPath)
    return fullPath.endsWith('.md') ? [fullPath] : []
  })
}

export function getAllPosts(): PostMeta[] {
  return getAllMarkdownFiles(postsDir)
    .map(parsePostFile)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(({ content: _content, ...meta }) => meta)
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const files = getAllMarkdownFiles(postsDir)
  const file = files.find(
    (f) => path.basename(f, '.md').replace(/^\d{4}-\d{2}-\d{2}-/, '') === slug
  )
  if (!file) return undefined
  return parsePostFile(file)
}

export function getAllCategories(): string[] {
  const posts = getAllPosts()
  return [...new Set(posts.flatMap((p) => p.categories))].sort()
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  return [...new Set(posts.flatMap((p) => p.tags))].sort()
}
