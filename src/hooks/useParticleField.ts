import { useEffect, useRef, type RefObject } from 'react';

/**
 * Hand-rolled canvas-2D particle engine — the single visual primitive behind
 * the site's "Сборка / Compile" concept. One engine, two modes:
 *
 *  - `assemble`    — particles drift in from a scattered cloud and settle into
 *                    the glyphs of a text element ("text emerges from smoke").
 *                    Runs a one-shot, self-terminating rAF and calls `onSettled`.
 *  - `disassemble` — particles start on the glyphs and disperse upward as a
 *                    caller-driven `progress` (0→1) rises ("crumbles to ash").
 *                    Deterministic per-frame draw, so it scrubs cleanly with a
 *                    GSAP ScrollTrigger.
 *
 * Colors are read from the design tokens (`--accent` / `--text`), DPR is capped
 * at 2, the loop pauses on a hidden tab, and everything is gated by `enabled`
 * (callers pass `false` under reduced motion). Canvas-2D is near-universal; if a
 * context can't be obtained the hook is a no-op and the live DOM text stands in.
 */

const MAX_DPR = 2;
const MAX_PARTICLES = 3500;
/** Shared signature easing — mirrors `var(--ease)` / Reveal's curve. */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export type ParticleMode = 'assemble' | 'disassemble';

interface Particle {
  /** settled (on-glyph) position, in CSS px relative to the canvas box */
  tx: number;
  ty: number;
  /** offset position — scatter origin (assemble) or dispersal target (disassemble) */
  ox: number;
  oy: number;
  size: number;
  /** 0–1 stagger so the cloud arrives/leaves as a wave, not all at once */
  delay: number;
}

interface UseParticleFieldArgs {
  /** the live element whose box + computed font we mirror (e.g. the <h1>) */
  targetRef: RefObject<HTMLElement | null>;
  text: string;
  mode: ParticleMode;
  /** false under reduced motion / unsupported canvas → engine stays dormant */
  enabled: boolean;
  /** assemble: fired once the cloud has fully settled (also fired on fallback) */
  onSettled?: () => void;
  /** assemble run length in ms */
  duration?: number;
}

interface UseParticleFieldResult {
  canvasRef: RefObject<HTMLCanvasElement>;
  /** disassemble: drive the dissolve, 0 = intact glyphs, 1 = fully dispersed */
  setProgress: (progress: number) => void;
}

interface SampleArgs {
  text: string;
  width: number;
  height: number;
  font: string;
  lineHeight: number;
  letterSpacing: number;
  /** sampling step in CSS px (smaller = denser) */
  step: number;
}

/**
 * Render `text` into an offscreen canvas mirroring the DOM element's box +
 * font (manual flex-style word wrap), then sample opaque pixels on a grid.
 * Returns target points in box-local CSS px.
 */
