import type { ExperienceItem } from './types';

// Заглушки — замени на свой реальный опыт.
export const experience: ExperienceItem[] = [
  {
    company: 'Продуктовая компания',
    role: 'Frontend Developer',
    period: '2023 — настоящее время',
    description:
      'Разработка и поддержка пользовательских интерфейсов SaaS-продукта. Работа в кросс-функциональной команде по фиче-флоу.',
    highlights: [
      'Перевёл часть legacy-кода на TypeScript и Redux Toolkit, снизив количество runtime-ошибок.',
      'Внедрил переиспользуемую UI-библиотеку компонентов и единые паттерны форм.',
      'Улучшил метрики производительности и доступности ключевых страниц.',
    ],
    tech: ['React', 'TypeScript', 'Redux Toolkit', 'React Hook Form'],
  },
  {
    company: 'E-commerce проект',
    role: 'Junior Frontend Developer',
    period: '2022 — 2023',
    description:
      'Вёрстка и реализация интерфейсов интернет-магазина, интеграция с REST API.',
    highlights: [
      'Сверстал адаптивные страницы каталога и корзины по макетам Figma.',
      'Подключил формы оформления заказа с валидацией.',
    ],
    tech: ['React', 'JavaScript', 'SASS', 'MUI'],
  },
  {
    company: 'E-commerce',
    role: 'Project Manager / Head of Content',
    period: 'до 2022',
    description:
      'Управление проектами и контентом в e-commerce: руководил командами, выстраивал процессы и взаимодействовал с разработчиками. Здесь начался переход во frontend.',
    tech: ['Project Management', 'Notion', 'Figma'],
  },
];
