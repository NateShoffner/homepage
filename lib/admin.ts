import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import type { DraftFrontmatter, DraftFile, DraftDetail } from '@/src/types/admin'

export function getDraftsDir(): string {
  return path.resolve(process.cwd(), '_drafts')
}

export function getPostsDir(): string {
  return path.resolve(process.cwd(), '_posts')
}

export function getImagesDir(): string {
  return path.resolve(process.cwd(), 'public/assets/images/posts')
}

function getAllMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).flatMap((entry) => {
    const fullPath = path.join(dir, entry)
    if (fs.statSync(fullPath).isDirectory()) return getAllMarkdownFiles(fullPath)
    return fullPath.endsWith('.md') ? [fullPath] : []
  })
}

function parseMarkdownFile(filePath: string, baseDir: string): DraftDetail {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const filepath = path.relative(baseDir, filePath).replace(/\\/g, '/').replace(/\.md$/, '')
  return {
    filepath,
    frontmatter: {
      title: (data.title as string) ?? '',
      date: data.date ? String(data.date) : '',
      lastUpdated: data.lastUpdated ? String(data.lastUpdated) : '',
      description: (data.description as string) ?? '',
      type: (data.type as string) ?? '',
      tags: (data.tags as string[]) ?? [],
      categories: (data.categories as string[]) ?? [],
      image: (data.image as string) ?? '',
    },
    content: content.trim(),
  }
}

function toFileList(files: string[], baseDir: string): DraftFile[] {
  return files
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(raw)
      const stat = fs.statSync(filePath)
      const filepath = path.relative(baseDir, filePath).replace(/\\/g, '/').replace(/\.md$/, '')
      return {
        filepath,
        title: (data.title as string) ?? filepath,
        date: data.date ? String(data.date) : '',
        description: (data.description as string) ?? '',
        modifiedAt: stat.mtime.toISOString(),
      }
    })
    .sort((a, b) => {
      const aHasDate = !!a.date
      const bHasDate = !!b.date
      // Undated items float to top sorted by modifiedAt
      if (!aHasDate && !bHasDate) return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()
      if (!aHasDate) return -1
      if (!bHasDate) return 1
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime()
      if (diff !== 0) return diff
      return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()
    })
}

export function getAllDraftFiles(): DraftFile[] {
  return toFileList(getAllMarkdownFiles(getDraftsDir()), getDraftsDir())
}

export function getAllPostFiles(): DraftFile[] {
  return toFileList(getAllMarkdownFiles(getPostsDir()), getPostsDir())
}

export function parseDraftFile(filePath: string): DraftDetail {
  return parseMarkdownFile(filePath, getDraftsDir())
}

export function parsePostFile(filePath: string): DraftDetail {
  return parseMarkdownFile(filePath, getPostsDir())
}

export function serializeFrontmatter(fm: DraftFrontmatter): string {
  const obj: Record<string, unknown> = {}
  if (fm.title) obj.title = fm.title
  if (fm.date) obj.date = fm.date
  if (fm.lastUpdated) obj.lastUpdated = fm.lastUpdated
  if (fm.description) obj.description = fm.description
  if (fm.type) obj.type = fm.type
  if (fm.tags?.length) obj.tags = fm.tags
  if (fm.categories?.length) obj.categories = fm.categories
  if (fm.image) obj.image = fm.image
  return `---\n${yaml.dump(obj)}---\n`
}
