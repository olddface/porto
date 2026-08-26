import { useSupabaseClient } from '@/lib/supabase'
import {
  fetchImagesForParents,
  groupImagesByParent,
  deleteImagesForParents,
  fetchImagesForParent,
  type DbImage,
} from '@/api/images'

function db() {
  return useSupabaseClient()
}

export interface DbProfile {
  id: string
  name: string
  title: string
  years_experience: string
  location: string
  tagline: string
  about: string[]
  email: string
  resume: string
}

export interface DbSocialLink {
  id: string
  profile_id: string
  label: string
  href: string
  sort_order: number
}

export interface DbExperience {
  id: string
  profile_id: string
  company: string
  role: string
  period: string
  location: string
  bullets: string[]
  sort_order: number
  images?: DbImage[]
}

export interface DbSkillGroup {
  id: string
  profile_id: string
  category: string
  skills: string[]
  sort_order: number
}

export interface DbProject {
  id: string
  profile_id: string
  slug: string
  name: string
  description: string
  body: string
  highlights: string[]
  stack: string[]
  repo: string
  demo: string
  image_url: string | null
  sort_order: number
  images?: DbImage[]
}

function throwIfError(error: { message: string } | null): void {
  if (error) throw new Error(error.message)
}

export async function getProfileId(): Promise<string> {
  const { data, error } = await db().from('profiles').select('id').limit(1).single()
  throwIfError(error)
  if (!data) throw new Error('No profile found')
  return data.id
}

export async function fetchProfile(): Promise<DbProfile> {
  const { data, error } = await db().from('profiles').select('*').limit(1).single()
  throwIfError(error)
  if (!data) throw new Error('No profile found')
  return data
}

export async function updateProfile(id: string, profile: Omit<DbProfile, 'id'>): Promise<void> {
  const { error } = await db().from('profiles').update(profile).eq('id', id)
  throwIfError(error)
}

export async function fetchSocialLinks(): Promise<DbSocialLink[]> {
  const { data, error } = await db()
    .from('social_links')
    .select('*')
    .order('sort_order', { ascending: true })
  throwIfError(error)
  return data ?? []
}

export async function upsertSocialLinks(links: Omit<DbSocialLink, 'profile_id'>[], profileId: string): Promise<void> {
  const { data: existing, error: fetchError } = await db()
    .from('social_links')
    .select('id')
    .eq('profile_id', profileId)
  throwIfError(fetchError)

  const existingIds = new Set((existing ?? []).map((r) => r.id))
  const incomingIds = new Set(links.filter((l) => l.id).map((l) => l.id))

  const toDelete = [...existingIds].filter((id) => !incomingIds.has(id))
  if (toDelete.length) {
    const { error } = await db().from('social_links').delete().in('id', toDelete)
    throwIfError(error)
  }

  for (let i = 0; i < links.length; i++) {
    const link = links[i]!
    const row = { ...link, profile_id: profileId, sort_order: i }
    if (link.id && existingIds.has(link.id)) {
      const { error } = await db().from('social_links').update(row).eq('id', link.id)
      throwIfError(error)
    } else {
      const { id: _id, ...insertRow } = row
      const { error } = await db().from('social_links').insert(insertRow)
      throwIfError(error)
    }
  }
}

export async function fetchExperiences(): Promise<DbExperience[]> {
  const { data, error } = await db()
    .from('experiences')
    .select('*')
    .order('sort_order', { ascending: true })
  throwIfError(error)

  const experiences = data ?? []
  if (!experiences.length) return []

  const images = await fetchImagesForParents('experiences', experiences.map((row) => row.id), db())
  const imagesByParent = groupImagesByParent(images)

  return experiences.map((row) => ({
    ...row,
    images: imagesByParent.get(row.id) ?? [],
  }))
}

