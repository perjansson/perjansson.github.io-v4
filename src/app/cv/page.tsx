import type { Metadata } from 'next'
import Link from 'next/link'

import { getIndexPageData } from '../../lib/api'
import { visibleContacts } from '../../lib/contactLine'
import { formatPeriodDetailed } from '../../lib/projectHelper'
import { SITE_URL } from '../../lib/site'
import { TECH_KINDS, buildTechStats, canonicalTech } from '../../lib/workData'
import { ARTICLES, articleUrl, articleYear } from '../../lib/writingData'
import { PrintButton } from '../../components/PrintButton'
import { RichText } from '../../components/RichText'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Per Jansson - Curious Software Craftsman - CV',
  description:
    'The curriculum vitae of Per Jansson, fullstack software developer, generated from the same content as the rest of the site.',
}

const prettyUrl = (url: string) =>
  url.replace(/^mailto:/, '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

export default async function CvPage() {
  const { data } = await getIndexPageData()
  const { me, projects } = data

  // Same weighting as the work page's chip cloud, so the CV agrees with the
  // site about what Per leads with
  const techStats = buildTechStats(projects.items)

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <Link href="/" className={styles.back}>
          ← perjansson.me
        </Link>
        <PrintButton />
      </div>

      <article className={styles.cv}>
        <header className={styles.header}>
          <h1 className={styles.name}>{me.name}</h1>
          <p className={styles.role}>Curious Software Craftsman</p>
          <ul className={styles.channels}>
            <li>Turku, Finland</li>
            {visibleContacts(me).map(({ medium, url }) => (
              <li key={medium}>
                <a href={url}>{prettyUrl(url)}</a>
              </li>
            ))}
            <li>
              <a href={SITE_URL}>perjansson.me</a>
            </li>
          </ul>
        </header>

        <section className={styles.section}>
          <h2 className={styles.heading}>Profile</h2>
          <RichText richText={me.short} className={styles.prose} />
          <RichText richText={me.long} className={styles.prose} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Skills</h2>
          <dl className={styles.skills}>
            {TECH_KINDS.map(({ kind, label }) => {
              const group = techStats.filter((stat) => stat.kind === kind)
              if (group.length === 0) {
                return null
              }

              return (
                <div key={kind} className={styles.skillRow}>
                  <dt className={styles.skillLabel}>{label}</dt>
                  <dd className={styles.skillValue}>
                    {group.map(({ name }) => name).join(', ')}
                  </dd>
                </div>
              )
            })}
          </dl>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Experience</h2>
          {projects.items.map((project) => (
            <div key={project.sys.id} className={styles.entry}>
              {/* Stacked, not two columns: a real entry reads "Inflight
                  entertainment (IFE) · Cathay Pacific / Panasonic Avionics"
                  against "Jun 2022 – present · Los Angeles / Hong Kong /
                  Helsinki / Turku", and side by side neither fits even on
                  paper. The name was losing and breaking mid-word. */}
              <h3 className={styles.entryTitle}>
                {project.titleShort}
                <span className={styles.entryClient}>{project.client}</span>
              </h3>
              <p className={styles.entryWhen}>
                {formatPeriodDetailed(project.startdate, project.enddate)}
                {project.city ? ` · ${project.city}` : ''}
              </p>
              <p className={styles.entryRole}>{project.role}</p>
              {(project.tech ?? []).length > 0 && (
                <p className={styles.entryTech}>
                  {(project.tech ?? []).map(canonicalTech).join(', ')}
                </p>
              )}
            </div>
          ))}
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Writing</h2>
          <ul className={styles.articles}>
            {ARTICLES.map((article) => (
              <li key={article.slug} className={styles.article}>
                <a href={articleUrl(article)}>{article.title}</a>
                {articleYear(article) && (
                  <span className={styles.articleYear}>
                    {articleYear(article)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <footer className={styles.footer}>
          Generated from perjansson.me, which is generated from the same
          content management system this CV reads.
        </footer>
      </article>
    </div>
  )
}
