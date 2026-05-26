import { NextResponse } from 'next/server'
import { getProfile } from '@/lib/profile'

export function GET() {
  return NextResponse.json(getProfile())
}
