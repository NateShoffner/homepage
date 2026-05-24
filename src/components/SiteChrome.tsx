'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@components/Navbar'
import Footer from '@components/Footer'

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  return (
    <>
      {!isAdmin && <Navbar />}
      <div className={isAdmin ? undefined : 'my-auto'}>{children}</div>
      {!isAdmin && <Footer />}
    </>
  )
}
