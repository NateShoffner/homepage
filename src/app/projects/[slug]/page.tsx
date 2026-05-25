import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllProjects, getProjectBySlug } from '@/lib/projects'
import { getAllPosts } from '@/lib/blog'
import ProjectInteractive from '@components/ProjectInteractive'
import type { ProjectDownload } from '@/src/types/Project'

interface Params { slug: string }

export async function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}
  return { title: project.name, description: project.description }
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const blogPosts = getAllPosts().filter(
    (p) =>
      p.categories.some((c) => c === 'Projects') &&
      p.tags.some((t) => t.toLowerCase() === project.name.toLowerCase())
  )

  const formattedDate = project.updated
    ? new Date(project.updated).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null

  const openSourceLabel =
    project.open_source === 'Yes' ? 'Open Source' :
    project.open_source === 'No' ? 'Proprietary' :
    null

  const infoItems = [
    project.version && project.version !== 'N/A' && { icon: 'fa-tag', label: 'Version', value: `v${project.version}` },
    formattedDate && { icon: 'fa-calendar', label: 'Updated', value: formattedDate },
    project.platforms?.length && { icon: 'fa-desktop', label: 'Platform', value: project.platforms.join(', ') },
    openSourceLabel && { icon: 'fa-code', label: 'Source', value: openSourceLabel },
    project.license && project.license !== 'N/A' && { icon: 'fa-file-text-o', label: 'License', value: project.license },
  ].filter(Boolean) as { icon: string; label: string; value: string }[]

  return (
    <section className="page-section p-4 p-lg-5 d-flex flex-column">
      <div className="project">

        {/* ── Header ── */}
        <div className="project-header mb-4">
          <div className="project-logo-wrap">
            <img
              src={`/assets/images/projects/${project.slug}/${project.logo}`}
              className="project-logo"
              alt={project.name}
            />
          </div>
          <div className="project-header-body">
            <h1 className="mb-2">{project.name}</h1>
            <p className="lead mb-3">{project.description}</p>
            <div className="project-header-actions">
              {project.homepage && (
                <a href={project.homepage} className="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
                  <i className="fa fa-external-link" /> Visit Website
                </a>
              )}
              {project.open_source === 'Yes' && (
                <a href={`https://github.com/NateShoffner/${project.slug}`} className="btn btn-outline-secondary btn-sm" target="_blank" rel="noopener noreferrer">
                  <i className="fa fa-github" /> View Source
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Info strip ── */}
        {infoItems.length > 0 && (
          <div className="project-info-strip mb-4">
            {infoItems.map((item) => (
              <div key={item.label} className="project-info-item">
                <span className="project-info-label">
                  <i className={`fa ${item.icon}`} /> {item.label}
                </span>
                <span className="project-info-value">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        <ProjectInteractive project={project} />

        {project.downloads && project.downloads.length > 0 && (
          <div className="project-section">
            <h3 className="subheading mb-3">Downloads</h3>
            <div className="project-download-list">
              {project.downloads.map((download: ProjectDownload, index: number) => (
                <div key={index} className="project-download-item">
                  <div>
                    <div className="project-download-name">{download.name}</div>
                    {download.description && (
                      <div className="project-download-desc">{download.description}</div>
                    )}
                  </div>
                  <a href={download.url} className="btn btn-primary btn-sm">
                    <i className="fa fa-download" /> Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {blogPosts.length > 0 && (
          <div className="project-section">
            <h3 className="subheading mb-3">Related Posts</h3>
            <ul className="list-unstyled project-post-list">
              {blogPosts.slice(0, 4).map((post, index) => (
                <li key={index} className="project-post-item">
                  <a href={post.url}>{post.title}</a>
                  {post.date && (
                    <span className="project-post-date">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </section>
  )
}
