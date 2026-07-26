// gtag is injected by @next/third-parties' GoogleAnalytics, and only when
// NEXT_PUBLIC_GA_TRACKING_ID is set. Everything here is a no-op otherwise,
// so nothing has to know whether analytics is configured.
declare global {
  interface Window {
    gtag?: (
      command: 'event',
      name: string,
      params?: Record<string, unknown>
    ) => void
  }
}

export const trackEvent = (
  name: string,
  params?: Record<string, unknown>
) => {
  if (typeof window !== 'undefined') {
    window.gtag?.('event', name, params)
  }
}
