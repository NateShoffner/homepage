'use client'

import { CommentCount, DiscussionEmbed } from 'disqus-react'
import ShareButtons from '@components/ShareButtons'
import { ProjectPostEmbed } from '@components/ProjectPostEmbed'
import PostBody from '@components/PostBody'
import type { PostMeta } from '@/lib/blog'
import type { Project } from '@/src/types/Project'

interface Props {
  post: PostMeta
  content: string
  projectEmbeds?: Project[]
  nextPost?: PostMeta
  prevPost?: PostMeta
}

export default function BlogPostInteractive({
  post,
  content,
  projectEmbeds = [],
  nextPost,
  prevPost,
}: Props) {
  return (
    <>
      <ul className="post-meta">
        <li className="post-meta-item">
          <i className="fa fa-calendar"></i>{' '}
          {post.date
            ? new Date(post.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : ''}
        </li>
        {post.lastUpdated && (
          <li className="post-meta-item">
            <i className="fa fa-pencil"></i>{' '}
            Updated{' '}
            {new Date(post.lastUpdated).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </li>
        )}
        <li className="post-meta-item">
          <i className="fa fa-comments"></i>{' '}
          <a href={post.fullUrl}>
            <CommentCount shortname="nateshoffner" config={{ url: post.fullUrl }}>
              {0} Comments
            </CommentCount>
          </a>
        </li>
        <li className="post-meta-item">
          <i className="fa fa-folder"></i>{' '}
          {post.categories && post.categories.length > 0
            ? post.categories.map((category, idx) => (
                <span key={category}>
                  <a href={`/blog/category/${encodeURIComponent(category)}/`}>{category}</a>
                  {idx < post.categories.length - 1 ? ', ' : ''}
                </span>
              ))
            : 'Uncategorized'}
        </li>
      </ul>

      <PostBody body={content} />

      {projectEmbeds.map((project, idx) => (
        <ProjectPostEmbed key={idx} project={project} />
      ))}

      <div className="row mb-3">
        <div className="col-12 col-sm-6">
          <div className="post-tags d-flex flex-wrap align-items-center gap-1">
            <span><i className="fa fa-tag"></i> Tags:</span>
            {post.tags && post.tags.length > 0
              ? post.tags.map((tag, i) => (
                  <span key={tag}>
                    <a href={`/blog/tag/${encodeURIComponent(tag)}`}>{tag}</a>
                    {i < post.tags.length - 1 && ','}
                  </span>
                ))
              : <span>None</span>}
          </div>
          <ShareButtons title={post.title} />
        </div>
      </div>

      <div className="row post-nav pb-3 pt-3">
        <div className="col-12 col-sm-6">
          {nextPost?.url && <a href={nextPost.url}>&laquo; {nextPost.title}</a>}
        </div>
        <div className="col-12 col-sm-6">
          <div className="float-sm-right">
            {prevPost?.url && <a href={prevPost.url}>{prevPost.title} &raquo;</a>}
          </div>
        </div>
      </div>

      <div className="pb-3 pt-3">
        <DiscussionEmbed shortname="nateshoffner" config={{ url: post.fullUrl }} />
      </div>
    </>
  )
}
