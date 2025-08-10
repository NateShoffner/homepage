import CommentSection from "@components/CommentSectin";
import { ProjectPostEmbed } from "@components/ProjectPostEmbed";
import ProjectsSection from "@components/ProjectsSection";
import {
  getNextBlogPost,
  getPreviousBlogPost,
  useBlogPost,
} from "@hooks/useBlogPosts";
import { useProject, useProjectByName } from "@hooks/useProjects";
import { CommentCount, DiscussionEmbed } from "disqus-react";

import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";

const BlogPost = () => {
  const post = useBlogPost();
  const nextPost = getNextBlogPost(post!);
  const prevPost = getPreviousBlogPost(post!);

  return (
    <>
      <Helmet>
        <title>{post?.title}</title>
      </Helmet>
      <section className="page-section p-4 p-lg-5 d-flex flex-column">
        <div className="blog-post">
          <div className="post-title">
            <h2>{post?.title}</h2>
          </div>
        </div>

        <ul className="post-meta">
          <li className="post-meta-item">
            <i className="fa fa-calendar"></i>{" "}
            {post?.date
              ? new Date(post.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : ""}
          </li>
          <li className="post-meta-item">
            <i className="fa fa-comments"></i>{" "}
            <a href={`#comments`}>
              <span
                className="disqus-comment-count"
                data-disqus-url={window.location.href}
              >
                0 Comments
              </span>
            </a>
          </li>
          <li className="post-meta-item">
            <i className="fa fa-folder"></i>{" "}
            {post?.categories && post.categories.length > 0
              ? post.categories.map((category, idx) => (
                  <span key={category}>
                    <a href={`/blog/category/${encodeURIComponent(category)}/`}>
                      {category}
                    </a>
                    {idx < post.categories.length - 1 ? ", " : ""}
                  </span>
                ))
              : "Uncategorized"}
          </li>
        </ul>
        <article
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post?.content || "" }}
        ></article>

        {post?.categories.includes("Projects")
          ? post.tags
              ?.map((tag) => useProjectByName(tag))
              .map((project, idx) =>
                project ? (
                  <ProjectPostEmbed key={idx} project={project} />
                ) : null
              )
          : null}

        <div className="row mb-3">
          <div className="col-12 col-sm-6">
            <div className="post-tags">
              <i className="fa fa-tag"></i> Tags:{" "}
              {post?.tags && post.tags.length > 0
                ? post.tags.map((tag, i) => (
                    <span key={tag}>
                      <Link to={`/blog/tag/${encodeURIComponent(tag)}`}>
                        {tag}
                      </Link>
                      {i < post.tags.length - 1 && ", "}
                    </span>
                  ))
                : "None"}
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="ssk-group float-sm-right">
              <a href="#" className="ssk ssk-facebook"></a>
              <a href="#" className="ssk ssk-twitter"></a>
              <a href="#" className="ssk ssk-linkedin"></a>
            </div>
          </div>
        </div>

        <div className="row post-nav pb-3 pt-3">
          <div className="col-12 col-sm-6">
            {nextPost?.url && (
              <a href={nextPost.url}>&laquo; {nextPost.title}</a>
            )}
          </div>
          <div className="col-12 col-sm-6">
            <div className="float-sm-right">
              {prevPost?.url && (
                <a href={prevPost.url}>{prevPost.title} &raquo;</a>
              )}
            </div>
          </div>
        </div>

        <div className="pb-3 pt-3">
          <CommentSection />
        </div>
      </section>
    </>
  );
};

export default BlogPost;
