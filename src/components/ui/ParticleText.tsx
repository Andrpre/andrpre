import { type RefObject } from 'react';
import { useParticleField } from '../../hooks/useParticleField';
import styles from './ParticleText.module.css';

interface ParticleTextProps {
  /** the live <h1> we mirror — drives box, font and target glyph sampling */
  targetRef: RefObject<HTMLElement | null>;
  text: string;
  /** false under reduced motion → nothing renders, the live text stands alone */
  enabled: boolean;
  /** fired once the cloud has settled into the glyphs */
  onSettled?: () => void;
  /** crossfade the cloud out as the live <h1> takes over */
  faded?: boolean;
}

/**
 * Decorative particle layer that materializes `text` out of a drifting cloud
 * ("text emerges from smoke") and then hands off to the live <h1> via
 * `onSettled`. Purely visual: `aria-hidden`, never interactive, and absent
 * entirely under reduced motion.
 */
export function ParticleText({
  targetRef,
  text,
  enabled,
  onSettled,
  faded = false,
}: ParticleTextProps) {
  const { canvasRef } = useParticleField({
    targetRef,
    text,
    mode: 'assemble',
    enabled,
    onSettled,
  });

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`${styles.canvas} ${faded ? styles.faded : ''}`}
      aria-hidden="true"
    />
  );
}
