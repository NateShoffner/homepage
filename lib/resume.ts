import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

export interface ResumeContact {
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  website: string
}

export interface ResumeSkills {
  soft: string[]
  languages: string[]
}

export interface ResumeExperience {
  title: string
  company: string
  homepage?: string
  start: string
  end: string
  location: string
  bullets: string[]
}

export interface ResumeProject {
  name: string
  role: string
  homepage?: string
  start: string
  end: string
  bullets: string[]
}

export interface Resume {
  name: string
  title: string
  contact: ResumeContact
  objective: string
  skills: ResumeSkills
  experience: ResumeExperience[]
  projects: ResumeProject[]
}

const resumeFile = path.resolve(process.cwd(), 'src/_data/resume.yml')

export function getResume(): Resume {
  const raw = fs.readFileSync(resumeFile, 'utf-8')
  return yaml.load(raw) as Resume
}
