'use client'

import { useState } from 'react'
import Link from 'next/link'

import { TechStat, WorkItem } from '../lib/workData'
import { SplitPanel } from './SplitPanel'
import styles from './WorkExplorer.module.css'

interface WorkExplorerProps {
  items: WorkItem[]
  techStats: TechStat[]
}

const ProjectList: React.FC<{ items: WorkItem[] }> = ({ items }) => (
  <ul className={styles.list}>
    {items.map((item) => (
      <li key={item.id} className={styles.item}>
        <Link href={`/projects/${item.id}/`}>
          <span className={styles.row}>
            <span className={styles.name}>{item.titleShort}</span>
            <span className={styles.year}>{item.period}</span>
          </span>
          <span className={styles.meta}>
            {item.role} · {item.client}
          </span>
        </Link>
      </li>
    ))}
  </ul>
)

export const WorkExplorer: React.FC<WorkExplorerProps> = ({
  items,
  techStats,
}) => {
  const [activeTechs, setActiveTechs] = useState<string[]>([])

  const toggleTech = (tech: string) =>
    setActiveTechs((current) =>
      current.includes(tech)
        ? current.filter((t) => t !== tech)
        : [...current, tech]
    )

  // Selected techs narrow the list (project must use all of them)
  const visible = items.filter((item) =>
    activeTechs.every((tech) => item.tech.includes(tech))
  )

  // Only offer techs that keep at least one project on the menu, so a
  // dead-end selection is impossible; active chips always stay to allow
  // deselecting.
  const availableTechs = new Set(visible.flatMap((item) => item.tech))
  const shownStats = techStats.filter(
    ({ name }) => activeTechs.includes(name) || availableTechs.has(name)
  )

  const selected = visible.filter((item) => item.promoted)
  const rest = visible.filter((item) => !item.promoted)

  return (
    <SplitPanel
      title="Work"
      align="top"
      chips={
        <div className={styles.filters}>
          {shownStats.map(({ name, projectCount, months, scale }) => (
            <button
              key={name}
              type="button"
              className={`chip ${styles.techChip} ${
                activeTechs.includes(name) ? styles.techChipActive : ''
              }`}
              style={{ fontSize: `${0.62 + scale * 0.42}rem` }}
              onClick={() => toggleTech(name)}
              aria-pressed={activeTechs.includes(name)}
              title={`${projectCount} project${
                projectCount === 1 ? '' : 's'
              }, about ${Math.round(months / 12)} year${
                Math.round(months / 12) === 1 ? '' : 's'
              }`}
            >
              {name}
            </button>
          ))}
          {activeTechs.length > 0 && (
            <button
              type="button"
              className={`chip ${styles.clearChip}`}
              onClick={() => setActiveTechs([])}
            >
              × Clear filter
            </button>
          )}
        </div>
      }
    >
      {/* Keyed by the visible projects, so the fade only plays when the
          list actually changes — not on every chip press */}
      <div key={visible.map((item) => item.id).join('|')} className={styles.lists}>
        {selected.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.heading}>Selected work</h2>
            <ProjectList items={selected} />
          </section>
        )}
        {rest.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.heading}>All work</h2>
            <ProjectList items={rest} />
          </section>
        )}
      </div>
    </SplitPanel>
  )
}
