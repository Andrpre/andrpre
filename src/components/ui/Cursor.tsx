import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePrefersReducedMotion, useMediaQuery } from '../../hooks/useMediaQuery';
import styles from './Cursor.module.css';

/** Minimal custom cursor: a dot plus a trailing ring that grows over links.
 *  Progressive enhancement — disabled on touch/coarse pointers and reduced-motion. */
export function Cursor() {
  const reduced = usePrefersReducedMotion();
  const finePointer = useMediaQuery('(pointer: fine)');
  const enabled = !reduced && finePointer;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28 });

  const [active, setActive] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add('custom-cursor');

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
      const target = e.target as HTMLElement;
      setActive(!!target.closest('a, button, [data-cursor="hover"]'));
    };
    const leave = () => setHidden(true);

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      document.body.classList.remove('custom-cursor');
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div className={styles.wrap} aria-hidden="true" data-hidden={hidden}>
      <motion.div className={styles.dot} style={{ x, y }} />
      <motion.div
        className={styles.ring}
        style={{ x: ringX, y: ringY }}
        animate={{ scale: active ? 1.8 : 1, opacity: active ? 0.9 : 0.5 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}
