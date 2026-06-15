import type { ReactNode } from 'react';
import styles from './Section.module.css';
import { Reveal } from './Reveal';

interface SectionProps {
  id: string;
  /** small monospace label shown above the heading, e.g. "01 · About" */
  index?: string;
  title: string;
  children: ReactNode;
}

export function Section({ id, index, title, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} className={styles.section} aria-labelledby={headingId}>
      <div className="container">
        <Reveal>
          <header className={styles.head}>
            {index && <span className={`mono ${styles.index}`}>{index}</span>}
            <h2 id={headingId} className={styles.title}>
              {title}
            </h2>
          </header>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
