'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import styles from './Header.module.css'

const NAV_ITEMS = [
  { label: 'Story', href: '/#story' },
  { label: 'Work', href: '/#work' },
  { label: 'Craft', href: '/#craft' },
  { label: 'Contact', href: '/#contact' },
]

interface HeaderProps {
  backLink?: boolean
}

export const Header: React.FC<HeaderProps> = ({ backLink = false }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}
    >
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.wordmark} aria-label="Per Jansson — home">
          P<em>.</em>Jansson
        </Link>

        {backLink ? (
          <nav className={styles.nav}>
            <Link href="/#work" className={styles.navLink}>
              ← All work
            </Link>
          </nav>
        ) : (
          <>
            <nav
              className={`${styles.nav} ${isOpen ? styles.navOpen : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {NAV_ITEMS.map(({ label, href }) => (
                <Link key={label} href={href} className={styles.navLink}>
                  {label}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setIsOpen((open) => !open)}
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? 'Close' : 'Menu'}
            </button>
          </>
        )}
      </div>
    </header>
  )
}
