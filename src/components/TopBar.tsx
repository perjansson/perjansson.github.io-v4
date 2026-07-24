'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import styles from './TopBar.module.css'

const MENU_ITEMS = [
  { label: 'Front page', href: '/' },
  { label: 'Story', href: '/story/' },
  { label: 'Work', href: '/work/' },
  { label: 'Craft', href: '/craft/' },
  { label: 'Contact', href: '/contact/' },
]

const SOCIAL_ICONS = [
  { name: 'GitHub', href: 'https://github.com/perjansson', icon: 'github' },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/perjansson/',
    icon: 'linkedin',
  },
]

export const TopBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.social}>
          {SOCIAL_ICONS.map(({ name, href, icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={name}
              className={styles.socialIcon}
              style={{
                maskImage: `url(/icons/social/${icon}.svg)`,
                WebkitMaskImage: `url(/icons/social/${icon}.svg)`,
              }}
            />
          ))}
        </div>
        <button
          type="button"
          className={styles.burger}
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          aria-expanded={isOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={() => setIsOpen(false)}
      />
      <nav
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          className={styles.close}
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          ×
        </button>
        {MENU_ITEMS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.menuLink} ${
              pathname === href ? styles.menuLinkActive : ''
            }`}
            onClick={() => setIsOpen(false)}
            tabIndex={isOpen ? 0 : -1}
          >
            {label}
          </Link>
        ))}
      </nav>
    </>
  )
}
