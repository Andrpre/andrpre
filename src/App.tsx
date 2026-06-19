import { profile } from './data/profile';
import { experience } from './data/experience';
import { projects } from './data/projects';
import { skillGroups } from './data/skills';
import { GithubIcon, TelegramIcon, ArrowIcon } from './components/icons';
import styles from './App.module.css';

const [firstName, ...rest] = profile.nameLatin.split(' ');
const lastName = rest.join(' ');

// Footer socials: GitHub + Telegram only (per design).
const footerSocials = profile.socials.filter(
  (s) => s.icon === 'github' || s.icon === 'telegram',
);

// Two projects as a compact secondary block.
const featured = projects.slice(0, 2);

// Flatten skill groups into a single de-duplicated tag list.
const techStack = Array.from(new Set(skillGroups.flatMap((g) => g.items)));

export default function App() {
  return (
    <main className={styles.page}>
      <header className={styles.top}>
        <a href="#" className={styles.logo} aria-label={profile.nameLatin}>
          {firstName[0]}
          {lastName[0]}
          <span className={styles.logoMark} aria-hidden="true" />
        </a>
        <a className={styles.topLink} href={`mailto:${profile.email}`}>
          Написать <ArrowIcon width={14} height={14} />
        </a>
      </header>

      <div className={styles.body}>
        {/* ── Left: identity ───────────────────────────── */}
        <section className={styles.left}>
          <h1 className={styles.name}>
            <span>{firstName}</span>
            <span className={styles.nameDim}>{lastName}</span>
          </h1>
          <p className={styles.role}>{profile.role}</p>
          <p className={styles.tagline}>{profile.tagline}</p>

          <p className={styles.status}>
            <span className={styles.dot} aria-hidden="true" />
            Открыт к новым предложениям
          </p>
        </section>

        {/* ── Right: experience, projects, stack ──────────── */}
        <aside className={styles.right}>
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Опыт работы</h2>
            <ol className={styles.expList}>
              {experience.map((item, i) => (
                <li key={item.company + item.period} className={styles.expItem}>
                  <span className={styles.expNum}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.expMain}>
                    <span className={styles.expCompany}>{item.company}</span>
                    <span className={styles.expRole}>{item.role}</span>
                  </span>
                  <span className={styles.expPeriod}>{item.period}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Проекты</h2>
            <ul className={styles.projList}>
              {featured.map((p) => {
                const href =
                  p.liveUrl && p.liveUrl !== '#' ? p.liveUrl : p.repoUrl;
                const Tag = href ? 'a' : 'span';
                return (
                  <li key={p.title}>
                    <Tag
                      className={styles.projItem}
                      {...(href
                        ? { href, target: '_blank', rel: 'noreferrer' }
                        : {})}
                    >
                      <span className={styles.projTitle}>{p.title}</span>
                      <span className={styles.projMeta}>
                        {p.tags[0]}
                        {href && <ArrowIcon width={12} height={12} />}
                      </span>
                    </Tag>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Технологии</h2>
            <ul className={styles.tags}>
              {techStack.map((t) => (
                <li key={t} className={styles.tag}>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <nav className={styles.socials} aria-label="Контакты">
            {footerSocials.map((s) => (
              <a
                key={s.icon}
                className={styles.social}
                href={s.href}
                target="_blank"
                rel="noreferrer"
              >
                {s.icon === 'github' ? <GithubIcon /> : <TelegramIcon />}
                {s.label}
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </main>
  );
}
