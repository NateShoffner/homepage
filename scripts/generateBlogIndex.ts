import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import { Feed } from "feed";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const postsDir = path.resolve(process.cwd(), '_posts')
const outputFile = path.resolve(process.cwd(), 'src/_data/blogIndex.ts')
const feedFile = path.resolve(process.cwd(), 'public/feed.xml')

const siteUrl = "https://nateshoffner.com"

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

let slug = path
    .relative(postsDir, filePath)
    .replace(/\\/g, '/')
    .replace(/\.md$/, '')

// Remove leading YYYY-MM-DD- from the slug if present
slug = slug.replace(/^(\d{4}-\d{2}-\d{2}-)/, '')

// Parse date for URL construction
let year = 'unknown'
let month = '01'
if (data.date) {
    const d = new Date(data.date)
    if (!isNaN(d.getTime())) {
        year = String(d.getFullYear())
        month = String(d.getMonth() + 1).padStart(2, '0')
    }
}

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
    url: `/blog/${year}/${month}/${slug}/`,
    fullUrl: `${siteUrl}/blog/${year}/${month}/${slug}/`
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
  markdown: string
  url: string
  fullUrl: string
}
`

const output = `${typeDef}
export const blogIndex: BlogPost[] = ${JSON.stringify(posts, null, 2)}
`

fs.mkdirSync(path.dirname(outputFile), { recursive: true })
fs.writeFileSync(outputFile, output)

console.log(`✅ Generated blogIndex.ts with ${posts.length} posts`)

// Generate RSS Feed
const feed = new Feed({
  title: "Nate Shoffner",
  description: "Personal homepage and blog for Nate Shoffner.",
  id: siteUrl,
  link: siteUrl,
  copyright: "",
});

posts.forEach(post => {
  feed.addItem({
    title: post.title,
    description: post.description,
    date: post.date ? new Date(post.date) : new Date(),
    link: siteUrl + post.url,
    guid: siteUrl + post.url,
  });
}); 

fs.mkdirSync(path.dirname(feedFile), { recursive: true })
fs.writeFile(feedFile, feed.rss2(), (err) => {
  if (err) {
    console.error("Error writing RSS feed:", err);
  } else {
    console.log("✅ Generated RSS feed at", feedFile);
  }
}
);

