<script setup lang="ts">
import { deleteProject, fetchProjects, reorderProjects, type DbProject } from '@/api/admin'

definePageMeta({ layout: 'admin' })

const loading = ref(true)
const error = ref<string | null>(null)
const projects = ref<DbProject[]>([])
const deletingId = ref<string | null>(null)

async function load() {
  loading.value = true
  error.value = null
  try {
    projects.value = await fetchProjects()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load projects'
  } finally {
    loading.value = false
  }
}

onMounted(load)

async function handleDelete(id: string, name: string) {
  if (!confirm(`Delete project "${name}"?`)) return
  deletingId.value = id
  try {
    await deleteProject(id)
    await load()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to delete project'
  } finally {
    deletingId.value = null
  }
}

async function moveProject(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= projects.value.length) return

  const copy = [...projects.value]
  const temp = copy[index]!
  copy[index] = copy[target]!
  copy[target] = temp
  projects.value = copy

  try {
    await reorderProjects(copy.map((p) => p.id))
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to reorder projects'
    await load()
  }
}
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header">
      <h1 class="admin-page__title">Projects</h1>
      <p class="admin-page__subtitle">Manage portfolio projects and markdown write-ups.</p>
    </header>

    <div class="admin-actions" style="margin-bottom: 1.5rem">
      <NuxtLink to="/admin/projects/new" class="btn btn--filled">$ new project</NuxtLink>
    </div>

    <p v-if="loading" class="admin-page__subtitle">Loading...</p>
    <p v-if="error" class="admin-message admin-message--error">{{ error }}</p>

    <div v-else class="admin-list">
      <div v-for="(project, i) in projects" :key="project.id" class="admin-card">
        <div class="admin-card__header">
          <div>
            <span class="admin-card__title">{{ project.name }}</span>
            <p class="admin-page__subtitle">/{{ project.slug }}</p>
          </div>
          <div class="admin-card__actions">
            <button type="button" class="btn btn--sm" :disabled="i === 0" @click="moveProject(i, -1)">↑</button>
            <button
              type="button"
              class="btn btn--sm"
              :disabled="i === projects.length - 1"
              @click="moveProject(i, 1)"
            >
              ↓
            </button>
            <NuxtLink :to="`/admin/projects/${project.id}`" class="btn btn--sm">edit</NuxtLink>
            <button
              type="button"
              class="btn btn--sm btn--danger"
              :disabled="deletingId === project.id"
              @click="handleDelete(project.id, project.name)"
            >
              {{ deletingId === project.id ? '...' : 'delete' }}
            </button>
          </div>
        </div>
        <p class="admin-page__subtitle">{{ project.description }}</p>
      </div>

      <p v-if="!projects.length" class="admin-page__subtitle">No projects yet.</p>
    </div>
  </div>
</template>
