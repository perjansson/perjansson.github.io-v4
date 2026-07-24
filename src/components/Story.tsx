import { MeType } from '../types'
import {
  contentfulImageSrcSet,
  contentfulImageUrl,
} from '../lib/contentfulImage'
import { RichText } from './RichText'
import { Reveal } from './Reveal'
import styles from './Story.module.css'

interface StoryProps {
  me: MeType
}

export const Story: React.FC<StoryProps> = ({ me }) => (
  <section id="story" className={styles.story}>
    <div className="container">
      <div className={styles.grid}>
        <Reveal className={styles.imageWrapper}>
          <img
            className={styles.image}
            src={contentfulImageUrl(me.profileImage.url, { width: 800 })}
            srcSet={contentfulImageSrcSet(me.profileImage.url, [400, 800, 1200])}
            sizes="(max-width: 900px) 70vw, 24rem"
            alt={`Portrait of ${me.name}`}
            loading="lazy"
          />
        </Reveal>
        <div>
          <Reveal>
            <p className="overline">The Story</p>
            <h2 className={styles.heading}>
              Two decades of building for the web
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <RichText richText={me.short} className={styles.short} />
            <RichText richText={me.long} className={styles.long} />
          </Reveal>
        </div>
      </div>
    </div>
  </section>
)
