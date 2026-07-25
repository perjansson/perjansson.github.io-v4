import type { Metadata } from 'next'

import { getIndexPageData } from '../../lib/api'
import { buildContactEmail } from '../../lib/contactLine'
import { Frame } from '../../components/Frame'
import { SplitPanel } from '../../components/SplitPanel'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Per Jansson - Curious Software Craftsman - Craft',
}

export default async function CraftPage() {
  const { data } = await getIndexPageData()
  const { me, projects } = data

  // Aggregate the tech list like a cellar list: name plus where it was poured
  const techClients = new Map<string, Set<string>>()
  for (const project of projects.items) {
    for (const tech of project.tech ?? []) {
      if (!techClients.has(tech)) {
        techClients.set(tech, new Set())
      }
      techClients.get(tech)!.add(project.client)
    }
  }

  return (
    <Frame contactEmail={buildContactEmail(me)}>
      <SplitPanel title="Craft">
        <h2 className={styles.heading}>Tools of the trade</h2>
        <ul className={styles.list}>
          {Array.from(techClients.entries()).map(([tech, clients]) => (
            <li key={tech} className={styles.item}>
              <div className={styles.name}>{tech}</div>
              <div className={styles.clients}>
                {Array.from(clients).join(', ')}
              </div>
            </li>
          ))}
        </ul>
      </SplitPanel>
    </Frame>
  )
}
