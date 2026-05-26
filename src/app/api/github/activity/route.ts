import { NextRequest, NextResponse } from 'next/server'

const CACHE_SECONDS = 3600
const WEEKS = 52
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const owner = searchParams.get('owner')
  const repo = searchParams.get('repo')

  if (!owner || !repo) {
    return NextResponse.json({ weeks: [] }, { status: 400 })
  }

  const headers: HeadersInit = { Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const since = new Date(Date.now() - WEEKS * WEEK_MS).toISOString()
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?since=${since}&per_page=100`,
    { headers, next: { revalidate: CACHE_SECONDS } }
  )

  if (!res.ok) {
    return NextResponse.json({ weeks: [] })
  }

  const commits: { commit: { author: { date: string } } }[] = await res.json()

  const buckets = Array<number>(WEEKS).fill(0)
  const now = Date.now()
  for (const c of commits) {
    const age = now - new Date(c.commit.author.date).getTime()
    const weekIndex = Math.floor(age / WEEK_MS)
    if (weekIndex >= 0 && weekIndex < WEEKS) {
      buckets[WEEKS - 1 - weekIndex]++
    }
  }

  return NextResponse.json({ weeks: buckets }, {
    headers: { 'Cache-Control': `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate` },
  })
}
