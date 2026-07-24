import styles from './Logo.module.css'

const LETTERS = 'JANSSON'.split('')

// Each letter gets its own arbitrary tilt, echoing the restaurant's
// hand-scattered circular wordmark
const ROTATIONS = [-24, 18, -8, 28, -18, 12, -30]

interface LogoProps {
  size?: number
}

export const Logo: React.FC<LogoProps> = ({ size = 190 }) => (
  <svg
    className={styles.logo}
    width={size}
    height={size}
    viewBox="0 0 220 220"
    role="img"
    aria-label="Jansson"
  >
    {LETTERS.map((letter, i) => {
      const angle = (i * 360) / LETTERS.length - 90
      const x = 110 + 68 * Math.cos((angle * Math.PI) / 180)
      const y = 110 + 68 * Math.sin((angle * Math.PI) / 180)

      return (
        <text
          key={i}
          x={x}
          y={y}
          transform={`rotate(${ROTATIONS[i]} ${x} ${y})`}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {letter}
        </text>
      )
    })}
  </svg>
)
