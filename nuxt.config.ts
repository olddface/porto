export default defineNuxtConfig({
  compatibilityDate: '2026-08-24',
  srcDir: 'src',
  css: ['~/styles/base.css', '~/styles/admin.css'],
  routeRules: {
    '/admin/**': { ssr: false },
    '/sitemap.xml': { cache: { maxAge: 3600 } },
    '/robots.txt': { cache: { maxAge: 3600 } },
  },
  nitro: {
    preset: 'cloudflare_module',
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://olddface.my.id',
      supabaseUrl: '',
      supabasePublishableKey: '',
    },
  },
  app: {
    head: {
      title: 'Olddface — Software Engineer',
      meta: [
        {
          name: 'description',
          content: 'Olddface — Software Engineer with 3 years experience. Portfolio.',
        },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
})
