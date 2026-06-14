import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePrefersReducedMotion, useMediaQuery } from '../../hooks/useMediaQuery';

interface MagneticProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** max pull distance in px */
  strength?: number;
  ariaLabel?: string;
  target?: string;
  rel?: string;
}

/** Subtly pulls toward the cursor on hover (desktop, fine-pointer, motion-on). */
export function MagneticButton({
  children,
  href,
  onClick,
  className,
  strength = 14,
  ariaLabel,
  target,
  rel,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const finePointer = useMediaQuery('(pointer: fine)');
  const enabled = !reduced && finePointer;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.5 });

  const handleMove = (e: React.MouseEvent) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const max = strength;
    x.set(Math.max(-max, Math.min(max, relX * 0.4)));
    y.set(Math.max(-max, Math.min(max, relY * 0.4)));
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY, display: 'inline-flex' }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} aria-label={ariaLabel} target={target} rel={rel}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}
