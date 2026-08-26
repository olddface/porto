import { useSupabaseClient } from '@/lib/supabase'

export interface R2SettingsPublic {
  user_id: string
  account_id: string
  access_key_id: string
  bucket_name: string
  public_base_url: string
  updated_at: string
}

export interface R2SettingsInput {
  account_id: string
  access_key_id: string
  secret_access_key?: string
  bucket_name: string
  public_base_url: string
}

function db() {
  return useSupabaseClient()
}

function throwIfError(error: { message: string } | null): void {
  if (error) throw new Error(error.message)
}

export async function fetchR2Settings(userId: string): Promise<R2SettingsPublic | null> {
  const { data, error } = await db()
    .from('user_r2_settings')
    .select('user_id, account_id, access_key_id, bucket_name, public_base_url, updated_at')
    .eq('user_id', userId)
    .maybeSingle()

  throwIfError(error)
  return data
}

export async function upsertR2Settings(userId: string, input: R2SettingsInput): Promise<void> {
  const { data: existing, error: fetchError } = await db()
    .from('user_r2_settings')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()

  throwIfError(fetchError)

  if (existing) {
    const update: Record<string, string> = {
      account_id: input.account_id,
      access_key_id: input.access_key_id,
      bucket_name: input.bucket_name,
      public_base_url: input.public_base_url,
      updated_at: new Date().toISOString(),
    }

    if (input.secret_access_key) {
      update.secret_access_key = input.secret_access_key
    }

    const { error } = await db().from('user_r2_settings').update(update).eq('user_id', userId)
    throwIfError(error)
    return
  }

  if (!input.secret_access_key) {
    throw new Error('Secret access key is required for initial setup')
  }

  const { error } = await db().from('user_r2_settings').insert({
    user_id: userId,
    account_id: input.account_id,
    access_key_id: input.access_key_id,
    secret_access_key: input.secret_access_key,
    bucket_name: input.bucket_name,
    public_base_url: input.public_base_url,
  })

  throwIfError(error)
}
