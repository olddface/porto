<script setup lang="ts">
import ChipInput from '@/components/admin/ChipInput.vue'
import EntityImagesUpload from '@/components/admin/EntityImagesUpload.vue'
import { fetchExperiences, getProfileId, upsertExperiences, type DbExperience } from '@/api/admin'

definePageMeta({ layout: 'admin' })

type ExperienceItem = Omit<DbExperience, 'profile_id'>

const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const profileId = ref('')
const items = ref<ExperienceItem[]>([])

function mapExperience(row: DbExperience): ExperienceItem {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    period: row.period,
    location: row.location,
    bullets: row.bullets,
    sort_order: row.sort_order,
    images: row.images ?? [],
  }
}

onMounted(async () => {
  try {
    profileId.value = await getProfileId()
    items.value = (await fetchExperiences()).map(mapExperience)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load experience'
  } finally {
    loading.value = false
  }
})

function addItem() {
  items.value.push({
    id: '',
    company: '',
    role: '',
    period: '',
    location: '',
    bullets: [],
    sort_order: items.value.length,
    images: [],
  })
}

function removeItem(index: number) {
  items.value.splice(index, 1)
}

function moveItem(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= items.value.length) return
  const copy = [...items.value]
  const temp = copy[index]!
  copy[index] = copy[target]!
  copy[target] = temp
  items.value = copy
}

async function handleSubmit() {
  saving.value = true
  error.value = null
  success.value = false

  try {
    const payload = items.value.map(({ id, company, role, period, location, bullets, sort_order }) => ({
      id,
      company,
      role,
      period,
      location,
      bullets,
      sort_order,
    }))
    await upsertExperiences(payload, profileId.value)
    items.value = (await fetchExperiences()).map(mapExperience)
    success.value = true
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to save experience'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header">
      <h1 class="admin-page__title">Experience</h1>
      <p class="admin-page__subtitle">Work history entries, bullets, and images.</p>
    </header>

    <p v-if="loading" class="admin-page__subtitle">Loading...</p>

    <form v-else class="admin-form" @submit.prevent="handleSubmit">
      <div class="admin-list">
        <div v-for="(item, i) in items" :key="item.id || i" class="admin-card">
          <div class="admin-card__header">
            <span class="admin-card__title">{{ item.company || `Entry ${i + 1}` }}</span>
            <div class="admin-card__actions">
              <button type="button" class="btn btn--sm" :disabled="i === 0" @click="moveItem(i, -1)">↑</button>
              <button
                type="button"
                class="btn btn--sm"
                :disabled="i === items.length - 1"
                @click="moveItem(i, 1)"
              >
                ↓
              </button>
              <button type="button" class="btn btn--sm btn--danger" @click="removeItem(i)">×</button>
            </div>
          </div>

          <div class="admin-form">
            <div class="admin-field">
              <label>Company</label>
              <input v-model="item.company" required />
            </div>
            <div class="admin-field">
              <label>Role</label>
              <input v-model="item.role" required />
            </div>
            <div class="admin-field">
              <label>Period</label>
              <input v-model="item.period" required />
            </div>
            <div class="admin-field">
              <label>Location</label>
              <input v-model="item.location" required />
            </div>
            <div class="admin-field">
              <label>Bullets</label>
              <ChipInput v-model="item.bullets" />
            </div>
            <div class="admin-field">
              <label>Images</label>
              <EntityImagesUpload v-if="item.id" from-table="experiences" :from-id="item.id" />
              <p v-else class="admin-page__subtitle">Save this entry first, then you can upload images.</p>
            </div>
          </div>
        </div>
      </div>

      <button type="button" class="btn" @click="addItem">$ add entry</button>

      <p v-if="error" class="admin-message admin-message--error">{{ error }}</p>
      <p v-if="success" class="admin-message admin-message--success">Experience saved.</p>

      <div class="admin-actions">
        <button type="submit" class="btn btn--filled" :disabled="saving">
          {{ saving ? 'saving...' : '$ save' }}
        </button>
      </div>
    </form>
  </div>
</template>
