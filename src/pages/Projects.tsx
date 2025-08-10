import ProjectsSection from "@components/ProjectsSection";
import { Helmet } from "react-helmet";

const Projects = () => {
  return (
    <>
      <Helmet>
        <title>Projects &bull; Nate Shoffner</title>
      </Helmet>
      <section className="page-section p-4 p-lg-5 d-flex flex-column">
        <div className="my-auto">
          <ProjectsSection showMore={false} />
        </div>
      </section>
    </>
  );
};

export default Projects;
