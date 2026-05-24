'use client'

import Link from 'next/link'
import { PostMeta } from '@/lib/blog'
import Markdown from './Markdown'
import { CommentCount } from 'disqus-react'

function BlogPostCard({ post }: { post: PostMeta }) {
  return (
    <div className="card blog-card h-100 pt-2">
      <Link href={post.url}>
        <img
          src={post.image ? `/assets/images/posts/${post.image}` : `/assets/images/posts/default.png`}
          className="card-img-top img-fluid"
          alt={post.title}
        />
      </Link>
      <div className="card-body">
        <h5 className="card-title">
          <Link href={post.url}>{post.title}</Link>
        </h5>
        <div className="card-text">
          <Markdown>{post.description}</Markdown>
          <Link href={post.url} className="btn btn-primary">
            Read More &raquo;
          </Link>
        </div>
      </div>
      <div className="card-footer text-center text-muted">
        <ul className="post-meta">
          <li className="post-meta-item">
            <i className="fa fa-calendar"></i>{' '}
            {new Date(post.date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: '2-digit',
            })}
          </li>
          <li className="post-meta-item">
            <i className="fa fa-comments"></i>{' '}
            <a href={post.fullUrl + '#comments'}>
              <CommentCount shortname="nateshoffner" config={{ url: post.fullUrl }}>
                {0} Comments
              </CommentCount>
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export { BlogPostCard }
