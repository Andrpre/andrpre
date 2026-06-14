import { experience } from '../../data/experience';
import { Section } from '../ui/Section';
import { Reveal } from '../ui/Reveal';
import styles from './Experience.module.css';

export function Experience() {
  return (
    <Section id="experience" index="03 · Experience" title="Опыт">
      <ol className={styles.timeline}>
        {experience.map((item, i) => (
          <Reveal key={`${item.company}-${i}`} delay={i * 0.06} as="li">
            <div className={styles.entry}>
              <span className={styles.dot} aria-hidden="true" />
              <div className={styles.body}>
                <div className={styles.topRow}>
                  <h3 className={styles.role}>{item.role}</h3>
                  <span className={`mono ${styles.period}`}>{item.period}</span>
                </div>
                <p className={styles.company}>{item.company}</p>
                <p className={styles.desc}>{item.description}</p>

                {item.highlights && (
                  <ul className={styles.highlights}>
                    {item.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                )}

                {item.tech && (
                  <ul className={styles.tech}>
                    {item.tech.map((t) => (
                      <li key={t} className={`mono ${styles.techTag}`}>
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
