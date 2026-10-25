import Link from 'next/link'
import { ListCardDate } from '@components/ListCardDate'
import { Project } from '@/src/types/Project'

function ProjectCard({ project }: { project: Project }) {
  const image = project.logo
    ? `/assets/images/projects/${project.slug}/${project.logo}`
    : project.images?.[0]?.filename
    ? `/assets/images/projects/${project.slug}/${project.images[0].filename}`
    : null

  return (
    <Link href={`/projects/${project.slug}`} className="list-card">
      {image && (
        <div className="list-card-thumbnail contain">
          <img src={image} alt={project.name} />
        </div>
      )}
      <div className="list-card-body">
        <div className="list-card-header">
          <span className="list-card-title">{project.name}</span>
        </div>
        <p className="list-card-excerpt">{project.description}</p>
        <div className="list-card-footer">
          {project.platforms && project.platforms.length > 0 && (
            <div className="list-card-tags">
              {project.platforms.map((p) => (
                <span key={p} className="badge">{p}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      <ListCardDate date={project.updated} />
    </Link>
  )
}

export { ProjectCard }
