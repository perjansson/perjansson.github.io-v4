import { ProjectType } from '../types'
import { formatPeriod } from './projectHelper'

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

// Same tech, different spellings in the content
const TECH_ALIASES: Record<string, string> = {
  'Material-UI': 'Material UI',
}

export const canonicalTech = (name: string) => TECH_ALIASES[name] ?? name

// How relevant each tech feels in 2026, 0 (a thing of the past) to 1
// (current and trendy). Editorial judgment — tune freely. Unlisted
// techs default to 0.5.
const TECH_POPULARITY: Record<string, number> = {
  React: 0.95,
  Typescript: 0.95,
  'Next.js': 0.9,
  Kotlin: 0.9,
  'Jetpack Compose': 0.9,
  Figma: 0.9,
  'GitHub Actions': 0.85,
  AWS: 0.85,
  Android: 0.8,
  Node: 0.8,
  Docker: 0.8,
  'React Native': 0.75,
  Expo: 0.75,
  'Spring Boot': 0.7,
  Javascript: 0.7,
  'Framer Motion': 0.7,
  Java: 0.65,
  GraphQL: 0.6,
  MongoDB: 0.6,
  'D3.js': 0.6,
  Storybook: 0.6,
  Cypress: 0.55,
  Express: 0.55,
  SonarQube: 0.5,
  'Material UI': 0.5,
  Spring: 0.5,
  HTML: 0.5,
  'SQL Server': 0.45,
  Redux: 0.45,
  Angular: 0.4,
  SASS: 0.4,
  Puppeteer: 0.4,
  'Styled Components': 0.35,
  Hibernate: 0.35,
  Heroku: 0.3,
  Camel: 0.3,
  'Redux Saga': 0.25,
  Thymeleaf: 0.2,
  Zeplin: 0.15,
  Lerna: 0.15,
  jQuery: 0.1,
  'Google Web Toolkit': 0.05,
}

const popularityOf = (name: string) => TECH_POPULARITY[name] ?? 0.5

const monthsBetween = (start: string, end: string | null | undefined) => {
  const startDate = new Date(start)
  const endDate = end ? new Date(end) : new Date()
  return Math.max(
    1,
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth())
  )
}

// The `promoted` Boolean on the project content type drives the
// "Selected work" section
const isPromoted = (project: ProjectType) => project.promoted === true

export const buildWorkItems = (projects: ProjectType[]): WorkItem[] =>
  projects.map((project) => ({
    id: project.sys.id,
    titleShort: project.titleShort,
    client: project.client,
    role: project.role,
    tech: (project.tech ?? []).map(canonicalTech),
    period: formatPeriod(project.startdate, project.enddate),
    promoted: isPromoted(project),
  }))

// Weight = personal usage (months + a bonus per project, counted 1.5x
// for featured projects) times a present-day popularity factor, so
// long-and-recent techs proven in the showcase work read big while
// techs of the past shrink no matter how long they were used.
// Scaled against the heaviest tech for sizing.
const FEATURED_USAGE_MULTIPLIER = 1.5

export const buildTechStats = (projects: ProjectType[]): TechStat[] => {
  const stats = new Map<
    string,
    { projectCount: number; months: number; usage: number }
  >()

  for (const project of projects) {
    const months = monthsBetween(project.startdate, project.enddate)
    const multiplier = isPromoted(project) ? FEATURED_USAGE_MULTIPLIER : 1
    for (const rawTech of project.tech ?? []) {
      const tech = canonicalTech(rawTech)
      const entry = stats.get(tech) ?? { projectCount: 0, months: 0, usage: 0 }
      entry.projectCount += 1
      entry.months += months
      entry.usage += (months + 6) * multiplier
      stats.set(tech, entry)
    }
  }

  const scored = Array.from(stats.entries()).map(([name, entry]) => ({
    name,
    projectCount: entry.projectCount,
    months: entry.months,
    score: entry.usage * (0.3 + 0.7 * popularityOf(name)),
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
