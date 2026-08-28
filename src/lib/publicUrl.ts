export function normalizePublicBaseUrl(base: string): string {
  const trimmed = base.trim().replace(/\/$/, '')
  if (!trimmed) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function normalizePublicObjectUrl(url: string): string {
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function buildPublicObjectUrl(base: string, encodedKey: string): string {
  return `${normalizePublicBaseUrl(base)}/${encodedKey}`
}
