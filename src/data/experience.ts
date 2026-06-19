import type { ExperienceItem } from './types';

export const experience: ExperienceItem[] = [
  {
    company: 'amoCRM',
    role: 'Middle Frontend Developer',
    period: 'Ноябрь 2024 — настоящее время',
    description:
      'Разработка и развитие продуктовых модулей CRM-системы на React и TypeScript в составе frontend-команды.',
    highlights: [
      'Спроектировал и реализовал с нуля новый биллинговый раздел: управление подпиской, оплату, калькуляцию тарифов и интеграцию с тремя платёжными системами.',
      'Перевёл ряд высоконагруженных страниц с SSR на CSR, внедрил клиентское кэширование через TanStack Query — снизил TTI тяжёлых страниц с отчётами примерно на 40%.',
    ],
    tech: [
      'React',
      'TypeScript',
      'Next.js',
      'TanStack Query',
      'React Hook Form',
      'Tailwind CSS',
      'Webpack',
      'Docker',
      'FSD',
    ],
  },
  {
    company: 'Старая ферма',
    role: 'Frontend Developer',
    period: 'Сентябрь 2022 — Ноябрь 2024',
    description:
      'Интернет-магазин полного цикла с личным кабинетом, корзиной, доставкой и административной панелью на React + TypeScript.',
    highlights: [
      'Полностью переработал модуль доставки, сделав его масштабируемым, и реализовал доставку через пункты выдачи с интеграцией Яндекс Карт.',
      'Сократил время загрузки страниц примерно на 30% за счёт ленивой загрузки и оптимизации рендеринга.',
    ],
    tech: ['React', 'TypeScript', 'Redux Toolkit', 'Vite', 'Sass'],
  },
];
