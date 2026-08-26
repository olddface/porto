export default defineEventHandler((event) => {
  if (!event.path?.startsWith('/api/r2')) return

  const origin = getRequestHeader(event, 'origin')
  if (origin) {
    setResponseHeaders(event, {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      Vary: 'Origin',
    })
  }

  if (getMethod(event) === 'OPTIONS') {
    setResponseStatus(event, 204)
    return null
  }
})
