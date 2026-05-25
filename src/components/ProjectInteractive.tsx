'use client'

import ShareButtons from '@components/ShareButtons'
import ProjectImagesGallery from '@components/ProjectImagesGallery'
import type { Project } from '@/src/types/Project'

interface Props {
  project: Project
}

export default function ProjectInteractive({ project }: Props) {
  return (
    <div>
      {project.images && project.images.length > 0 && (
        <div className="project-section">
          <h3 className="subheading mb-3">Screenshots</h3>
          <ProjectImagesGallery slug={project.slug} images={project.images} />
        </div>
      )}
      <div className="project-section">
        <ShareButtons title={project.name} />
      </div>
    </div>
  )
}
