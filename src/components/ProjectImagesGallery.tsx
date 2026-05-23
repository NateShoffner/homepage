'use client'

import useFancybox from '@hooks/useFancybox'
import type { ProjectImage } from '@/src/types/Project'

interface Props {
  slug: string
  images: ProjectImage[]
}

export default function ProjectImagesGallery({ slug, images }: Props) {
  const [fancyboxRef] = useFancybox()

  return (
    <div className="project-images-container" ref={fancyboxRef}>
      {images.map((image, index) => (
        <a
          key={index}
          href={`/assets/images/projects/${slug}/${image.filename}`}
          className="fancybox"
          data-fancybox="screenshots"
        >
          <img
            src={`/assets/images/projects/${slug}/${image.filename}`}
            className="img-fluid project-image"
            alt={image.caption || `Screenshot ${index + 1}`}
          />
        </a>
      ))}
    </div>
  )
}
