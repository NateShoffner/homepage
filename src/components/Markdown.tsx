'use client'

import ReactMarkdown from 'react-markdown'
import remarkDirective from 'remark-directive'
import { visit, SKIP } from 'unist-util-visit'
import AmazonLink from '@components/AmazonLink'
import PostImage from './PostImage'
import PostImages from './PostImages'

function remarkShortcode({
  regex,
  nodeType,
  propNames,
}: {
  regex: RegExp
  nodeType: string
  propNames: string[]
}) {
  return () => (tree: any) => {
    visit(tree, 'text', (node: any, index: number | undefined, parent: any) => {
      if (index === undefined) return
      const value: string = node.value
      if (!regex.test(value)) return

      const parts: any[] = []
      let lastIndex = 0
      regex.lastIndex = 0
      value.replace(regex, (match, ...args) => {
        const offset = args[args.length - 2]
        if (offset > lastIndex)
          parts.push({ type: 'text', value: value.slice(lastIndex, offset) })
        const props: Record<string, string> = {}
        propNames.forEach((name, i) => {
          props[name] = args[i]
        })
        parts.push({
          type: nodeType,
          data: { hName: nodeType, hProperties: props },
        })
        lastIndex = offset + match.length
        return match
      })
      if (lastIndex < value.length)
        parts.push({ type: 'text', value: value.slice(lastIndex) })

      parent.children.splice(index, 1, ...parts)
      return [SKIP, index + parts.length]
    })
  }
}

const remarkAmazonShortcode = remarkShortcode({
  regex: /\{\%\s*amazon\s+asin="([^"]+)"(?:\s+text="([^"]*)")?\s*\%\}/g,
  nodeType: 'amazon_link',
  propNames: ['asin', 'text'],
})

const remarkPostImage = remarkShortcode({
  regex: /\{\%\s*post_image\s+filename="([^"]+)"(?:\s+class="([^"]*)")?\s*\%\}/g,
  nodeType: 'post_image',
  propNames: ['filename', 'className'],
})

const remarkPostImages = remarkShortcode({
  regex: /\{\%\s*post_images\s+filenames="([^"]+)"(?:\s+group="([^"]*)")?\s*\%\}/g,
  nodeType: 'post_images',
  propNames: ['filename', 'group'],
})

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[
        remarkDirective,
        remarkAmazonShortcode,
        remarkPostImage,
        remarkPostImages,
      ]}
      components={{
        // @ts-ignore
        amazon_link: ({ node, ...props }) => {
          const asin = node?.properties?.asin as string
          const text = (node?.properties?.text as string) || undefined
          return <AmazonLink asin={asin} text={text} />
        },
        // @ts-ignore
        post_image: ({ node, ...props }) => {
          const filename = node?.properties?.filename as string
          const className = (node?.properties?.className as string) || undefined
          return <PostImage filename={filename} className={className} />
        },
        // @ts-ignore
        post_images: ({ node, ...props }) => {
          const filenames = (node?.properties?.filename as string).split(',')
          const group = (node?.properties?.group as string) || undefined
          const images = filenames.map((f) => ({ filename: f.trim() }))
          return <PostImages images={images} group={group} />
        },
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
