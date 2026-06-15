import { useRef, type ReactNode } from 'react';
import {
  usePrefersReducedMotion,
  useMediaQuery,
} from '../../hooks/useMediaQuery';
import styles from './ParticleBurst.module.css';

interface ParticleBurstProps {
  children: ReactNode;
  className?: string;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

const MAX_DPR = 2;
const PAD = 90; // canvas bleed so sparks can fly past the button edges
const COUNT = 80;
const GRAVITY = 0.0006; // px / ms²

function readAccent(): string {
  return (
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() ||
    '#e4b363'
  );
}

/**
 * Wraps an interactive element and fires a one-shot gold particle burst from
 * the click point — the "build succeeded / deploy shipped" celebration that
 * closes the page's particle vocabulary. Purely decorative: the canvas is
 * `aria-hidden` + `pointer-events:none` and never intercepts the click, so the
 * wrapped link/button works exactly as before. Gated to fine pointers + motion
 * on; touch and reduced-motion users just get the plain action.
 */
export function ParticleBurst({ children, className }: ParticleBurstProps) {
  const reduced = usePrefersReducedMotion();
  const finePointer = useMediaQuery('(pointer: fine)');
  const enabled = !reduced && finePointer;

  const wrapRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const rafRef = useRef<number | null>(null);

  const fire = (clientX: number, clientY: number) => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!wrap || !canvas || !ctx) return;

    const rect = wrap.getBoundingClientRect();
    const w = rect.width + PAD * 2;
    const h = rect.height + PAD * 2;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.style.left = `${-PAD}px`;
    canvas.style.top = `${-PAD}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = clientX - rect.left + PAD;
    const cy = clientY - rect.top + PAD;
    const color = readAccent();
    sparksRef.current = Array.from({ length: COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.12 + Math.random() * 0.42; // px/ms
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 600 + Math.random() * 500,
        size: Math.random() < 0.8 ? 2 : 3,
      };
    });

    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    let last = performance.now();
    ctx.fillStyle = color;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      ctx.clearRect(0, 0, w, h);
      let alive = 0;
      for (const s of sparksRef.current) {
        if (s.life <= 0) continue;
        s.life -= dt;
        s.vy += GRAVITY * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const alpha = Math.max(0, s.life / 1100);
        if (alpha <= 0.01) continue;
        alive += 1;
        ctx.globalAlpha = alpha;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }
      ctx.globalAlpha = 1;
      if (alive > 0 && !document.hidden) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, w, h);
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (enabled) fire(e.clientX, e.clientY);
  };

  return (
    <span ref={wrapRef} className={`${styles.wrap} ${className ?? ''}`} onClick={handleClick}>
      {children}
      {enabled && (
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      )}
    </span>
  );
}
