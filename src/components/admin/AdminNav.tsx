'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminNav() {
  const pathname = usePathname()
  return (
    <ul className="nav nav-tabs mb-4">
      <li className="nav-item">
        <Link
          href="/admin/drafts"
          className={`nav-link ${pathname.startsWith('/admin/drafts') ? 'active' : ''}`}
        >
          Drafts
        </Link>
      </li>
      <li className="nav-item">
        <Link
          href="/admin/posts"
          className={`nav-link ${pathname.startsWith('/admin/posts') ? 'active' : ''}`}
        >
          Published
        </Link>
      </li>
    </ul>
  )
}
