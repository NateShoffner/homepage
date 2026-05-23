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
    : 'N/A'

  return (
    <section className="page-section p-4 p-lg-5 d-flex flex-column">
      <div className="my-auto">
        <div className="project">
          <div className="row">
            <div className="col-12 col-sm-2 col-md-1 my-auto">
              <img
                src={`/assets/images/projects/${project.slug}/${project.logo}`}
                className="img-fluid mx-auto d-block project-logo"
                alt={project.name}
              />
            </div>
            <div className="col-12 col-sm-10 col-md-11 mt-3">
              <h1>{project.name}</h1>
            </div>
          </div>
          <p>{project.description}</p>

          <ProjectInteractive project={project} />

          <div className="row">
            <div className="col-12 col-md-6">
              <table className="table table-sm table-striped project-table">
                <thead><tr><th colSpan={2}>Details</th></tr></thead>
                <tbody>
                  <tr><td><i className="fa fa-history"></i> Version:</td><td>{project.version}</td></tr>
                  <tr>
                    <td><i className="fa fa-calendar"></i> Updated:</td>
                    <td>
                      {project.updated
                        ? new Date(project.updated).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric',
                          })
                        : ''}
                    </td>
                  </tr>
                  <tr><td><i className="fa fa-desktop"></i> Platform(s):</td><td>{project.platforms?.join(', ')}</td></tr>
                  <tr>
                    <td><i className="fa fa-home"></i> Homepage:</td>
                    <td><a href={project.homepage} target="_blank" rel="noopener noreferrer">{domain}</a></td>
                  </tr>
                  <tr><td><i className="fa fa-code"></i> Open Source:</td><td>{project.open_source}</td></tr>
                  <tr><td><i className="fa fa-file"></i> License:</td><td>{project.license}</td></tr>
                </tbody>
              </table>
            </div>

            {project.downloads && (
              <div className="col-12 col-md-6">
                <table className="table table-sm table-striped project-table">
                  <thead><tr><th colSpan={2}>Downloads</th></tr></thead>
                  <tbody>
                    {project.downloads.map((download: ProjectDownload, index: number) => (
                      <tr key={index}>
                        <td>
                          <i className="fa fa-download"></i> {download.name}<br />
                          <span className="project-description">{download.description}</span>
                        </td>
                        <td className="download">
                          <a href={download.url} role="button" className="btn btn-primary btn-block btn-download">
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="row">
            <div className="col-12 col-md-6">
              <table className="table table-sm table-striped project-table">
                <thead><tr><th colSpan={2}>Latest Blog Posts About {project.name}</th></tr></thead>
                <tbody>
                  {blogPosts.length > 0 ? (
                    blogPosts.slice(0, 4).map((post, index) => (
                      <tr key={index}>
                        <td><a href={post.url}>{post.title}</a></td>
                        <td>
                          <i className="fa fa-calendar"></i>{' '}
                          {post.date
                            ? new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric',
                              })
                            : ''}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={2}>No blog posts available. :(</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
