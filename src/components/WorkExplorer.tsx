'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import {
  TECH_KINDS,
  TechStat,
  WorkItem,
  parseTechFilter,
  techFilterHref,
} from '../lib/workData'
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

  const knownTechs = useMemo(
    () => new Set(techStats.map(({ name }) => name)),
    [techStats]
  )

  // The filter lives in the URL, so a narrowed view can be bookmarked or
  // shared and the back button steps back through it. State stays the
  // source of truth for rendering: the page prerenders unfiltered, which
  // keeps the whole project list in the static HTML for crawlers, and the
  // URL is read once on mount and on every popstate.
  useEffect(() => {
    const sync = () =>
      setActiveTechs(parseTechFilter(window.location.search, knownTechs))

    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [knownTechs])

  const applyTechs = useCallback((next: string[]) => {
    setActiveTechs(next)
    window.history.pushState(null, '', techFilterHref(next))
  }, [])

  const toggleTech = (tech: string) =>
    applyTechs(
      activeTechs.includes(tech)
        ? activeTechs.filter((t) => t !== tech)
        : [...activeTechs, tech]
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
      chips={
        // A fixed-size box under the logo: several chip rows visible,
        // internal scroll for the rest — its height never changes, so
        // the logo stays put and filtering can't shift the page
        <>
          <div className={styles.filters}>
            {activeTechs.length > 0 && (
              <button
                type="button"
                className={`chip ${styles.clearChip}`}
                onClick={() => applyTechs([])}
              >
                × Clear
              </button>
            )}
            {TECH_KINDS.map(({ kind, label }) => {
              const group = shownStats.filter((stat) => stat.kind === kind)
              if (group.length === 0) {
                return null
              }

              return (
                <div
                  key={kind}
                  className={styles.group}
                  role="group"
                  aria-labelledby={`tech-kind-${kind}`}
                >
                  <p id={`tech-kind-${kind}`} className={styles.groupLabel}>
                    {label}
                  </p>
                  <div className={styles.groupChips}>
                    {group.map(({ name, projectCount, months, scale }) => (
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
                  </div>
                </div>
              )
            })}
          </div>
          {/* aria-live so a screen reader hears the list shrink; the chips
              themselves only announce their own pressed state */}
          <p className={styles.matchCount} aria-live="polite">
            {activeTechs.length > 0
              ? `${visible.length} of ${items.length} projects`
              : `${items.length} projects`}
          </p>
        </>
      }
    >
      {/* Keyed by the visible projects, so the fade only plays when the
          list actually changes — not on every chip press */}
      <div key={visible.map((item) => item.id).join('|')} className={styles.lists}>
        {selected.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.heading}>Highlights</h2>
            <ProjectList items={selected} />
          </section>
        )}
        {rest.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.heading}>Everything</h2>
            <ProjectList items={rest} />
          </section>
        )}
      </div>
    </SplitPanel>
  )
}
