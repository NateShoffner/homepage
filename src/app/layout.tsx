import type { Metadata } from 'next'
import { Raleway, Open_Sans } from 'next/font/google'
import Navbar from '@components/Navbar'
import Footer from '@components/Footer'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import '@assets/css/main.scss'

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-raleway',
  display: 'block',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-open-sans',
  display: 'block',
})

export const metadata: Metadata = {
  title: {
    default: 'Nate Shoffner',
    template: '%s • Nate Shoffner',
  },
  description: 'Personal homepage and blog for Nate Shoffner.',
  icons: {
    icon: '/assets/images/logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${raleway.variable} ${openSans.variable}`}>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t||p)})()` }} />
      </head>
      <body>
        <Navbar />
        <div className="my-auto">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
