import { createClient } from '@supabase/supabase-js'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl as string).replace(/\/$/, '')
  const lastmod = new Date().toISOString()

  const urls: { loc: string; priority: string }[] = [
    { loc: `${siteUrl}/`, priority: '1.0000' },
  ]

  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseKey = config.public.supabasePublishableKey as string

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data } = await supabase.from('projects').select('slug').order('sort_order')

    for (const project of data ?? []) {
      urls.push({
        loc: `${siteUrl}/projects/${project.slug}`,
        priority: '0.8000',
      })
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return xml
})
