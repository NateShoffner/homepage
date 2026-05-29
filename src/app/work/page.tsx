import type { Metadata } from 'next'
import { getProfile } from '@lib/profile'
import { getAllCertifications } from '@lib/certs'
import WorkContent from '@components/WorkContent'
import type { CertSummary } from '@/src/types/CertSummary'
import styles from './WorkPage.module.scss'

export const metadata: Metadata = {
  title: 'Work',
}

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

function parseMonthYear(str: string): Date | null {
  try {
    const [mon, year] = str.split(' ')
    const y = parseInt(year)
    const m = MONTHS[mon]
    if (isNaN(y) || m === undefined) return null
    return new Date(y, m)
  } catch {
    return null
  }
}

function certIsActive(expires?: string): boolean {
  if (!expires) return true
  const d = parseMonthYear(expires)
  return d ? d >= new Date() : false
}

const isReadable = (s?: string) => !s || !s.startsWith('ENC[')

export default function WorkPage() {
  const profile = getProfile()
  let rawCerts = getAllCertifications()
  if (rawCerts.some((c) => !isReadable(c.name))) rawCerts = []

  const certs: CertSummary | undefined = rawCerts.length > 0 ? {
    active: rawCerts.filter((c) => certIsActive(c.expires)).length,
    total: rawCerts.length,
    issuers: Array.from(
      new Map(rawCerts.filter((c) => c.issuer_logo && isReadable(c.issuer_logo))
        .map((c) => [c.issuer, { name: c.issuer, logo: c.issuer_logo }]))
        .values()
    ),
  } : undefined

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.heading}>Work</h1>
        <p className={styles.intro}>
          Professional background, credentials, and experience.
        </p>
      </div>
      <WorkContent profile={profile} certs={certs} />
    </div>
  )
}
