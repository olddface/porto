import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

export function useSupabaseClient(): SupabaseClient {
  if (import.meta.client && browserClient) {
    return browserClient
  }

  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl
  const key = config.public.supabasePublishableKey

  if (!url || !key) {
    throw new Error('NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set')
  }

  const client = createClient(url, key)

  if (import.meta.client) {
    browserClient = client
  }

  return client
}
