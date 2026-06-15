---
name: stunning-portfolio
description: >-
  Techniques for building memorable, award-winning personal portfolio and
  business-card ("сайт-визитка") sites — visual direction, motion choreography,
  and a curated catalog of ready-made "wow" effect libraries (Paper Shaders,
  React Bits, GSAP, Vanta, …) plus how to wire a WebGL/shader hero centerpiece,
  performance budgets and accessibility. Use when designing or upgrading a
  portfolio/landing page that needs a strong "wow" factor while staying fast and
  accessible.
---

# Stunning portfolio / business-card sites

A field guide for turning a competent portfolio into one people remember. Bias
toward **one strong idea executed cleanly** over a pile of effects. Every effect
must survive the budget and accessibility checks at the bottom.

> **Prefer a battle-tested library over hand-rolled WebGL.** A maintained,
> popular effect library gives you a polished, declarative, theme-able result
> for a few lines of code — and avoids the subtle bugs of hand-managing a
> WebGL context (lost context on theme switch, leaked rAF loops, DPR/resize
> handling). Reach for raw WebGL/GLSL only when you need something no library
> offers. **This is the project's current approach** — see §3.

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

## 3. The "wow" centerpiece — use a ready-made effect library

A fragment-shader / animated background is the highest-impact "wow". Don't write
it by hand: pick a maintained library, drive it from your **design tokens**, and
keep one quiet centerpiece. Selection criteria: popular + actively maintained,
free to use, declarative (props, not imperative `init/destroy`), theme-able via
color props, lightweight, and TypeScript-friendly.

### Catalog of ready-made libraries (pick one)

