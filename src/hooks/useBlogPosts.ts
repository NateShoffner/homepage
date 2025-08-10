import { useMemo } from 'react'
import { blogIndex, BlogPost } from '@data/blogIndex'
import { useParams } from 'react-router-dom'

export interface BlogPostFilters {
    category?: string
    tag?: string
}

export function useBlogPosts(filters?: BlogPostFilters): BlogPost[] {
    return useMemo(() => {
        if (!filters) return blogIndex

        return blogIndex.filter((post) => {
            return (
                (!filters.category || (post.categories?.includes(filters.category))) &&
                (!filters.tag || (post.tags?.includes(filters.tag)))
            )
        })
    }, [filters])
}

export function useBlogPost(): BlogPost | undefined {
  const { year, month, slug } = useParams<{
    year: string
    month: string
    slug: string
  }>()

  // find based on the slug
    return useMemo(() => {
        if (!slug) return undefined
    
        const post = blogIndex.find((p) => p.slug === slug)
        if (!post) return undefined

    
        return post
    }, [slug])
}

export function getNextBlogPost(currentPost: BlogPost): BlogPost | undefined {
  const posts = useBlogPosts()
  const currentIndex = posts.findIndex((post) => post.slug === currentPost.slug)
  return currentIndex >= 0 && currentIndex < posts.length - 1
    ? posts[currentIndex + 1]
    : undefined
}

export function getPreviousBlogPost(currentPost: BlogPost): BlogPost | undefined {
  const posts = useBlogPosts()
  const currentIndex = posts.findIndex((post) => post.slug === currentPost.slug)
  return currentIndex > 0 ? posts[currentIndex - 1] : undefined
}

export function useCategory(): string | undefined {
  const { category } = useParams<{ category: string }>()
  return category ? decodeURIComponent(category) : undefined
}

export function useTag(): string | undefined {
  const { tag } = useParams<{ tag: string }>()
  return tag ? decodeURIComponent(tag) : undefined
}
