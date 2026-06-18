import type { SkillGroup } from './types';

export const skillGroups: SkillGroup[] = [
  {
    title: 'Languages',
    items: ['TypeScript', 'JavaScript (ES2023)', 'HTML5', 'CSS3', 'Sass'],
  },
  {
    title: 'Frameworks & Libraries',
    items: [
      'React',
      'Next.js',
      'Redux Toolkit',
      'Zustand',
      'React Hook Form',
      'TanStack Query',
    ],
  },
  {
    title: 'API & Tooling',
    items: ['REST', 'GraphQL', 'Vite', 'Webpack', 'Docker', 'Git'],
  },
  {
    title: 'Practices',
    items: [
      'FSD-архитектура',
      'Оптимизация производительности',
      'Адаптивная вёрстка',
      'Тесты',
      'Figma',
    ],
  },
];
