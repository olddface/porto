<script setup lang="ts">
import { fetchR2Settings, upsertR2Settings } from '@/api/r2Settings'
import { useAuth } from '@/composables/useAuth'
import { normalizePublicBaseUrl } from '@/lib/publicUrl'

definePageMeta({ layout: 'admin' })

const { user } = useAuth()

const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const hasExisting = ref(false)

const form = ref({
  account_id: '',
  access_key_id: '',
  secret_access_key: '',
  bucket_name: '',
  public_base_url: '',
})

onMounted(async () => {
  if (!user.value?.id) {
    error.value = 'Not authenticated'
    loading.value = false
    return
  }

  try {
    const settings = await fetchR2Settings(user.value.id)
    if (settings) {
      hasExisting.value = true
      form.value = {
        account_id: settings.account_id,
        access_key_id: settings.access_key_id,
        secret_access_key: '',
        bucket_name: settings.bucket_name,
        public_base_url: settings.public_base_url,
      }
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load settings'
  } finally {
    loading.value = false
  }
})

async function handleSubmit() {
  if (!user.value?.id) {
    error.value = 'Not authenticated'
    return
  }

  saving.value = true
  error.value = null
  success.value = false

  try {
    const payload = {
      account_id: form.value.account_id.trim(),
      access_key_id: form.value.access_key_id.trim(),
      bucket_name: form.value.bucket_name.trim(),
      public_base_url: normalizePublicBaseUrl(form.value.public_base_url),
      secret_access_key: form.value.secret_access_key.trim() || undefined,
    }

    await upsertR2Settings(user.value.id, payload)
    hasExisting.value = true
    form.value.secret_access_key = ''
    success.value = true
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to save settings'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="admin-page" style="max-width: 40rem">
    <header class="admin-page__header">
      <h1 class="admin-page__title">Storage settings</h1>
      <p class="admin-page__subtitle">Cloudflare R2 credentials for direct image uploads.</p>
    </header>

    <p v-if="loading" class="admin-page__subtitle">Loading...</p>

    <form v-else class="admin-form" @submit.prevent="handleSubmit">
      <div class="admin-field">
        <label for="account_id">Cloudflare account ID</label>
        <input id="account_id" v-model="form.account_id" required />
      </div>

      <div class="admin-field">
        <label for="access_key_id">R2 access key ID</label>
        <input id="access_key_id" v-model="form.access_key_id" required />
      </div>

      <div class="admin-field">
        <label for="secret_access_key">R2 secret access key</label>
        <input
          id="secret_access_key"
          v-model="form.secret_access_key"
          type="password"
          :required="!hasExisting"
          autocomplete="new-password"
        />
        <p v-if="hasExisting" class="admin-page__subtitle" style="margin-top: 0.35rem">
          Leave blank to keep the existing secret.
        </p>
      </div>

      <div class="admin-field">
        <label for="bucket_name">Bucket name</label>
        <input id="bucket_name" v-model="form.bucket_name" required />
      </div>

      <div class="admin-field">
        <label for="public_base_url">Public base URL</label>
        <input
          id="public_base_url"
          v-model="form.public_base_url"
          required
          placeholder="https://pub-xxxx.r2.dev"
        />
        <p class="admin-page__subtitle" style="margin-top: 0.35rem">
          Use the R2 <strong>public</strong> URL (pub-xxxx.r2.dev) or custom domain — not
          <code>accountid.r2.cloudflarestorage.com</code>. Enable public access on the bucket in
          Cloudflare R2 settings.
        </p>
      </div>

      <p v-if="error" class="admin-message admin-message--error">{{ error }}</p>
      <p v-if="success" class="admin-message admin-message--success">Settings saved.</p>

      <div class="admin-actions">
        <button type="submit" class="btn btn--filled" :disabled="saving">
          {{ saving ? 'saving...' : '$ save' }}
        </button>
        <NuxtLink to="/admin" class="btn">$ back</NuxtLink>
      </div>
    </form>
  </div>
</template>
