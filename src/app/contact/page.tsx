import type { Metadata } from 'next'

import { getIndexPageData } from '../../lib/api'
import { buildContactEmail } from '../../lib/contactLine'
import { Frame } from '../../components/Frame'
import { SplitPanel } from '../../components/SplitPanel'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Per Jansson - Curious Software Craftsman - Contact',
}

const prettyUrl = (url: string) =>
  url
    .replace(/^mailto:/, '')
    .replace(/^https?:\/\/(www\.)?/, '')
    .replace(/\/$/, '')

const HIDDEN_CHANNELS = ['stackoverflow', 'twitter', 'facebook']

// Matches "Stack Overflow", "stack-overflow", twitter.com/x.com urls etc.
const isHiddenChannel = ({ medium, url }: { medium: string; url: string }) => {
  const normalizedMedium = medium.toLowerCase().replace(/[^a-z0-9]/g, '')
  const normalizedUrl = url.toLowerCase()
  return HIDDEN_CHANNELS.some(
    (hidden) =>
      normalizedMedium.includes(hidden) || normalizedUrl.includes(hidden)
  )
}

export default async function ContactPage() {
  const { data } = await getIndexPageData()
  const { me } = data

  return (
    <Frame contactEmail={buildContactEmail(me)}>
      <SplitPanel title="Contact">
        <h2 className={styles.heading}>Find me here</h2>
        <ul className={styles.list}>
          {me.contacts.items
            .filter(Boolean)
            .filter((contact) => !isHiddenChannel(contact))
            .map(({ medium, url }) => (
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
          <span>Curious Software Craftsman</span>
          <br />
          <span>Turku, Finland</span>
        </p>
      </SplitPanel>
    </Frame>
  )
}
