import type { Metadata } from 'next'

import { getIndexPageData } from '../../lib/api'
import { buildContactLine } from '../../lib/contactLine'
import { Frame } from '../../components/Frame'
import { SplitPanel } from '../../components/SplitPanel'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: '✨ Per Jansson - Fullstack Web Developer - Contact ✨',
}

const prettyUrl = (url: string) =>
  url
    .replace(/^mailto:/, '')
    .replace(/^https?:\/\/(www\.)?/, '')
    .replace(/\/$/, '')

export default async function ContactPage() {
  const { data } = await getIndexPageData()
  const { me } = data

  return (
    <Frame contactLine={buildContactLine(me)}>
      <SplitPanel title="Contact">
        <h2 className={styles.heading}>Find me here</h2>
        <ul className={styles.list}>
          {me.contacts.items.filter(Boolean).map(({ medium, url }) => (
            <li key={medium}>
              <a
                href={url}
                target={url.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
                className={styles.row}
              >
                <span className={styles.medium}>{medium}</span>
                <span className={styles.handle}>{prettyUrl(url)}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.address}>
          <span>{me.name}</span>
          <br />
          <span>{me.title}</span>
          <br />
          <span>Turku, Finland</span>
        </p>
      </SplitPanel>
    </Frame>
  )
}
