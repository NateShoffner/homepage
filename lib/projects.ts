import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import type { Project } from '@/src/types/Project'

const projectsFile = path.resolve(process.cwd(), 'src/_data/projects.yml')

export type { Project }

export function getAllProjects(): Project[] {
  const raw = fs.readFileSync(projectsFile, 'utf-8')
  const data = yaml.load(raw) as any[]
  return data.map((p) => ({
    ...p,
    updated:
      p.updated && p.updated !== 'N/A'
        ? new Date(p.updated.replace(/(\d+)(st|nd|rd|th)/, '$1'))
        : undefined,
  }))
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((p) => p.slug === slug)
}

export function getProjectByName(name: string): Project | undefined {
  return getAllProjects().find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  )
}
