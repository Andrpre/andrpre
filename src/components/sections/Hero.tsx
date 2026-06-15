import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { profile } from '../../data/profile';
import { MagneticButton } from '../ui/MagneticButton';
import { ShaderBackground } from '../ui/ShaderBackground';
import { ArrowIcon } from '../ui/icons';
import {
  usePrefersReducedMotion,
  useMediaQuery,
} from '../../hooks/useMediaQuery';
import styles from './Hero.module.css';

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const finePointer = useMediaQuery('(pointer: fine)');
  const tiltEnabled = !reduced && finePointer;
  const words = profile.name.split(' ');

  // Cursor-driven 3D tilt of the name block (desktop + motion-on only).
  const nameRef = useRef<HTMLHeadingElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), {
    stiffness: 150,
    damping: 20,
  });
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 20,
  });

  const handleTilt = (e: React.MouseEvent) => {
    if (!tiltEnabled || !nameRef.current) return;
    const rect = nameRef.current.getBoundingClientRect();
    px.set((e.clientX - (rect.left + rect.width / 2)) / rect.width);
    py.set((e.clientY - (rect.top + rect.height / 2)) / rect.height);
  };
  const resetTilt = () => {
    px.set(0);
    py.set(0);
  };

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduced ? 0 : 0.08, delayChildren: 0.1 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: reduced ? 0 : '0.6em' },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section id="top" className={styles.hero} aria-label="Вступление">
      <ShaderBackground />

      <div className={`container ${styles.inner}`}>
        <motion.p
          className={`mono ${styles.eyebrow}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {profile.level} · {profile.role}
          {profile.location ? ` · ${profile.location}` : ''}
        </motion.p>

        <motion.h1
          ref={nameRef}
          className={styles.name}
          variants={container}
          initial="hidden"
          animate="visible"
          onMouseMove={handleTilt}
          onMouseLeave={resetTilt}
          style={
            tiltEnabled
              ? { rotateX: rotX, rotateY: rotY, transformPerspective: 900 }
              : undefined
          }
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
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <MagneticButton href="#projects" className={styles.primary}>
            Смотреть проекты
            <ArrowIcon width={18} height={18} />
          </MagneticButton>
          <MagneticButton href="#contact" className={styles.secondary}>
            Связаться
          </MagneticButton>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className={styles.scroll}
        aria-label="Прокрутить вниз"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <span className={styles.scrollLine} aria-hidden="true" />
        <span className="mono">scroll</span>
      </motion.a>
    </section>
  );
}
