// Simple line-art illustrations in the spirit of the restaurant's
// hand-drawn table, pot, corkscrew and mailbox sketches.

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const BookSketch: React.FC = () => (
  <svg viewBox="0 0 120 90" aria-hidden="true">
    <g {...strokeProps}>
      <path d="M12 18 C 28 10, 48 11, 59 20 L 59 74 C 48 66, 28 65, 13 71 Z" />
      <path d="M108 18 C 92 10, 71 11, 60 20 L 60 74 C 71 66, 91 65, 107 71 Z" />
      <path d="M22 27 C 33 22, 44 23, 52 28" />
      <path d="M22 38 C 33 33, 44 34, 52 39" />
      <path d="M22 49 C 33 44, 44 45, 52 50" />
      <path d="M68 28 C 76 23, 87 22, 98 27" />
      <path d="M68 39 C 76 34, 87 33, 98 38" />
      <path d="M68 50 C 76 45, 87 44, 98 49" />
      <path d="M12 18 L 12 72 M 108 18 L 108 72" />
    </g>
  </svg>
)

export const LaptopSketch: React.FC = () => (
  <svg viewBox="0 0 120 90" aria-hidden="true">
    <g {...strokeProps}>
      <path d="M25 14 L 94 13 L 96 58 L 24 59 Z" />
      <path d="M31 20 L 89 19 L 90 52 L 30 53 Z" />
      <path d="M24 59 L 12 76 L 107 75 L 96 58" />
      <path d="M50 66 L 71 66" />
      <path d="M40 26 L 52 36 L 40 45" />
      <path d="M58 45 L 74 45" />
    </g>
  </svg>
)

export const WrenchSketch: React.FC = () => (
  <svg viewBox="0 0 120 90" aria-hidden="true">
    <g {...strokeProps}>
      <path d="M34 15 C 25 17, 18 24, 17 33 L 27 31 L 34 38 L 32 48 C 41 47, 48 40, 49 31 C 49 28, 49 26, 48 24 L 84 60" />
      <path d="M48 24 C 46 20, 41 15, 34 15" />
      <path d="M84 60 C 80 66, 81 72, 86 76 C 91 80, 98 79, 102 74 C 106 69, 105 62, 100 58 C 96 55, 89 55, 84 60 Z" />
      <path d="M92 66 L 95 69" />
    </g>
  </svg>
)

export const PenSketch: React.FC = () => (
  <svg viewBox="0 0 120 90" aria-hidden="true">
    <g {...strokeProps}>
      <path d="M92 10 L 104 22 L 46 78 L 28 84 L 33 66 Z" />
      <path d="M84 18 L 96 30" />
      <path d="M33 66 L 46 78" />
      <path d="M38 72 L 41 75" />
      <path d="M16 22 L 60 22" />
      <path d="M16 34 L 48 34" />
      <path d="M16 46 L 36 46" />
    </g>
  </svg>
)

export const CardSketch: React.FC = () => (
  <svg viewBox="0 0 120 90" aria-hidden="true">
    <g {...strokeProps}>
      <path d="M28 8 L 78 8 L 94 24 L 94 82 L 28 82 Z" />
      <path d="M78 8 L 78 24 L 94 24" />
      <path d="M40 34 C 40 28, 46 24, 52 24 C 58 24, 64 28, 64 34 C 64 40, 58 44, 52 44 C 46 44, 40 40, 40 34 Z" />
      <path d="M38 58 C 38 50, 45 47, 52 47 C 59 47, 66 50, 66 58" />
      <path d="M38 68 L 84 68" />
      <path d="M38 76 L 72 76" />
    </g>
  </svg>
)

export const MailboxSketch: React.FC = () => (
  <svg viewBox="0 0 120 90" aria-hidden="true">
    <g {...strokeProps}>
      <path d="M30 20 C 22 20, 15 27, 15 36 L 15 52 L 74 52 L 74 36 C 74 27, 68 20, 59 20 Z" />
      <path d="M74 30 L 90 30 L 90 18 L 82 22 L 74 20" />
      <path d="M28 34 L 55 34 L 55 46 L 28 46 Z" />
      <path d="M28 34 L 41 41 L 55 34" />
      <path d="M48 52 L 48 80 M 40 80 L 57 80" />
    </g>
  </svg>
)
