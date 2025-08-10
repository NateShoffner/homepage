import { BlogPostCard } from "@components/BlogPostCard";
import BlogSection from "@components/BlogSection";
import {
  BlogPostFilters,
  useBlogPost,
  useBlogPosts,
  useCategory,
} from "@hooks/useBlogPosts";
import { Helmet } from "react-helmet";

const Category = () => {
  const category = useCategory();
  const decoded = category ? decodeURIComponent(category) : "";
  const filters: BlogPostFilters = { category: decoded };
  const posts = useBlogPosts(filters);

  return (
    <>
      <section className="page-section p-4 p-lg-5 d-flex flex-column">
        <h2 className="mb-5">
          Posts categorized under{" "}
          <span className="text-primary">'{category}'</span>
        </h2>

        <div className="row">
          {posts.length === 0 && (
            <div className="col-12">
              <p>No posts found under this category.</p>
            </div>
          )}
          {posts.map((post, index) => (
            <div className="col-sm-12 col-md-6 col-lg-4 mb-5" key={index}>
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

export default Category;
