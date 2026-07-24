import type { Metadata } from 'next'
import Link from 'next/link'

import { getAllProjects, getProjectDetails } from '../../../lib/api'
import {
  contentfulImageSrcSet,
  contentfulImageUrl,
} from '../../../lib/contentfulImage'
import { formatPeriodDetailed } from '../../../lib/projectHelper'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { RichText } from '../../../components/RichText'
import { Reveal } from '../../../components/Reveal'
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
    title: `✨ Per Jansson - Fullstack Web Developer - ${project.titleShort} ✨`,
    description: `I'm Per, a curious software developer. This is the story of me helping out building ${project.title}`,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const { data } = await getProjectDetails(id)
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

  return (
    <>
      <Header backLink />
      <main>
        <section className={styles.hero}>
          <img
            className={styles.heroImage}
            src={contentfulImageUrl(project.asset.url, { width: 1800 })}
            srcSet={contentfulImageSrcSet(
              project.asset.url,
              [800, 1200, 1800, 2400]
            )}
            sizes="100vw"
            alt=""
          />
          <div className={styles.heroShade} />
          <div className={`container ${styles.heroContent}`}>
            <p className="overline">{project.client}</p>
            <h1 className={styles.title}>{project.title}</h1>
          </div>
        </section>

        <div className="container">
          <Reveal>
            <section className={styles.section}>
              <ul className={styles.facts}>
                {facts.map(({ label, value }) => (
                  <li key={label} className={styles.fact}>
                    <p className={styles.factLabel}>{label}</p>
                    <p className={styles.factValue}>{value}</p>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal>
            <section className={styles.section}>
              <h2 className={styles.subheading}>The project</h2>
              <RichText richText={project.description} className={styles.prose} />
            </section>
          </Reveal>

          <Reveal>
            <section className={styles.section}>
              <h2 className={styles.subheading}>My part in it</h2>
              <RichText richText={project.me} className={styles.prose} />
            </section>
          </Reveal>

          {project.tags && project.tags.length > 0 && (
            <Reveal>
              <section className={styles.section}>
                <h2 className={styles.subheading}>On the plate</h2>
                <p className={styles.tags}>
                  {project.tags.map((tag, index) => (
                    <span key={tag}>
                      {index > 0 && (
                        <span className={styles.separator} aria-hidden="true">
                          ·
                        </span>
                      )}
                      {tag}
                    </span>
                  ))}
                </p>
              </section>
            </Reveal>
          )}

          {collaborators.length > 0 && (
            <Reveal>
              <section className={styles.section}>
                <h2 className={styles.subheading}>Around the table</h2>
                <ul className={styles.collaborators}>
                  {collaborators.map(({ name, company, linkedin }) => (
                    <li key={name + company} className={styles.collaborator}>
                      <span className={styles.collaboratorName}>
                        {linkedin ? (
                          <a href={linkedin} target="_blank" rel="noreferrer">
                            {name}
                          </a>
                        ) : (
                          name
                        )}
                      </span>
                      <span className={styles.leader} aria-hidden="true" />
                      <span className={styles.company}>{company}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          )}

          <div className={styles.backRow}>
            <Link href="/#work" className={styles.backLink}>
              Back to all work
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
