import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy' }

const LAST_UPDATED = 'October 25, 2026'

export default function PrivacyPage() {
  return (
    <section className="page-section p-4 p-lg-5 d-flex d-column">
      <div className="my-auto">
        <h1 className="mb-3">Privacy Policy</h1>
        <p className="text-muted mb-5">Last updated: {LAST_UPDATED}</p>

        <p>This is my personal site. It carries no ads and no analytics.</p>

        <h3 className="pt-5">Contact form</h3>
        <p>
          The form collects the name, email address, and message you type in.{' '}
          <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
            Resend
          </a>{' '}
          delivers it to my inbox, where it is used to reply.
        </p>
        <p>
          The form is protected by{' '}
          <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
            Cloudflare Turnstile
          </a>
          , which receives your IP address and some browser details to tell humans from bots.
        </p>

        <h3 className="pt-5">Blog comments</h3>
        <p>
          Comments come from{' '}
          <a href="https://disqus.com/data-sharing-settings/" target="_blank" rel="noopener noreferrer">
            Disqus
          </a>
          , which loads its own code and cookies on posts and tracks visitors for its own purposes.
          That falls under its privacy policy, not this one.
        </p>

        <h3 className="pt-5">Cookies</h3>
        <p>
          The site remembers your light or dark theme preference, and sets a session cookie if you
          unlock the gated pages. Neither is used for tracking.
        </p>

        <h3 className="pt-5">Server logs</h3>
        <p>
          The hosting infrastructure keeps short-lived request logs with IP addresses, URLs, and
          user agents, used to keep the site online and secure.
        </p>

        <h3 className="pt-5">Your rights</h3>
        <p>
          I am the data controller. You can ask what data of yours I hold, and have it corrected or
          deleted, through the <a href="/contact">contact form</a>.
        </p>
      </div>
    </section>
  )
}
