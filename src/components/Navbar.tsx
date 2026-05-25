'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useLayoutEffect, useState, MouseEvent } from 'react'
import { useScrollSpy } from '@hooks/useScrollSpy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import NavCircuitTraces from '@components/NavCircuitTraces'

type NavItem = { id: string; label: string; route: string; hash: string }
type SocialItem = { id: string; icon: IconDefinition; url: string }

const NavItems: NavItem[] = [
  { id: 'about', label: 'About', route: '/about', hash: '/#about' },
  { id: 'blog', label: 'Blog', route: '/blog', hash: '/#blog' },
  { id: 'projects', label: 'Projects', route: '/projects', hash: '/#projects' },
  { id: 'contact', label: 'Contact', route: '/contact', hash: '/#contact' },
]

const SocialItems: SocialItem[] = [
  { id: 'x', icon: faXTwitter, url: 'https://x.com/NateShoffner' },
  { id: 'github', icon: faGithub, url: 'https://github.com/NateShoffner' },
  { id: 'linkedin', icon: faLinkedinIn, url: 'https://www.linkedin.com/in/NateShoffner' },
]

function scrollToId(id: string, smooth = true) {
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

export default function Navbar() {
  const pathname = usePathname()
  const onHome = pathname === '/'
  const [navOpen, setNavOpen] = useState(false)

  const toggleTheme = () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  useLayoutEffect(() => {
    if (!onHome || !window.location.hash) return
    const id = decodeURIComponent(window.location.hash.slice(1))
    scrollToId(id)
  }, [onHome])

  const activeSectionId = useScrollSpy(
    NavItems.map((n) => n.id),
    100
  )

  const isActive = (item: NavItem) => {
    if (onHome) {
      return (activeSectionId ?? NavItems[0].id) === item.id
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
      scrollToId(id)
      setNavOpen(false)
    }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="navbar">
      <NavCircuitTraces />
      <NextLink href="/" className="navbar-brand">
        <span className="d-block d-lg-none navbar-brand-text">Nate Shoffner</span>
        <span className="d-none d-lg-block">
          <div className="circle-border">
            <div className="circle">
              <img
                className="img-fluid rounded-circle img-profile mx-auto"
                src="/assets/images/profile-pic.jpg"
                alt="Nate Shoffner"
              />
            </div>
            <svg className="profile-circuit" viewBox="0 0 200 200" fill="none" aria-hidden="true">
              {/* TL — exits left then up toward sidebar left edge */}
              <polyline className="pc-trace pc-trace-1" points="31,60 -15,60 -15,30" />
              <circle className="pc-node" cx="-15" cy="30" r="2" />
              {/* TR — exits right toward sidebar right edge */}
              <polyline className="pc-trace pc-trace-2" points="140,31 218,31" />
              <circle className="pc-node" cx="218" cy="31" r="2" />
              {/* BL — exits left toward sidebar left edge */}
              <polyline className="pc-trace pc-trace-3" points="31,140 -18,140" />
              <circle className="pc-node" cx="-18" cy="140" r="2" />
              {/* BR — exits right then down toward sidebar right edge */}
              <polyline className="pc-trace pc-trace-4" points="169,140 210,140 210,165" />
              <circle className="pc-node" cx="210" cy="165" r="2" />
            </svg>
          </div>
        </span>
      </NextLink>

      <button
        className="navbar-toggler"
        type="button"
        aria-controls="navbarSupportedContent"
        aria-expanded={navOpen}
        aria-label="Toggle navigation"
        onClick={() => setNavOpen(o => !o)}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`collapse navbar-collapse${navOpen ? ' show' : ''}`} id="navbarSupportedContent">
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
                    <FontAwesomeIcon icon={social.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>

        <div className="theme-toggle-mobile d-lg-none">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
            <i className="fa fa-moon-o theme-icon-for-light" />
            <i className="fa fa-sun-o theme-icon-for-dark" />
            <span className="theme-toggle-label">
              <span className="theme-icon-for-light">Dark mode</span>
              <span className="theme-icon-for-dark">Light mode</span>
            </span>
          </button>
        </div>
      </div>

      <div className="theme-toggle-wrapper d-none d-lg-flex">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
          <i className="fa fa-moon-o theme-icon-for-light" />
          <i className="fa fa-sun-o theme-icon-for-dark" />
        </button>
      </div>
    </nav>
  )
}
