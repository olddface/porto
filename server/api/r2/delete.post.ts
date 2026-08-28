import {
  deleteR2Object,
  getR2SettingsFromEvent,
  publicUrlToObjectKey,
} from '../../utils/r2'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ urls?: string[]; url?: string }>(event)
  const urls = [...(body?.urls ?? []), ...(body?.url ? [body.url] : [])].filter(Boolean)

  if (!urls.length) {
    throw createError({ statusCode: 400, message: 'No image URLs provided' })
  }

  const settings = await getR2SettingsFromEvent(event)

  for (const url of urls) {
    const key = publicUrlToObjectKey(url, settings.public_base_url)
    if (!key) {
      throw createError({ statusCode: 400, message: `URL does not match configured public base: ${url}` })
    }

    await deleteR2Object(settings, key)
  }

  setResponseHeader(event, 'content-type', 'application/json')
  return { deleted: urls.length }
})
