import { Project } from '@/src/types/Project'

export function getProjectImage(project: Project): string {
  if (project.logo) {
    return `/assets/images/projects/${project.slug}/${project.logo}`;
  } else if (project.images && project.images.length > 0) {
    return `/assets/images/projects/${project.slug}/${project.images[0].filename}`;
  }
  return "https://via.placeholder.com/150"; // Fallback image
}