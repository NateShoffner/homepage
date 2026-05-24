'use client'

import Link from 'next/link'
import SaveStatusIndicator from './SaveStatusIndicator'

function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', next)
  document.documentElement.setAttribute('data-theme', next)
}

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error'

interface Props {
  saveStatus: SaveStatus
  lastSavedAt: Date | null
  onPublish: () => void
  publishError: string | null
  showPublish?: boolean
}

export default function EditorToolbar({
  saveStatus,
  lastSavedAt,
  onPublish,
  publishError,
  showPublish = true,
}: Props) {
  return (
    <div
      className="d-flex align-items-center py-2 px-3 border-bottom mb-3 admin-toolbar"
      style={{ gap: '0.75rem' }}
    >
      <Link href="/admin" className="btn btn-sm btn-outline-secondary">
        ← Admin
      </Link>
      <Link href="/" className="btn btn-sm btn-outline-secondary">
        ← Site
      </Link>
      <SaveStatusIndicator status={saveStatus} lastSavedAt={lastSavedAt} />
      <div className="ml-auto d-flex align-items-center" style={{ gap: '0.5rem' }}>
        {publishError && <span className="text-danger small">{publishError}</span>}
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
        >
          <i className="fa fa-moon-o theme-icon-for-light" />
          <i className="fa fa-sun-o theme-icon-for-dark" />
        </button>
        {showPublish && (
          <button className="btn btn-sm btn-success" onClick={onPublish}>
            Publish
          </button>
        )}
      </div>
    </div>
  )
}
