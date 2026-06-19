import type { Project } from './types';

export const projects: Project[] = [
  {
    title: 'Биллинговый раздел amoCRM',
    description:
      'Раздел управления подпиской и оплатой в CRM-платформе, спроектированный и реализованный с нуля: страница управления подпиской, модальное окно оплаты, калькуляция тарифов и интеграция с тремя платёжными системами.',
    tags: ['React', 'TypeScript', 'Next.js', 'TanStack Query'],
    year: '2025',
  },
  {
    title: 'Модуль AI Agent (amoCRM)',
    description:
      'Участие в проектировании frontend-архитектуры продуктового модуля AI Agent, согласование контрактов между frontend- и backend-командами и развитие внутренней библиотеки UI-компонентов.',
    tags: ['React', 'TypeScript', 'FSD', 'Tailwind CSS'],
    year: '2025',
  },
  {
    title: 'Интернет-магазин «Старая ферма»',
    description:
      'Интернет-магазин полного цикла: каталог, корзина, оформление заказа, доставка через пункты выдачи с интеграцией Яндекс Карт, личный кабинет и административная панель.',
    tags: ['React', 'TypeScript', 'Redux Toolkit', 'Vite'],
    liveUrl: 'https://www.dogeat.ru',
    year: '2024',
  },
  {
    title: 'Portfolio Site',
    description:
      'Этот сайт: минималистичный портфолио-проект на React + Vite + TypeScript с аккуратными анимациями и переключением темы.',
    tags: ['React', 'Vite', 'TypeScript', 'Framer Motion'],
    repoUrl: 'https://github.com/Andrpre/andrpre',
    year: '2026',
  },
];
