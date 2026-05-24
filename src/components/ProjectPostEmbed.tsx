import Link from 'next/link'
import { Project } from '@/src/types/Project'
function ProjectPostEmbed({ project }: { project: Project }) {
  const image = project.logo
    ? `/assets/images/projects/${project.slug}/${project.logo}`
    : project.images?.[0]?.filename
    ? `/assets/images/projects/${project.slug}/${project.images[0].filename}`
    : ''

  return (
    <div className="media blog-project-embed mt-3 mb-3 p-3">
      <img
        className="align-self-center mr-3 ml-3 img-fluid"
        src={image}
        alt={project.name}
      />
      <div className="media-body">
        <h5 className="mt-0">{project.name}</h5>
        <p>{project.description}</p>
        <p className="mb-0">
          <Link href={`/projects/${project.slug}`}>
            More Info <i className="fa fa-arrow-right"></i>
          </Link>
        </p>
      </div>
    </div>
  )
}

export { ProjectPostEmbed }
