import type { Metadata } from 'next'

import { getIndexPageData } from '../../lib/api'
import { buildContactLine } from '../../lib/contactLine'
import {
  contentfulImageSrcSet,
  contentfulImageUrl,
} from '../../lib/contentfulImage'
import { Frame } from '../../components/Frame'
import { SplitPanel } from '../../components/SplitPanel'
import { RichText } from '../../components/RichText'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: '✨ Per Jansson - Fullstack Web Developer - The Story ✨',
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
          src={contentfulImageUrl(me.profileImage.url, { width: 800 })}
          srcSet={contentfulImageSrcSet(me.profileImage.url, [400, 800, 1200])}
          sizes="(max-width: 860px) 90vw, 22rem"
          alt={`Portrait of ${me.name}`}
        />
        <RichText richText={me.short} className={styles.short} />
        <RichText richText={me.long} className={styles.long} />
      </SplitPanel>
    </Frame>
  )
}
