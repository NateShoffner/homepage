import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy' }

export default function PrivacyPage() {
  return (
    <section className="page-section p-4 p-lg-5 d-flex d-column">
      <div className="my-auto">
        <h1 className="mb-5">Privacy Policy</h1>

        <h3>Cookies</h3>
        <p>
          A cookie is a small file which asks permission to be placed on your computer&apos;s hard
          drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets
          you know when you visit a particular site. Cookies allow web applications to respond to
          you as an individual. The web application can tailor its operations to your needs, likes
          and dislikes by gathering and remembering information about your preferences.
        </p>
        <p>
          You can choose to accept or decline cookies. Most web browsers automatically accept
          cookies, but you can usually modify your browser setting to decline cookies if you prefer.
          This may prevent you from taking full advantage of the website.
        </p>

        <h3 className="pt-5">Google Analytics</h3>
        <p>
          This site uses &ldquo;Google Analytics&rdquo; to collect information about use of this
          site. Google Analytics collects information such as how often users visit this site, what
          pages they visit when they do so, and what other sites they used prior to coming to this
          site. This site uses use the information it gets from Google Analytics only to improve
          this site. Google Analytics collects only the IP address assigned to you on the date you
          visit this site, rather than your name or other identifying information. We do not combine
          the information collected through the use of Google Analytics with personally identifiable
          information. Although Google Analytics plants a permanent cookie on your web browser to
          identify you as a unique user the next time you visit this site, the cookie cannot be used
          by anyone but Google. Google&apos;s ability to use and share information collected by
          Google Analytics about your visits to this site is restricted by the{' '}
          <a href="http://www.google.com/analytics/tos.html" target="_blank" rel="noopener noreferrer">
            Google Analytics Terms of Use
          </a>{' '}
          and the{' '}
          <a href="http://www.google.com/privacypolicy.html" target="_blank" rel="noopener noreferrer">
            Google Privacy Policy
          </a>
          . You can prevent Google Analytics from recognizing you on return visits to this site by{' '}
          <a href="http://www.usa.gov/optout_instructions.shtml" target="_blank" rel="noopener noreferrer">
            disabling cookies
          </a>{' '}
          on your browser.
        </p>
        <p>
          If you choose, you can opt out by turning off cookies in the preferences settings in your
          web browser. For more information on Google Analytics, please visit{' '}
          <a href="http://www.google.com/analytics/" target="_blank" rel="noopener noreferrer">
            Google Analytics
          </a>
        </p>
      </div>
    </section>
  )
}
