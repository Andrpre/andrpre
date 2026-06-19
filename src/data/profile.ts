import type { Profile } from './types';

export const profile: Profile = {
  name: 'Андрей Кожухов',
  nameLatin: 'Andrey Kozhukhov',
  role: 'Frontend Developer',
  level: 'Middle',
  tagline:
    'Frontend-разработчик с почти 4 годами коммерческого опыта в CRM и e-commerce. React, TypeScript, производительность и внутренние платформы.',
  bio: [
    'Frontend-разработчик с почти 4 годами коммерческого опыта разработки продуктов в сферах CRM и e-commerce. Специализируюсь на React-приложениях, проектировании пользовательских интерфейсов, производительности и развитии внутренних платформ.',
    'Работал над высоконагруженными продуктами с десятками тысяч пользователей: участвовал в проектировании архитектуры, разработке новых продуктовых модулей и оптимизации существующих решений.',
  ],
  location: 'Москва',
  email: 'and.kozhuhov@mail.ru',
  resumeUrl: undefined, // положи resume.pdf в /public и укажи: `${import.meta.env.BASE_URL}resume.pdf`
  socials: [
    { label: 'Telegram', href: 'https://t.me/ray_nder', icon: 'telegram' },
    { label: 'GitHub', href: 'https://github.com/Andrpre', icon: 'github' },
    { label: 'Email', href: 'mailto:and.kozhuhov@mail.ru', icon: 'email' },
  ],
};
