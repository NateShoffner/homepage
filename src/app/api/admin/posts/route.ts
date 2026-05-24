import { NextResponse } from 'next/server'
import { getAllPostFiles } from '@/lib/admin'

export async function GET() {
  if (process.env.NODE_ENV === 'production') return NextResponse.json(null, { status: 404 })
  const posts = getAllPostFiles()
  return NextResponse.json({ posts })
}
