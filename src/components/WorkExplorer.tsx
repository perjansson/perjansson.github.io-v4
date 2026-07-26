'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import { TechStat, WorkItem } from '../lib/workData'
import { SplitPanel } from './SplitPanel'
import styles from './WorkExplorer.module.css'

interface WorkExplorerProps {
  items: WorkItem[]
  techStats: TechStat[]
}

const TECH_PARAM = 'tech'

// Comma separated, so a shared link reads /work/?tech=Kotlin,Jetpack%20Compose
// instead of a wall of repeated keys. No tech name contains a comma.
// Unknown names are dropped rather than trusted, otherwise a stale or
// hand-edited link lands on an empty list with no chip left to press.
const parseTechParam = (search: string, known: Set<string>) => {
  const raw = new URLSearchParams(search).get(TECH_PARAM)
  if (!raw) {
    return []
  }
  return raw
    .split(',')
    .map((name) => name.trim())
    .filter((name) => known.has(name))
}

const techSearch = (techs: string[]) =>
  techs.length
    ? `?${TECH_PARAM}=${techs.map(encodeURIComponent).join(',')}`
    : ''

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
      setActiveTechs(parseTechParam(window.location.search, knownTechs))

    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [knownTechs])

  const applyTechs = useCallback((next: string[]) => {
    setActiveTechs(next)
    window.history.pushState(
      null,
      '',
      `${window.location.pathname}${techSearch(next)}`
    )
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
        </div>
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
