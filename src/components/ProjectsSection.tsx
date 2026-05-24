'use client'

import GitHubRepoViewer from '@components/GitHubRepoViewer'
import { PublicProjects } from '@components/PublicProjects'
import Link from 'next/link'
import type { Project } from '@/src/types/Project'

interface ProjectsSectionProps {
  projects: Project[]
  limit?: number
  showMore?: boolean
}

export function ProjectsSection({ projects, limit, showMore }: ProjectsSectionProps) {
  return (
    <>
      <h2 className="mb-5">
        Personal <span className="text-highlight">Projects</span>
      </h2>
      <p>
        A collection of personal and hobby projects I&apos;ve built in my spare time.
      </p>

      <PublicProjects projects={projects} limit={limit} sortBy="updated" sortOrder="desc" />
      {showMore && (
        <p className="mt-4">
          <Link href="/projects" role="button" className="btn btn-primary btn-lg btn-block">
            View More Projects
          </Link>
        </p>
      )}

      <h3 className="mt-5">Open Source Projects</h3>
      <strong>GitHub: </strong>
      <a href="https://github.com/NateShoffner" target="_blank" rel="noopener noreferrer">
        https://github.com/NateShoffner
      </a>
      <GitHubRepoViewer
        usernames={['NateShoffner', 'Tabster', 'BuildandShoot', 'NubileGames', 'Tenji-hin']}
        includeForks={false}
        includePages={true}
        sortBy="pushed"
        showHomepage={false}
      />
    </>
  )
}

export default ProjectsSection
