import { workSectionEnabled } from '@/src/config'

export type SiteSection = {
  id: string
  label: string
  route: string
  hash: string
}

// In document order. The sidebar nav, the scroll spy and the section pager all
// read this, so the order and the enabled set live in one place.
export const siteSections: SiteSection[] = [
  { id: 'about', label: 'About', route: '/about', hash: '/#about' },
  { id: 'blog', label: 'Blog', route: '/blog', hash: '/#blog' },
  { id: 'projects', label: 'Projects', route: '/projects', hash: '/#projects' },
  { id: 'work', label: 'Work', route: '/work', hash: '/#work' },
  { id: 'contact', label: 'Contact', route: '/contact', hash: '/#contact' },
].filter((item) => item.id !== 'work' || workSectionEnabled)

export function scrollToSection(id: string, smooth = true) {
  const el =
    document.getElementById(id) ||
    document.querySelector<HTMLElement>(`[name="${id}"]`)
  if (!el) return
  // Desktop has a fixed left sidebar (no top bar), so only a small offset is needed.
  // Mobile has a fixed top navbar (~56px), so clear it with a bit of breathing room.
  const offset = window.innerWidth >= 992 ? 0 : 60
  const y = el.getBoundingClientRect().top + window.pageYOffset - offset
  window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' })
}
