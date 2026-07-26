import type { Metadata } from 'next'

import { getIndexPageData } from '../../lib/api'
import { buildContactEmail } from '../../lib/contactLine'
import { SITE_URL } from '../../lib/site'
import { ARTICLES, MEDIUM_PROFILE, articleUrl } from '../../lib/writingData'
import { Frame } from '../../components/Frame'
import { JsonLd } from '../../components/JsonLd'
import { SplitPanel } from '../../components/SplitPanel'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Per Jansson - Curious Software Craftsman - Writing',
  description:
    'Articles Per Jansson has written on Medium, on Angular, React, CSS Grid, codemods, mob programming and more.',
}

export default async function WritingPage() {
  const { data } = await getIndexPageData()
  const { me } = data

  return (
    <Frame contactEmail={buildContactEmail(me)}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Writing by Per Jansson',
          url: `${SITE_URL}/writing/`,
          author: { '@type': 'Person', name: me.name },
          blogPost: ARTICLES.map((article) => ({
            '@type': 'BlogPosting',
            headline: article.title,
            url: articleUrl(article),
            ...(article.date ? { datePublished: article.date } : {}),
            author: { '@type': 'Person', name: me.name },
          })),
        }}
      />
      <SplitPanel
        title="Writing"
        chips={
          <a
            href={MEDIUM_PROFILE}
            target="_blank"
            rel="noreferrer"
            className="chip"
          >
            All on Medium ↗
          </a>
        }
      >
        <h2 className={styles.heading}>Articles</h2>
        <ul className={styles.list}>
          {ARTICLES.map((article) => (
            <li key={article.slug} className={styles.item}>
              <a href={articleUrl(article)} target="_blank" rel="noreferrer">
                <span className={styles.name}>{article.title}</span>
                <span className={styles.meta}>{article.topic} · Medium ↗</span>
              </a>
            </li>
          ))}
        </ul>
      </SplitPanel>
    </Frame>
  )
}
