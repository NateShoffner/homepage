import GitHubRepoViewer from "@components/GitHubRepoViewer";
import { PublicProjects } from "@components/PublicProjects";
import { Link } from "react-router-dom";

interface ProjectsSectionProps {
  limit?: number;
  showMore?: boolean;
}

export function ProjectsSection({ limit, showMore }: ProjectsSectionProps) {
  return (
    <>
      <h2 className="mb-5">
        Public <span className="text-highlight">Projects</span>
      </h2>
      <p>
        Here are a few public projects I’ve worked on. I still have a lot yet to
        add here and some of these might not be 100% up to date, but I'll get to
        it eventually&trade;.
      </p>
      <p>
        If you would like to see my portfolio and resume for professional work,{" "}
        <a href="#contact">message me</a>.
      </p>

      <PublicProjects limit={limit} sortBy="updated" sortOrder="desc" />
      {showMore && (
        <p className="mt-4">
          <Link
            to="/projects"
            role="button"
            className="btn btn-primary btn-lg btn-block"
          >
            View More Projects
          </Link>
        </p>
      )}

      <h3 className="mt-5">Open Source Projects</h3>
      <strong>GitHub: </strong>
      <a href="https://github.com/NateShoffner" target="_blank">
        https://github.com/NateShoffner
      </a>
      <GitHubRepoViewer
        usernames={[
          "NateShoffner",
          "Tabster",
          "BuildandShoot",
          "NubileGames",
          "Tenji-hin",
        ]}
        includeForks={false}
        includePages={true}
        sortBy="pushed"
        showHomepage={false}
      />
    </>
  );
}

export default ProjectsSection;
