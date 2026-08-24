<script setup lang="ts">
import ChipInput from '@/components/admin/ChipInput.vue'
import MarkdownEditor from '@/components/admin/MarkdownEditor.vue'
import { createProject, getProfileId, updateProject } from '@/api/admin'

definePageMeta({ layout: 'admin' })

const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const profileId = ref('')

const form = ref({
  slug: '',
  name: '',
  description: '',
  body: '',
  highlights: [] as string[],
  stack: [] as string[],
  repo: '',
  demo: '#',
})

onMounted(async () => {
  try {
    profileId.value = await getProfileId()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load profile'
  } finally {
    loading.value = false
  }
})

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function autoSlug() {
  if (!form.value.slug) {
    form.value.slug = slugify(form.value.name)
  }
}

async function handleSubmit() {
  saving.value = true
  error.value = null
  success.value = false

  try {
    const created = await createProject(form.value, profileId.value)
    await navigateTo(`/admin/projects/${created.id}`)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to save project'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="admin-page" style="max-width: 56rem">
    <header class="admin-page__header">
      <h1 class="admin-page__title">New project</h1>
      <p class="admin-page__subtitle">Markdown body renders on the public project detail page.</p>
    </header>

    <p v-if="loading" class="admin-page__subtitle">Loading...</p>

    <form v-else class="admin-form" @submit.prevent="handleSubmit">
      <div class="admin-field">
        <label for="name">Name</label>
        <input id="name" v-model="form.name" required @blur="autoSlug" />
      </div>

      <div class="admin-field">
        <label for="slug">Slug</label>
        <input id="slug" v-model="form.slug" required pattern="[a-z0-9-]+" />
      </div>

      <div class="admin-field">
        <label for="description">Short description</label>
        <textarea id="description" v-model="form.description" rows="3" required />
      </div>

      <div class="admin-field">
        <label>Stack</label>
        <ChipInput v-model="form.stack" />
      </div>

      <div class="admin-field">
        <label>Highlights</label>
        <ChipInput v-model="form.highlights" />
      </div>

      <div class="admin-field">
        <label for="repo">Repo URL</label>
        <input id="repo" v-model="form.repo" required />
      </div>

      <div class="admin-field">
        <label for="demo">Demo URL</label>
        <input id="demo" v-model="form.demo" />
      </div>

      <div class="admin-field">
        <label>Body (markdown)</label>
        <ClientOnly>
          <MarkdownEditor v-model="form.body" />
        </ClientOnly>
      </div>

      <p v-if="error" class="admin-message admin-message--error">{{ error }}</p>

      <div class="admin-actions">
        <button type="submit" class="btn btn--filled" :disabled="saving">
          {{ saving ? 'saving...' : '$ save' }}
        </button>
        <NuxtLink to="/admin/projects" class="btn">$ back</NuxtLink>
      </div>
    </form>
  </div>
</template>
