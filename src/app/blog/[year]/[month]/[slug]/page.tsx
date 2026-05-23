import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { getProjectByName } from '@/lib/projects'
import BlogPostInteractive from '@components/BlogPostInteractive'

interface Params {
  year: string
  month: string
  slug: string
}

export async function generateStaticParams(): Promise<Params[]> {
  return getAllPosts().map((post) => {
    const d = new Date(post.date)
    return {
      year: String(d.getFullYear()),
      month: String(d.getMonth() + 1).padStart(2, '0'),
      slug: post.slug,
    }
  })
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return { title: post.title, description: post.description }
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const allPosts = getAllPosts()
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug)
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1
    ? allPosts[currentIndex + 1]
    : undefined
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined

  const projectEmbeds = post.categories.includes('Projects')
    ? post.tags.map((tag) => getProjectByName(tag)).filter((p): p is NonNullable<typeof p> => !!p)
    : []

  return (
    <section className="page-section p-4 p-lg-5 d-flex flex-column">
      <div className="blog-post">
        <div className="post-title">
          <h2>{post.title}</h2>
          <BlogPostInteractive
            post={post}
            content={post.content}
            projectEmbeds={projectEmbeds}
            nextPost={nextPost}
            prevPost={prevPost}
          />
        </div>
      </div>
    </section>
  )
}
