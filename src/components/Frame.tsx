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
      <div className={styles.copyright}>
        <span className={styles.copyrightSign} aria-hidden="true">
          ©
        </span>{' '}
        {new Date().getFullYear()} Per Jansson
      </div>
      <div className={styles.contactLine}>
        {contactLine ?? 'Turku, Finland'}
      </div>
    </footer>
  </div>
)
