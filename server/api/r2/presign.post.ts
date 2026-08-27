import { AwsClient } from 'aws4fetch'
import { createClient } from '@supabase/supabase-js'

interface R2Settings {
  account_id: string
  access_key_id: string
  secret_access_key: string
  bucket_name: string
  public_base_url: string
}

const PRESIGN_EXPIRES_SEC = 600
const CONTENT_TYPE = 'image/webp'

function sanitizePrefix(prefix: string): string {
  const cleaned = prefix.replace(/[^a-zA-Z0-9_\-/]/g, '').replace(/^\/+|\/+$/g, '')
  return cleaned || 'uploads'
}

function encodeObjectKey(key: string): string {
  return key.split('/').map((segment) => encodeURIComponent(segment)).join('/')
}

export default defineEventHandler(async (event) => {
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

  const body = await readBody<{ prefix?: string }>(event)
  const prefix = sanitizePrefix(body?.prefix ?? 'uploads')
  const key = `${prefix}/${crypto.randomUUID()}.webp`

  const r2 = settings as R2Settings
  const objectPath = `${r2.bucket_name}/${encodeObjectKey(key)}`
  const objectUrl = new URL(
    `https://${r2.account_id}.r2.cloudflarestorage.com/${objectPath}`,
  )
  objectUrl.searchParams.set('X-Amz-Expires', String(PRESIGN_EXPIRES_SEC))

  const client = new AwsClient({
    accessKeyId: r2.access_key_id,
    secretAccessKey: r2.secret_access_key,
    service: 's3',
    region: 'auto',
  })

  const signedRequest = await client.sign(
    new Request(objectUrl, {
      method: 'PUT',
      headers: { 'Content-Type': CONTENT_TYPE },
    }),
    { aws: { signQuery: true } },
  )

  const uploadUrl = signedRequest.url.toString()
  const base = r2.public_base_url.replace(/\/$/, '')
  const publicUrl = `${base}/${encodeObjectKey(key)}`

  setResponseHeader(event, 'content-type', 'application/json')
  return { uploadUrl, publicUrl, key }
})
