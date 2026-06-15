import { useState } from 'react';
import { motion } from 'framer-motion';
import { useActiveSection } from '../../hooks/useActiveSection';
import { profile } from '../../data/profile';
import { ThemeToggle } from './ThemeToggle';
import styles from './Nav.module.css';

const LINKS = [
  { id: 'about', label: 'Обо мне' },
  { id: 'skills', label: 'Навыки' },
  { id: 'experience', label: 'Опыт' },
  { id: 'projects', label: 'Проекты' },
  { id: 'contact', label: 'Контакты' },
];

export function Nav() {
  const active = useActiveSection(LINKS.map((l) => l.id));
  const [open, setOpen] = useState(false);

  const initials = profile.nameLatin
    .split(' ')
    .map((w) => w[0])
    .join('');

  return (
    <motion.header
      className={styles.header}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className={`container ${styles.nav}`} aria-label="Основная навигация">
        <a href="#top" className={styles.logo} aria-label="В начало">
          {initials}
          <span className={styles.logoDot} aria-hidden="true">
            .
          </span>
        </a>

        <button
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label="Меню"
          onClick={() => setOpen((v) => !v)}
        >
          <span data-open={open} />
        </button>

        <ul
          id="nav-links"
          className={styles.links}
          data-open={open}
          onClick={() => setOpen(false)}
        >
          {LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={styles.link}
                aria-current={active === link.id ? 'true' : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className={styles.themeLi}>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </motion.header>
  );
}
