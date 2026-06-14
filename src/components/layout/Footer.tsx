import { profile } from '../../data/profile';
import { ArrowIcon } from '../ui/icons';
import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.copy}>
          © {year} {profile.name}
        </p>
        <p className={`mono ${styles.built}`}>Built with React + Vite</p>
        <a href="#top" className={styles.top}>
          Наверх
          <ArrowIcon width={16} height={16} />
        </a>
      </div>
    </footer>
  );
}
