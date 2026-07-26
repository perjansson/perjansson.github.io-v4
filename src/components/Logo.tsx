'use client'

import { useRef, useState } from 'react'

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

// How far the wheel coasts on after the pointer lets go, as a fraction of
// the last drag step per frame. Low enough to settle in about a second.
const SPIN_FRICTION = 0.94
const MIN_SPIN = 0.05

const angleFrom = (element: HTMLElement, x: number, y: number) => {
  const box = element.getBoundingClientRect()
  return (
    (Math.atan2(y - (box.top + box.height / 2), x - (box.left + box.width / 2)) *
      180) /
    Math.PI
  )
}

// A ferris wheel of letters: the wheel rotates, every letter
// counter-rotates in sync so it keeps hanging downwards, and each
// glyph swings gently from its attachment point.
//
// Grab it and it becomes a wheel you can actually spin: dragging sets the
// rotation directly, letting go lets it coast to a stop, and the idle
// rotation picks up again from wherever it landed.
export const Logo: React.FC = () => {
  const wheelRef = useRef<HTMLDivElement>(null)
  const [turn, setTurn] = useState(0)
  const [dragging, setDragging] = useState(false)
  const grab = useRef({ pointerAngle: 0, turn: 0, velocity: 0 })

  const coast = () => {
    let velocity = grab.current.velocity

    const step = () => {
      velocity *= SPIN_FRICTION
      if (Math.abs(velocity) < MIN_SPIN) {
        return
      }
      setTurn((current) => current + velocity)
      requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const wheel = wheelRef.current
    if (!wheel) {
      return
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    grab.current = {
      pointerAngle: angleFrom(wheel, event.clientX, event.clientY),
      turn,
      velocity: 0,
    }
    setDragging(true)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const wheel = wheelRef.current
    if (!dragging || !wheel) {
      return
    }
    const pointerAngle = angleFrom(wheel, event.clientX, event.clientY)
    // atan2 wraps at ±180; without unwrapping, dragging past the left side
    // would snap the wheel most of the way round the other way
    let delta = pointerAngle - grab.current.pointerAngle
    if (delta > 180) {
      delta -= 360
    }
    if (delta < -180) {
      delta += 360
    }

    const next = grab.current.turn + delta
    grab.current.velocity = next - turn
    setTurn(next)
  }

  const onPointerUp = () => {
    if (!dragging) {
      return
    }
    setDragging(false)
    coast()
  }

  return (
    <div
      className={`${styles.logo} ${dragging ? styles.dragging : ''}`}
      role="img"
      aria-label="Per Jansson"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* The drag offset sits on an outer element so the inner wheel keeps
          its own steady animation, and the two rotations simply add up */}
      <div
        className={styles.turn}
        style={{ transform: `rotate(${turn}deg)` }}
      >
        <div ref={wheelRef} className={styles.wheel}>
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
                {/* Two counter-rotations, not one: the animated keyframes
                    would win over any inline transform on the same element,
                    so the drag gets a wrapper of its own */}
                <span className={styles.counter}>
                  <span
                    className={styles.counterDrag}
                    style={{ transform: `rotate(${-turn}deg)` }}
                  >
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
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
