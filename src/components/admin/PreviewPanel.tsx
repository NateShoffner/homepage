'use client'

import Markdown from '@components/Markdown'
import type { DraftFrontmatter } from '@/src/types/admin'

interface Props {
  frontmatter: DraftFrontmatter
  content: string
}

export default function PreviewPanel({ frontmatter, content }: Props) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div
      className="admin-preview-panel"
      style={{ position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}
    >
      <div className="blog-post p-3">
        <div className="post-title">
          {frontmatter.title && <h2>{frontmatter.title}</h2>}
          <ul className="post-meta">
            {frontmatter.date && (
              <li className="post-meta-item">
                <i className="fa fa-calendar" /> {formatDate(frontmatter.date)}
              </li>
            )}
            {frontmatter.lastUpdated && (
              <li className="post-meta-item">
                <i className="fa fa-pencil" /> Updated {formatDate(frontmatter.lastUpdated)}
              </li>
            )}
            {frontmatter.categories?.length > 0 && (
              <li className="post-meta-item">
                <i className="fa fa-folder" />{' '}
                {frontmatter.categories.join(', ')}
              </li>
            )}
          </ul>
        </div>

        <div className="post-content">
          <Markdown imageBasePath="/assets/images/posts/" fileBasePath="/assets/files/">
            {content}
          </Markdown>
        </div>

        {frontmatter.tags?.length > 0 && (
          <div className="post-tags">
            <i className="fa fa-tag" /> Tags:{' '}
            {frontmatter.tags.map((t, i) => (
              <span key={t}>
                <span className="text-primary">{t}</span>
                {i < frontmatter.tags.length - 1 && <span className="me-1">,</span>}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
