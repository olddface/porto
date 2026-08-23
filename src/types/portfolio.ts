export interface SocialLink {
  label: string
  href: string
}

export interface Experience {
  company: string
  role: string
  period: string
  location: string
  bullets: string[]
}

export interface SkillGroup {
  category: string
  skills: string[]
}

export interface Project {
  slug: string
  name: string
  description: string
  details: string[]
  highlights: string[]
  stack: string[]
  repo: string
  demo: string
}

export interface PortfolioContent {
  name: string
  title: string
  yearsExperience: string
  location: string
  tagline: string
  about: string[]
  email: string
  resume: string
  socials: SocialLink[]
  experience: Experience[]
  skills: SkillGroup[]
  projects: Project[]
}

export const NAV_ITEMS = [
  { label: 'about', href: '#about' },
  { label: 'experience', href: '#experience' },
  { label: 'skills', href: '#skills' },
  { label: 'projects', href: '#projects' },
  { label: 'contact', href: '#contact' },
] as const
