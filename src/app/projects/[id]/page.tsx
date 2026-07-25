import type { Metadata } from 'next'
import Link from 'next/link'

import { getAllProjects, getIndexPageData, getProjectDetails } from '../../../lib/api'
import { buildContactLine } from '../../../lib/contactLine'
import {
  contentfulImageSrcSet,
  contentfulImageUrl,
} from '../../../lib/contentfulImage'
import { formatPeriodDetailed } from '../../../lib/projectHelper'
import { Frame } from '../../../components/Frame'
import { SplitPanel } from '../../../components/SplitPanel'
import { RichText } from '../../../components/RichText'
import styles from './page.module.css'

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const { data } = await getAllProjects()

  return data.projects.items.map(({ sys: { id } }) => ({ id }))
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params
  const { data } = await getProjectDetails(id)
  const { project } = data

  return {
    title: `Per Jansson - Curious Software Craftsman - ${project.titleShort}`,
    description: `I'm Per, a curious software developer. This is the story of me helping out building ${project.title}`,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const [{ data }, indexData] = await Promise.all([
    getProjectDetails(id),
    getIndexPageData(),
  ])
  const { project } = data

  const facts = [
    { label: 'Client', value: project.client },
    { label: 'Role', value: project.role },
    { label: 'Where', value: project.city },
    {
      label: 'When',
      value: formatPeriodDetailed(project.startdate, project.enddate),
    },
  ].filter(({ value }) => Boolean(value))

  const collaborators = project.collaborators?.items ?? []

  // The `links` JSON field is freeform in Contentful — only render
  // entries that actually look like {label, url}
  const links = (project.links ?? []).filter(
    (link) => typeof link?.label === 'string' && typeof link?.url === 'string'
  )

  return (
    <Frame contactLine={buildContactLine(indexData.data.me)}>
      <SplitPanel
        title={project.titleShort}
        chips={
          <Link href="/work/" className="chip">
            ← All work
          </Link>
        }
      >
        <img
          className={styles.image}
          src={contentfulImageUrl(project.asset.url, { width: 1400 })}
          srcSet={contentfulImageSrcSet(project.asset.url, [700, 1400, 2000])}
          sizes="(max-width: 860px) 100vw, 50vw"
          alt=""
        />

        <ul className={styles.facts}>
          {facts.map(({ label, value }) => (
            <li key={label} className={styles.factRow}>
              <span className={styles.factLabel}>{label}</span>
              <span className={styles.factValue}>{value}</span>
            </li>
          ))}
        </ul>

        <section className={styles.section}>
          <h2 className={styles.heading}>The project</h2>
          <RichText richText={project.description} className={styles.prose} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>My part in it</h2>
          <RichText richText={project.me} className={styles.prose} />
        </section>

        {links.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.heading}>In the papers</h2>
            <ul className={styles.links}>
              {links.map(({ label, url }) => (
                <li key={url} className={styles.linkRow}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.linkLabel}
                  >
                    {label}
                  </a>
                  <span className={styles.linkHost} aria-hidden="true">
                    {new URL(url).hostname.replace(/^www\./, '')} ↗
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.tags && project.tags.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.heading}>On the plate</h2>
            <div className={styles.tags}>
              {project.tags.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {collaborators.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.heading}>Around the table</h2>
            <ul className={styles.collaborators}>
              {collaborators.map(({ name, company, linkedin }) => (
                <li key={name + company} className={styles.collabRow}>
                  {linkedin ? (
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.collabName}
                    >
                      {name}
                    </a>
                  ) : (
                    <span className={styles.collabName}>{name}</span>
                  )}
                  <span className={styles.collabCompany}>{company}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </SplitPanel>
    </Frame>
  )
}
