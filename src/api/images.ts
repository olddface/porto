import { type SupabaseClient } from '@supabase/supabase-js'
import { useSupabaseClient } from '@/lib/supabase'

function db(client?: SupabaseClient) {
  return client ?? useSupabaseClient()
}

function throwIfError(error: { message: string } | null): void {
  if (error) throw new Error(error.message)
}

export type ImageParentTable = 'experiences' | 'projects'

export interface DbImage {
  id: string
  from_table: ImageParentTable
  from_id: string
  url: string
  sort_order: number
  created_at: string
}

export async function fetchImagesForParent(
  fromTable: ImageParentTable,
  fromId: string,
  client?: SupabaseClient,
): Promise<DbImage[]> {
  const { data, error } = await db(client)
    .from('images')
    .select('*')
    .eq('from_table', fromTable)
    .eq('from_id', fromId)
    .order('sort_order', { ascending: true })

  throwIfError(error)
  return (data ?? []) as DbImage[]
}

export async function fetchImagesForParents(
  fromTable: ImageParentTable,
  fromIds: string[],
  client?: SupabaseClient,
): Promise<DbImage[]> {
  if (!fromIds.length) return []

  const { data, error } = await db(client)
    .from('images')
    .select('*')
    .eq('from_table', fromTable)
    .in('from_id', fromIds)
    .order('sort_order', { ascending: true })

  throwIfError(error)
  return (data ?? []) as DbImage[]
}

export function groupImagesByParent(images: DbImage[]): Map<string, DbImage[]> {
  const map = new Map<string, DbImage[]>()
  for (const image of images) {
    const list = map.get(image.from_id) ?? []
    list.push(image)
    map.set(image.from_id, list)
  }
  return map
}

export async function insertImage(
  fromTable: ImageParentTable,
  fromId: string,
  url: string,
): Promise<DbImage> {
  const { data: maxRow } = await db()
    .from('images')
    .select('sort_order')
    .eq('from_table', fromTable)
    .eq('from_id', fromId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const sortOrder = (maxRow?.sort_order ?? -1) + 1

  const { data, error } = await db()
    .from('images')
    .insert({
      from_table: fromTable,
      from_id: fromId,
      url,
      sort_order: sortOrder,
    })
    .select()
    .single()

  throwIfError(error)
  return data as DbImage
}

export async function deleteImage(id: string): Promise<void> {
  const { error } = await db().from('images').delete().eq('id', id)
  throwIfError(error)
}

export async function deleteImagesForParents(
  fromTable: ImageParentTable,
  fromIds: string[],
): Promise<void> {
  if (!fromIds.length) return

  const { error } = await db()
    .from('images')
    .delete()
    .eq('from_table', fromTable)
    .in('from_id', fromIds)

  throwIfError(error)
}
