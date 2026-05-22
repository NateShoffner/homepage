import BlogSection from "@components/BlogSection";
import { Helmet } from "react-helmet";

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Blog</title>
      </Helmet>
      <section className="page-section p-4 p-lg-5 d-flex flex-column">
        <div className="my-auto">
          <h2 className="mb-5">
            Blog <span className="text-highlight">Posts</span>
            <a href="feed.xml">
              <i className="fa fa-rss pl-4"></i>
            </a>
          </h2>
          <BlogSection />
        </div>
      </section>
    </>
  );
};

export default Blog;
