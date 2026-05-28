'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollToHash() {
  const pathname = usePathname()

  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    const timer = setTimeout(() => {
      const el = document.getElementById(id)
      if (!el) return
      const navbarHeight = window.innerWidth < 992 ? 70 : 0
      const y = el.getBoundingClientRect().top + window.pageYOffset - navbarHeight
      window.scrollTo({ top: y, behavior: 'smooth' })
    }, 50)
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
