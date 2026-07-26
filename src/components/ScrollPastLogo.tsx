'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// On the stacked mobile layout the spinning logo fills the first
// screen. After a fresh navigation, nudge the scroll so the page
// title sits near the top with a little air above it instead.
export const ScrollPastLogo = () => {
  const pathname = usePathname()

  useEffect(() => {
    if (!window.matchMedia('(max-width: 860px)').matches) return

    let lastSet = 0
    const timers: ReturnType<typeof setTimeout>[] = []

    const tryScroll = () => {
      // Never fight the user (or back/forward restoration): only act
      // while the page still sits where we left it
      if (window.scrollY !== 0 && window.scrollY !== lastSet) return
      const title = document.querySelector('main h1')
      if (!title) return
      const top = title.getBoundingClientRect().top + window.scrollY - 120
      if (top > 24) {
        window.scrollTo(0, top)
        lastSet = window.scrollY
      }
    }

    // First attempt lands two frames after the router's scroll-to-top;
    // retries catch late layout (fonts, images) growing the page
    let inner: number
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(tryScroll)
    })
    timers.push(setTimeout(tryScroll, 200), setTimeout(tryScroll, 500))

    return () => {
      cancelAnimationFrame(outer)
      if (inner) cancelAnimationFrame(inner)
      timers.forEach(clearTimeout)
    }
  }, [pathname])

  return null
}
