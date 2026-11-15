import { NextResponse } from 'next/server'
import { getAllProjects } from '@/lib/projects'

// The admin preview needs project data to mirror the project embeds the live
// post page renders. lib/projects is fs-backed, so the client fetches it here.
export async function GET() {
  if (process.env.NODE_ENV === 'production') return NextResponse.json(null, { status: 404 })
  return NextResponse.json({ projects: getAllProjects() })
}
