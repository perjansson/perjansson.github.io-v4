import { TopBar } from './TopBar'
import styles from './Frame.module.css'

interface FrameProps {
  children: React.ReactNode
  /** mailto: href for the footer's "Email me" link */
  contactEmail?: string
}

// Page shell: social icons + burger above a thick-bordered frame,
// with the language-switcher-style strip below — the E.Ekblom chrome.
export const Frame: React.FC<FrameProps> = ({ children, contactEmail }) => (
  <div className={styles.page}>
    <TopBar />
    <main className={styles.frame}>{children}</main>
    <footer className={styles.strip}>
      <div className={styles.copyright}>
        <span className={styles.copyrightSign} aria-hidden="true">
          ©
        </span>
        <span>{new Date().getFullYear()} Per Jansson</span>
      </div>
      {contactEmail && (
        <a href={contactEmail} className={styles.contactLink}>
          Email me
        </a>
      )}
    </footer>
  </div>
)
