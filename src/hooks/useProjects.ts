// Client-side hook for accessing project data fetched from the API.
// Server-side code should use lib/projects.ts directly.

import { useState, useEffect } from 'react'
import type { Project } from '@/src/types/Project'

export function useProjects(): Project[] {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data: Project[]) => setProjects(data))
      .catch(() => {})
  }, [])

  return projects
}
