"use client";

import GitHubRepoViewer from "@components/GitHubRepoViewer";
import { PublicProjects } from "@components/PublicProjects";
import Link from "next/link";
import type { Project } from "@/src/types/Project";

interface ProjectsSectionProps {
  projects: Project[];
  limit?: number;
  showMore?: boolean;
}

export function ProjectsSection({
  projects,
  limit,
  showMore,
}: ProjectsSectionProps) {
  return (
    <>
      <h2 className="mb-5">
        Personal <span className="text-highlight">Projects</span>
      </h2>
      <p>
        A collection of personal and hobby projects I&apos;ve built in my spare
        time.
      </p>

      <PublicProjects
        projects={projects}
        limit={limit}
        sortBy="updated"
        sortOrder="desc"
      />
      {showMore && (
        <div className="mt-4">
          <Link href="/projects" className="btn btn-primary px-4">
            All projects →
          </Link>
        </div>
      )}

      <h3 className="mt-5">Open Source Projects</h3>
      <p>
        A selection of open source projects across my personal and organization
        accounts. Most of these are hobby experiments, tools, or community
        contributions.
      </p>
      <a
        href="https://github.com/NateShoffner"
        target="_blank"
        rel="noopener noreferrer"
        className="gw-github-link"
      >
        <i className="fa fa-github" /> github.com/NateShoffner
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
        defaultVisibleCount={showMore ? 6 : Infinity}
        defaultSortBy={showMore ? "stars" : "pushed"}
        showFilters={!showMore}
      />
    </>
  );
}

export default ProjectsSection;
