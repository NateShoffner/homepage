'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@components/Navbar'
import Footer from '@components/Footer'

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const isPrint = pathname.startsWith('/resume/view/print')
  const noChrome = isAdmin || isPrint
  return (
    <>
      {!noChrome && <Navbar />}
      <div className={noChrome ? undefined : 'site-content'}>{children}</div>
      {!noChrome && <Footer />}
    </>
  )
}
