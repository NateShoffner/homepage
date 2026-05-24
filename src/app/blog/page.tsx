import type { Metadata } from 'next'
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/blog'
import BlogListInteractive from '@components/BlogListInteractive'

export const metadata: Metadata = { title: 'Blog' }

export default function BlogPage() {
  const posts = getAllPosts()
  const categories = getAllCategories()
  const tags = getAllTags()

  return (
    <section className="page-section p-4 p-lg-5 d-flex flex-column">
      <div className="my-auto">
        <h2 className="mb-4">
          Blog <span className="text-highlight">Posts</span>
          <a href="/feed.xml" className="pl-4">
            <i className="fa fa-rss" />
          </a>
        </h2>
        <p className="pb-4 text-muted">
          Incoherent ramblings, project updates, reviews, and other writings fallen into the ether.
        </p>
        <BlogListInteractive posts={posts} categories={categories} tags={tags} />
      </div>
    </section>
  )
}
