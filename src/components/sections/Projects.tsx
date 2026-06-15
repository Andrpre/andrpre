import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { projects } from '../../data/projects';
import type { Project } from '../../data/types';
import { Section } from '../ui/Section';
import { RevealGroup, RevealItem } from '../ui/Reveal';
import { ArrowIcon, GithubIcon } from '../ui/icons';
import {
  usePrefersReducedMotion,
  useMediaQuery,
} from '../../hooks/useMediaQuery';
import styles from './Projects.module.css';

/** A single project card with cursor-driven 3D tilt + light glow. */
function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const finePointer = useMediaQuery('(pointer: fine)');
  const enabled = !reduced && finePointer;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), {
    stiffness: 200,
    damping: 22,
  });
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), {
    stiffness: 200,
    damping: 22,
  });

  const handleMove = (e: React.MouseEvent) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    px.set(nx - 0.5);
    py.set(ny - 0.5);
    ref.current.style.setProperty('--mx', `${nx * 100}%`);
    ref.current.style.setProperty('--my', `${ny * 100}%`);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={styles.card}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={
        enabled
          ? { rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }
          : undefined
      }
    >
      <div className={styles.cardTop}>
        {project.year && (
          <span className={`mono ${styles.year}`}>{project.year}</span>
        )}
        <div className={styles.links}>
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              className={styles.iconLink}
              aria-label={`Репозиторий проекта ${project.title}`}
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon width={18} height={18} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              className={styles.iconLink}
              aria-label={`Открыть проект ${project.title}`}
              target="_blank"
              rel="noreferrer"
            >
              <ArrowIcon width={18} height={18} />
            </a>
          )}
        </div>
      </div>

      <h3 className={styles.title}>{project.title}</h3>
      <p className={styles.desc}>{project.description}</p>

      <ul className={styles.tags}>
        {project.tags.map((tag) => (
          <li key={tag} className={`mono ${styles.tag}`}>
            {tag}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Projects() {
  return (
    <Section id="projects" index="04 · Work" title="Проекты">
      <RevealGroup className={styles.grid} stagger={0.1}>
        {projects.map((project) => (
          <RevealItem key={project.title} as="article" className={styles.cardWrap}>
            <ProjectCard project={project} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