export async function upsertExperiences(
  items: Omit<DbExperience, 'profile_id'>[],
  profileId: string,
): Promise<void> {
  const { data: existing, error: fetchError } = await db()
    .from('experiences')
    .select('id')
    .eq('profile_id', profileId)
  throwIfError(fetchError)

  const existingIds = new Set((existing ?? []).map((r) => r.id))
  const incomingIds = new Set(items.filter((e) => e.id).map((e) => e.id))

  const toDelete = [...existingIds].filter((id) => !incomingIds.has(id))
  if (toDelete.length) {
    await deleteImagesForParents('experiences', toDelete)
    const { error } = await db().from('experiences').delete().in('id', toDelete)
    throwIfError(error)
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i]!
    const row = { ...item, profile_id: profileId, sort_order: i }
    if (item.id && existingIds.has(item.id)) {
      const { error } = await db().from('experiences').update(row).eq('id', item.id)
      throwIfError(error)
    } else {
      const { id: _id, ...insertRow } = row
      const { error } = await db().from('experiences').insert(insertRow)
      throwIfError(error)
    }
  }
}

export async function fetchSkillGroups(): Promise<DbSkillGroup[]> {
  const { data, error } = await db()
    .from('skill_groups')
    .select('*')
    .order('sort_order', { ascending: true })
  throwIfError(error)
  return data ?? []
}

export async function upsertSkillGroups(
  items: Omit<DbSkillGroup, 'profile_id'>[],
  profileId: string,
): Promise<void> {
  const { data: existing, error: fetchError } = await db()
    .from('skill_groups')
    .select('id')
    .eq('profile_id', profileId)
  throwIfError(fetchError)

  const existingIds = new Set((existing ?? []).map((r) => r.id))
  const incomingIds = new Set(items.filter((s) => s.id).map((s) => s.id))

  const toDelete = [...existingIds].filter((id) => !incomingIds.has(id))
  if (toDelete.length) {
    const { error } = await db().from('skill_groups').delete().in('id', toDelete)
    throwIfError(error)
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i]!
    const row = { ...item, profile_id: profileId, sort_order: i }
    if (item.id && existingIds.has(item.id)) {
      const { error } = await db().from('skill_groups').update(row).eq('id', item.id)
      throwIfError(error)
    } else {
      const { id: _id, ...insertRow } = row
      const { error } = await db().from('skill_groups').insert(insertRow)
      throwIfError(error)
    }
  }
}

export async function fetchProjects(): Promise<DbProject[]> {
  const { data, error } = await db()
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
  throwIfError(error)

  const projects = data ?? []
  if (!projects.length) return []

  const images = await fetchImagesForParents('projects', projects.map((row) => row.id), db())
  const imagesByParent = groupImagesByParent(images)

  return projects.map((row) => ({
    ...row,
    images: imagesByParent.get(row.id) ?? [],
  }))
}

export async function fetchProjectById(id: string): Promise<DbProject | null> {
  const { data, error } = await db().from('projects').select('*').eq('id', id).maybeSingle()
  throwIfError(error)
  if (!data) return null

  const images = await fetchImagesForParent('projects', id, db())
  return { ...data, images }
}

export async function createProject(
  project: Omit<DbProject, 'id' | 'profile_id' | 'sort_order'>,
  profileId: string,
): Promise<DbProject> {
  const { data: maxRow } = await db()
    .from('projects')
    .select('sort_order')
    .eq('profile_id', profileId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const sortOrder = (maxRow?.sort_order ?? -1) + 1

  const { data, error } = await db()
    .from('projects')
    .insert({ ...project, profile_id: profileId, sort_order: sortOrder })
    .select()
    .single()
  throwIfError(error)
  return data
}

export async function updateProject(id: string, project: Partial<DbProject>): Promise<void> {
  const { error } = await db().from('projects').update(project).eq('id', id)
  throwIfError(error)
}

export async function deleteProject(id: string): Promise<void> {
  await deleteImagesForParents('projects', [id])
  const { error } = await db().from('projects').delete().eq('id', id)
  throwIfError(error)
}

export async function reorderProjects(orderedIds: string[]): Promise<void> {
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await db()
      .from('projects')
      .update({ sort_order: i })
      .eq('id', orderedIds[i]!)
    throwIfError(error)
  }
}
