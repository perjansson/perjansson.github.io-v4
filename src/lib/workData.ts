import { ProjectType } from '../types'
import { formatPeriod } from './projectHelper'

// Legacy fallback: entry ids of the promoted projects shown under
// "Selected work" while the content model has no `promoted` boolean.
// Once that field exists in Contentful it takes over completely and
// this list (plus the fallback branch below) can be deleted.
export const PROMOTED_PROJECT_IDS = [
  '67ngtiw23mqyrvYrpIhtru', // Inflight entertainment (IFE) — Panasonic / Cathay Pacific
  '6dS3vBt0QKN9KNwsPUlIpl', // Mobile app — Sony Music
  '46wqaGkNNYoA4LVHHWktzC', // Smart TV app — HBO / Warner Media
  '26Wuh23vh1tlC8VucfSpfx', // Wi-Fi Connectivity Platform — IAG
  'uqQee6xa8k8Ww6gSbCRV4', // Wi-Fi Connectivity Platform — Panasonic Avionics
  'EBiVwzTdpUSKKP7vGCb6U', // Insourcing Matchmaking Tool — EY
  '28O7Tth24u89EpqdnaCtS9', // Nordic portfolio system — Nordea
]

export interface WorkItem {
  id: string
  titleShort: string
  client: string
  role: string
  tech: string[]
  period?: string
  promoted: boolean
}

export interface TechStat {
  name: string
  projectCount: number
  months: number
  /** 0..1, relative to the heaviest tech */
  scale: number
}

const monthsBetween = (start: string, end: string | null | undefined) => {
  const startDate = new Date(start)
  const endDate = end ? new Date(end) : new Date()
  return Math.max(
    1,
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth())
  )
}

export const buildWorkItems = (projects: ProjectType[]): WorkItem[] => {
  // When the `promoted` field exists in the content model, every item
  // carries it (true/false/null) and the flags are the whole truth —
  // even if nothing is ticked. Only when the field is absent entirely
  // does the legacy id list apply.
  const hasPromotedField = projects.some(
    (project) => project.promoted !== undefined
  )

  const isPromoted = (project: ProjectType) =>
    hasPromotedField
      ? project.promoted === true
      : PROMOTED_PROJECT_IDS.includes(project.sys.id)

  return projects.map((project) => ({
    id: project.sys.id,
    titleShort: project.titleShort,
    client: project.client,
    role: project.role,
    tech: project.tech ?? [],
    period: formatPeriod(project.startdate, project.enddate),
    promoted: isPromoted(project),
  }))
}

// Weight = total months of use + a bonus per project, so both duration
// and breadth count. Scaled against the heaviest tech for sizing.
export const buildTechStats = (projects: ProjectType[]): TechStat[] => {
  const stats = new Map<string, { projectCount: number; months: number }>()

  for (const project of projects) {
    const months = monthsBetween(project.startdate, project.enddate)
    for (const tech of project.tech ?? []) {
      const entry = stats.get(tech) ?? { projectCount: 0, months: 0 }
      entry.projectCount += 1
      entry.months += months
      stats.set(tech, entry)
    }
  }

  const scored = Array.from(stats.entries()).map(([name, entry]) => ({
    name,
    ...entry,
    score: entry.months + entry.projectCount * 6,
  }))

  const maxScore = Math.max(...scored.map(({ score }) => score), 1)

  return scored
    .sort((a, b) => b.score - a.score)
    .map(({ name, projectCount, months, score }) => ({
      name,
      projectCount,
      months,
      scale: score / maxScore,
    }))
}
