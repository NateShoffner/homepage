import BlogSection from "@components/BlogSection";
import PageHelmet from "@components/PageHelmet";

const Blog = () => {
  return (
    <>
      <PageHelmet title="Blog" />
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
