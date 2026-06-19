import type { SkillGroup } from './types';

// Только ключевые технологии — то, чем определяется профиль, без базовых вещей,
// которые подразумеваются у мидл+ разработчика (HTML/CSS/Git/ES-версии и т.п.).
export const skillGroups: SkillGroup[] = [
  {
    title: "Core",
    items: ["React", "TypeScript", "Next.js"],
  },
  {
    title: "State & Data",
    items: ["Redux Toolkit", "TanStack Query", "REST API"],
  },
  {
    title: "UI & Architecture",
    items: ["Tailwind CSS", "FSD"],
  },
];
