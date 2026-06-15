import { profile } from '../../data/profile';
import { Section } from '../ui/Section';
import { Reveal } from '../ui/Reveal';
import { MagneticButton } from '../ui/MagneticButton';
import { ParticleBurst } from '../ui/ParticleBurst';
import { SocialGlyph } from '../ui/icons';
import styles from './Contact.module.css';

export function Contact() {
  return (
    <Section id="contact" index="05 · Contact" title="Контакты">
      <div className={styles.wrap}>
        <Reveal>
          <p className={styles.lead}>
            Открыт к интересным задачам и сотрудничеству. Напишите — отвечу.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ParticleBurst>
            <a href={`mailto:${profile.email}`} className={styles.email}>
              {profile.email}
            </a>
          </ParticleBurst>
        </Reveal>

        <Reveal delay={0.18}>
          <ul className={styles.socials}>
            {profile.socials.map((social) => (
              <li key={social.label}>
                <MagneticButton
                  href={social.href}
                  ariaLabel={social.label}
                  target={social.icon === 'email' ? undefined : '_blank'}
                  rel={social.icon === 'email' ? undefined : 'noreferrer'}
                  className={styles.social}
                >
                  <SocialGlyph icon={social.icon} width={20} height={20} />
                  <span>{social.label}</span>
                </MagneticButton>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
