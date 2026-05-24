'use client'

import ShareButtons from '@components/ShareButtons'
import ProjectImagesGallery from '@components/ProjectImagesGallery'
import type { Project } from '@/src/types/Project'

interface Props {
  project: Project
}

export default function ProjectInteractive({ project }: Props) {
  return (
    <div className="mb-4">
      {project.images && project.images.length > 0 && (
        <div className="mb-3">
          <ProjectImagesGallery slug={project.slug} images={project.images} />
        </div>
      )}
      <ShareButtons title={project.name} />
    </div>
  )
}
