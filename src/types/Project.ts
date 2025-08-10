export interface ProjectImage {
  caption: string
  filename: string
}

export interface ProjectDownload {
  name: string
  description: string
  url: string
}

export interface ProjectExample {
  name: string
  description: string
  url: string
}
export interface Project {
    slug: string
    name: string
    version: string
    updated: Date
    description: string
    logo: string
    open_source: string
    license: string
    homepage?: string
    images?: ProjectImage[]
    downloads?: ProjectDownload[]
    platforms?: string[]
    examples?: ProjectExample[]
}
