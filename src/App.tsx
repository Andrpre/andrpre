import { useState } from 'react';
import type { ComponentType, SVGProps } from 'react';
import { profile } from './data/profile';
import { experience } from './data/experience';
import { projects } from './data/projects';
import { skillGroups } from './data/skills';
import type { SocialIcon } from './data/types';
import {
  GithubIcon,
  TelegramIcon,
  MailIcon,
  ArrowIcon,
  ChevronIcon,
} from './components/icons';
import styles from './App.module.css';

const socialIcons: Record<SocialIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  github: GithubIcon,
  telegram: TelegramIcon,
  email: MailIcon,
};

const [firstName, ...rest] = profile.nameLatin.split(' ');
const lastName = rest.join(' ');

// Two projects as a compact secondary block.
const featured = projects.slice(0, 2);

// Flatten skill groups into a single de-duplicated tag list.
const techStack = Array.from(new Set(skillGroups.flatMap((g) => g.items)));

// Telegram link for the header CTA, sourced from socials so it stays in sync.
const telegram = profile.socials.find((s) => s.icon === 'telegram');

export default function App() {
  // Experience items expand/collapse independently; all collapsed by default.
  const [openExp, setOpenExp] = useState<Set<number>>(new Set());
  const toggleExp = (i: number) =>
    setOpenExp((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <main className={styles.page}>
      <header className={styles.top}>
        <a href="#" className={styles.logo} aria-label={profile.nameLatin}>
          {firstName[0]}
          {lastName[0]}
          <span className={styles.logoMark} aria-hidden="true" />
        </a>
        <a
          className={styles.topLink}
          href={telegram?.href ?? `mailto:${profile.email}`}
          target="_blank"
          rel="noreferrer"
        >
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
            <ul className={styles.expList}>
              {experience.map((item, i) => {
                const isOpen = openExp.has(i);
                const panelId = `exp-panel-${i}`;
                return (
                  <li
                    key={item.company + item.period}
                    className={styles.expItem}
                  >
                    <button
                      type="button"
                      className={styles.expHead}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleExp(i)}
                    >
                      <span className={styles.expMain}>
                        <span className={styles.expCompany}>{item.company}</span>
                        <span className={styles.expRole}>{item.role}</span>
                      </span>
                      <span className={styles.expPeriod}>{item.period}</span>
                      <ChevronIcon
                        className={styles.expChevron}
                        width={16}
                        height={16}
                      />
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      className={styles.expPanel}
                      data-open={isOpen}
                    >
                      <div className={styles.expPanelInner}>
                        <p className={styles.expDesc}>{item.description}</p>
                        {item.highlights && item.highlights.length > 0 && (
                          <ul className={styles.expHighlights}>
                            {item.highlights.map((h) => (
                              <li key={h}>{h}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Проекты</h2>
            <ol className={styles.projList}>
              {featured.map((p, i) => {
                const href = p.liveUrl && p.liveUrl !== "#" ? p.liveUrl : p.repoUrl;
                const Tag = href ? "a" : "span";
                return (
                  <li key={p.title}>
                    <Tag
                      className={styles.projItem}
                      {...(href ? { href, target: "_blank", rel: "noreferrer" } : {})}
                    >
                      <span className={styles.projNum}>{String(i + 1).padStart(2, "0")}</span>
                      <span className={styles.projTitle}>{p.title}</span>
                      <span className={styles.projMeta}>
                        {p.tags[0]}
                        {href && <ArrowIcon width={12} height={12} />}
                      </span>
                    </Tag>
                  </li>
                );
              })}
            </ol>
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
            {profile.socials.map((s) => {
              const Icon = socialIcons[s.icon];
              const isMail = s.href.startsWith("mailto:");
              return (
                <a
                  key={s.icon}
                  className={styles.social}
                  href={s.href}
                  {...(isMail ? {} : { target: "_blank", rel: "noreferrer" })}
                >
                  <Icon />
                  {s.label}
                </a>
              );
            })}
          </nav>
        </aside>
      </div>
    </main>
  );
}
