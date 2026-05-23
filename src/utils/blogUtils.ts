import { PostMeta } from '@/lib/blog'

export function getBlogPostImage(post: PostMeta): string {
  if (post.image) return `/assets/images/posts/${post.image}`
  return `/assets/images/posts/default.png`
}

export function getBlogPostExcerpt(post: PostMeta): string {
  return post.description ?? ''
}

export function getBlogPostUrl(post: PostMeta): string {
  const d = new Date(post.date)
  return `/blog/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${post.slug}`
}
