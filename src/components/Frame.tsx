import { TopBar } from './TopBar'
import styles from './Frame.module.css'

interface FrameProps {
  children: React.ReactNode
  contactLine?: string
}

// Page shell: social icons + burger above a thick-bordered frame,
// with the language-switcher-style strip below — the E.Ekblom chrome.
export const Frame: React.FC<FrameProps> = ({ children, contactLine }) => (
  <div className={styles.page}>
    <TopBar />
    <main className={styles.frame}>{children}</main>
    <footer className={styles.strip}>
      <div className={styles.versions}>
        <a
          href="https://github.com/perjansson/perjansson.github.io-v3"
          target="_blank"
          rel="noreferrer"
          className={styles.versionLink}
        >
          V3
        </a>
        <span className={styles.versionCurrent}>V4</span>
      </div>
      <div className={styles.contactLine}>
        {contactLine ?? 'Turku, Finland'}
      </div>
    </footer>
  </div>
)
