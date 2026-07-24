import {
  getAllProjectsQuery,
  getIndexPageDataQuery,
  getProjectPageDataQuery,
} from './queries'
import {
  fallbackIndexPageData,
  fallbackAllProjectsData,
  fallbackProjectPageData,
} from './fallbackData'
import { AllProjectsData, IndexPageData, ProjectPageData } from '../types'

const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN

const hasContentfulConfig = Boolean(space && accessToken)

let warned = false
const warnOnce = () => {
  if (!warned) {
    warned = true
    console.warn(
      '[api] NEXT_PUBLIC_CONTENTFUL_SPACE_ID / NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN not set — building with local fallback data.'
    )
  }
}

const fetchGraphQL = async <T>(query: string): Promise<T> => {
  const res = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${space}`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query }),
    }
  )

  if (!res.ok) {
    throw new Error(`Contentful request failed: ${res.status}`)
  }

  return (await res.json()) as T
}

export const getIndexPageData = async (): Promise<IndexPageData> => {
  if (!hasContentfulConfig) {
    warnOnce()
    return fallbackIndexPageData
  }

  return fetchGraphQL<IndexPageData>(getIndexPageDataQuery)
}

export const getAllProjects = async (): Promise<AllProjectsData> => {
  if (!hasContentfulConfig) {
    warnOnce()
    return fallbackAllProjectsData
  }

  return fetchGraphQL<AllProjectsData>(getAllProjectsQuery)
}

export const getProjectDetails = async (
  projectId: string
): Promise<ProjectPageData> => {
  if (!hasContentfulConfig) {
    warnOnce()
    return fallbackProjectPageData(projectId)
  }

  return fetchGraphQL<ProjectPageData>(getProjectPageDataQuery(projectId))
}
