import Script from 'next/script'
import { PostMeta } from '@/lib/blog'
import { BlogPostCard } from './BlogPostCard'

interface BlogSectionProps {
  posts: PostMeta[]
}

export function BlogSection({ posts }: BlogSectionProps) {
  return (
    <>
      <p className="pb-5">
        Incoherent ramblings, project updates, reviews, and other writings fallen into the ether.
      </p>
      <div className="list-cards">
        {posts.map((post, index) => (
          <BlogPostCard key={index} post={post} />
        ))}
      </div>

      <Script id="dsq-count-scr" src="//nateshoffner.disqus.com/count.js" strategy="afterInteractive" />
    </>
  )
}

export default BlogSection
