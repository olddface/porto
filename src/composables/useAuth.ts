import { inject, provide, ref, computed, type InjectionKey, type Ref, type ComputedRef } from 'vue'
import type { Session, User } from '@supabase/supabase-js'
import { useSupabaseClient } from '@/lib/supabase'

export interface AuthState {
  session: Ref<Session | null>
  user: ComputedRef<User | null>
  loading: Ref<boolean>
  initialized: Ref<boolean>
  init: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

export const authKey: InjectionKey<AuthState> = Symbol('auth')

let sharedAuth: AuthState | null = null

function createAuthState(): AuthState {
  const session = ref<Session | null>(null)
  const loading = ref(true)
  const initialized = ref(false)

  const user = computed(() => session.value?.user ?? null)

  async function init() {
    if (initialized.value) return

    const supabase = useSupabaseClient()
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    loading.value = false
    initialized.value = true

    supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession
      loading.value = false
    })
  }

  async function signIn(email: string, password: string) {
    loading.value = true
    const supabase = useSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    loading.value = false
    return { error: error?.message ?? null }
  }

  async function signOut() {
    loading.value = true
    const supabase = useSupabaseClient()
    await supabase.auth.signOut()
    loading.value = false
  }

  return {
    session,
    user,
    loading,
    initialized,
    init,
    signIn,
    signOut,
  }
}

export function getAuth(): AuthState {
  if (!sharedAuth) {
    sharedAuth = createAuthState()
  }
  return sharedAuth
}

export function provideAuth(): AuthState {
  const state = getAuth()
  provide(authKey, state)
  return state
}

export function useAuth(): AuthState {
  const state = inject(authKey, null) ?? sharedAuth
  if (!state) {
    throw new Error('useAuth() must be used within a component that calls provideAuth()')
  }
  return state
}
