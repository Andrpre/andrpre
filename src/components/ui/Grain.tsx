import styles from './Grain.module.css';

/** Fixed, decorative film-grain overlay rendered via inline SVG noise. */
export function Grain() {
  return (
    <div className={styles.grain} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
        <filter id="grain-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-noise)" />
      </svg>
    </div>
  );
}
