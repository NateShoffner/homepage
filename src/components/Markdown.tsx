'use client'

import ReactMarkdown from 'react-markdown'
import useFancybox from '@hooks/useFancybox'

type Props = {
  children: string
  imageBasePath?: string
  fileBasePath?: string
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
  const resolvedSrc =
    src && imageBasePath && !src.startsWith('/') && !src.startsWith('http')
      ? `${imageBasePath}${src}`
      : src

  return (
    <a href={resolvedSrc} data-fancybox="gallery">
      <img
        src={resolvedSrc}
        className="img-fluid post-image"
        alt={alt || ''}
        title={title || ''}
      />
    </a>
  )
}

function resolveHref(href: string | undefined, fileBasePath: string | undefined): string | undefined {
  if (!href || !fileBasePath || href.startsWith('/') || href.startsWith('http') || href.startsWith('#'))
    return href
  if (/\.[a-zA-Z0-9]+$/.test(href))
    return `${fileBasePath}${href}`
  return href
}

export default function Markdown({ children, imageBasePath, fileBasePath }: Props) {
  const [fancyboxRef] = useFancybox()

  return (
    <div ref={fancyboxRef}>
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
          a: ({ href, children }) => (
            <a href={resolveHref(href, fileBasePath)}>{children}</a>
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
    </div>
  )
}
