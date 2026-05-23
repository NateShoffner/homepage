import type { Metadata } from 'next'
import { getAllProjects } from '@/lib/projects'
import { ProjectsSection } from '@components/ProjectsSection'

export const metadata: Metadata = { title: 'Projects' }

export default function ProjectsPage() {
  const projects = getAllProjects()

  return (
    <section className="page-section p-4 p-lg-5 d-flex flex-column">
      <div className="my-auto">
        <ProjectsSection projects={projects} showMore={false} />
      </div>
    </section>
  )
}
