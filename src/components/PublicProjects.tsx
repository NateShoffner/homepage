import { ProjectCard } from '@components/ProjectCard'
import { SkeletonListCard } from '@components/SkeletonListCard'
import { Project } from '@/src/types/Project'

interface PublicProjectsProps {
  projects: Project[]
  limit?: number
  sortBy?: keyof Project
  sortOrder?: 'asc' | 'desc'
  loading?: boolean
}

function PublicProjects({ projects, limit, sortBy = 'updated', sortOrder = 'desc', loading }: PublicProjectsProps) {
  const sorted = [...projects].sort((a, b) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]

    if (sortBy === 'updated') {
      if (aValue === undefined && bValue !== undefined) return 1
      if (aValue !== undefined && bValue === undefined) return -1
      if (aValue === undefined && bValue === undefined) return 0
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortOrder === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime()
    }
    return 0
  })

  const visible = limit ? sorted.slice(0, limit) : sorted

  return (
    <div className="list-cards">
      {loading
        ? Array.from({ length: limit ?? 6 }).map((_, i) => <SkeletonListCard key={i} />)
        : visible.map((project) => <ProjectCard key={project.slug} project={project} />)
      }
    </div>
  )
}

export { ProjectCard, PublicProjects }
