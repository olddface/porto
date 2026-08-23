<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { signIn, loading } = useAuth()

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)

async function handleSubmit() {
  error.value = null
  const result = await signIn(email.value, password.value)
  if (result.error) {
    error.value = result.error
    return
  }
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin'
  router.push(redirect)
}
</script>

<template>
  <div class="login">
    <div class="login__card">
      <p class="login__prompt prompt">
        <span class="prompt-user">admin</span><span class="prompt-symbol">@</span><span class="prompt-path">portfolio</span><span class="prompt-symbol">:~$</span>
        auth login
      </p>

      <h1 class="login__title">Sign in</h1>
      <p class="login__subtitle">Supabase email + password. JWT session stored locally.</p>

      <form class="admin-form" @submit.prevent="handleSubmit">
        <div class="admin-field">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" required autocomplete="email" />
        </div>

        <div class="admin-field">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
          />
        </div>

        <p v-if="error" class="admin-message admin-message--error">{{ error }}</p>

        <div class="admin-actions">
          <button type="submit" class="btn btn--filled" :disabled="loading">
            {{ loading ? 'signing in...' : '$ login' }}
          </button>
          <RouterLink to="/" class="btn">$ cd ../</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem;
}

.login__card {
  width: 100%;
  max-width: 24rem;
  padding: 2rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-raised);
}

.login__prompt {
  font-size: 0.75rem;
  margin-bottom: 1rem;
}

.login__title {
  font-size: 1.25rem;
  color: var(--green);
  margin-bottom: 0.35rem;
}

.login__subtitle {
  font-size: 0.75rem;
  color: var(--text-dim);
  margin-bottom: 1.5rem;
}
</style>
