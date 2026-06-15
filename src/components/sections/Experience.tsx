import { experience } from '../../data/experience';
import { Section } from '../ui/Section';
import { Reveal } from '../ui/Reveal';
import { useScrollScene, gsap } from '../../hooks/useScrollScene';
import styles from './Experience.module.css';

export function Experience() {
  // An accent line "draws" itself down the timeline as you scroll — the build
  // assembling its own history. Animates a dedicated element (no Framer node),
  // so there's no transform conflict with the per-entry Reveal.
  const sceneRef = useScrollScene<HTMLOListElement>((scope) => {
    const line = scope.querySelector<HTMLElement>(`.${styles.progressLine}`);
    if (!line) return;
    gsap.to(line, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: scope,
        start: 'top center',
        end: 'bottom center',
        scrub: true,
      },
    });
  });

  return (
    <Section id="experience" index="03 · Experience" title="Опыт">
      <ol className={styles.timeline} ref={sceneRef}>
        <span className={styles.progressLine} aria-hidden="true" />
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
