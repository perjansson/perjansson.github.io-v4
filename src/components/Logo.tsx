import styles from './Logo.module.css'

// Badge layout: PER across the top arc, JANSSON mirrored along the
// bottom arc, so at rest the mark reads as two lines —
//   PER
//   JANSSON
// Angles are clockwise from 12 o'clock; the bottom word runs
// counter-clockwise so it reads left-to-right too.
const PLACED = [
  { letter: 'P', angle: -20 },
  { letter: 'E', angle: 0 },
  { letter: 'R', angle: 20 },
  { letter: 'J', angle: 240 },
  { letter: 'A', angle: 220 },
  { letter: 'N', angle: 200 },
  { letter: 'S', angle: 180 },
  { letter: 'S', angle: 160 },
  { letter: 'O', angle: 140 },
  { letter: 'N', angle: 120 },
]

// Per-letter swing rhythm so the dangling never looks mechanical
const SWING_DURATIONS = [3.1, 2.7, 3.5, 2.9, 3.3, 2.6, 3.7, 3.0, 2.8, 3.4]
const SWING_DELAYS = [-0.4, -1.7, -0.9, -2.2, -0.1, -1.3, -2.8, -0.6, -1.9, -2.5]

interface LogoProps {
  size?: number
}

// A ferris wheel of letters: the wheel rotates, every letter
// counter-rotates in sync so it keeps hanging downwards, and each
// glyph swings gently from its attachment point.
export const Logo: React.FC<LogoProps> = ({ size = 240 }) => {
  const radius = size * 0.37

  return (
    <div
      className={styles.logo}
      style={{ width: size, height: size, fontSize: size * 0.175 }}
      role="img"
      aria-label="Per Jansson"
    >
      <div className={styles.wheel}>
        {PLACED.map(({ letter, angle }, i) => (
          <span
            key={i}
            className={styles.anchor}
            style={{
              transform: `rotate(${angle}deg) translateY(-${radius}px) rotate(${-angle}deg)`,
            }}
          >
            <span className={styles.counter}>
              <span
                className={styles.letter}
                style={{
                  animationDuration: `${SWING_DURATIONS[i]}s`,
                  animationDelay: `${SWING_DELAYS[i]}s`,
                }}
              >
                {letter}
              </span>
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
