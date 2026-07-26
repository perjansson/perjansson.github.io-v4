import { Logo } from './Logo'
import { ScrollPastLogo } from './ScrollPastLogo'
import styles from './SplitPanel.module.css'

interface SplitPanelProps {
  title?: string
  chips?: React.ReactNode
  /** Replaces the default logo + title + chips stack entirely */
  left?: React.ReactNode
  /**
   * 'center' suits short left content; 'top' anchors it so growing
   * content (chip clouds, project facts) extends downward and scrolls
   * instead of recentering and jumping on every change
   */
  align?: 'center' | 'top'
  children: React.ReactNode
}

// The recurring E.Ekblom page layout: logo panel on the left with the page
// name (and optional label chips), content panel on the right.
export const SplitPanel: React.FC<SplitPanelProps> = ({
  title,
  chips,
  left,
  align = 'center',
  children,
}) => (
  <div className={styles.split}>
    <section
      className={`${styles.left} ${align === 'top' ? styles.leftTop : ''}`}
    >
      {left ?? (
        <>
          <Logo />
          <h1 className={styles.pageTitle}>{title}</h1>
          {chips && <div className={styles.chips}>{chips}</div>}
          <ScrollPastLogo />
        </>
      )}
    </section>
    <section className={styles.right}>{children}</section>
  </div>
)
