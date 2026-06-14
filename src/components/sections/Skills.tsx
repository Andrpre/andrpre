import { skillGroups } from '../../data/skills';
import { Section } from '../ui/Section';
import { RevealGroup, RevealItem } from '../ui/Reveal';
import styles from './Skills.module.css';

export function Skills() {
  return (
    <Section id="skills" index="02 · Skills" title="Навыки">
      <RevealGroup className={styles.grid} as="div" stagger={0.1}>
        {skillGroups.map((group) => (
          <RevealItem key={group.title} as="article" className={styles.group}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <ul className={styles.tags}>
              {group.items.map((item) => (
                <li key={item} className={`mono ${styles.tag}`}>
                  {item}
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
