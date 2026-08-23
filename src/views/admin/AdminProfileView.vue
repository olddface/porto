<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchProfile, updateProfile } from '@/api/admin'

const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const profileId = ref('')
const aboutText = ref('')

const form = ref({
  name: '',
  title: '',
  years_experience: '',
  location: '',
  tagline: '',
  email: '',
  resume: '',
})

onMounted(async () => {
  try {
    const profile = await fetchProfile()
    profileId.value = profile.id
    form.value = {
      name: profile.name,
      title: profile.title,
      years_experience: profile.years_experience,
      location: profile.location,
      tagline: profile.tagline,
      email: profile.email,
      resume: profile.resume,
    }
    aboutText.value = profile.about.join('\n\n')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load profile'
  } finally {
    loading.value = false
  }
})

async function handleSubmit() {
  saving.value = true
  error.value = null
  success.value = false

  try {
    const about = aboutText.value
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean)

    await updateProfile(profileId.value, {
      ...form.value,
      about,
    })
    success.value = true
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to save profile'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header">
      <h1 class="admin-page__title">Profile</h1>
      <p class="admin-page__subtitle">Hero section, about, and contact info.</p>
    </header>

    <p v-if="loading" class="admin-page__subtitle">Loading...</p>

    <form v-else class="admin-form" @submit.prevent="handleSubmit">
      <div class="admin-field">
        <label for="name">Name</label>
        <input id="name" v-model="form.name" required />
      </div>

      <div class="admin-field">
        <label for="title">Title</label>
        <input id="title" v-model="form.title" required />
      </div>

      <div class="admin-field">
        <label for="years">Years experience</label>
        <input id="years" v-model="form.years_experience" required />
      </div>

      <div class="admin-field">
        <label for="location">Location</label>
        <input id="location" v-model="form.location" required />
      </div>

      <div class="admin-field">
        <label for="tagline">Tagline</label>
        <input id="tagline" v-model="form.tagline" required />
      </div>

      <div class="admin-field">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" required />
      </div>

      <div class="admin-field">
        <label for="resume">Resume URL</label>
        <input id="resume" v-model="form.resume" />
      </div>

      <div class="admin-field">
        <label for="about">About paragraphs (blank line between paragraphs)</label>
        <textarea id="about" v-model="aboutText" rows="8" />
      </div>

      <p v-if="error" class="admin-message admin-message--error">{{ error }}</p>
      <p v-if="success" class="admin-message admin-message--success">Profile saved.</p>

      <div class="admin-actions">
        <button type="submit" class="btn btn--filled" :disabled="saving">
          {{ saving ? 'saving...' : '$ save' }}
        </button>
      </div>
    </form>
  </div>
</template>
