'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ThemeToggle } from './ThemeToggle'
import styles from './TopBar.module.css'

const MENU_ITEMS = [
  { label: 'Front page', href: '/' },
  { label: 'Story', href: '/story/' },
  { label: 'Work', href: '/work/' },
  { label: 'Craft', href: '/craft/' },
  { label: 'Writing', href: '/writing/' },
  { label: 'CV', href: '/cv/' },
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
  const panelRef = useRef<HTMLElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)

  const close = useCallback(() => setIsOpen(false), [])

  // While the menu is open it owns the keyboard: Escape closes it, and Tab
  // cycles inside the panel so focus can't wander onto the page behind it.
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const panel = panelRef.current
    panel?.querySelector<HTMLElement>('button')?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'Tab' || !panel) {
        return
      }

      const stops = panel.querySelectorAll<HTMLElement>('a[href], button')
      const first = stops[0]
      const last = stops[stops.length - 1]
      if (!first) {
        return
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, close])

  // Hand focus back to the burger on close, so the tab order resumes where
  // the user left it instead of restarting at the top of the document
  useEffect(() => {
    if (wasOpen.current && !isOpen) {
      burgerRef.current?.focus()
    }
    wasOpen.current = isOpen
  }, [isOpen])

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
        <div className={styles.actions}>
          <ThemeToggle />
          <button
            ref={burgerRef}
            type="button"
            className={styles.burger}
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            aria-expanded={isOpen}
            aria-controls="main-menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={close}
        aria-hidden="true"
      />
      {/* `inert` takes the closed panel out of both the tab order and the
          accessibility tree in one go, which aria-hidden alone can't do
          without leaving focusable links inside a hidden subtree */}
      <nav
        ref={panelRef}
        id="main-menu"
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
        aria-label="Menu"
        inert={!isOpen}
      >
        <button
          type="button"
          className={styles.close}
          onClick={close}
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
            onClick={close}
          >
            {label}
          </Link>
        ))}
      </nav>
    </>
  )
}
