<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header">
      <h1 class="admin-page__title">Dashboard</h1>
      <p class="admin-page__subtitle">Logged in as {{ user?.email }}</p>
    </header>

    <div class="admin-list">
      <RouterLink to="/admin/profile" class="admin-card admin-card--link">
        <span class="prompt-symbol">></span> Edit profile & about
      </RouterLink>
      <RouterLink to="/admin/socials" class="admin-card admin-card--link">
        <span class="prompt-symbol">></span> Manage social links
      </RouterLink>
      <RouterLink to="/admin/experience" class="admin-card admin-card--link">
        <span class="prompt-symbol">></span> Manage experience
      </RouterLink>
      <RouterLink to="/admin/skills" class="admin-card admin-card--link">
        <span class="prompt-symbol">></span> Manage skills
      </RouterLink>
      <RouterLink to="/admin/projects" class="admin-card admin-card--link">
        <span class="prompt-symbol">></span> Manage projects
      </RouterLink>
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
