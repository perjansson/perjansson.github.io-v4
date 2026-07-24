import type { Metadata } from 'next'
import Link from 'next/link'

import { getIndexPageData } from '../../lib/api'
import { buildContactLine } from '../../lib/contactLine'
import { formatPeriod } from '../../lib/projectHelper'
import { Frame } from '../../components/Frame'
import { SplitPanel } from '../../components/SplitPanel'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: '✨ Per Jansson - Fullstack Web Developer - Work ✨',
}

export default async function WorkPage() {
  const { data } = await getIndexPageData()
  const { me, projects } = data

  const techs = Array.from(
    new Set(projects.items.flatMap((project) => project.tech ?? []))
  ).slice(0, 8)

  return (
    <Frame contactLine={buildContactLine(me)}>
      <SplitPanel
        title="Work"
        chips={techs.map((tech) => (
          <span key={tech} className="chip">
            {tech}
          </span>
        ))}
      >
        <h2 className={styles.heading}>Selected work</h2>
        <ul className={styles.list}>
          {projects.items.map((project) => (
            <li key={project.sys.id} className={styles.item}>
              <Link href={`/projects/${project.sys.id}/`}>
                <span className={styles.row}>
                  <span className={styles.name}>{project.titleShort}</span>
                  <span className={styles.year}>
                    {formatPeriod(project.startdate, project.enddate)}
                  </span>
                </span>
                <span className={styles.meta}>
                  {project.role} · {project.client}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </SplitPanel>
    </Frame>
  )
}
