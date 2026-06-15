import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import styles from './ShaderBackground.module.css';

/* Full-screen triangle — no vertex buffer math needed in the fragment shader. */
const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

/* Domain-warped fractal noise field, tinted between the page bg and the accent.
   Reacts to the (smoothed) pointer and fades out toward the bottom so section
   content below the hero stays readable. */
const FRAG = `
precision highp float;

uniform vec2  u_resolution;
uniform float u_time;
uniform vec2  u_mouse;      // 0..1, smoothed
uniform vec3  u_bg;
uniform vec3  u_accent;
uniform float u_intensity;  // 0 = static-ish, 1 = full motion

// 2D value noise + fbm (domain warping) — cheap, GPU-friendly.
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p *= 2.0;
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv;
  p.x *= aspect;

  float t = u_time * 0.05 * u_intensity;

  // Domain warping: feed fbm into itself for an organic, flowing field.
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(
    fbm(p + 1.5 * q + vec2(1.7, 9.2) + 0.15 * t),
    fbm(p + 1.5 * q + vec2(8.3, 2.8) - 0.12 * t)
  );
  float f = fbm(p + 1.8 * r);

  // Pointer attractor — the field brightens and pulls toward the cursor.
  vec2 m = u_mouse;
  m.x *= aspect;
  float d = distance(p, m);
  float pull = smoothstep(0.55, 0.0, d) * (0.35 + 0.65 * u_intensity);

  float field = clamp(f * 1.15 + pull, 0.0, 1.0);

  // Tint from bg toward accent; keep it subtle so text stays legible.
  vec3 col = mix(u_bg, u_accent, pow(field, 1.6) * 0.85);
  col += u_accent * pull * 0.25;

  // Soft radial vignette + bottom fade so the hero blends into the page.
  float vign = smoothstep(1.15, 0.2, length(uv - 0.5));
  float bottomFade = smoothstep(0.0, 0.55, uv.y);
  float alpha = vign * mix(0.5, 1.0, bottomFade);

  gl_FragColor = vec4(col, alpha);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/** Parse a CSS color (hex or rgb()) read from a custom property into 0..1 RGB. */
function readColor(varName: string): [number, number, number] {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  if (raw.startsWith('#')) {
    let hex = raw.slice(1);
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    const n = parseInt(hex, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const m = raw.match(/[\d.]+/g);
  if (m && m.length >= 3) {
    return [Number(m[0]) / 255, Number(m[1]) / 255, Number(m[2]) / 255];
  }
  return [0, 0, 0];
}

/**
 * Animated WebGL field rendered behind the hero. Token-driven colors, pointer
 * reactive, and gracefully degrades: static single frame under reduced motion,
 * paused off-screen / when the tab is hidden, and renders nothing if WebGL is
 * unavailable (the ambient CSS glow remains).
 */
export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false }) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return; // graceful fallback: ambient glow stays

    const vert = compile(gl, gl.VERTEX_SHADER, VERT);
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const u = {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      time: gl.getUniformLocation(program, 'u_time'),
      mouse: gl.getUniformLocation(program, 'u_mouse'),
      bg: gl.getUniformLocation(program, 'u_bg'),
      accent: gl.getUniformLocation(program, 'u_accent'),
      intensity: gl.getUniformLocation(program, 'u_intensity'),
    };

    // Colors are read from CSS tokens so the shader follows the active theme.
    const bg = readColor('--bg');
    const accent = readColor('--accent');
    gl.uniform3fv(u.bg, bg);
    gl.uniform3fv(u.accent, accent);
    gl.uniform1f(u.intensity, reduced ? 0 : 1);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: 0.7, y: 0.6 };
    const target = { x: 0.7, y: 0.6 };

    function resize() {
      if (!canvas || !gl) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u.resolution, canvas.width, canvas.height);
    }

    function render(now: number) {
      if (!gl) return;
      // Ease the pointer toward its target for fluid motion.
      mouse.x += (target.x - mouse.x) * 0.06;
      mouse.y += (target.y - mouse.y) * 0.06;
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
      gl.uniform1f(u.time, now * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    resize();

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / rect.width;
      target.y = 1 - (e.clientY - rect.top) / rect.height;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Reduced motion: paint one frame and stop. No rAF loop, no pointer drive.
    if (reduced) {
      render(0);
      return () => {
        ro.disconnect();
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    }

    window.addEventListener('pointermove', onPointer, { passive: true });

    let raf = 0;
    let running = false;
    const loop = (now: number) => {
      render(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Pause when the hero scrolls out of view or the tab is hidden.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (canvas.getBoundingClientRect().bottom > 0) start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [theme, reduced]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
