import Link from 'next/link'
import { Project } from '@/src/types/Project'
import { getProjectImage } from '@utils/projectUtils'

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="card project-card h-100 pt-2">
      <Link href={`/projects/${project.slug}`}>
        <img
          src={getProjectImage(project)}
          className="card-img-top img-fluid project-card-image"
          alt={project.name}
        />
      </Link>
      <div className="card-body">
        <h5 className="card-title">
          <Link href={`/projects/${project.slug}`}>{project.name}</Link>
        </h5>
        <p className="card-text">{project.description}</p>
        <p className="card-text">
          <Link href={`/projects/${project.slug}`}>View Project &raquo;</Link>
        </p>
      </div>
    </div>
  )
}

export { ProjectCard }
