import Link from 'next/link'

import { ProjectsType } from '../types'
import { formatPeriod } from '../lib/projectHelper'
import { Reveal } from './Reveal'
import styles from './WorkMenu.module.css'

interface WorkMenuProps {
  projects: ProjectsType
}

export const WorkMenu: React.FC<WorkMenuProps> = ({ projects }) => (
  <section id="work" className={styles.work}>
    <div className="container">
      <Reveal>
        <header className="sectionHeader">
          <p className="overline">The Menu</p>
          <h2 className="sectionHeading">Selected work</h2>
          <hr className="rule" />
        </header>
      </Reveal>
      <Reveal delay={120}>
        <div className={styles.card}>
          <ul className={styles.list}>
            {projects.map((project) => (
              <li key={project.sys.id} className={styles.item}>
                <Link
                  href={`/projects/${project.sys.id}/`}
                  className={styles.link}
                >
                  <div className={styles.titleRow}>
                    <h3 className={styles.title}>{project.titleShort}</h3>
                    <span className={styles.leader} aria-hidden="true" />
                    <span className={styles.year}>
                      {formatPeriod(project.startdate, project.enddate)}
                    </span>
                  </div>
                  <p className={styles.role}>
                    {project.role} · <span className={styles.client}>{project.client}</span>
                  </p>
                  {project.tech && project.tech.length > 0 && (
                    <p className={styles.tech}>{project.tech.join(' · ')}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  </section>
)
