import rawProjects from "@data/projects.yml";
import { useParams } from "react-router-dom";

export type Project = {
  name: string;
  slug: string;
  updated?: Date;
  [key: string]: any;
};

export function useProjects(): Project[] {
  return (rawProjects as any[]).map((p) => ({
    ...p,
    updated: p.updated
      ? new Date(p.updated.replace(/(\d+)(st|nd|rd|th)/, "$1"))
      : undefined,
  }));
}

export function useProject(slug: string): Project | undefined {
  const projects = useProjects();
  return projects.find((project) => project.slug === slug);
}

export function useProjectByName(name: string): Project | undefined {
  const projects = useProjects();
    return projects.find(
        (project) => project.name.toLowerCase() === name.toLowerCase()
    );
}

export function useProjectFromParams(): Project | undefined {
  const { slug } = useParams<{ slug: string }>();
  return useProject(slug);
}