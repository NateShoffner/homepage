import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'
import { BlogSection } from '@components/BlogSection'

export const metadata: Metadata = { title: 'Blog' }

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <section className="page-section p-4 p-lg-5 d-flex flex-column">
      <div className="my-auto">
        <h2 className="mb-5">
          Blog <span className="text-highlight">Posts</span>
          <a href="/feed.xml">
            <i className="fa fa-rss pl-4"></i>
          </a>
        </h2>
        <BlogSection posts={posts} />
      </div>
    </section>
  )
}
