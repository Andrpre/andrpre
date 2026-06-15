---
name: stunning-portfolio
description: >-
  Techniques for building memorable, award-winning personal portfolio and
  business-card ("сайт-визитка") sites — visual direction, motion choreography,
  WebGL/shader hero centerpieces, performance budgets and accessibility. Use
  when designing or upgrading a portfolio/landing page that needs a strong
  "wow" factor while staying fast and accessible.
---

# Stunning portfolio / business-card sites

A field guide for turning a competent portfolio into one people remember. Bias
toward **one strong idea executed cleanly** over a pile of effects. Every effect
must survive the budget and accessibility checks at the bottom.

## 1. Design direction (memorability)

- **One focal centerpiece.** Award-winning sites usually have a single hero
  moment (a WebGL field, kinetic type, a 3D object) and let everything else be
  quiet. Don't compete with yourself.
- **Restrained palette + one accent.** A near-monochrome base with a single
  signature accent reads as intentional and premium. Drive all color from design
  tokens (CSS custom properties), never hard-coded literals.
- **Confident typography.** A geometric display face for impact, a neutral face
  for body, a mono for technical labels/metadata. Fluid `clamp()` scales so type
  feels composed at every width.
- **Generous negative space + rhythm.** A consistent spacing scale (8px base)
  and a max-width container keep dense content calm.
- **Texture for depth.** Subtle film grain, ambient radial glows, and soft
  vignettes add analog richness without distracting.
- **Theme-aware.** Dark default with a tasteful light theme; set the theme
  before first paint (inline script) to avoid a flash.

## 2. Motion choreography

- **Entrance staggers.** Reveal sections with a short fade + rise; stagger
  children (~0.06–0.1s) so content arrives as a choreographed sequence, not all
  at once. Hero name can split per word/letter.
- **Shared easing.** Pick one signature curve (e.g. `cubic-bezier(0.22, 1,
  0.36, 1)`) and reuse it everywhere for cohesion.
- **Cursor-reactive micro-interactions.** Magnetic buttons, a custom cursor, and
  3D tilt on cards (perspective + `rotateX/rotateY` from cursor position, eased
  with springs) make the page feel alive and responsive — fitting for a frontend
  dev's site.
- **Scroll feedback.** A thin scroll-progress bar and light parallax on
  background layers reward scrolling without hijacking it.
- **Separation of concerns.** Let CSS handle predictable, looping motion
  (keyframes, transitions); use JS/Framer Motion for dynamic, state- or
  pointer-dependent motion (springs, `useMotionValue`, `useScroll`).

## 3. WebGL / shader hero (the centerpiece)

A fragment-shader background is the highest-impact, lowest-bloat "wow" — raw
WebGL needs **no dependency** (Three.js/R3F only when you genuinely need 3D
scenes/geometry).

Recipe for an organic, interactive field:

- Full-screen triangle + fragment shader; skip vertex math.
- **Domain-warped fbm noise** (feed value/Perlin noise into itself) for a
  flowing, liquid look. Tint between the page background and the accent so it
  stays subtle and text stays legible.
- **Pointer attractor:** pass a smoothed (eased/lerped) `u_mouse` uniform; have
  the field brighten / pull toward the cursor.
- **Theme-driven colors:** read `--bg` / `--accent` from computed styles and
  pass as uniforms; re-read on theme change.
- **Mask the edges:** radial vignette + bottom fade (CSS `mask-image` or in-shader
  alpha) so the hero blends into the page and content below stays readable.

## 4. Performance budget

- **Cap DPR at ~2**; resize via `ResizeObserver`.
- **Pause the rAF loop** when the canvas is off-screen (`IntersectionObserver`)
  and when the tab is hidden (`visibilitychange`). Never animate what isn't seen.
- Keep shader loops small (≤5 fbm octaves); prefer GPU transforms (`transform`,
  `opacity`) over layout-triggering properties.
- Lazy-load heavy/below-the-fold media; keep the runtime dependency list tiny.
- Always provide a **graceful fallback** if WebGL is unavailable (the ambient
  CSS glow alone should still look intentional).

## 5. Accessibility (non-negotiable)

- **Respect `prefers-reduced-motion`:** zero out staggers/offsets, disable
  parallax/tilt, and render shaders as a single static frame (no loop).
- **Gate pointer effects** to fine pointers (`(pointer: fine)`) so touch and
  keyboard users are unaffected.
- Maintain semantic landmarks, skip links, `aria-label`/`aria-labelledby`,
  `aria-current` on active nav, and sufficient text contrast over animated
  backgrounds.
- Decorative canvases/overlays get `aria-hidden="true"` and
  `pointer-events: none`.

## 6. Ship checklist

- [ ] One clear focal centerpiece; rest is quiet.
- [ ] All color/type/spacing from tokens — no literals.
- [ ] One shared easing curve across all motion.
- [ ] Reduced-motion path verified (static, no jank).
- [ ] Pointer effects gated to fine pointers; touch/keyboard unaffected.
- [ ] rAF paused off-screen and when tab hidden; DPR capped.
- [ ] WebGL fallback looks intentional.
- [ ] Works in light + dark themes; no theme flash.
- [ ] Type-check / build is green; bundle stays lean.

## References

- [Awwwards — Interactive WebGL Hero (Matt Bierman portfolio)](https://www.awwwards.com/inspiration/interactive-webgl-hero-matt-bierman-portfolio)
- [Awwwards — Cyd Stumpel Portfolio 2025 (SOTD)](https://www.awwwards.com/sites/cyd-stumpel-portfolio-2025)
- [Codrops — The Creative WebGL Worlds of Adrián Gubrica](https://tympanus.net/codrops/2025/12/05/from-illusions-to-optimization-the-creative-webgl-worlds-of-adrian-gubrica/)
- [Awwward-winning animation techniques for websites (Bootcamp / Medium)](https://medium.com/design-bootcamp/awwward-winning-animation-techniques-for-websites-cb7c6b5a86ff)
- [Tracking the cursor with Framer Motion (framerbook)](https://framerbook.com/animation/example-animations/26-tracking-the-cursor/)
- [Creating staggered animations with Framer Motion](https://medium.com/@onifkay/creating-staggered-animations-with-framer-motion-0e7dc90eae33)
- [Two easing curves and no animation library (Frigade)](https://frigade.com/blog/two-easing-curves-no-animation-library)
