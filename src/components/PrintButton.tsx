'use client'

import styles from './PrintButton.module.css'

// The browser's own print dialog is also the "save as PDF" dialog, so this
// is the download button too. Hidden in the printed output by page.module.css.
export const PrintButton: React.FC = () => (
  <button type="button" className={styles.print} onClick={() => window.print()}>
    Print / save as PDF
  </button>
)
