import { getAllPosts } from '@/lib/blog'
import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json(getAllPosts())
}
