import { getPostBySlug } from '@/lib/blog'
import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return new NextResponse(null, { status: 404 })
  return NextResponse.json(post)
}
