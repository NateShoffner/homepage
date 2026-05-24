import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getDraftsDir, parseDraftFile, serializeFrontmatter } from '@/lib/admin'
import type { DraftFrontmatter } from '@/src/types/admin'

type Params = { filepath: string[] }

function resolveDraftPath(filepath: string[]): string {
  const draftsDir = getDraftsDir()
  return path.join(draftsDir, ...filepath) + '.md'
}

export async function GET(_request: Request, { params }: { params: Promise<Params> }) {
  if (process.env.NODE_ENV === 'production') return NextResponse.json(null, { status: 404 })
  const { filepath } = await params
  const filePath = resolveDraftPath(filepath)
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const draft = parseDraftFile(filePath)
  return NextResponse.json(draft)
}

export async function PUT(request: Request, { params }: { params: Promise<Params> }) {
  if (process.env.NODE_ENV === 'production') return NextResponse.json(null, { status: 404 })
  const { filepath } = await params
  const filePath = resolveDraftPath(filepath)
  const { frontmatter, content } = (await request.json()) as {
    frontmatter: DraftFrontmatter
    content: string
  }
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const serialized = serializeFrontmatter(frontmatter) + '\n' + content
  fs.writeFileSync(filePath, serialized, 'utf-8')
  return NextResponse.json({ savedAt: new Date().toISOString() })
}

export async function DELETE(_request: Request, { params }: { params: Promise<Params> }) {
  if (process.env.NODE_ENV === 'production') return NextResponse.json(null, { status: 404 })
  const { filepath } = await params
  const filePath = resolveDraftPath(filepath)
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  fs.unlinkSync(filePath)
  return NextResponse.json({ deleted: true })
}
