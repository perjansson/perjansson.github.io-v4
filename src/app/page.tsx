import Link from 'next/link'

import { getIndexPageData } from '../lib/api'
import { buildContactEmail, profileUrls } from '../lib/contactLine'
import { SITE_DESCRIPTION, SITE_URL } from '../lib/site'
import { Frame } from '../components/Frame'
import { JsonLd } from '../components/JsonLd'
import { Logo } from '../components/Logo'
import {
  BookSketch,
  LaptopSketch,
  WrenchSketch,
  MailboxSketch,
} from '../components/illustrations'
import styles from './page.module.css'

const CARDS = [
  { label: 'The Story', href: '/story/', Sketch: BookSketch },
  { label: 'Work', href: '/work/', Sketch: LaptopSketch },
  { label: 'Craft', href: '/craft/', Sketch: WrenchSketch },
  { label: 'Contact', href: '/contact/', Sketch: MailboxSketch },
]

export default async function Home() {
  const { data } = await getIndexPageData()
  const { me } = data

  return (
    <Frame contactEmail={buildContactEmail(me)}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: me.name,
          givenName: me.firstName,
          familyName: me.lastName,
          jobTitle: 'Curious Software Craftsman',
          description: SITE_DESCRIPTION,
          url: SITE_URL,
          sameAs: profileUrls(me),
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Turku',
            addressCountry: 'FI',
          },
        }}
      />
      <div className={styles.home}>
        <section className={styles.intro}>
          <Logo />
          <p className={styles.tagline}>
            Curious.
            <br />
            Committed.
            <br />
            Full&nbsp;stack.
          </p>
          <p className={styles.byline}>
            {me.name} — Curious Software Craftsman
          </p>
        </section>
        <nav className={styles.grid} aria-label="Main">
          {CARDS.map(({ label, href, Sketch }) => (
            <Link key={href} href={href} className={styles.card}>
              <span className={styles.illustration}>
                <Sketch />
              </span>
              <span className={styles.label}>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </Frame>
  )
}
