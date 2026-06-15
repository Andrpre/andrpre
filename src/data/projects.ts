import type { Project } from './types';

// Заглушки — замени на свои реальные проекты (можно убрать liveUrl/repoUrl, если их нет).
export const projects: Project[] = [
  {
    title: 'Dashboard Analytics',
    description:
      'Панель аналитики с интерактивными графиками, фильтрами и тёмной темой. Состояние на Redux Toolkit, данные через RTK Query.',
    tags: ['React', 'TypeScript', 'Redux Toolkit', 'Charts'],
    liveUrl: '#',
    repoUrl: 'https://github.com/Andrpre',
    year: '2024',
  },
  {
    title: 'UI Component Library',
    description:
      'Переиспользуемая библиотека доступных компонентов с документацией и единой дизайн-системой на CSS-переменных.',
    tags: ['React', 'TypeScript', 'CSS Modules', 'a11y'],
    repoUrl: 'https://github.com/Andrpre',
    year: '2024',
  },
  {
    title: 'E-commerce Storefront',
    description:
      'Витрина интернет-магазина: каталог, корзина и оформление заказа с валидируемыми формами и интеграцией REST API.',
    tags: ['React', 'React Hook Form', 'SASS', 'REST'],
    liveUrl: '#',
    repoUrl: 'https://github.com/Andrpre',
    year: '2023',
  },
];
