import type { Document } from '@contentful/rich-text-types'

export type RichTextJson = { json: Document }

export type ProjectsType = ProjectType[]

interface SysId {
  id: string
}

export interface Collaborator {
  name: string
  company: string
  linkedin?: string
}

export interface ProjectType {
  sys: SysId
  title: string
  titleShort: string
  client: string
  description: RichTextJson
  me: RichTextJson
  role: string
  tech?: Array<string>
  /** Optional Contentful boolean; undefined when the field doesn't exist in the content model yet */
  promoted?: boolean | null
  tags: Array<string>
  asset: ImageType
  assetPlaceholder?: string
  startdate: string
  enddate: string | null
  city: string
  collaborators: {
    items: Array<Collaborator>
  }
}

export interface ImageType {
  fileName: string
  url: string
}

export interface MeType {
  firstName: string
  lastName: string
  name: string
  title: string
  /** No longer queried or shown — the site uses the GitHub avatar */
  profileImage?: ImageType
  contacts: {
    items: Array<ContactType>
  }
  short: RichTextJson
  long: RichTextJson
}

export type ContactsType = Array<ContactType>

export interface ContactType {
  medium: string
  url: string
}

export interface IndexPageData {
  data: {
    me: MeType
    projects: {
      items: ProjectsType
    }
  }
}

export interface AllProjectsData {
  data: {
    projects: {
      items: Array<{ sys: SysId }>
    }
  }
}

export interface ProjectPageData {
  data: {
    project: ProjectType
  }
}
