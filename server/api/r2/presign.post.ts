import {
  encodeObjectKey,
  getR2SettingsFromEvent,
  normalizePublicBaseUrl,
  type R2Settings,
} from '../../utils/r2'
import { AwsClient } from 'aws4fetch'

const PRESIGN_EXPIRES_SEC = 600
const CONTENT_TYPE = 'image/webp'

function sanitizePrefix(prefix: string): string {
  const cleaned = prefix.replace(/[^a-zA-Z0-9_\-/]/g, '').replace(/^\/+|\/+$/g, '')
  return cleaned || 'uploads'
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ prefix?: string }>(event)
  const prefix = sanitizePrefix(body?.prefix ?? 'uploads')
  const key = `${prefix}/${crypto.randomUUID()}.webp`

  const r2 = await getR2SettingsFromEvent(event) as R2Settings
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
  const publicUrl = `${normalizePublicBaseUrl(r2.public_base_url)}/${encodeObjectKey(key)}`

  setResponseHeader(event, 'content-type', 'application/json')
  return { uploadUrl, publicUrl, key }
})
