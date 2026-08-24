import { useSupabaseClient } from '@/lib/supabase'
import type { PortfolioContent, Project } from '@/types/portfolio'

function throwIfError(error: { message: string } | null): void {
  if (error) throw new Error(error.message)
}

export async function fetchPortfolioContent(): Promise<PortfolioContent> {
  const supabase = useSupabaseClient()

  const [profileRes, socialsRes, experiencesRes, skillsRes, projectsRes] = await Promise.all([
    supabase.from('profiles').select('*').limit(1).single(),
    supabase.from('social_links').select('label, href').order('sort_order'),
    supabase.from('experiences').select('company, role, period, location, bullets').order('sort_order'),
    supabase.from('skill_groups').select('category, skills').order('sort_order'),
    supabase
      .from('projects')
      .select('slug, name, description, body, highlights, stack, repo, demo')
      .order('sort_order'),
  ])

  throwIfError(profileRes.error)
  throwIfError(socialsRes.error)
  throwIfError(experiencesRes.error)
  throwIfError(skillsRes.error)
  throwIfError(projectsRes.error)

  if (!profileRes.data) {
    throw new Error('No portfolio profile found in Supabase')
  }

  const profile = profileRes.data

  return {
    name: profile.name,
    title: profile.title,
    yearsExperience: profile.years_experience,
    location: profile.location,
    tagline: profile.tagline,
    about: profile.about,
    email: profile.email,
    resume: profile.resume,
    socials: socialsRes.data ?? [],
    experience: experiencesRes.data ?? [],
    skills: skillsRes.data ?? [],
    projects: projectsRes.data ?? [],
  }
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = useSupabaseClient()

  const { data, error } = await supabase
    .from('projects')
    .select('slug, name, description, body, highlights, stack, repo, demo')
    .eq('slug', slug)
    .maybeSingle()

  throwIfError(error)
  return data
}
