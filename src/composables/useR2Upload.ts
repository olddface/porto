import { convertToWebp } from '@/lib/imageWebp'
import { normalizePublicObjectUrl } from '@/lib/publicUrl'
import { useSupabaseClient } from '@/lib/supabase'

interface PresignResponse {
  uploadUrl: string
  publicUrl: string
  key: string
}

export async function uploadImageToR2(file: File, prefix: string): Promise<string> {
  const webpBlob = await convertToWebp(file)
  const token = await getAuthToken()

  const presign = await $fetch<PresignResponse>('/api/r2/presign', {
    method: 'POST',
    body: { prefix },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!presign?.uploadUrl || !presign?.publicUrl) {
    throw new Error('Presign API returned an invalid response')
  }

  const uploadRes = await fetch(presign.uploadUrl, {
    method: 'PUT',
    body: webpBlob,
    headers: { 'Content-Type': 'image/webp' },
    mode: 'cors',
  }).catch((err: unknown) => {
    if (err instanceof TypeError) {
      throw new Error(
        'Upload blocked by CORS. Configure your R2 bucket CORS policy (see r2-cors.json, run npm run configure-r2-cors).',
      )
    }
    throw err
  })

  // R2/S3 PUT success is 200 or 204 with an empty body — that is expected.
  if (!uploadRes.ok) {
    const detail = await uploadRes.text().catch(() => '')
    throw new Error(`Upload to R2 failed (${uploadRes.status})${detail ? `: ${detail}` : ''}`)
  }

  // Store the cacheable public URL (custom domain or pub-xxx.r2.dev), not the S3 API endpoint.
  return normalizePublicObjectUrl(presign.publicUrl)
}

async function getAuthToken(): Promise<string> {
  const supabase = useSupabaseClient()
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token

  if (!token) {
    throw new Error('Not authenticated')
  }

  return token
}

export async function deleteImagesFromR2(urls: string[]): Promise<void> {
  const uniqueUrls = [...new Set(urls.filter(Boolean))]
  if (!uniqueUrls.length) return

  const token = await getAuthToken()

  await $fetch('/api/r2/delete', {
    method: 'POST',
    body: { urls: uniqueUrls },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
