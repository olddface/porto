import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { tryUseNuxtApp } from 'nuxt/app'

let browserClient: SupabaseClient | null = null

function getSupabaseCredentials(): { url: string; key: string } {
  const nuxtApp = tryUseNuxtApp()
  if (nuxtApp) {
    const publicConfig = nuxtApp.$config.public as {
      supabaseUrl?: string
      supabasePublishableKey?: string
    }
    return {
      url: publicConfig.supabaseUrl ?? '',
      key: publicConfig.supabasePublishableKey ?? '',
    }
  }

  return {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL ?? '',
    key: process.env.NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '',
  }
}

export function useSupabaseClient(): SupabaseClient {
  if (import.meta.client && browserClient) {
    return browserClient
  }

  const { url, key } = getSupabaseCredentials()

  if (!url || !key) {
    throw new Error('NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set')
  }

  const client = createClient(url, key)

  if (import.meta.client) {
    browserClient = client
  }

  return client
}
