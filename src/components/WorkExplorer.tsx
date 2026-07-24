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
  const [activeTech, setActiveTech] = useState<string | null>(null)

  const visible = activeTech
    ? items.filter((item) => item.tech.includes(activeTech))
    : items

  const selected = visible.filter((item) => item.promoted)
  const rest = visible.filter((item) => !item.promoted)

  return (
    <SplitPanel
      title="Work"
      chips={
        <>
          {techStats.map(({ name, projectCount, months, scale }) => (
            <button
              key={name}
              type="button"
              className={`chip ${styles.techChip} ${
                activeTech === name ? styles.techChipActive : ''
              }`}
              style={{ fontSize: `${0.62 + scale * 0.42}rem` }}
              onClick={() =>
                setActiveTech(activeTech === name ? null : name)
              }
              aria-pressed={activeTech === name}
              title={`${projectCount} project${
                projectCount === 1 ? '' : 's'
              }, about ${Math.round(months / 12)} year${
                Math.round(months / 12) === 1 ? '' : 's'
              }`}
            >
              {name}
            </button>
          ))}
          {activeTech && (
            <button
              type="button"
              className={`chip ${styles.clearChip}`}
              onClick={() => setActiveTech(null)}
            >
              × Clear filter
            </button>
          )}
        </>
      }
    >
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
      {visible.length === 0 && (
        <p className={styles.empty}>Nothing on the menu with {activeTech}.</p>
      )}
    </SplitPanel>
  )
}
