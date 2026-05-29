import type { Metadata } from 'next'
import { getAllCertifications } from '@lib/certs'
import CertificationsPage from '@components/certifications/CertificationsPage'

export const metadata: Metadata = {
  title: 'Certifications',
  robots: { index: false, follow: false },
}

export default function CertificationsRoute() {
  const certifications = getAllCertifications()
  return <CertificationsPage certifications={certifications} />
}
