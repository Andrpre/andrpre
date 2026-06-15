import { profile } from '../../data/profile';
import { Section } from '../ui/Section';
import { Reveal } from '../ui/Reveal';
import styles from './About.module.css';

export function About() {
  return (
    <Section id="about" index="01 · About" title="Обо мне">
      <div className={styles.grid}>
        <div className={styles.bio}>
          {profile.bio.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className={styles.paragraph}>{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className={styles.asideWrap}>
          <aside className={styles.aside}>
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
