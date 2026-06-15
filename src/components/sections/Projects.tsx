import { projects } from '../../data/projects';
import { Section } from '../ui/Section';
import { RevealGroup, RevealItem } from '../ui/Reveal';
import { ArrowIcon, GithubIcon } from '../ui/icons';
import styles from './Projects.module.css';

export function Projects() {
  return (
    <Section id="projects" index="04 · Work" title="Проекты">
      <RevealGroup className={styles.grid} stagger={0.1}>
        {projects.map((project) => (
          <RevealItem key={project.title} as="article" className={styles.card}>
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
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
