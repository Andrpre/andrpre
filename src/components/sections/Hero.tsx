import { useRef, lazy, Suspense, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from 'framer-motion';
import { profile } from '../../data/profile';
import { MagneticButton } from '../ui/MagneticButton';
import { ArrowIcon } from '../ui/icons';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import styles from './Hero.module.css';

const ParticleField = lazy(() =>
  import('../ui/ParticleField').then((m) => ({ default: m.ParticleField }))
);

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const words = profile.name.split(' ');
  const heroRef = useRef<HTMLElement>(null);

  // Scroll parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Mouse spotlight
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spotX = useSpring(rawX, { damping: 22, stiffness: 60, mass: 0.5 });
  const spotY = useSpring(rawY, { damping: 22, stiffness: 60, mass: 0.5 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reduced) return;
      const r = e.currentTarget.getBoundingClientRect();
      rawX.set(e.clientX - r.left);
      rawY.set(e.clientY - r.top);
    },
    [rawX, rawY, reduced]
  );

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: reduced ? 0 : 0.09, delayChildren: 0.15 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduced ? 0 : '0.7em', clipPath: 'inset(100% 0 0 0)' },
    visible: {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0% 0 0 0)',
      transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      ref={heroRef}
      id="top"
      className={styles.hero}
      aria-label="Вступление"
      onMouseMove={onMouseMove}
    >
      {!reduced && (
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
      )}

      {/* Mouse spotlight */}
      {!reduced && (
        <motion.div
          className={styles.spotlight}
          style={{ x: spotX, y: spotY }}
          aria-hidden="true"
        />
      )}

      <motion.div
        className={`container ${styles.inner}`}
        style={reduced ? {} : { y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          className={`mono ${styles.eyebrow}`}
          initial={{ opacity: 0, letterSpacing: '0.4em' }}
          animate={{ opacity: 1, letterSpacing: '0.18em' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {profile.level} · {profile.role}
          {profile.location ? ` · ${profile.location}` : ''}
        </motion.p>

        <motion.h1
          className={styles.name}
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {words.map((word, i) => (
            <span key={i} className={styles.wordMask}>
              <motion.span className={styles.word} variants={item}>
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          className={styles.tagline}
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <MagneticButton href="#projects" className={styles.primary}>
            Смотреть проекты
            <ArrowIcon width={18} height={18} />
          </MagneticButton>
          <MagneticButton href="#contact" className={styles.secondary}>
            Связаться
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        className={styles.scroll}
        aria-label="Прокрутить вниз"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <span className={styles.scrollLine} aria-hidden="true" />
        <span className="mono">scroll</span>
      </motion.a>
    </section>
  );
}
