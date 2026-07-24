'use client'

import { useEffect, useState } from 'react'

import styles from './ThemeToggle.module.css'

type Theme = 'dark' | 'light'

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const current = document.documentElement.dataset.theme
    if (current === 'light') {
      setTheme('light')
    }
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // private mode etc. — theme simply won't persist
    }
  }

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}
