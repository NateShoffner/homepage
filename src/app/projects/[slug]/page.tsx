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

  const domain = project.homepage
    ? new URL(project.homepage).hostname.replace('www.', '')
    : null

  const formattedDate = project.updated
    ? new Date(project.updated).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null

  const openSourceLabel =
    project.open_source === 'Yes' ? 'Open Source' :
    project.open_source === 'No' ? 'Proprietary' :
    null

  return (
    <section className="page-section p-4 p-lg-5 d-flex flex-column">
      <div className="project">

        <div className="d-flex align-items-start gap-3 mb-3">
          <img
            src={`/assets/images/projects/${project.slug}/${project.logo}`}
            className="project-logo"
            alt={project.name}
          />
          <div>
            <h1 className="mb-2">{project.name}</h1>
            <div className="list-card-tags">
              {project.version && project.version !== 'N/A' && (
                <span className="badge"><i className="fa fa-tag" /> v{project.version}</span>
              )}
              {formattedDate && (
                <span className="badge"><i className="fa fa-calendar" /> {formattedDate}</span>
              )}
              {project.platforms && project.platforms.map((p) => (
                <span key={p} className="badge">{p}</span>
              ))}
              {project.license && project.license !== 'N/A' && (
                <span className="badge"><i className="fa fa-file-text-o" /> {project.license}</span>
              )}
              {openSourceLabel && (
                <span className="badge"><i className="fa fa-code" /> {openSourceLabel}</span>
              )}
              {domain && (
                <a href={project.homepage} className="badge" target="_blank" rel="noopener noreferrer">
                  <i className="fa fa-external-link" /> {domain}
                </a>
              )}
            </div>
          </div>
        </div>

        <p className="lead mb-4">{project.description}</p>

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
