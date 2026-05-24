'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import type { DraftFile } from '@/src/types/admin'

interface Props {
  drafts: DraftFile[]
  posts: DraftFile[]
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return String(dateStr).slice(0, 10)
}

function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', next)
  document.documentElement.setAttribute('data-theme', next)
}

export default function AdminDashboard({ drafts: initialDrafts, posts }: Props) {
  const [drafts, setDrafts] = useState(initialDrafts)
  const [query, setQuery] = useState('')
  const router = useRouter()

  function matches(item: DraftFile) {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.filepath.toLowerCase().includes(q)
    )
  }

  async function handleDelete(filepath: string) {
    if (!confirm(`Delete draft "${filepath}"?`)) return
    await axios.delete(`/api/admin/drafts/${filepath}`)
    setDrafts((prev) => prev.filter((d) => d.filepath !== filepath))
  }

  const filteredDrafts = drafts.filter(matches)
  const filteredPosts = posts.filter(matches)

  return (
    <div>
      <div className="d-flex align-items-center mb-4" style={{ gap: '0.75rem' }}>
        <h2 className="mb-0">Admin</h2>
        <div className="ml-auto d-flex align-items-center" style={{ gap: '0.5rem' }}>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            <i className="fa fa-moon-o theme-icon-for-light" />
            <i className="fa fa-sun-o theme-icon-for-dark" />
          </button>
          <Link href="/" className="btn btn-sm btn-outline-secondary">
            ← Site
          </Link>
          <Link href="/admin/drafts/new" className="btn btn-sm btn-primary">
            + New Draft
          </Link>
        </div>
      </div>

      <input
        type="search"
        className="form-control mb-4"
        placeholder="Search by title, description, or slug…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      <section className="mb-5">
        <h5 className="mb-3">Drafts</h5>
        {filteredDrafts.length === 0 ? (
          <p className="text-muted small">{query ? 'No drafts match your search.' : 'No drafts yet.'}</p>
        ) : (
          <ul className="list-group">
            {filteredDrafts.map((draft) => (
              <li
                key={draft.filepath}
                className="list-group-item d-flex justify-content-between align-items-start"
              >
                <div style={{ minWidth: 0 }}>
                  <div className="font-weight-bold">{draft.title || draft.filepath}</div>
                  <div className="small text-muted">
                    {draft.filepath}
                    {draft.date && ` • ${formatDate(draft.date)}`}
                  </div>
                  {draft.description && (
                    <div className="small text-secondary text-truncate" style={{ maxWidth: 480 }}>
                      {draft.description}
                    </div>
                  )}
                </div>
                <div className="d-flex flex-shrink-0 ml-3" style={{ gap: '0.5rem' }}>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => router.push(`/admin/drafts/${draft.filepath}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(draft.filepath)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h5 className="mb-3">Published</h5>
        {filteredPosts.length === 0 ? (
          <p className="text-muted small">{query ? 'No posts match your search.' : 'No published posts.'}</p>
        ) : (
          <ul className="list-group">
            {filteredPosts.map((post) => (
              <li
                key={post.filepath}
                className="list-group-item d-flex justify-content-between align-items-start"
              >
                <div style={{ minWidth: 0 }}>
                  <div className="font-weight-bold">{post.title || post.filepath}</div>
                  <div className="small text-muted">
                    {post.filepath}
                    {post.date && ` • ${formatDate(post.date)}`}
                  </div>
                  {post.description && (
                    <div className="small text-secondary text-truncate" style={{ maxWidth: 480 }}>
                      {post.description}
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-shrink-0">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => router.push(`/admin/posts/${post.filepath}`)}
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
