import type { Metadata } from 'next'
import Script from 'next/script'
import { getAllPosts, getAllCategories } from '@/lib/blog'
import { BlogPostCard } from '@components/BlogPostCard'

interface Params { category: string }

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ category: encodeURIComponent(category) }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category } = await params
  return { title: decodeURIComponent(category) }
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category } = await params
  const decoded = decodeURIComponent(category)
  const posts = getAllPosts().filter((p) =>
    p.categories.some((c) => c.toLowerCase() === decoded.toLowerCase())
  )

  return (
    <>
      <section className="page-section p-4 p-lg-5 d-flex flex-column">
        <h2 className="mb-5">
          Posts categorized under <span className="text-primary">&apos;{decoded}&apos;</span>
        </h2>
        <div className="row">
          {posts.length === 0 && (
            <div className="col-12"><p>No posts found under this category.</p></div>
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
