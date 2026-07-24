import styles from './Footer.module.css'

export const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className="container">
      <div className={styles.wordmark}>
        P<em>.</em>Jansson
      </div>
      <p className={styles.meta}>
        © {new Date().getFullYear()} Per Jansson · Built with{' '}
        <a href="https://nextjs.org" target="_blank" rel="noreferrer">
          Next.js
        </a>{' '}
        &{' '}
        <a href="https://www.contentful.com" target="_blank" rel="noreferrer">
          Contentful
        </a>
      </p>
    </div>
  </footer>
)
