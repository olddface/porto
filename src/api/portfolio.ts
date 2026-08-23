import { graphqlRequest } from '@/lib/graphql'
import { PORTFOLIO_QUERY, PROJECT_BY_SLUG_QUERY } from '@/api/queries'
import type { PortfolioContent, Project } from '@/types/portfolio'

interface Edge<T> {
  node: T
}

interface Collection<T> {
  edges: Edge<T>[]
}

interface ProfileNode {
  name: string
  title: string
  years_experience: string
  location: string
  tagline: string
  about: string[]
  email: string
  resume: string
  social_linksCollection: Collection<{ label: string; href: string }>
  experiencesCollection: Collection<{
    company: string
    role: string
    period: string
    location: string
    bullets: string[]
  }>
  skill_groupsCollection: Collection<{ category: string; skills: string[] }>
  projectsCollection: Collection<{
    slug: string
    name: string
    description: string
    body: string
    highlights: string[]
    stack: string[]
    repo: string
    demo: string
  }>
}

interface PortfolioQueryResult {
  profilesCollection: Collection<ProfileNode>
}

interface ProjectQueryResult {
  projectsCollection: Collection<{
    slug: string
    name: string
    description: string
    body: string
    highlights: string[]
    stack: string[]
    repo: string
    demo: string
  }>
}

function mapProfile(node: ProfileNode): PortfolioContent {
  return {
    name: node.name,
    title: node.title,
    yearsExperience: node.years_experience,
    location: node.location,
    tagline: node.tagline,
    about: node.about,
    email: node.email,
    resume: node.resume,
    socials: node.social_linksCollection.edges.map((e) => e.node),
    experience: node.experiencesCollection.edges.map((e) => e.node),
    skills: node.skill_groupsCollection.edges.map((e) => e.node),
    projects: node.projectsCollection.edges.map((e) => e.node),
  }
}

export async function fetchPortfolioContent(): Promise<PortfolioContent> {
  const data = await graphqlRequest<PortfolioQueryResult>(PORTFOLIO_QUERY)
  const profile = data.profilesCollection.edges[0]?.node

  if (!profile) {
    throw new Error('No portfolio profile found in Supabase')
  }

  return mapProfile(profile)
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const data = await graphqlRequest<ProjectQueryResult>(PROJECT_BY_SLUG_QUERY, { slug })
  const node = data.projectsCollection.edges[0]?.node
  return node ?? null
}
