import type { Metadata } from 'next'
import Script from 'next/script'
import { getAllPosts, getAllCategories } from '@/lib/blog'
import { BlogPostCard } from '@components/BlogPostCard'

interface Params { category: string }

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }))
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
        {posts.length === 0
          ? <p>No posts found under this category.</p>
          : <div className="list-cards">
              {posts.map((post, index) => (
                <BlogPostCard key={index} post={post} />
              ))}
            </div>
        }
      </section>
      <Script id="dsq-count-scr" src="//nateshoffner.disqus.com/count.js" strategy="afterInteractive" />
    </>
  )
}
