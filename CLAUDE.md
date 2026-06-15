# CLAUDE.md

Guidance for AI assistants working in this repository.

## What this is

Personal portfolio site for **Andrey Kozhukhov** (frontend developer), built as a
single-page React application. The repo doubles as the GitHub *profile* repo
(`Andrpre/andrpre`), so `README.md` is the rendered profile page and the rest of the
repo is the portfolio site source.

- **Stack:** React 18, TypeScript (strict), Vite 5, Framer Motion 11, CSS Modules.
- **No CSS framework, no UI kit, no state library** — styling is hand-written CSS with
  design tokens; the only runtime deps are `react`, `react-dom`, and `framer-motion`.
- **Language:** UI copy and most code comments are in **Russian**. Keep new
  user-facing text in Russian to match; code identifiers stay in English.
- **Deploy target:** GitHub Pages at `https://andrpre.github.io/andrpre/`.

## Commands

```bash
npm install      # install deps
npm run dev      # Vite dev server with HMR
npm run build    # type-check (tsc --noEmit) then vite build → dist/
npm run preview  # serve the production build locally
npm run lint     # type-check only (tsc --noEmit) — there is no ESLint/Prettier configured
```

There is **no test suite** and **no linter beyond `tsc`**. Before committing, run
`npm run build` (or at minimum `npm run lint`) — the build runs `tsc --noEmit` and will
fail on type errors, including `noUnusedLocals`/`noUnusedParameters`.

## Project structure

```
index.html              # entry HTML; sets <html lang="ru" data-theme>, fonts, OG meta,
                         #   and an inline anti-flash theme script (runs before first paint)
vite.config.ts          # base: '/andrpre/' MUST match the repo name for Pages
src/
  main.tsx              # React root; StrictMode; imports global.css
  App.tsx               # composes providers + section order (single source of page layout)
  context/
    ThemeContext.tsx    # dark/light theme provider + useTheme(); persists to localStorage
  data/                 # ALL site content lives here as typed TS objects — edit data, not JSX
    types.ts            # Profile, SkillGroup, ExperienceItem, Project, SocialLink interfaces
    profile.ts          # name, role, bio, socials, email
    skills.ts | experience.ts | projects.ts
  hooks/
    useMediaQuery.ts    # useMediaQuery() + usePrefersReducedMotion()
    useActiveSection.ts # IntersectionObserver scroll-spy for the nav
  components/
    layout/             # Nav, Footer, ThemeToggle
    sections/           # Hero, About, Skills, Experience, Projects, Contact (one per page section)
    ui/                 # Reusable primitives: Section, Reveal, MagneticButton, Cursor, Grain, icons
  styles/
    reset.css           # CSS reset
    tokens.css          # design tokens (color/type/space) — single source of truth
    global.css          # @imports reset + tokens, then base/util classes (.container, .mono, .link)
public/                 # static assets copied as-is (favicon.svg, og-image.svg)
```

## Key conventions

### Content vs. presentation
Site copy is **data-driven**. To change text, projects, skills, or experience, edit the
files in `src/data/` — do **not** hard-code content into components. New content shapes
go through the interfaces in `src/data/types.ts` first.

### Component pattern
- One component per file, named export (e.g. `export function Hero()`), PascalCase file
  matching the component name.
- Each styled component pairs with a co-located CSS Module: `Hero.tsx` ↔ `Hero.module.css`,
  imported as `import styles from './Hero.module.css'` and used via `styles.foo`.
- Global utility classes (`container`, `mono`, `link`, `skip-link`) come from `global.css`
  and are applied as plain strings; combine with module classes via template literals:
  `` className={`container ${styles.inner}`} ``.
- Page sections live in `components/sections/`; wrap them with the `<Section>` primitive
  (`ui/Section.tsx`) which renders the `id`, monospace index label, and heading with proper
  `aria-labelledby`. Section `id`s are referenced by the nav (`layout/Nav.tsx` `LINKS`) and
  by `App.tsx` order — keep those three in sync when adding/removing/renaming a section.

### Styling & theming
- **Never hard-code colors, fonts, spacing, or radii.** Use the CSS custom properties from
  `tokens.css` (e.g. `var(--text)`, `var(--space-6)`, `var(--accent)`, `var(--step-2)`).
- Theme is controlled by `data-theme="dark|light"` on `<html>`. Dark is the default in
  `:root`; light overrides under `:root[data-theme='light']`. `ThemeContext` writes the
  attribute and persists to `localStorage`; `index.html` has an inline script that sets it
  before first paint to avoid a flash — keep that script in sync if theme storage changes.
- Type scale and spacing are fluid (`clamp()`); reuse the `--step-*` and `--space-*` tokens
  rather than introducing new magic numbers.

### Motion & accessibility
- Animations use **Framer Motion**. The shared easing is `[0.22, 1, 0.36, 1]` (also
  `var(--ease)` in CSS) — reuse it for consistency.
- **Always respect reduced motion.** Use `usePrefersReducedMotion()` and gate or zero-out
  animation offsets/stagger (see `Reveal`, `Hero`, `MagneticButton` for the pattern).
  `global.css` also kills transitions under `prefers-reduced-motion`.
- For scroll-in reveals use the `Reveal` / `RevealGroup` / `RevealItem` primitives in
  `ui/Reveal.tsx` instead of writing one-off `whileInView` variants.
- `MagneticButton` and `Cursor` effects are gated to fine pointers + motion-on; preserve
  those guards so touch/keyboard users are unaffected.
- Maintain accessibility: keep the skip link, `aria-label`/`aria-labelledby`,
  `aria-current` on the active nav item, and semantic landmarks (`<main>`, `<header>`,
  `<nav>`, `<section>`).

### TypeScript
- `strict` mode is on with `noUnusedLocals`, `noUnusedParameters`, and
  `noFallthroughCasesInSwitch`. Unused imports/vars break the build.
- Use `import type { ... }` for type-only imports (matches existing style;
  `isolatedModules` is enabled).

## Deployment & git workflow

- Pushing to **`main`** triggers `.github/workflows/deploy.yml`, which runs `npm ci`,
  `npm run build`, and publishes `dist/` to GitHub Pages. There is no separate hosting step.
- Because the site is served from a subpath, `vite.config.ts` sets `base: '/andrpre/'` and
  asset URLs in `index.html`/data use `/andrpre/...` (or `import.meta.env.BASE_URL`). If the
  repo is ever renamed, update `base` to match or assets will 404.
- `dist/`, `node_modules/`, and env files are gitignored — never commit build output.
- Do **not** open a pull request unless explicitly asked.

## When making changes

1. Adding/editing content → edit `src/data/*`, conform to `types.ts`.
2. Adding a section → create `components/sections/Foo.tsx` (+ `.module.css`), wrap in
   `<Section>`, register it in `App.tsx` and in `Nav.tsx`'s `LINKS`.
3. New design value → add a token in `tokens.css` rather than a literal.
4. New animation → use the shared easing, the `Reveal` primitives, and a reduced-motion guard.
5. Verify with `npm run build` before committing; keep UI copy in Russian.
