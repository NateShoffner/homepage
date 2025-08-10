import { ProjectCard } from "@components/ProjectCard";
import { useProjects } from "@hooks/useProjects";
import { Project } from "@types/Project";

interface PublicProjectsProps {
  limit?: number;
  sortBy?: keyof Project;
  sortOrder?: "asc" | "desc";
}

function PublicProjects({
  limit,
  sortBy = "updated",
  sortOrder = "desc",
}: PublicProjectsProps) {
  const projects = useProjects();

  // Sort and limit projects
  const sorted = [...projects].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (aValue instanceof Date && bValue instanceof Date) {
      console.log(`Sorting by date: ${aValue} vs ${bValue}`);
      return sortOrder === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }
    return 0;
  });

  const visible = limit ? sorted.slice(0, limit) : sorted;

  return (
    <div className="row">
      {visible.map((project) => (
        <div className="col-sm-12 col-md-6 col-lg-4 mb-5" key={project.slug}>
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}

export { ProjectCard, PublicProjects };
