import { ProjectsType } from '../types'
import { Reveal } from './Reveal'
import styles from './Craft.module.css'

interface CraftProps {
  projects: ProjectsType
}

export const Craft: React.FC<CraftProps> = ({ projects }) => {
  const techs = Array.from(
    new Set(projects.flatMap((project) => project.tech ?? []))
  )

  if (techs.length === 0) {
    return null
  }

  return (
    <section id="craft" className={styles.craft}>
      <div className="container">
        <Reveal>
          <header className="sectionHeader">
            <p className="overline">The Cellar</p>
            <h2 className="sectionHeading">Tools of the craft</h2>
            <hr className="rule" />
          </header>
        </Reveal>
        <Reveal delay={120}>
          <p className={styles.words}>
            {techs.map((tech, index) => (
              <span key={tech}>
                {index > 0 && (
                  <span className={styles.separator} aria-hidden="true">
                    ·
                  </span>
                )}
                {tech}
              </span>
            ))}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
