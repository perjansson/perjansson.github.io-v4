import { Logo } from './Logo'
import styles from './SplitPanel.module.css'

interface SplitPanelProps {
  title: string
  chips?: React.ReactNode
  children: React.ReactNode
}

// The recurring E.Ekblom page layout: logo panel on the left with the page
// name (and optional label chips), content panel on the right.
export const SplitPanel: React.FC<SplitPanelProps> = ({
  title,
  chips,
  children,
}) => (
  <div className={styles.split}>
    <section className={styles.left}>
      <Logo />
      <h1 className={styles.pageTitle}>{title}</h1>
      {chips && <div className={styles.chips}>{chips}</div>}
    </section>
    <section className={styles.right}>{children}</section>
  </div>
)
