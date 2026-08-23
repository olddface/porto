<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchSocialLinks, getProfileId, upsertSocialLinks, type DbSocialLink } from '@/api/admin'

const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const profileId = ref('')
const links = ref<Omit<DbSocialLink, 'profile_id'>[]>([])

onMounted(async () => {
  try {
    profileId.value = await getProfileId()
    const data = await fetchSocialLinks()
    links.value = data.map(({ id, label, href, sort_order }) => ({ id, label, href, sort_order }))
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load social links'
  } finally {
    loading.value = false
  }
})

function addLink() {
  links.value.push({ id: '', label: '', href: '', sort_order: links.value.length })
}

function removeLink(index: number) {
  links.value.splice(index, 1)
}

function moveLink(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= links.value.length) return
  const copy = [...links.value]
  const temp = copy[index]!
  copy[index] = copy[target]!
  copy[target] = temp
  links.value = copy
}

async function handleSubmit() {
  saving.value = true
  error.value = null
  success.value = false

  try {
    await upsertSocialLinks(links.value, profileId.value)
    const data = await fetchSocialLinks()
    links.value = data.map(({ id, label, href, sort_order }) => ({ id, label, href, sort_order }))
    success.value = true
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to save social links'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header">
      <h1 class="admin-page__title">Social links</h1>
      <p class="admin-page__subtitle">Links shown in hero and contact sections.</p>
    </header>

    <p v-if="loading" class="admin-page__subtitle">Loading...</p>

    <form v-else class="admin-form" @submit.prevent="handleSubmit">
      <div class="admin-list">
        <div v-for="(link, i) in links" :key="i" class="admin-card">
          <div class="admin-card__header">
            <span class="admin-card__title">Link {{ i + 1 }}</span>
            <div class="admin-card__actions">
              <button type="button" class="btn btn--sm" :disabled="i === 0" @click="moveLink(i, -1)">↑</button>
              <button
                type="button"
                class="btn btn--sm"
                :disabled="i === links.length - 1"
                @click="moveLink(i, 1)"
              >
                ↓
              </button>
              <button type="button" class="btn btn--sm btn--danger" @click="removeLink(i)">×</button>
            </div>
          </div>

          <div class="admin-form">
            <div class="admin-field">
              <label>Label</label>
              <input v-model="link.label" required />
            </div>
            <div class="admin-field">
              <label>URL</label>
              <input v-model="link.href" required />
            </div>
          </div>
        </div>
      </div>

      <button type="button" class="btn" @click="addLink">$ add link</button>

      <p v-if="error" class="admin-message admin-message--error">{{ error }}</p>
      <p v-if="success" class="admin-message admin-message--success">Social links saved.</p>

      <div class="admin-actions">
        <button type="submit" class="btn btn--filled" :disabled="saving">
          {{ saving ? 'saving...' : '$ save' }}
        </button>
      </div>
    </form>
  </div>
</template>
