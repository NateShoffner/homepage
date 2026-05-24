import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getImagesDir } from '@/lib/admin'

export async function GET() {
  if (process.env.NODE_ENV === 'production') return NextResponse.json(null, { status: 404 })
  const imagesDir = getImagesDir()
  if (!fs.existsSync(imagesDir)) return NextResponse.json({ images: [] })
  const files = fs.readdirSync(imagesDir).filter((f) => /\.(jpe?g|png|gif|webp|svg)$/i.test(f))
  const images = files.map((filename) => ({
    filename,
    url: `/assets/images/posts/${filename}`,
  }))
  return NextResponse.json({ images })
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') return NextResponse.json(null, { status: 404 })
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const imagesDir = getImagesDir()
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  const filePath = path.join(imagesDir, sanitized)
  fs.writeFileSync(filePath, buffer)

  return NextResponse.json({ filename: sanitized, url: `/assets/images/posts/${sanitized}` })
}
