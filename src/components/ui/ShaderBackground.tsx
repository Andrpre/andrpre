import { useEffect, useState } from 'react';
import { MeshGradient } from '@paper-design/shaders-react';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import styles from './ShaderBackground.module.css';

/**
 * Resolve the gradient palette from the design tokens on `<html>`. Driving the
 * shader from `--bg` / `--accent` / … keeps the single source of truth in
 * `tokens.css` and means the effect simply follows the active theme.
 */
function readPalette(): string[] {
  if (typeof window === 'undefined') return [];
  const cs = getComputedStyle(document.documentElement);
  const token = (name: string) => cs.getPropertyValue(name).trim();
  // Mostly background tones with accent pops — stays subtle so hero text on top
  // of it remains legible (the wrapper also fades out toward the bottom).
  return [
    token('--bg'),
    token('--bg-elevated'),
    token('--accent'),
    token('--surface'),
    token('--bg'),
  ].filter(Boolean);
}

/**
 * Animated WebGL mesh-gradient rendered behind the hero, powered by Paper
 * Shaders (`@paper-design/shaders-react`). Colors are reactive props read from
 * the design tokens, so switching theme is a declarative prop change — no
 * manual WebGL context juggling. Reduced motion freezes it to a static frame
 * (`speed={0}`); the library handles the rAF loop, DPR and context lifecycle.
 */
export function ShaderBackground() {
  const reduced = usePrefersReducedMotion();
  const [colors, setColors] = useState<string[]>(readPalette);

  // Re-read tokens whenever the theme attribute flips. Observing the attribute
  // (rather than the React `theme` value) guarantees the read happens *after*
  // `<html data-theme>` is updated, avoiding a one-toggle color lag.
  useEffect(() => {
    const sync = () => setColors(readPalette());
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => mo.disconnect();
  }, []);

  if (colors.length === 0) return null;

  return (
    <div className={styles.wrap} aria-hidden="true">
      <MeshGradient
        className={styles.shader}
        colors={colors}
        distortion={0.8}
        swirl={0.6}
        grainOverlay={0.04}
        speed={reduced ? 0 : 0.6}
      />
    </div>
  );
}
