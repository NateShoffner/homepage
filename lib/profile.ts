import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

export interface ProfileLocation {
  city: string
  state: string
  country: string
}

export interface ProfileRole {
  title: string
  current: boolean
  verified?: boolean
  url?: string
}

export interface Profile {
  author: string
  description: string[]
  years_experience: number
  open_to_work: boolean
  location: ProfileLocation
  roles: ProfileRole[]
  focus_areas: string[]
}

const profileFile = path.resolve(process.cwd(), '_data/profile.yml')

export function getProfile(): Profile {
  const raw = fs.readFileSync(profileFile, 'utf-8')
  return yaml.load(raw) as Profile
}
