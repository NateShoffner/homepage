import { AboutSection } from "@components/AboutSection";
import BlogSection from "@components/BlogSection";
import ProjectsSection from "@components/ProjectsSection";
import ContactSection from "@components/ContactSection";

const Home = () => {
  return (
    <div className="container-fluid p-0">
      <section
        className="page-section about-cover p-4 p-lg-5 d-flex d-column"
        id="about"
      >
        <div className="my-auto">
          <AboutSection />
        </div>
        <div className="scroll-btn">
          <a href="#blog" title="" className="centered">
            <span className="scroll-down"></span>
          </a>
        </div>
      </section>
      <section className="page-section p-4 p-lg-5 d-flex flex-column" id="blog">
        <div className="my-auto">
          <h2 className="mb-5">
            Latest <span className="text-highlight">Blog Posts</span>
            <a href="feed.xml">
              <i className="fa fa-rss pl-4"></i>
            </a>
          </h2>
          <BlogSection limit={3} />
          <a
            href="blog"
            role="button"
            className="btn btn-primary btn-lg btn-block"
          >
            View More Blog Posts
          </a>
        </div>
      </section>
      <section
        className="page-section p-4 p-lg-5 d-flex flex-column"
        id="projects"
      >
        <div className="my-auto">
          <ProjectsSection limit={3} showMore={true} />
        </div>
      </section>
      <section
        className="page-section p-4 p-lg-5 d-flex flex-column"
        id="contact"
      >
        <div className="my-auto">
          <ContactSection />
        </div>
      </section>
      <div id="top-btn" className="scroll-btn">
        <a href="#page-top" title="">
          <span className="scroll-up"></span>
        </a>
      </div>
    </div>
  );
};

export default Home;
