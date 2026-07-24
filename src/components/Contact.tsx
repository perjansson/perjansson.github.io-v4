import { MeType } from '../types'
import { Reveal } from './Reveal'
import styles from './Contact.module.css'

interface ContactProps {
  me: MeType
}

const prettyUrl = (url: string) =>
  url
    .replace(/^mailto:/, '')
    .replace(/^https?:\/\/(www\.)?/, '')
    .replace(/\/$/, '')

export const Contact: React.FC<ContactProps> = ({ me }) => {
  const contacts = me.contacts.items.filter(Boolean)
  const email = contacts.find(({ url }) => url.startsWith('mailto:'))

  return (
    <section id="contact" className={styles.contact}>
      <div className="container">
        <Reveal>
          <header className="sectionHeader">
            <p className="overline">Contact</p>
            <h2 className="sectionHeading">Find me here</h2>
            <hr className="rule" />
          </header>
        </Reveal>
        <Reveal delay={120}>
          <ul className={styles.table}>
            {contacts.map(({ medium, url }) => (
              <li key={medium}>
                <a
                  href={url}
                  target={url.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noreferrer"
                  className={styles.row}
                >
                  <span className={styles.medium}>{medium}</span>
                  <span className={styles.leader} aria-hidden="true" />
                  <span className={styles.handle}>{prettyUrl(url)}</span>
                </a>
              </li>
            ))}
          </ul>
          {email && (
            <a href={email.url} className={styles.cta}>
              Say hello
            </a>
          )}
        </Reveal>
      </div>
    </section>
  )
}
