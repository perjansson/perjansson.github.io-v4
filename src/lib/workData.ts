import type { ProjectType } from '../types'
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
  // Guard against the casing that used to live in the content, so a
  // stray old spelling still scores instead of silently falling to the
  // default popularity
  Typescript: 'TypeScript',
  Javascript: 'JavaScript',
}

export const canonicalTech = (name: string) => TECH_ALIASES[name] ?? name

// How current each tech is today, 0 (retired) to 1 (what people reach
// for now). This is the "would a reader recognise this as current?"
// axis — not how much Per liked it. Editorial judgment, tune freely.
//
// HTML and CSS are deliberately held at 0.5 rather than the ~0.8 their
// evergreen status would earn: they appear in almost every project, so
// at face value they crowd out the techs that actually say something
// about the work.
const TECH_POPULARITY: Record<string, number> = {
  // Current and in demand
  'Claude Code': 0.95,
  TypeScript: 0.95,
  React: 0.95,
  Kotlin: 0.9,
  'Jetpack Compose': 0.9,
  'Next.js': 0.9,
  Docker: 0.9,
  Figma: 0.9,
  AWS: 0.88,
  Android: 0.85,
  'GitHub Actions': 0.85,
  Node: 0.85,
  PostgreSQL: 0.85,
  GCP: 0.8,
  Jest: 0.8,
  JavaScript: 0.8,
  'React Native': 0.8,
  Expo: 0.8,
  'Spring Boot': 0.8,
  Java: 0.7,
  gRPC: 0.7,
  GraphQL: 0.65,
  Storybook: 0.65,
  'Framer Motion': 0.6,
  Cypress: 0.6,
  'D3.js': 0.6,
  'three.js': 0.6,
  MongoDB: 0.6,
  RabbitMQ: 0.6,
  'Material UI': 0.6,
  Bazel: 0.6,
  Spring: 0.6,
  Express: 0.55,

  // Still around, no longer exciting
  Angular: 0.5,
  Hibernate: 0.5,
  Maven: 0.5,
  SonarQube: 0.5,
  'SQL Server': 0.5,
  PWA: 0.5,
  HTML: 0.4,
  CSS: 0.4,
  Jenkins: 0.45,
  SASS: 0.45,
  Redux: 0.45,
  // Current, but they say more about process than craft — held down so
  // they don't outrank engineering tools on a long-running project
  Jira: 0.4,
  Miro: 0.4,
  Cucumber: 0.4,
  Puppeteer: 0.4,
  'Styled Components': 0.35,
  Camel: 0.35,
  Koa: 0.35,
  Eclipse: 0.3,
  'Java EE': 0.3,
  Heroku: 0.25,
  Thymeleaf: 0.25,
  'Standard JS': 0.25,
  'Redux Saga': 0.2,

  // Historic
  JSF: 0.15,
  Zeplin: 0.15,
  Lerna: 0.15,
  jQuery: 0.1,
  EJB3: 0.1,
  Materialize: 0.1,
  MyFaces: 0.08,
  Struts: 0.05,
  Sculptor: 0.05,
  RichFaces: 0.03,
  Seam: 0.03,
  'Google Web Toolkit': 0.03,
  Shale: 0.02,
  Hudson: 0.02,
  'Apache Continuum': 0.02,
  ADT: 0.02,
}

const popularityOf = (name: string) => TECH_POPULARITY[name] ?? 0.5

// What kind of thing is it? A language is the deepest claim you can
// make about someone, a framework is the next, and a tool is real but
// shallower — you can learn Figma in a week and not TypeScript. This
// tilts the cloud rather than sorting it, so a tool used constantly on
// current work still places high; it just won't lead.
//
// "Framework" is the broad middle: libraries, runtimes, platforms,
// databases and test frameworks all sit here. Anything unlisted lands
// here too, which is the safe default.
type TechKind = 'language' | 'framework' | 'tool'

const KIND_WEIGHT: Record<TechKind, number> = {
  language: 1,
  framework: 0.85,
  tool: 0.6,
}

