'use client'

import { useEffect, useMemo, useState } from 'react'
import readingTime from 'reading-time'
import PostBody from '@components/PostBody'
import ShareButtons from '@components/ShareButtons'
import { ProjectPostEmbed } from '@components/ProjectPostEmbed'
import type { DraftFrontmatter } from '@/src/types/admin'
import type { Project } from '@/src/types/Project'

interface Props {
  frontmatter: DraftFrontmatter
  content: string
}

// A bare YYYY-MM-DD parses as UTC midnight, which renders a day early west of
// Greenwich. Published posts carry a time and offset, so treat a date-only
// value as local midnight to match what the live page shows.
function parsePostDate(value: string): Date {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value)
}

function formatDate(value: string): string {
  const d = parsePostDate(value)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function PreviewPanel({ frontmatter, content }: Props) {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/projects')
      .then((res) => (res.ok ? res.json() : { projects: [] }))
      .then((data) => {
        if (!cancelled) setProjects(data.projects ?? [])
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // Same rule as the live post page: a post filed under Projects embeds any
  // project whose name matches one of its tags.
  const projectEmbeds = useMemo(() => {
    if (!frontmatter.categories?.includes('Projects')) return []
    return (frontmatter.tags ?? [])
      .map((tag) => projects.find((p) => p.name.toLowerCase() === tag.toLowerCase()))
      .filter((p): p is Project => !!p)
  }, [frontmatter.categories, frontmatter.tags, projects])

  // Identical call to lib/blog.ts, so the figure matches the published post.
  const readTime = useMemo(() => (content ? readingTime(content).text : ''), [content])

  return (
    <div
      className="admin-preview-panel"
      style={{ position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}
    >
      {/* Mirrors src/app/blog/[year]/[month]/[slug]/page.tsx + BlogPostInteractive */}
      <section className="page-section p-4 p-lg-5 d-flex flex-column">
        <div className="blog-post">
          <div className="post-title">
            <h2>{frontmatter.title}</h2>

            <div className="post-meta list-card-tags mb-3">
              <span className="badge">
                <i className="fa fa-calendar" /> {frontmatter.date ? formatDate(frontmatter.date) : ''}
              </span>
              {readTime && (
                <span className="badge">
                  <i className="fa fa-clock-o" /> {readTime}
                </span>
              )}
              {frontmatter.lastUpdated && (
                <span className="badge">
                  <i className="fa fa-pencil" /> Updated {formatDate(frontmatter.lastUpdated)}
                </span>
              )}
              {/* Static stand-in. A draft has no canonical URL, so querying
                  Disqus would register a thread for a page that does not exist. */}
              <span className="badge">
                <i className="fa fa-comments" /> 0 Comments
              </span>
              {frontmatter.categories?.map((category) => (
                <a
                  key={category}
                  href={`/blog/category/${encodeURIComponent(category)}/`}
                  className="badge"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa fa-folder" /> {category}
                </a>
              ))}
            </div>

            <PostBody body={content} />

            {projectEmbeds.map((project, idx) => (
              <ProjectPostEmbed key={idx} project={project} />
            ))}

            <div className="row mb-3">
              <div className="col-12 col-sm-6">
                <div className="post-tags list-card-tags">
                  <i className="fa fa-tag" />
                  {frontmatter.tags?.length > 0 ? (
                    frontmatter.tags.map((tag) => (
                      <a
                        key={tag}
                        href={`/blog/tag/${encodeURIComponent(tag)}`}
                        className="badge"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {tag}
                      </a>
                    ))
                  ) : (
                    <span>None</span>
                  )}
                </div>
                <ShareButtons title={frontmatter.title} />
              </div>
            </div>

            {/* Placeholders for the two sections that only exist once the post
                is published, kept so the spacing and rules match the live page. */}
            <div className="row post-nav pb-3 pt-3">
              <div className="col-12 col-sm-6">
                <small className="text-muted">Previous and next posts appear once published</small>
              </div>
            </div>

            <div className="disqus-embed">
              <small className="text-muted">Comments load on the published post</small>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
