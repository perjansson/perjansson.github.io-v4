import type { Metadata } from 'next'

import { getIndexPageData } from '../../lib/api'
import { buildContactLine } from '../../lib/contactLine'
import { Frame } from '../../components/Frame'
import { SplitPanel } from '../../components/SplitPanel'
import { RichText } from '../../components/RichText'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Per Jansson - Curious Software Craftsman - The Story',
}

export default async function StoryPage() {
  const { data } = await getIndexPageData()
  const { me } = data

  return (
    <Frame contactLine={buildContactLine(me)}>
      <SplitPanel title="The Story">
        <h2 className={styles.heading}>About me</h2>
        <img
          className={styles.portrait}
          src="https://avatars.githubusercontent.com/u/1557938?v=4&s=800"
          alt={`Portrait of ${me.name}`}
        />
        <RichText richText={me.short} className={styles.short} />
        <RichText richText={me.long} className={styles.long} />
      </SplitPanel>
    </Frame>
  )
}
