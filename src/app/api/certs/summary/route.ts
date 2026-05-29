import { NextResponse } from 'next/server'
import { getAllCertifications } from '@lib/certs'

export const dynamic = 'force-static'

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

function isActive(expires?: string): boolean {
  if (!expires) return true
  const [mon, year] = expires.split(' ')
  const d = new Date(parseInt(year), MONTHS[mon] ?? 0)
  return d >= new Date()
}

const isReadable = (s?: string) => !s || !s.startsWith('ENC[')

export function GET() {
  let certs = getAllCertifications()
  if (certs.some((c) => !isReadable(c.name))) certs = []

  const issuerMap = new Map<string, string | undefined>()
  for (const c of certs) {
    if (!issuerMap.has(c.issuer)) issuerMap.set(c.issuer, c.issuer_logo)
  }

  return NextResponse.json({
    active: certs.filter((c) => isActive(c.expires)).length,
    total: certs.length,
    issuers: Array.from(issuerMap.entries()).map(([name, logo]) => ({ name, logo })),
  })
}
