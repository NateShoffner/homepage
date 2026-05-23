import type { Metadata } from 'next'
import ContactSection from '@components/ContactSection'

export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <section className="page-section p-4 p-lg-5 d-flex flex-column">
      <div className="my-auto">
        <ContactSection />
      </div>
    </section>
  )
}
