import { motion, useScroll, useSpring } from 'framer-motion';
import styles from './ScrollProgress.module.css';

/** Thin accent bar at the top of the viewport tracking page scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={styles.bar}
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