const LANGUAGES = [
  'TypeScript',
  'JavaScript',
  'Java',
  'Kotlin',
  'HTML',
  'CSS',
  'SASS',
]

const TOOLS = [
  // Design and planning
  'Figma',
  'Zeplin',
  'Miro',
  'Jira',
  // Build, CI and quality
  'Maven',
  'Jenkins',
  'Hudson',
  'Apache Continuum',
  'GitHub Actions',
  'Bazel',
  'Lerna',
  'SonarQube',
  'Standard JS',
  'Storybook',
  'Sculptor',
  // Runtime platforms and hosting
  'Docker',
  'AWS',
  'GCP',
  'Heroku',
  // Editors and SDK tooling
  'Eclipse',
  'ADT',
  'Claude Code',
]

const TECH_KIND: Record<string, TechKind> = {
  ...Object.fromEntries(LANGUAGES.map((name) => [name, 'language' as const])),
  ...Object.fromEntries(TOOLS.map((name) => [name, 'tool' as const])),
}

const kindWeightOf = (name: string) =>
  KIND_WEIGHT[TECH_KIND[name] ?? 'framework']

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000

const monthsBetween = (start: string, end: string | null | undefined) => {
  const startDate = new Date(start)
  const endDate = end ? new Date(end) : new Date()
  return Math.max(
    1,
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth())
  )
}

const yearsSince = (end: string | null | undefined, now: Date) =>
  end ? Math.max(0, (now.getTime() - new Date(end).getTime()) / MS_PER_YEAR) : 0

// The `promoted` Boolean on the project content type drives the
// "Highlights" section
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

// A tech's weight answers "how much does this say about Per today?",
// which is three things multiplied together:
//
//   1. how long he used it        — months, plus a bonus per project so
//                                   breadth counts alongside depth
//   2. how recently                — halves every RECENCY_HALF_LIFE_YEARS
//                                   since the project ended; still-running
//                                   work counts in full
//   3. how current the tech is     — the popularity table above
//   4. what kind of thing it is    — language over framework over tool
//
// Without (2) a decade of mid-2000s Java outweighed four current years
// of Kotlin, which is the opposite of what a reader needs to know.
const FEATURED_USAGE_MULTIPLIER = 1.5
const PROJECT_BONUS_MONTHS = 6
const RECENCY_HALF_LIFE_YEARS = 5
// Popularity scales the weight rather than gating it, so a long stint
// in something unfashionable never disappears entirely
const POPULARITY_FLOOR = 0.3
// Raw scores are dominated by a handful of techs; the square root lifts
// the middle of the pack back into legible sizes without reordering
const scaleCurve = (ratio: number) => Math.sqrt(ratio)

export const buildTechStats = (
  projects: ProjectType[],
  now: Date = new Date()
): TechStat[] => {
  const stats = new Map<
    string,
    { projectCount: number; months: number; usage: number }
  >()

  for (const project of projects) {
    const months = monthsBetween(project.startdate, project.enddate)
    const featured = isPromoted(project) ? FEATURED_USAGE_MULTIPLIER : 1
    const recency =
      0.5 ** (yearsSince(project.enddate, now) / RECENCY_HALF_LIFE_YEARS)

    for (const rawTech of project.tech ?? []) {
      const tech = canonicalTech(rawTech)
      const entry = stats.get(tech) ?? { projectCount: 0, months: 0, usage: 0 }
      entry.projectCount += 1
      entry.months += months
      entry.usage += (months + PROJECT_BONUS_MONTHS) * featured * recency
      stats.set(tech, entry)
    }
  }

  const scored = Array.from(stats.entries()).map(([name, entry]) => ({
    name,
    projectCount: entry.projectCount,
    months: entry.months,
    score:
      entry.usage *
      (POPULARITY_FLOOR + (1 - POPULARITY_FLOOR) * popularityOf(name)) *
      kindWeightOf(name),
  }))

  const maxScore = Math.max(...scored.map(({ score }) => score), 1)

  return scored
    .sort((a, b) => b.score - a.score)
    .map(({ name, projectCount, months, score }) => ({
      name,
      projectCount,
      months,
      scale: scaleCurve(score / maxScore),
    }))
}
