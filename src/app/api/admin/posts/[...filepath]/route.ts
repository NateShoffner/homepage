import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getPostsDir, parsePostFile, serializeFrontmatter } from '@/lib/admin'
import type { DraftFrontmatter } from '@/src/types/admin'

type Params = { filepath: string[] }

function resolvePostPath(filepath: string[]): string {
  return path.join(getPostsDir(), ...filepath) + '.md'
}

export async function GET(_request: Request, { params }: { params: Promise<Params> }) {
  if (process.env.NODE_ENV === 'production') return NextResponse.json(null, { status: 404 })
  const { filepath } = await params
  const filePath = resolvePostPath(filepath)
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(parsePostFile(filePath))
}

export async function PUT(request: Request, { params }: { params: Promise<Params> }) {
  if (process.env.NODE_ENV === 'production') return NextResponse.json(null, { status: 404 })
  const { filepath } = await params
  const filePath = resolvePostPath(filepath)
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const { frontmatter, content } = (await request.json()) as {
    frontmatter: DraftFrontmatter
    content: string
  }
  const serialized = serializeFrontmatter(frontmatter) + '\n' + content
  fs.writeFileSync(filePath, serialized, 'utf-8')
  return NextResponse.json({ savedAt: new Date().toISOString() })
}
