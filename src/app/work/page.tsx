import type { Metadata } from 'next'

import { getIndexPageData } from '../../lib/api'
import { buildContactEmail } from '../../lib/contactLine'
import { SITE_URL } from '../../lib/site'
import { buildTechStats, buildWorkItems } from '../../lib/workData'
import { Frame } from '../../components/Frame'
import { JsonLd } from '../../components/JsonLd'
import { WorkExplorer } from '../../components/WorkExplorer'

export const metadata: Metadata = {
  title: 'Per Jansson - Curious Software Craftsman - Work',
}

export default async function WorkPage() {
  const { data } = await getIndexPageData()
  const { me, projects } = data

  return (
    <Frame contactEmail={buildContactEmail(me)}>
      {/* The project list as a crawlable ordered list, newest first, the
          same order the page renders it in */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Projects by Per Jansson',
          numberOfItems: projects.items.length,
          itemListOrder: 'https://schema.org/ItemListOrderDescending',
          itemListElement: projects.items.map((project, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: project.titleShort,
            url: `${SITE_URL}/projects/${project.sys.id}/`,
          })),
        }}
      />
      <WorkExplorer
        items={buildWorkItems(projects.items)}
        techStats={buildTechStats(projects.items)}
      />
    </Frame>
  )
}
