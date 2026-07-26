import Link from 'next/link'

import { Frame } from '../components/Frame'
import { SplitPanel } from '../components/SplitPanel'
import styles from './not-found.module.css'

// The menu card for a dish the kitchen has run out of
export default function NotFound() {
  return (
    <Frame>
      <SplitPanel
        title="404"
        chips={<span className={styles.chip}>Off the menu</span>}
      >
        <h2 className={styles.heading}>Not on today&apos;s card</h2>
        <p className={styles.body}>
          Whatever was at this address has been taken off. It may have moved,
          or it may never have existed.
        </p>
        <ul className={styles.links}>
          <li>
            <Link href="/" className={styles.link}>
              Front page
            </Link>
          </li>
          <li>
            <Link href="/work/" className={styles.link}>
              Every project
            </Link>
          </li>
          <li>
            <Link href="/contact/" className={styles.link}>
              Contact
            </Link>
          </li>
        </ul>
      </SplitPanel>
    </Frame>
  )
}
