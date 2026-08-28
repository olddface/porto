import { AwsClient } from 'aws4fetch'
import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'

export interface R2Settings {
  account_id: string
  access_key_id: string
  secret_access_key: string
  bucket_name: string
  public_base_url: string
}

function normalizePublicBaseUrl(base: string): string {
  const trimmed = base.trim().replace(/\/$/, '')
  if (!trimmed) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function encodeObjectKey(key: string): string {
  return key.split('/').map((segment) => encodeURIComponent(segment)).join('/')
}

export function decodeObjectKey(encodedKey: string): string {
  return encodedKey.split('/').map((segment) => decodeURIComponent(segment)).join('/')
}

export function publicUrlToObjectKey(publicUrl: string, publicBaseUrl: string): string | null {
  const base = normalizePublicBaseUrl(publicBaseUrl)
  const normalizedUrl = normalizePublicBaseUrl(publicUrl).replace(/\/$/, '')

  if (!normalizedUrl.startsWith(`${base}/`)) {
    return null
  }

  const encodedKey = normalizedUrl.slice(base.length + 1)
  if (!encodedKey) return null

  return decodeObjectKey(encodedKey)
}

function createAwsClient(settings: R2Settings): AwsClient {
  return new AwsClient({
    accessKeyId: settings.access_key_id,
    secretAccessKey: settings.secret_access_key,
    service: 's3',
    region: 'auto',
  })
}

export async function getR2SettingsFromEvent(event: H3Event): Promise<R2Settings> {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabasePublishableKey

  if (!supabaseUrl || !supabaseKey) {
    throw createError({ statusCode: 500, message: 'Supabase is not configured' })
  }

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const token = authHeader.slice(7)
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData.user) {
    throw createError({ statusCode: 401, message: 'Invalid token' })
  }

  const { data: settings, error: settingsError } = await supabase
    .from('user_r2_settings')
    .select('account_id, access_key_id, secret_access_key, bucket_name, public_base_url')
    .eq('user_id', userData.user.id)
    .maybeSingle()

  if (settingsError) {
    throw createError({ statusCode: 500, message: settingsError.message })
  }

  if (!settings) {
    throw createError({ statusCode: 400, message: 'R2 not configured' })
  }

  return settings as R2Settings
}

export async function deleteR2Object(settings: R2Settings, key: string): Promise<void> {
  const objectPath = `${settings.bucket_name}/${encodeObjectKey(key)}`
  const objectUrl = `https://${settings.account_id}.r2.cloudflarestorage.com/${objectPath}`

  const client = createAwsClient(settings)
  const response = await client.fetch(objectUrl, { method: 'DELETE' })

  if (response.ok || response.status === 404) {
    return
  }

  const detail = await response.text().catch(() => '')
  throw createError({
    statusCode: 502,
    message: `R2 delete failed (${response.status})${detail ? `: ${detail}` : ''}`,
  })
}

export { normalizePublicBaseUrl }
