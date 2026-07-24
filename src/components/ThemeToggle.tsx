'use client'

import { useEffect, useState } from 'react'

import styles from './ThemeToggle.module.css'

type Theme = 'light' | 'dark'

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const current = document.documentElement.dataset.theme
    if (current === 'dark') {
      setTheme('dark')
    }
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light'
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
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  )
}
