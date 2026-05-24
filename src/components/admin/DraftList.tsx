'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import type { DraftFile } from '@/src/types/admin'

interface Props {
  drafts: DraftFile[]
}

export default function DraftList({ drafts: initialDrafts }: Props) {
  const [drafts, setDrafts] = useState(initialDrafts)
  const router = useRouter()

  async function handleDelete(filepath: string) {
    if (!confirm(`Delete "${filepath}"?`)) return
    await axios.delete(`/api/admin/drafts/${filepath}`)
    setDrafts((prev) => prev.filter((d) => d.filepath !== filepath))
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Drafts</h2>
        <Link href="/admin/drafts/new" className="btn btn-sm btn-primary">
          + New Draft
        </Link>
      </div>
      {drafts.length === 0 ? (
        <p className="text-muted">No drafts yet.</p>
      ) : (
        <ul className="list-group">
          {drafts.map((draft) => (
            <li key={draft.filepath} className="list-group-item d-flex justify-content-between align-items-start">
              <div>
                <div className="fw-semibold">{draft.title || draft.filepath}</div>
                <div className="small text-muted">
                  {draft.filepath}
                  {draft.date && ` • ${draft.date.slice(0, 10)}`}
                </div>
                {draft.description && (
                  <div className="small text-secondary text-truncate" style={{ maxWidth: 400 }}>
                    {draft.description}
                  </div>
                )}
              </div>
              <div className="d-flex flex-shrink-0 ms-3" style={{ gap: '0.75rem' }}>
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
    </div>
  )
}
