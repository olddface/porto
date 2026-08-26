import { useSupabaseClient } from '@/lib/supabase'
import {
  fetchImagesForParents,
  fetchImagesForParent,
  groupImagesByParent,
} from '@/api/images'
import type { PortfolioContent, Project } from '@/types/portfolio'

function throwIfError(error: { message: string } | null): void {
  if (error) throw new Error(error.message)
}

function mapImages(images: { url: string }[]) {
  return images.map((image) => ({ url: image.url }))
}

export async function fetchPortfolioContent(): Promise<PortfolioContent> {
  const supabase = useSupabaseClient()

  const [profileRes, socialsRes, experiencesRes, skillsRes, projectsRes] = await Promise.all([
    supabase.from('profiles').select('*').limit(1).single(),
    supabase.from('social_links').select('label, href').order('sort_order'),
    supabase.from('experiences').select('id, company, role, period, location, bullets').order('sort_order'),
    supabase.from('skill_groups').select('category, skills').order('sort_order'),
    supabase
      .from('projects')
      .select('id, slug, name, description, body, highlights, stack, repo, demo, image_url')
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
  const experiences = experiencesRes.data ?? []
  const projects = projectsRes.data ?? []

  const [experienceImages, projectImages] = await Promise.all([
    experiences.length
      ? fetchImagesForParents('experiences', experiences.map((row) => row.id), supabase)
      : Promise.resolve([]),
    projects.length
      ? fetchImagesForParents('projects', projects.map((row) => row.id), supabase)
      : Promise.resolve([]),
  ])

  const imagesByExperience = groupImagesByParent(experienceImages)
  const imagesByProject = groupImagesByParent(projectImages)

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
    experience: experiences.map((row) => ({
      company: row.company,
      role: row.role,
      period: row.period,
      location: row.location,
      bullets: row.bullets,
      images: mapImages(imagesByExperience.get(row.id) ?? []),
    })),
    skills: skillsRes.data ?? [],
    projects: projects.map((row) => ({
      slug: row.slug,
      name: row.name,
      description: row.description,
      body: row.body,
      highlights: row.highlights,
      stack: row.stack,
      repo: row.repo,
      demo: row.demo,
      image_url: row.image_url,
      images: mapImages(imagesByProject.get(row.id) ?? []),
    })),
  }
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = useSupabaseClient()

  const { data, error } = await supabase
    .from('projects')
    .select('id, slug, name, description, body, highlights, stack, repo, demo, image_url')
    .eq('slug', slug)
    .maybeSingle()

  throwIfError(error)
  if (!data) return null

  const images = await fetchImagesForParent('projects', data.id, supabase)

  return {
    slug: data.slug,
    name: data.name,
    description: data.description,
    body: data.body,
    highlights: data.highlights,
    stack: data.stack,
    repo: data.repo,
    demo: data.demo,
    image_url: data.image_url,
    images: mapImages(images),
  }
}