| Library | Best for | Notes |
| --- | --- | --- |
| **[Paper Shaders](https://shaders.paper.design/)** (`@paper-design/shaders-react`) | Token-driven animated shader backgrounds | **What this repo uses.** Zero-dependency WebGL (no three.js), React + TS, fully declarative. Components: `MeshGradient`, `Waves`, `Dithering`, `GodRays`, `Warp`, `Voronoi`, `LiquidMetal`, … Color/`speed`/`distortion`/`swirl` are props → theme switch + reduced-motion are trivial. Source-available license, free for non-competing apps. |
| **[React Bits](https://reactbits.dev/)** | Drop-in animated backgrounds & components | MIT. OGL/Framer-Motion based (tiny). `Aurora`, `Iridescence`, `Threads`, `Silk`, `Beams`, `Hyperspeed`, tilt/spotlight cards. Distributed by copy-in (CLI/copy-paste) rather than a single npm import. |
| **[Vanta.js](https://www.vantajs.com/)** | One-call iconic backgrounds | MIT, very recognizable (`FOG`, `WAVES`, `NET`, `BIRDS`). Imperative (`init`/`destroy`; re-init or `setOptions` on theme change) and pulls **three.js** (~120 KB) — heavy for a minimalist stack. |
| **[GSAP](https://gsap.com/)** | Scroll-driven timelines, kinetic type, SVG | Now free incl. all plugins (ScrollTrigger, SplitText, Flip). The pro tool for choreographed scroll/timeline motion; pairs with any of the above. |
| **[Magic UI](https://magicui.design/) / [Aceternity UI](https://ui.aceternity.com/)** | shadcn-style animated section blocks | MIT, Tailwind + Framer Motion. Great for spotlight/beam/marquee section effects if you're already on shadcn/Tailwind. |
| **[Spline](https://spline.design/) / [Unicorn Studio](https://www.unicorn.studio/)** | No-code 3D / shader scenes | Design visually, embed via a runtime/`<iframe>`. Fastest path to a bespoke 3D hero; watch the runtime weight and licensing. |
| **[Three.js](https://threejs.org/) + [R3F](https://r3f.docs.pmnd.rs/) / [OGL](https://github.com/oframe/ogl)** | Real 3D scenes / geometry | Only when you genuinely need 3D models, physics or custom geometry. OGL is the lightweight middle ground; raw GLSL when nothing else fits. |

### How this repo wires it (Paper Shaders `MeshGradient`)

`src/components/ui/ShaderBackground.tsx` renders a `<MeshGradient>` behind the
hero. The pattern that makes it robust:

- **Token-driven colors.** Read `--bg`, `--bg-elevated`, `--accent`, `--surface`
  from `getComputedStyle(document.documentElement)` and pass them as the
  `colors` prop — `tokens.css` stays the single source of truth, no literals.
- **Theme switch = prop change (the bug fix).** Don't re-read tokens off the
  React `theme` value: child effects run *before* the provider's attribute-set
  effect, so you'd read the previous theme's tokens (a one-toggle color lag, and
  with hand-rolled WebGL, a lost-context crash). Instead, watch the attribute
  directly with a `MutationObserver` on `<html data-theme>` and re-read the
  palette when it flips. Passing new `colors` re-renders declaratively — the
  library updates its uniforms; no manual context teardown.
- **Reduced motion = `speed={0}`.** A static frame, no rAF loop. The library
  also handles DPR, resize and the WebGL context lifecycle for you.
- **Stay subtle.** Mostly background tones with accent pops; wrap in a div with
  reduced `opacity` + a bottom `mask-image` fade so hero text stays legible.
- **Decorative.** `aria-hidden="true"` + `pointer-events: none`.

If you ever drop the library, the old hand-rolled recipe (full-screen triangle +
domain-warped fbm noise, smoothed `u_mouse` attractor, vignette/bottom-fade
alpha, `--bg`/`--accent` uniforms re-read on theme change) still works — but
remember to recreate the WebGL context on theme change (a `loseContext()` in
cleanup makes the canvas un-reusable on re-init).

## 4. Performance budget

- **Cap DPR at ~2** (libraries expose `maxPixelRatio`/`maxPixelCount`; set it).
- **Pause animation off-screen** (`IntersectionObserver`) and when the tab is
  hidden (`visibilitychange`). Never animate what isn't seen — check whether the
  library pauses itself; if not, gate it.
- Keep shader work cheap (≤5 fbm octaves if hand-rolling); prefer GPU transforms
  (`transform`, `opacity`) over layout-triggering properties.
- **Mind the bundle.** Prefer zero-/light-dependency effect libs (Paper Shaders,
  OGL, React Bits) over pulling three.js for a flat background. Lazy-load
  heavy/below-the-fold media and 3D scenes.
- Always provide a **graceful fallback** if WebGL is unavailable (the ambient
  CSS glow alone should still look intentional).

## 5. Accessibility (non-negotiable)

- **Respect `prefers-reduced-motion`:** zero out staggers/offsets, disable
  parallax/tilt, and render shaders as a single static frame (e.g. `speed={0}`,
  no loop).
- **Gate pointer effects** to fine pointers (`(pointer: fine)`) so touch and
  keyboard users are unaffected.
- Maintain semantic landmarks, skip links, `aria-label`/`aria-labelledby`,
  `aria-current` on active nav, and sufficient text contrast over animated
  backgrounds.
- Decorative canvases/overlays get `aria-hidden="true"` and
  `pointer-events: none`.

## 6. Ship checklist

- [ ] One clear focal centerpiece; rest is quiet.
- [ ] Effect comes from a maintained library (or a deliberate raw-WebGL choice).
- [ ] All color/type/spacing from tokens — no literals; shader colors are props.
- [ ] One shared easing curve across all motion.
- [ ] Reduced-motion path verified (static, no jank).
- [ ] Pointer effects gated to fine pointers; touch/keyboard unaffected.
- [ ] Animation paused off-screen and when tab hidden; DPR capped.
- [ ] WebGL fallback looks intentional.
- [ ] Works in light + dark themes; theme switch re-colors the effect, no flash,
      no broken/blank canvas after toggling.
- [ ] Type-check / build is green; bundle stays lean.

## References

Libraries & docs

- [Paper Shaders — gallery + docs](https://shaders.paper.design/) ·
  [GitHub](https://github.com/paper-design/shaders) ·
  [React usage guide](https://mintlify.com/paper-design/shaders/guides/react-usage)
- [React Bits — animated React components](https://reactbits.dev/) ·
  [GitHub](https://github.com/DavidHDev/react-bits)
- [Vanta.js — animated 3D backgrounds](https://www.vantajs.com/)
- [GSAP (now fully free)](https://gsap.com/) · [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Magic UI](https://magicui.design/) · [Aceternity UI](https://ui.aceternity.com/) · [shadcn shader components](https://www.shadcn.io/shaders)
- [Spline](https://spline.design/) · [Unicorn Studio](https://www.unicorn.studio/)
- [Three.js](https://threejs.org/) · [React Three Fiber](https://r3f.docs.pmnd.rs/) · [OGL](https://github.com/oframe/ogl)

Inspiration & technique

- [Awwwards — Interactive WebGL Hero (Matt Bierman portfolio)](https://www.awwwards.com/inspiration/interactive-webgl-hero-matt-bierman-portfolio)
- [Awwwards — Cyd Stumpel Portfolio 2025 (SOTD)](https://www.awwwards.com/sites/cyd-stumpel-portfolio-2025)
- [Codrops — The Creative WebGL Worlds of Adrián Gubrica](https://tympanus.net/codrops/2025/12/05/from-illusions-to-optimization-the-creative-webgl-worlds-of-adrian-gubrica/)
- [Awwward-winning animation techniques for websites (Bootcamp / Medium)](https://medium.com/design-bootcamp/awwward-winning-animation-techniques-for-websites-cb7c6b5a86ff)
- [Tracking the cursor with Framer Motion (framerbook)](https://framerbook.com/animation/example-animations/26-tracking-the-cursor/)
- [Creating staggered animations with Framer Motion](https://medium.com/@onifkay/creating-staggered-animations-with-framer-motion-0e7dc90eae33)
- [Two easing curves and no animation library (Frigade)](https://frigade.com/blog/two-easing-curves-no-animation-library)
