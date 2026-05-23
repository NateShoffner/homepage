import type { Metadata } from 'next'
import Script from 'next/script'
import { getAllPosts, getAllTags } from '@/lib/blog'
import { BlogPostCard } from '@components/BlogPostCard'

interface Params { tag: string }

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: encodeURIComponent(tag) }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { tag } = await params
  return { title: decodeURIComponent(tag) }
}

export default async function TagPage({ params }: { params: Promise<Params> }) {
  const { tag } = await params
  const decoded = decodeURIComponent(tag)
  const posts = getAllPosts().filter((p) =>
    p.tags.some((t) => t.toLowerCase() === decoded.toLowerCase())
  )

  return (
    <>
      <section className="page-section p-4 p-lg-5 d-flex flex-column">
        <h2 className="mb-5">
          Posts tagged under <span className="text-primary">&apos;{decoded}&apos;</span>
        </h2>
        <div className="row">
          {posts.length === 0 && (
            <div className="col-12"><p>No posts found under this tag.</p></div>
          )}
          {posts.map((post, index) => (
            <div className="col-sm-12 col-md-6 col-lg-4 mb-5" key={index}>
              <BlogPostCard post={post} />
            </div>
          ))}
        </div>
      </section>
      <Script id="dsq-count-scr" src="//nateshoffner.disqus.com/count.js" strategy="afterInteractive" />
    </>
  )
}
