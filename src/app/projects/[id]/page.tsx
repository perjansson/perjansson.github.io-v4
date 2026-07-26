import type { Metadata } from 'next'
import Link from 'next/link'

import { getAllProjects, getIndexPageData, getProjectDetails } from '../../../lib/api'
import { buildContactEmail } from '../../../lib/contactLine'
import {
  contentfulImageSrcSet,
  contentfulImageUrl,
} from '../../../lib/contentfulImage'
import { formatPeriodDetailed } from '../../../lib/projectHelper'
import { canonicalTech, techFilterHref } from '../../../lib/workData'
import { Frame } from '../../../components/Frame'
import { SplitPanel } from '../../../components/SplitPanel'
import { RichText } from '../../../components/RichText'
import { FadeImage } from '../../../components/FadeImage'
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
    description: `I'm Per, a curious software craftsman. This is the story of me helping out building ${project.title}`,
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

  // The `links` JSON field is freeform in Contentful — only render
  // entries that actually look like {label, url}
  const links = (project.links ?? []).filter(
    (link) => typeof link?.label === 'string' && typeof link?.url === 'string'
  )

  // The curated tech list (same spelling fixes as the work page filters)
  const tech = (project.tech ?? []).map(canonicalTech)

  // Contentful hands the collection back newest first, so the entry before
  // this one is the more recent project and the one after is the older
  const ordered = indexData.data.projects.items
  const position = ordered.findIndex(({ sys }) => sys.id === id)
  const newer = position > 0 ? ordered[position - 1] : undefined
  const older =
    position >= 0 && position < ordered.length - 1
      ? ordered[position + 1]
      : undefined

  return (
    <Frame contactEmail={buildContactEmail(indexData.data.me)}>
      <SplitPanel
        align="top"
        left={
          <div className={styles.hero}>
            <FadeImage
              className={styles.heroImage}
              src={contentfulImageUrl(project.asset.url, { width: 1400 })}
              srcSet={contentfulImageSrcSet(project.asset.url, [700, 1400, 2000])}
              sizes="(max-width: 860px) 100vw, 50vw"
              alt=""
              placeholder={project.assetPlaceholder}
            />
            <h1 className={styles.heroTitle}>{project.titleShort}</h1>
            <ul className={styles.facts}>
              {facts.map(({ label, value }) => (
                <li key={label} className={styles.factRow}>
                  <span className={styles.factLabel}>{label}</span>
                  <span className={styles.factValue}>{value}</span>
                </li>
              ))}
            </ul>
            <Link href="/work/" className="chip">
              ← Everything
            </Link>
          </div>
        }
      >
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

        {tech.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.heading}>On the plate</h2>
            {/* Each chip is a way back into the work list, already narrowed
                to that tech, rather than a dead label */}
            <div className={styles.tags}>
              {tech.map((name) => (
                <Link key={name} href={techFilterHref([name])} className="chip">
                  {name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {(newer || older) && (
          <nav className={styles.pager} aria-label="Other projects">
            {newer ? (
              <Link
                href={`/projects/${newer.sys.id}/`}
                className={styles.pagerLink}
              >
                <span className={styles.pagerLabel}>← Newer</span>
                <span className={styles.pagerTitle}>{newer.titleShort}</span>
              </Link>
            ) : (
              <span />
            )}
            {older && (
              <Link
                href={`/projects/${older.sys.id}/`}
                className={`${styles.pagerLink} ${styles.pagerLinkEnd}`}
              >
                <span className={styles.pagerLabel}>Older →</span>
                <span className={styles.pagerTitle}>{older.titleShort}</span>
              </Link>
            )}
          </nav>
        )}
      </SplitPanel>
    </Frame>
  )
}
