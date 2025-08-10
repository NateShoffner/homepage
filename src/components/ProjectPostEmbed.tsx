import { Link } from "react-router-dom";
import { Project } from "@types/Project";
import { getProjectImage } from "@utils/projectUtils";

function ProjectPostEmbed({ project }: { project: Project }) {
  return (
    <div className="media blog-project-embed mt-3 mb-3 p-3">
      <img
        className="align-self-center mr-3 ml-3 img-fluid"
        src={getProjectImage(project)}
        alt={project.name}
      />
      <div className="media-body">
        <h5 className="mt-0">{project.name}</h5>
        <p>{project.description}</p>
        <p className="mb-0">
          <Link to={`/projects/${project.slug}`}>
            More Info <i className="fa fa-arrow-right"></i>
          </Link>
        </p>
      </div>
    </div>
  );
}

export { ProjectPostEmbed };
