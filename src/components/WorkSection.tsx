import Link from 'next/link'
import type { Profile } from '@/lib/profile'
import type { CertSummary } from '@/src/types/CertSummary'
import WorkContent from './WorkContent'

interface Props {
  profile: Profile | null
  certSummary: CertSummary | null
}

export default function WorkSection({ profile, certSummary }: Props) {
  return (
    <>
      <h2 className="mb-3">
        Professional <span className="text-highlight">Work</span>
      </h2>
      <WorkContent profile={profile} certs={certSummary ?? undefined} compact />
      <div className="mt-4">
        <Link href="/work" className="btn btn-primary px-4">
          View Work <i className="fa fa-arrow-right" />
        </Link>
      </div>
    </>
  )
}
