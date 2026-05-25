"use client";

import { CommentCount } from "disqus-react";
import DisqusEmbed from "@components/DisqusEmbed";
import ShareButtons from "@components/ShareButtons";
import { ProjectPostEmbed } from "@components/ProjectPostEmbed";
import PostBody from "@components/PostBody";
import type { PostMeta } from "@/lib/blog";
import type { Project } from "@/src/types/Project";

interface Props {
  post: PostMeta;
  content: string;
  projectEmbeds?: Project[];
  nextPost?: PostMeta;
  prevPost?: PostMeta;
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
      <div className="post-meta list-card-tags mb-3">
        <span className="badge">
          <i className="fa fa-calendar" />{" "}
          {post.date
            ? new Date(post.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : ""}
        </span>
        {post.readingTime && (
          <span className="badge">
            <i className="fa fa-clock-o" /> {post.readingTime}
          </span>
        )}
        {post.lastUpdated && (
          <span className="badge">
            <i className="fa fa-pencil" /> Updated{" "}
            {new Date(post.lastUpdated).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        )}
        <a href={post.fullUrl} className="badge">
          <i className="fa fa-comments" />{" "}
          <CommentCount shortname="nateshoffner" config={{ url: post.fullUrl }}>
            {0} Comments
          </CommentCount>
        </a>
        {post.categories && post.categories.length > 0
          ? post.categories.map((category) => (
              <a
                key={category}
                href={`/blog/category/${encodeURIComponent(category)}/`}
                className="badge"
              >
                <i className="fa fa-folder" /> {category}
              </a>
            ))
          : null}
      </div>

      <PostBody body={content} />

      {projectEmbeds.map((project, idx) => (
        <ProjectPostEmbed key={idx} project={project} />
      ))}

      <div className="row mb-3">
        <div className="col-12 col-sm-6">
          <div className="post-tags list-card-tags">
            <i className="fa fa-tag"></i>
            {post.tags && post.tags.length > 0 ? (
              post.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/blog/tag/${encodeURIComponent(tag)}`}
                  className="badge"
                >
                  {tag}
                </a>
              ))
            ) : (
              <span>None</span>
            )}
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
            {prevPost?.url && (
              <a href={prevPost.url}>{prevPost.title} &raquo;</a>
            )}
          </div>
        </div>
      </div>

      <div className="disqus-embed">
        <DisqusEmbed shortname="nateshoffner" url={post.fullUrl} />
      </div>
    </>
  );
}
