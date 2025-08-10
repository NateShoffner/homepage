import { BlogPostCard } from "@components/BlogPostCard";

import { BlogPostFilters, useBlogPosts, useTag } from "@hooks/useBlogPosts";
import { Helmet } from "react-helmet";

const Tag = () => {
  const tag = useTag();
  const decoded = tag ? decodeURIComponent(tag) : "";
  const filters: BlogPostFilters = { tag: decoded };
  const posts = useBlogPosts(filters);

  return (
    <>
      <section className="page-section p-4 p-lg-5 d-flex flex-column">
        <h2 className="mb-5">
          Posts tagged under <span className="text-primary">'{tag}'</span>
        </h2>

        <div className="row">
          {posts.length === 0 && (
            <div className="col-12">
              <p>No posts found under this tag.</p>
            </div>
          )}
          {posts.map((post) => (
            <div className="col-sm-12 col-md-6 col-lg-4 mb-5">
              <BlogPostCard post={post} />
            </div>
          ))}
        </div>
      </section>

      <script
        id="dsq-count-scr"
        src="//nateshoffner.disqus.com/count.js"
        async
      ></script>
    </>
  );
};

export default Tag;
