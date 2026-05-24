import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getDraftsDir, getPostsDir } from '@/lib/admin'

type Params = { filepath: string[] }

export async function POST(_request: Request, { params }: { params: Promise<Params> }) {
  if (process.env.NODE_ENV === 'production') return NextResponse.json(null, { status: 404 })
  const { filepath } = await params
  const draftsDir = getDraftsDir()
  const postsDir = getPostsDir()
  const draftPath = path.join(draftsDir, ...filepath) + '.md'

  if (!fs.existsSync(draftPath)) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const raw = fs.readFileSync(draftPath, 'utf-8')
  const { data } = matter(raw)

  if (!data.date) {
    return NextResponse.json({ error: 'Missing date in frontmatter' }, { status: 400 })
  }

  const d = new Date(data.date as string)
  if (isNaN(d.getTime())) {
    return NextResponse.json({ error: 'Invalid date in frontmatter' }, { status: 400 })
  }

  const datePrefix = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
  const slugPart = filepath[filepath.length - 1].replace(/^\d{4}-\d{2}-\d{2}-/, '')
  const publishedFilename = `${datePrefix}-${slugPart}.md`

  const subDirs = filepath.slice(0, -1)
  const targetDir = subDirs.length ? path.join(postsDir, ...subDirs) : postsDir
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })

  const publishedPath = path.join(targetDir, publishedFilename)
  fs.renameSync(draftPath, publishedPath)

  const year = String(d.getUTCFullYear())
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const publishedSlug = slugPart

  return NextResponse.json({ publishedSlug, publishedPath: `/blog/${year}/${month}/${publishedSlug}/` })
}
