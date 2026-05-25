import { NextRequest, NextResponse } from 'next/server'

const REVALIDATE_SECONDS = 3600

async function fetchRepos(username: string, headers: HeadersInit): Promise<unknown[]> {
  // Try /users/ first (works for both users and orgs), fall back to /orgs/ if empty
  const userRes = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
    { headers, next: { revalidate: REVALIDATE_SECONDS } }
  )
  if (userRes.ok) {
    const repos: unknown[] = await userRes.json()
    if (repos.length > 0) return repos
  }

  const orgRes = await fetch(
    `https://api.github.com/orgs/${username}/repos?per_page=100&sort=pushed`,
    { headers, next: { revalidate: REVALIDATE_SECONDS } }
  )
  return orgRes.ok ? orgRes.json() : []
}

export async function GET(request: NextRequest) {
  const usernames = request.nextUrl.searchParams
    .get('usernames')
    ?.split(',')
    .map((u) => u.trim())
    .filter(Boolean) ?? []

  if (usernames.length === 0) {
    return NextResponse.json([])
  }

  const headers: HeadersInit = { Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const results = await Promise.allSettled(
    usernames.map((username) => fetchRepos(username, headers))
  )

  const repos = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))

  return NextResponse.json(repos, {
    headers: { 'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate` },
  })
}
