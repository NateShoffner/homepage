'use client'

import ShareButtons from '@components/ShareButtons'
import ProjectImagesGallery from '@components/ProjectImagesGallery'
import type { Project } from '@/src/types/Project'

interface Props {
  project: Project
}

export default function ProjectInteractive({ project }: Props) {
  return (
    <>
      {project.images && project.images.length > 0 && (
        <ProjectImagesGallery slug={project.slug} images={project.images} />
      )}
      <ShareButtons title={project.name} />
    </>
  )
}
