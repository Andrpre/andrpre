import type { Profile } from './types';

export const profile: Profile = {
  name: 'Андрей Кожухов',
  nameLatin: 'Andrey Kozhukhov',
  role: 'Frontend Developer · React / TypeScript',
  level: 'Middle',
  tagline:
    'Middle Frontend Developer с 3+ годами коммерческого опыта разработки продуктов в сферах CRM и e-commerce.',
  bio: [
    'Специализируюсь на приложениях на React и TypeScript: проектирую пользовательские интерфейсы, занимаюсь производительностью и развитием внутренних платформ.',
    'Работал над высоконагруженными продуктами с десятками тысяч пользователей — участвовал в проектировании архитектуры, разработке новых продуктовых модулей и оптимизации существующих решений.',
  ],
  location: 'Москва',
  email: 'and.kozhuhov@mail.ru',
  resumeUrl: undefined, // положи resume.pdf в /public и укажи: `${import.meta.env.BASE_URL}resume.pdf`
  socials: [
    { label: 'GitHub', href: 'https://github.com/Andrpre', icon: 'github' },
    { label: 'Telegram', href: 'https://t.me/ray_nder', icon: 'telegram' },
    { label: 'Email', href: 'mailto:and.kozhuhov@mail.ru', icon: 'email' },
  ],
};
