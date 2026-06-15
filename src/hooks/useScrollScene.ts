import { useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { usePrefersReducedMotion } from './useMediaQuery';

// Register the scroll plugin once for the whole app.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * Thin wrapper around `useGSAP` for scroll-driven set-pieces. GSAP owns
 * scrubbed/scroll timelines (Framer Motion stays for component-level
 * micro-interactions — never both on the same node). The callback receives the
 * scope element; any tween/ScrollTrigger created inside is auto-reverted on
 * unmount or dependency change. The whole scene is skipped under reduced motion.
 */
export function useScrollScene<T extends HTMLElement = HTMLDivElement>(
  setup: (scope: T) => void,
  deps: unknown[] = [],
): RefObject<T> {
  const scopeRef = useRef<T>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const scope = scopeRef.current;
      if (!scope) return;
      setup(scope);
    },
    { scope: scopeRef, dependencies: [reduced, ...deps], revertOnUpdate: true },
  );

  return scopeRef;
}
