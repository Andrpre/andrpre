export type SocialIcon = 'github' | 'telegram' | 'email';

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIcon;
}

export interface Profile {
  name: string;
  /** Latin transliteration, used for the logo / monogram */
  nameLatin: string;
  role: string;
  level: string;
  tagline: string;
  bio: string[];
  location?: string;
  email: string;
  resumeUrl?: string;
  socials: SocialLink[];
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  description: string;
  highlights?: string[];
  tech?: string[];
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  year?: string;
}
