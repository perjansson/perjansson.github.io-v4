'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Longest a transition may hold the old frame if a navigation never lands.
// Without it a click that turns out not to navigate would leave the page
// frozen under the snapshot.
const SAFETY_MS = 1500

// Cross-fades between pages using the browser's own View Transition API.
//
// React's <ViewTransition> is not in the stable release, and putting a
// production site on React's experimental channel for a crossfade is a bad
// trade, so this drives the native API directly.
//
// It does not intercept the navigation. A capture-phase listener starts the
// transition, which snapshots the page as it is right now, and then holds it
// open with a pending promise while next/link does the navigating exactly as
// before. Resolving on the pathname change is what tells the browser the new
// frame is ready. Intercepting instead would mean either fighting Link's own
// preventDefault or stopping the event dead, and the burger menu's links
// close the menu on that same click.
//
// Browsers without the API never install the listener.
export const ViewTransitions: React.FC = () => {
  const pathname = usePathname()
  const finish = useRef<(() => void) | null>(null)

  useEffect(() => {
    finish.current?.()
    finish.current = null
  }, [pathname])

  useEffect(() => {
    if (typeof document.startViewTransition !== 'function') {
      return
    }

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) {
        return
      }
      // Leave the browser's own open-in-new-tab gestures alone
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }

      const target = event.target
      const link = target instanceof Element ? target.closest('a[href]') : null
      if (!(link instanceof HTMLAnchorElement)) {
        return
      }
      if (
        link.hasAttribute('download') ||
        (link.target && link.target !== '_self')
      ) {
        return
      }

      const url = new URL(link.href, window.location.href)
      if (url.origin !== window.location.origin) {
        return
      }
      // Same page: an in-page anchor or a filter chip, neither of which
      // should flash the whole document
      if (url.pathname === window.location.pathname) {
        return
      }

      // The resolver has to be published now, not inside the callback: the
      // browser runs that callback a tick later, by which time a prefetched
      // route has already navigated and the pathname effect has been and
      // gone, leaving every transition to sit out the safety timeout.
      let settle: () => void = () => {}
      const ready = new Promise<void>((resolve) => {
        settle = resolve
      })
      finish.current = settle
      setTimeout(settle, SAFETY_MS)

      document.startViewTransition(() => ready)
    }

    document.addEventListener('click', onClick, { capture: true })
    return () =>
      document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return null
}
