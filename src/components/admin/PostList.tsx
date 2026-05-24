'use client'

import { useRouter } from 'next/navigation'
import type { DraftFile } from '@/src/types/admin'

interface Props {
  posts: DraftFile[]
}

export default function PostList({ posts }: Props) {
  const router = useRouter()

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Published Posts</h2>
      </div>
      {posts.length === 0 ? (
        <p className="text-muted">No published posts.</p>
      ) : (
        <ul className="list-group">
          {posts.map((post) => (
            <li key={post.filepath} className="list-group-item d-flex justify-content-between align-items-start">
              <div>
                <div className="fw-semibold">{post.title || post.filepath}</div>
                <div className="small text-muted">
                  {post.filepath}
                  {post.date && ` • ${String(post.date).slice(0, 10)}`}
                </div>
                {post.description && (
                  <div className="small text-secondary text-truncate" style={{ maxWidth: 400 }}>
                    {post.description}
                  </div>
                )}
              </div>
              <div className="ms-3 flex-shrink-0" style={{ gap: '0.75rem' }}>
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
    </div>
  )
}
