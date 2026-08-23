<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ChipInput from '@/components/admin/ChipInput.vue'
import { fetchSkillGroups, getProfileId, upsertSkillGroups, type DbSkillGroup } from '@/api/admin'

const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const profileId = ref('')
const items = ref<Omit<DbSkillGroup, 'profile_id'>[]>([])

onMounted(async () => {
  try {
    profileId.value = await getProfileId()
    const data = await fetchSkillGroups()
    items.value = data.map(({ id, category, skills, sort_order }) => ({
      id,
      category,
      skills,
      sort_order,
    }))
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load skills'
  } finally {
    loading.value = false
  }
})

function addItem() {
  items.value.push({
    id: '',
    category: '',
    skills: [],
    sort_order: items.value.length,
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
    await upsertSkillGroups(items.value, profileId.value)
    const data = await fetchSkillGroups()
    items.value = data.map(({ id, category, skills, sort_order }) => ({
      id,
      category,
      skills,
      sort_order,
    }))
    success.value = true
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to save skills'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header">
      <h1 class="admin-page__title">Skills</h1>
      <p class="admin-page__subtitle">Skill groups and tags.</p>
    </header>

    <p v-if="loading" class="admin-page__subtitle">Loading...</p>

    <form v-else class="admin-form" @submit.prevent="handleSubmit">
      <div class="admin-list">
        <div v-for="(item, i) in items" :key="i" class="admin-card">
          <div class="admin-card__header">
            <span class="admin-card__title">{{ item.category || `Group ${i + 1}` }}</span>
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
              <label>Category</label>
              <input v-model="item.category" required />
            </div>
            <div class="admin-field">
              <label>Skills</label>
              <ChipInput v-model="item.skills" />
            </div>
          </div>
        </div>
      </div>

      <button type="button" class="btn" @click="addItem">$ add group</button>

      <p v-if="error" class="admin-message admin-message--error">{{ error }}</p>
      <p v-if="success" class="admin-message admin-message--success">Skills saved.</p>

      <div class="admin-actions">
        <button type="submit" class="btn btn--filled" :disabled="saving">
          {{ saving ? 'saving...' : '$ save' }}
        </button>
      </div>
    </form>
  </div>
</template>
