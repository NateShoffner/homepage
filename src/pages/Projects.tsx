import ProjectsSection from "@components/ProjectsSection";
import PageHelmet from "@components/PageHelmet";

const Projects = () => {
  return (
    <>
      <PageHelmet title="Projects" />
      <section className="page-section p-4 p-lg-5 d-flex flex-column">
        <div className="my-auto">
          <ProjectsSection showMore={false} />
        </div>
      </section>
    </>
  );
};

export default Projects;
