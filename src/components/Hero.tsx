import { MeType } from '../types'
import { Reveal } from './Reveal'
import styles from './Hero.module.css'

interface HeroProps {
  me: MeType
}

export const Hero: React.FC<HeroProps> = ({ me }) => (
  <section className={styles.hero}>
    <div className={styles.frame} aria-hidden="true" />
    <div className="container">
      <Reveal>
        <p className={styles.overline}>
          {me.name} — {me.title}
        </p>
      </Reveal>
      <Reveal delay={150}>
        <h1 className={styles.statement}>
          Curious.
          <br />
          Committed.
          <br />
          <em>Full stack.</em>
        </h1>
      </Reveal>
      <Reveal delay={300}>
        <p className={styles.intro}>
          Hi. I&apos;m {me.firstName} — I build great applications and
          websites, and help others do the same.
        </p>
      </Reveal>
    </div>
    <a href="#story" className={styles.scrollCue}>
      Scroll
    </a>
  </section>
)
