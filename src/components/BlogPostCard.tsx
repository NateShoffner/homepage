import Link from 'next/link'
import { PostMeta } from '@/lib/blog'

function BlogPostCard({ post }: { post: PostMeta }) {
  const imageSrc = post.image
    ? `/assets/images/posts/${post.image}`
    : `/assets/images/posts/default.png`

  const dateLabel = new Date(post.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Link href={post.url} className="list-card">
      <div className="list-card-thumbnail">
        <img src={imageSrc} alt={post.title} />
      </div>
      <div className="list-card-body">
        <div className="list-card-header">
          <span className="list-card-title">{post.title}</span>
          <span className="list-card-meta">{dateLabel}</span>
        </div>
        <p className="list-card-excerpt">{post.description}</p>
        {post.categories.length > 0 && (
          <div className="list-card-tags">
            {post.categories.map((cat) => (
              <span key={cat} className="badge">{cat}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

export { BlogPostCard }
