import type { Profile } from './types';

// Замени значения-заглушки на свои реальные данные.
export const profile: Profile = {
  name: 'Андрей Кожухов',
  nameLatin: 'Andrey Kozhukhov',
  role: 'Frontend Developer',
  level: 'Middle',
  tagline:
    'Frontend-разработчик с опытом управления проектами в сфере веб-разработки.',
  bio: [
    'Начинал как junior, сегодня — уверенный middle-разработчик. За плечами путь от управления контентом и проектами в e-commerce до самостоятельной разработки продуктовых интерфейсов.',
    'Делаю быстрые, доступные и продуманные интерфейсы на React и TypeScript. Ценю чистый код, внимание к деталям и хороший пользовательский опыт.',
  ],
  location: 'Россия',
  email: 'andkozhykhov@team.amocrm.com',
  resumeUrl: undefined, // положи resume.pdf в /public и укажи: `${import.meta.env.BASE_URL}resume.pdf`
  socials: [
    { label: 'GitHub', href: 'https://github.com/Andrpre', icon: 'github' },
    // PLACEHOLDER — замени на свой ник в Telegram
    { label: 'Telegram', href: 'https://t.me/andrpre', icon: 'telegram' },
    // PLACEHOLDER — замени на свой профиль LinkedIn
    { label: 'LinkedIn', href: 'https://linkedin.com/in/andrpre', icon: 'linkedin' },
    { label: 'Email', href: 'mailto:andkozhykhov@team.amocrm.com', icon: 'email' },
  ],
};
