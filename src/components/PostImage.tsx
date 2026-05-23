'use client'

import useFancybox from '@hooks/useFancybox'

type Props = {
  filename: string
  alt?: string
  title?: string
  className?: string
}

export default function PostImage({ filename, alt = '', title = '', className }: Props) {
  const imageUrl = `/assets/images/posts/${filename}`
  const [fancyboxRef] = useFancybox()

  return (
    <div ref={fancyboxRef}>
      <a href={imageUrl} className="fancybox" data-fancybox="post-image">
        <img
          src={imageUrl}
          className={`img-fluid post-image${className ? ` ${className}` : ''}`}
          alt={alt}
          title={title}
        />
      </a>
    </div>
  )
}
