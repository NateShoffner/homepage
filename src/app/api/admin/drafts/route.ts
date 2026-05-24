import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getAllDraftFiles, getDraftsDir, serializeFrontmatter } from '@/lib/admin'

export async function GET() {
  if (process.env.NODE_ENV === 'production') return NextResponse.json(null, { status: 404 })
  const drafts = getAllDraftFiles()
  return NextResponse.json({ drafts })
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') return NextResponse.json(null, { status: 404 })
  const { title } = (await request.json()) as { title?: string }
  const titleSlug = (title ?? 'untitled')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'untitled'
  const now = new Date()
  const datePrefix = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`
  const slug = `${datePrefix}-${titleSlug}`
  const draftsDir = getDraftsDir()
  if (!fs.existsSync(draftsDir)) fs.mkdirSync(draftsDir, { recursive: true })
  const filename = `${slug}.md`
  const filePath = path.join(draftsDir, filename)
  const content = serializeFrontmatter({
    title: title ?? '',
    date: datePrefix,
    lastUpdated: '',
    description: '',
    type: '',
    tags: [],
    categories: [],
    image: '',
  })
  fs.writeFileSync(filePath, content, 'utf-8')
  return NextResponse.json({ filename: slug, content })
}
