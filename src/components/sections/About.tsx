import { profile } from '../../data/profile';
import { Section } from '../ui/Section';
import { Reveal } from '../ui/Reveal';
import { useScrollScene, gsap } from '../../hooks/useScrollScene';
import styles from './About.module.css';

export function About() {
  // Subtle parallax depth on the facts panel as the section scrolls through.
  // GSAP drives the inner <aside>; Framer's Reveal owns the wrapper — different
  // nodes, so the two never fight over `transform`.
  const sceneRef = useScrollScene<HTMLDivElement>((scope) => {
    const aside = scope.querySelector<HTMLElement>('[data-parallax]');
    if (!aside) return;
    gsap.fromTo(
      aside,
      { yPercent: 8 },
      {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: scope,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });

  return (
    <Section id="about" index="01 · About" title="Обо мне">
      <div className={styles.grid} ref={sceneRef}>
        <div className={styles.bio}>
          {profile.bio.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className={styles.paragraph}>{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className={styles.asideWrap}>
          <aside className={styles.aside} data-parallax>
            <dl className={styles.facts}>
              <div className={styles.fact}>
                <dt className="mono">Уровень</dt>
                <dd>{profile.level}</dd>
              </div>
              <div className={styles.fact}>
                <dt className="mono">Роль</dt>
                <dd>{profile.role}</dd>
              </div>
              {profile.location && (
                <div className={styles.fact}>
                  <dt className="mono">Локация</dt>
                  <dd>{profile.location}</dd>
                </div>
              )}
              <div className={styles.fact}>
                <dt className="mono">Фокус</dt>
                <dd>React · TypeScript · UX</dd>
              </div>
            </dl>
          </aside>
        </Reveal>
      </div>
    </Section>
  );
}
