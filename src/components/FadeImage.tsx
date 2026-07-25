'use client'

import { useState } from 'react'
import styles from './FadeImage.module.css'

interface FadeImageProps {
  src: string
  srcSet?: string
  sizes?: string
  alt: string
  /** Tiny base64 preview (Contentful assetPlaceholder) shown while loading */
  placeholder?: string
  className?: string
}

// Shows the blurred placeholder immediately and cross-fades to the
// real image once it has loaded — the v3 treatment.
export const FadeImage: React.FC<FadeImageProps> = ({
  src,
  srcSet,
  sizes,
  alt,
  placeholder,
  className,
}) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <span className={`${styles.wrapper} ${className ?? ''}`}>
      {placeholder && (
        <img src={placeholder} alt="" aria-hidden className={styles.placeholder} />
      )}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={`${styles.image} ${loaded ? styles.imageLoaded : ''}`}
        onLoad={() => setLoaded(true)}
        // A cached image can be complete before hydration attaches onLoad
        ref={(el) => {
          if (el?.complete && el.naturalWidth > 0) setLoaded(true)
        }}
      />
    </span>
  )
}
