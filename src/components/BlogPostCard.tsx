import Link from 'next/link'
import { ListCardDate } from '@components/ListCardDate'
import { PostMeta } from '@/lib/blog'

interface Props {
  post: PostMeta
  onCategoryClick?: (cat: string) => void
  showImage?: boolean
}

function BlogPostCard({ post, onCategoryClick, showImage = true }: Props) {
  const imageSrc = post.image
    ? `/assets/images/posts/${post.image}`
    : `/assets/images/posts/default.png`

  return (
    <Link href={post.url} className="list-card">
      {showImage && (
        <div className="list-card-thumbnail">
          <img src={imageSrc} alt={post.title} />
        </div>
      )}
      <div className="list-card-body">
        <div className="list-card-header">
          <span className="list-card-title">{post.title}</span>
        </div>
        <p className="list-card-excerpt">{post.description}</p>
        <div className="list-card-footer">
          <div className="list-card-tags">
            {post.readingTime && <span className="badge"><i className="fa fa-clock-o" /> {post.readingTime}</span>}
            {post.categories.map((cat) =>
              onCategoryClick ? (
                <button
                  key={cat}
                  className="badge"
                  onClick={(e) => { e.preventDefault(); onCategoryClick(cat) }}
                >
                  {cat}
                </button>
              ) : (
                <span key={cat} className="badge">{cat}</span>
              )
            )}
          </div>
        </div>
      </div>
      <ListCardDate date={post.date} />
    </Link>
  )
}

export { BlogPostCard }
