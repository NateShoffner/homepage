import { getAllProjects } from '@/lib/projects'
import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json(getAllProjects())
}
