const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export function getGraphqlUrl(): string {
  if (!supabaseUrl) {
    throw new Error('VITE_SUPABASE_URL is not set')
  }
  return `${supabaseUrl}/graphql/v1`
}

export function getSupabaseHeaders(): Record<string, string> {
  if (!supabasePublishableKey) {
    throw new Error('VITE_SUPABASE_PUBLISHABLE_KEY is not set')
  }

  return {
    apikey: supabasePublishableKey,
    Authorization: `Bearer ${supabasePublishableKey}`,
    'Content-Type': 'application/json',
  }
}

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(getGraphqlUrl(), {
    method: 'POST',
    headers: getSupabaseHeaders(),
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`)
  }

  const json = (await response.json()) as {
    data?: T
    errors?: { message: string }[]
  }

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(', '))
  }

  if (!json.data) {
    throw new Error('GraphQL response missing data')
  }

  return json.data
}
