import type { Metadata } from 'next'
import { getResume } from '@lib/resume'
import ResumeWeb from '@components/resume/ResumeWeb'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Resume',
  robots: { index: false, follow: false },
}

export default function ResumeViewPage() {
  const resume = getResume()
  return <ResumeWeb resume={resume} />
}
