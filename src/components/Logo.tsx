import styles from './Logo.module.css'

// The trailing space mirrors the gap between the words, so the circle
// reads PER · JANSSON with room on both sides
const LETTERS = 'PER JANSSON '.split('')

// Offset the ring so the E of PER starts centered at 12 o'clock
const START_OFFSET = -30

// Per-letter swing rhythm so the dangling never looks mechanical
const SWING_DURATIONS = [3.1, 2.7, 3.5, 0, 2.9, 3.3, 2.6, 3.7, 3.0, 2.8, 3.4, 0]
const SWING_DELAYS = [-0.4, -1.7, -0.9, 0, -2.2, -0.1, -1.3, -2.8, -0.6, -1.9, -2.5, 0]

// The ring radius as a multiple of the font size. Everything about the
// logo is sized off its own font-size in em, so the whole thing scales
// with the box instead of being pinned to a pixel count — a fixed px
// radius kept the letters at full size when a zoomed-in viewport shrank
// the panel around them, and they spilled out of the frame.
const RADIUS_EM = 1.79

// A ferris wheel of letters: the wheel rotates, every letter
// counter-rotates in sync so it keeps hanging downwards, and each
// glyph swings gently from its attachment point.
export const Logo: React.FC = () => {
  return (
    <div className={styles.logo} role="img" aria-label="Per Jansson">
      <div className={styles.wheel}>
        {LETTERS.map((letter, i) => {
          if (letter === ' ') {
            return null
          }
          const angle = (i * 360) / LETTERS.length + START_OFFSET

          return (
            <span
              key={i}
              className={styles.anchor}
              style={{
                transform: `rotate(${angle}deg) translateY(-${RADIUS_EM}em) rotate(${-angle}deg)`,
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
          )
        })}
      </div>
    </div>
  )
}
