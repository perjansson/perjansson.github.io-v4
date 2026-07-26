import type { MetadataRoute } from 'next'

import { getAllProjects } from '../lib/api'
import { SITE_PAGES, SITE_URL } from '../lib/site'

// Emitted as a static sitemap.xml by the export build
export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await getAllProjects()

  // No lastModified: Contentful's publish timestamps are not part of the
  // query, and a made-up date is worse than none at all
  return [
    ...SITE_PAGES.map((path) => ({
      url: `${SITE_URL}${path}`,
      priority: path === '/' ? 1 : 0.8,
    })),
    ...data.projects.items.map(({ sys: { id } }) => ({
      url: `${SITE_URL}/projects/${id}/`,
      priority: 0.6,
    })),
  ]
}
