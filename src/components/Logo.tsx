import styles from './Logo.module.css'

const LETTERS = 'PERJANSSON'.split('')

// Each letter gets its own arbitrary tilt, echoing the restaurant's
// hand-scattered circular wordmark
const ROTATIONS = [-22, 16, -10, 26, -18, 12, -28, 20, -14, 24]

interface LogoProps {
  size?: number
}

export const Logo: React.FC<LogoProps> = ({ size = 240 }) => (
  <svg
    className={styles.logo}
    width={size}
    height={size}
    viewBox="0 0 240 240"
    role="img"
    aria-label="Per Jansson"
  >
    {LETTERS.map((letter, i) => {
      const angle = (i * 360) / LETTERS.length - 90
      const x = 120 + 80 * Math.cos((angle * Math.PI) / 180)
      const y = 120 + 80 * Math.sin((angle * Math.PI) / 180)

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
