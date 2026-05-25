import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Page Not Found' }

export default function NotFound() {
  return (
    <section className="error-404">
      <div className="error-404-inner">
        <p className="error-404-code">404</p>
        <div className="error-404-divider" />
        <h1 className="error-404-title">Page Not Found</h1>
        <p className="error-404-message">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <a href="/" className="btn btn-primary px-4">
          Back to Home <i className="fa fa-arrow-right ms-1" />
        </a>
      </div>
    </section>
  )
}
