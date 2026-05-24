'use client'

import ReactMarkdown from 'react-markdown'
import useFancybox from '@hooks/useFancybox'

type Props = {
  children: string
  imageBasePath?: string
}

function BlogImage({
  src,
  alt,
  title,
  imageBasePath,
}: {
  src?: string
  alt?: string
  title?: string
  imageBasePath?: string
}) {
  const [fancyboxRef] = useFancybox()
  const resolvedSrc =
    src && imageBasePath && !src.startsWith('/') && !src.startsWith('http')
      ? `${imageBasePath}${src}`
      : src

  return (
    <div ref={fancyboxRef}>
      <a href={resolvedSrc} data-fancybox="gallery">
        <img
          src={resolvedSrc}
          className="img-fluid post-image"
          alt={alt || ''}
          title={title || ''}
        />
      </a>
    </div>
  )
}

export default function Markdown({ children, imageBasePath }: Props) {
  return (
    <ReactMarkdown
      components={{
        img: ({ src, alt, title }) => (
          <BlogImage
            src={src as string | undefined}
            alt={alt}
            title={title}
            imageBasePath={imageBasePath}
          />
        ),
        p: ({ children, node }) => {
          const onlyImage =
            node?.children?.length === 1 &&
            node.children[0].type === 'element' &&
            (node.children[0] as any).tagName === 'img'
          if (onlyImage) return <>{children}</>
          return <p>{children}</p>
        },
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
