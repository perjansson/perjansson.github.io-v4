'use client'

import { useEffect, useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'

// During static prerender there is no layout to measure; swap in the
// plain effect to keep React from warning about useLayoutEffect
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

// On the stacked mobile layout the spinning logo fills the first
// screen. Position the page on the title (with a little air above)
// before anything is painted, so there is never a visible jump.
export const ScrollPastLogo = () => {
  const pathname = usePathname()

  useIsomorphicLayoutEffect(() => {
    if (!window.matchMedia('(max-width: 860px)').matches) return

    // The global smooth scroll-behavior would turn both the router's
    // reset and our correction into visible glides; make everything
    // instant for the brief navigation window
    const html = document.documentElement
    const prevBehavior = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'

    const apply = () => {
      const title = document.querySelector('main h1')
      if (!title) return
      const top = title.getBoundingClientRect().top + window.scrollY - 120
      if (top > 24) window.scrollTo(0, top)
    }

    // Before the new page's first paint
    apply()

    // The router's own scroll-to-top can land after us; whenever the
    // page snaps back to the very top right after a navigation,
    // correct it again before the next paint
    const onScroll = () => {
      if (window.scrollY === 0) apply()
    }
    window.addEventListener('scroll', onScroll)

    const cleanup = () => {
      window.removeEventListener('scroll', onScroll)
      html.style.scrollBehavior = prevBehavior
    }
    const stop = setTimeout(cleanup, 600)

    return () => {
      clearTimeout(stop)
      cleanup()
    }
  }, [pathname])

  return null
}
