import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import { marked } from 'marked'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const postsDir = path.resolve(process.cwd(), '_posts')
const outputFile = path.resolve(process.cwd(), 'src/_data/blogIndex.ts')

function getAllMarkdownFiles(dir: string): string[] {
  return fs.readdirSync(dir).flatMap(entry => {
    const fullPath = path.join(dir, entry)
    if (fs.statSync(fullPath).isDirectory()) return getAllMarkdownFiles(fullPath)
    return fullPath.endsWith('.md') ? [fullPath] : []
  })
}

const files = getAllMarkdownFiles(postsDir)

const posts = files.map(filePath => {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  const slug = path
    .relative(postsDir, filePath)
    .replace(/\\/g, '/')
    .replace(/\.md$/, '')

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? null,
    description: data.description ?? '',
    type: data.type ?? '',
    image: data.image ?? '',
    categories: data.categories ?? [],
    tags: data.tags ?? [],
    markdown: content,
    content: marked.parse(content),
    
    // yyyy/mm/slug
    url: `/blog/${data.date ? new Date(data.date).getFullYear() : 'unknown'}/${data.date ? String(new Date(data.date).getMonth() + 1).padStart(2, '0') : '01'}/${slug}/`
  }
})

// Optional: Sort posts by date
posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const typeDef = `export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  type: string
  image: string
  categories: string[]
  tags: string[]
  content: string
  markdown: string
  url: string
}
`

const output = `${typeDef}
export const blogIndex: BlogPost[] = ${JSON.stringify(posts, null, 2)}
`

fs.mkdirSync(path.dirname(outputFile), { recursive: true })
fs.writeFileSync(outputFile, output)

console.log(`✅ Generated blogIndex.ts with ${posts.length} posts`)
