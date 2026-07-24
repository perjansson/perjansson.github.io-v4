import type { Metadata } from 'next'

import { getIndexPageData } from '../../lib/api'
import { buildContactLine } from '../../lib/contactLine'
import { buildTechStats, buildWorkItems } from '../../lib/workData'
import { Frame } from '../../components/Frame'
import { WorkExplorer } from '../../components/WorkExplorer'

export const metadata: Metadata = {
  title: 'Per Jansson - Curious Software Craftsman - Work',
}

export default async function WorkPage() {
  const { data } = await getIndexPageData()
  const { me, projects } = data

  return (
    <Frame contactLine={buildContactLine(me)}>
      <WorkExplorer
        items={buildWorkItems(projects.items)}
        techStats={buildTechStats(projects.items)}
      />
    </Frame>
  )
}
