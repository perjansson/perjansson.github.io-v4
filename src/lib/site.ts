/** Canonical origin, used for metadata, the sitemap and structured data */
export const SITE_URL = 'https://www.perjansson.me'

export const SITE_TITLE = 'Per Jansson - Curious Software Craftsman'

export const SITE_DESCRIPTION =
  "I'm Per, a curious software developer with a passion to build great applications and websites - and help others do the same."

/** Every route the site publishes, in reading order. Trailing slashes match
 *  next.config's trailingSlash, so the sitemap agrees with what is served. */
export const SITE_PAGES = [
  '/',
  '/story/',
  '/work/',
  '/craft/',
  '/writing/',
  '/contact/',
] as const
