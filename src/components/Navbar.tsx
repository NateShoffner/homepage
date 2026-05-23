'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useLayoutEffect, useEffect, MouseEvent } from 'react'
import { useScrollSpy } from '@hooks/useScrollSpy'

type NavItem = { id: string; label: string; route: string; hash: string }
type SocialItem = { id: string; icon: string; url: string }

const NavItems: NavItem[] = [
  { id: 'about', label: 'About', route: '/about', hash: '/#about' },
  { id: 'blog', label: 'Blog', route: '/blog', hash: '/#blog' },
  { id: 'projects', label: 'Projects', route: '/projects', hash: '/#projects' },
  { id: 'contact', label: 'Contact', route: '/contact', hash: '/#contact' },
]

const SocialItems: SocialItem[] = [
  { id: 'twitter', icon: 'fa-twitter', url: 'https://twitter.com/NateShoffner' },
  { id: 'github', icon: 'fa-github', url: 'https://github.com/NateShoffner' },
  { id: 'linkedin', icon: 'fa-linkedin', url: 'https://www.linkedin.com/in/NateShoffner' },
]

function scrollToId(id: string, offset = 80, smooth = true) {
  const el =
    document.getElementById(id) ||
    document.querySelector<HTMLElement>(`[name="${id}"]`)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.pageYOffset - offset
  window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' })
}

export default function Navbar() {
  const pathname = usePathname()
  const onHome = pathname === '/'

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js').catch(() => {})
  }, [])

  useLayoutEffect(() => {
    if (!onHome || !window.location.hash) return
    const id = decodeURIComponent(window.location.hash.slice(1))
    scrollToId(id, 80, true)
  }, [onHome])

  const activeSectionId = useScrollSpy(
    NavItems.map((n) => n.id),
    80
  )

  const isActive = (item: NavItem) => {
    if (onHome) {
      const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : ''
      return (activeSectionId ?? (hash || NavItems[0].id)) === item.id
    }
    return pathname === item.route || pathname.startsWith(`${item.route}/`)
  }

  const handleHomeClick =
    (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      if (!onHome) return
      e.preventDefault()
      if (window.location.hash !== `#${id}`) {
        history.replaceState(null, '', `/#${id}`)
      }
      scrollToId(id, 80, true)
      const el = document.getElementById('navbarSupportedContent')
      if (el?.classList.contains('show')) {
        ;(document.querySelector('.navbar-toggler') as HTMLButtonElement)?.click()
      }
    }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="navbar">
      <NextLink href="/" className="navbar-brand">
        <span className="d-block d-lg-none">Nate Shoffner</span>
        <span className="d-none d-lg-block">
          <div className="circle-border">
            <div className="circle">
              <img
                className="img-fluid rounded-circle img-profile mx-auto"
                src="/assets/images/profile-pic.jpg"
                alt="Nate Shoffner"
              />
            </div>
          </div>
        </span>
      </NextLink>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav">
          {NavItems.map((item) => {
            const active = isActive(item)
            const classes = `nav-link${active ? ' active' : ''}`
            return (
              <li className="nav-item" key={item.id}>
                {onHome ? (
                  <NextLink
                    href={`#${item.id}`}
                    onClick={handleHomeClick(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={classes}
                  >
                    {item.label}
                  </NextLink>
                ) : (
                  <NextLink
                    href={item.hash}
                    aria-current={active ? 'page' : undefined}
                    className={classes}
                  >
                    {item.label}
                  </NextLink>
                )}
              </li>
            )
          })}

          <li className="nav-item">
            <ul className="social-list">
              {SocialItems.map((social) => (
                <li key={social.id}>
                  <a href={social.url} target="_blank" rel="noopener noreferrer">
                    <span className="fa-stack fa-lg">
                      <i className="fa fa-circle fa-stack-2x"></i>
                      <i className={`fa ${social.icon} fa-stack-1x fa-inverse`}></i>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  )
}
