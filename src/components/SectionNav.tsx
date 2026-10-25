'use client'

import { useEffect, useState } from 'react'
import { useScrollSpy } from '@hooks/useScrollSpy'
import { siteSections, scrollToSection, type SiteSection } from '@/src/lib/sections'

interface SectionNavProps {
  /** Gated on the cover's reveal so the pager fades in with it. */
  revealed?: boolean
}

/** Prev/next section pager, stacked as one control in the bottom corner. */
export default function SectionNav({ revealed = true }: SectionNavProps) {
  const ids = siteSections.map((s) => s.id)
  const activeId = useScrollSpy(ids, 100)
  const [atTop, setAtTop] = useState(true)
  const [pending, setPending] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY <= 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // A smooth scroll outlasts the click, and the spy reports where the reader is
  // rather than where they are headed, so page from the requested section until
  // the spy catches up. The timeout covers a scroll that never arrives.
  useEffect(() => {
    if (!pending) return
    if (activeId === pending) {
      setPending(null)
      return
    }
    const timer = setTimeout(() => setPending(null), 1200)
    return () => clearTimeout(timer)
  }, [pending, activeId])

  const index = Math.max(0, ids.indexOf(pending ?? activeId ?? ids[0]))
  const prev = index > 0 ? siteSections[index - 1] : null
  const next = index < siteSections.length - 1 ? siteSections[index + 1] : null

  const go = (section: SiteSection | null) => {
    if (!section) return
    setPending(section.id)
    scrollToSection(section.id)
  }

  return (
    <nav
      className={`section-nav${revealed ? ' is-revealed' : ''}`}
      aria-label="Section"
    >
      <button
        type="button"
        className="section-nav-btn"
        onClick={() => go(prev)}
        disabled={!prev}
        aria-label={prev ? `Previous section: ${prev.label}` : 'Previous section'}
      >
        <span className="section-nav-arrow section-nav-arrow-up" aria-hidden="true" />
      </button>
      <button
        type="button"
        className={`section-nav-btn${atTop && next ? ' is-inviting' : ''}`}
        onClick={() => go(next)}
        disabled={!next}
        aria-label={next ? `Next section: ${next.label}` : 'Next section'}
      >
        <span className="section-nav-arrow section-nav-arrow-down" aria-hidden="true" />
      </button>
    </nav>
  )
}
