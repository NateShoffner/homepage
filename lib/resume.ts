import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
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
  if (process.env.NODE_ENV === 'development' && raw.includes('ENC[AES256_GCM') && process.env.AGE_SECRET_KEY) {
    const decrypted = execSync(`sops --decrypt "${resumeFile}"`, {
      env: { ...process.env, SOPS_AGE_KEY: process.env.AGE_SECRET_KEY },
    }).toString()
    return yaml.load(decrypted) as Resume
  }
  return yaml.load(raw) as Resume
}

