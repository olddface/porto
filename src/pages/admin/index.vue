<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

definePageMeta({ layout: 'admin' })

const { user } = useAuth()
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header">
      <h1 class="admin-page__title">Dashboard</h1>
      <p class="admin-page__subtitle">Logged in as {{ user?.email }}</p>
    </header>

    <div class="admin-list">
      <NuxtLink to="/admin/profile" class="admin-card admin-card--link">
        <span class="prompt-symbol">></span> Edit profile & about
      </NuxtLink>
      <NuxtLink to="/admin/socials" class="admin-card admin-card--link">
        <span class="prompt-symbol">></span> Manage social links
      </NuxtLink>
      <NuxtLink to="/admin/experience" class="admin-card admin-card--link">
        <span class="prompt-symbol">></span> Manage experience
      </NuxtLink>
      <NuxtLink to="/admin/skills" class="admin-card admin-card--link">
        <span class="prompt-symbol">></span> Manage skills
      </NuxtLink>
      <NuxtLink to="/admin/projects" class="admin-card admin-card--link">
        <span class="prompt-symbol">></span> Manage projects
      </NuxtLink>
      <NuxtLink to="/admin/settings" class="admin-card admin-card--link">
        <span class="prompt-symbol">></span> Storage settings (R2)
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.admin-card--link {
  display: block;
  color: var(--text);
  text-decoration: none;
  transition: border-color 0.15s;
}

.admin-card--link:hover {
  border-color: var(--green-dim);
  color: var(--green);
}
</style>
