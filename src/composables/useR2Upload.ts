import { convertToWebp } from '@/lib/imageWebp'
import { useSupabaseClient } from '@/lib/supabase'

interface PresignResponse {
  uploadUrl: string
  publicUrl: string
  key: string
}

function verifyImageLoads(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () =>
      reject(
        new Error(
          'File uploaded to R2 but the public URL is not reachable. Enable R2 public access on the bucket and set public_base_url to your pub-xxx.r2.dev URL (not the S3 API endpoint).',
        ),
      )
    img.src = `${url}${url.includes('?') ? '&' : '?'}v=${Date.now()}`
  })
}

export async function uploadImageToR2(file: File, prefix: string): Promise<string> {
  const webpBlob = await convertToWebp(file)
  const supabase = useSupabaseClient()
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token

  if (!token) {
    throw new Error('Not authenticated')
  }

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

  await verifyImageLoads(presign.publicUrl)

  return presign.publicUrl
}