function sampleTextPoints({
  text,
  width,
  height,
  font,
  lineHeight,
  letterSpacing,
  step,
}: SampleArgs): { x: number; y: number }[] {
  const w = Math.ceil(width);
  const h = Math.ceil(height);
  if (w <= 0 || h <= 0) return [];

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  ctx.font = font;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#fff';
  // `letterSpacing` is widely supported; ignored gracefully where it isn't.
  if ('letterSpacing' in ctx) {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
      `${letterSpacing}px`;
  }

  // Lay words out like the <h1>'s `flex-wrap` with a ~0.3em horizontal gap.
  const fontSize = parseFloat(font) || lineHeight;
  const gap = fontSize * 0.3;
  const ascent = fontSize * 0.82;
  const words = text.split(/\s+/).filter(Boolean);
  let cursorX = 0;
  let line = 0;
  for (const word of words) {
    const wordWidth = ctx.measureText(word).width;
    if (cursorX > 0 && cursorX + wordWidth > w) {
      line += 1;
      cursorX = 0;
    }
    ctx.fillText(word, cursorX, line * lineHeight + ascent);
    cursorX += wordWidth + gap;
  }

  const data = ctx.getImageData(0, 0, w, h).data;
  const points: { x: number; y: number }[] = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      // alpha channel of the sampled pixel
      if (data[(y * w + x) * 4 + 3] > 128) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

function readAccent(): string {
  const cs = getComputedStyle(document.documentElement);
  return cs.getPropertyValue('--accent').trim() || '#e4b363';
}

export function useParticleField({
  targetRef,
  text,
  mode,
  enabled,
  onSettled,
  duration = 1500,
}: UseParticleFieldArgs): UseParticleFieldResult {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const colorRef = useRef<string>('#e4b363');
  const rafRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const dprRef = useRef(1);
  const onSettledRef = useRef(onSettled);
  onSettledRef.current = onSettled;

  /** Draw the cloud at a given global progress (0→1). */
  const draw = (progress: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = dprRef.current;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    // At rest, disassemble shows nothing — the live text stands alone until the
    // dissolve actually begins.
    if (mode === 'disassemble' && progress <= 0.001) return;
    ctx.fillStyle = colorRef.current;

    const particles = particlesRef.current;
    // a small spread so the wave isn't a hard edge
    const SPREAD = 0.55;
    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      const local = clamp01((progress - p.delay * SPREAD) / (1 - SPREAD));
      const eased = easeOutCubic(local);
      let x: number;
      let y: number;
      let alpha: number;
      if (mode === 'assemble') {
        // scatter origin → glyph; fade in as it arrives
        x = p.ox + (p.tx - p.ox) * eased;
        y = p.oy + (p.ty - p.oy) * eased;
        alpha = eased;
      } else {
        // glyph → dispersal target; fade out as it leaves
        x = p.tx + (p.ox - p.tx) * eased;
        y = p.ty + (p.oy - p.ty) * eased;
        alpha = 1 - eased;
      }
      if (alpha <= 0.01) continue;
      ctx.globalAlpha = alpha;
      ctx.fillRect(x, y, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  };

  // Build the particle set from the target's box + font. Returns success.
  const build = (): boolean => {
    const canvas = canvasRef.current;
    const target = targetRef.current;
    if (!canvas || !target) return false;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    const rect = target.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    dprRef.current = dpr;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cs = getComputedStyle(target);
    const fontSize = parseFloat(cs.fontSize) || 48;
    const lineHeight = parseFloat(cs.lineHeight) || fontSize * 1.02;
    const letterSpacing = parseFloat(cs.letterSpacing) || 0;
    const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;

    // Keep the count in budget: widen the sampling grid until under the cap.
    let step = Math.max(3, Math.round(fontSize / 16));
    let points = sampleTextPoints({
      text,
      width: rect.width,
      height: rect.height,
      font,
      lineHeight,
      letterSpacing,
      step,
    });
    while (points.length > MAX_PARTICLES) {
      step += 1;
      points = sampleTextPoints({
        text,
        width: rect.width,
        height: rect.height,
        font,
        lineHeight,
        letterSpacing,
        step,
      });
    }
    if (points.length === 0) return false;

    const diag = Math.hypot(rect.width, rect.height);
    particlesRef.current = points.map((pt) => {
      if (mode === 'assemble') {
        // origin: a scattered cloud biased from below — "rising smoke"
        const angle = Math.random() * Math.PI * 2;
        const dist = diag * (0.15 + Math.random() * 0.5);
        return {
          tx: pt.x,
          ty: pt.y,
          ox: pt.x + Math.cos(angle) * dist,
          oy: pt.y + Math.sin(angle) * dist + diag * 0.25,
          size: Math.random() < 0.85 ? 1.5 : 2.5,
          delay: Math.random(),
        };
      }
      // disassemble: dispersal target drifts up + out, like ash
      const drift = diag * (0.2 + Math.random() * 0.6);
      return {
        tx: pt.x,
        ty: pt.y,
        ox: pt.x + (Math.random() - 0.5) * drift,
        oy: pt.y - drift,
        size: Math.random() < 0.85 ? 1.5 : 2.5,
        delay: Math.random(),
      };
    });
    colorRef.current = readAccent();
    return true;
  };

  // Assemble: build once fonts are ready, then run a one-shot rAF.
  useEffect(() => {
    if (mode !== 'assemble' || !enabled) return;
    let cancelled = false;
    let fallback: number;

    const run = () => {
      if (cancelled) return;
      if (!build()) {
        // Could not sample (no box/font/context) — reveal the live text anyway.
        onSettledRef.current?.();
        return;
      }
      const startTime = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        if (document.hidden) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        const progress = clamp01((now - startTime) / duration);
        progressRef.current = progress;
        draw(progress);
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          onSettledRef.current?.();
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) {
      fonts.ready.then(run);
      // Safety net: never leave the name invisible if fonts hang.
      fallback = window.setTimeout(run, 1200);
    } else {
      run();
    }

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [mode, enabled, text, duration]);

  // Disassemble: build on ready; the caller drives draw() via setProgress.
  useEffect(() => {
    if (mode !== 'disassemble' || !enabled) return;
    let cancelled = false;

    const ready = () => {
      if (cancelled) return;
      if (build()) draw(progressRef.current);
    };
    const onResize = () => ready();

    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) fonts.ready.then(ready);
    else ready();
    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
    };
  }, [mode, enabled, text]);

  const setProgress = (progress: number) => {
    progressRef.current = clamp01(progress);
    draw(progressRef.current);
  };

  return { canvasRef, setProgress };
}
