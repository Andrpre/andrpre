import { motion } from 'framer-motion';
import { projects } from '../../data/projects';
import { Section } from '../ui/Section';
import { Reveal } from '../ui/Reveal';
import { ArrowIcon, GithubIcon } from '../ui/icons';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import styles from './Projects.module.css';

export function Projects() {
  const reduced = usePrefersReducedMotion();

  return (
    <Section id="projects" index="04 · Work" title="Проекты">
      <div className={styles.grid}>
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={i * 0.05} as="article" className={styles.card}>
            <div className={styles.cardTop}>
              {project.year && (
                <span className={`mono ${styles.year}`}>{project.year}</span>
              )}
            </div>

            <div className={styles.links}>
              {project.repoUrl && (
                <motion.a
                  href={project.repoUrl}
                  className={styles.iconLink}
                  aria-label={`Репозиторий проекта ${project.title}`}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={reduced ? {} : { scale: 1.08 }}
                  transition={{ duration: 0.2 }}
                >
                  <GithubIcon width={16} height={16} />
                </motion.a>
              )}
              {project.liveUrl && (
                <motion.a
                  href={project.liveUrl}
                  className={styles.iconLink}
                  aria-label={`Открыть проект ${project.title}`}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={reduced ? {} : { scale: 1.08 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowIcon width={16} height={16} />
                </motion.a>
              )}
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
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
