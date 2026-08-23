<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { user, signOut } = useAuth()

const navItems = [
  { label: 'dashboard', to: '/admin' },
  { label: 'profile', to: '/admin/profile' },
  { label: 'socials', to: '/admin/socials' },
  { label: 'experience', to: '/admin/experience' },
  { label: 'skills', to: '/admin/skills' },
  { label: 'projects', to: '/admin/projects' },
]

async function handleSignOut() {
  await signOut()
}
</script>

<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <div class="admin-sidebar__header">
        <RouterLink to="/admin" class="admin-sidebar__brand">
          <span class="prompt-symbol">$</span> admin
        </RouterLink>
        <p class="admin-sidebar__user">{{ user?.email }}</p>
      </div>

      <nav class="admin-sidebar__nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="admin-sidebar__link"
          :class="{ active: route.path === item.to || (item.to !== '/admin' && route.path.startsWith(item.to)) }"
        >
          <span class="prompt-symbol">></span> {{ item.label }}
        </RouterLink>
      </nav>

      <div class="admin-sidebar__footer">
        <RouterLink to="/" class="admin-sidebar__link">
          <span class="prompt-symbol">$</span> view site
        </RouterLink>
        <button type="button" class="btn btn--sm admin-sidebar__logout" @click="handleSignOut">
          logout
        </button>
      </div>
    </aside>

    <main class="admin-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.admin-shell {
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  width: 14rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border);
  background: var(--bg-raised);
  padding: 1.25rem 0.75rem;
}

.admin-sidebar__header {
  padding: 0 0.5rem 1.25rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 1rem;
}

.admin-sidebar__brand {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--green);
  text-decoration: none;
}

.admin-sidebar__user {
  font-size: 0.65rem;
  color: var(--text-dim);
  margin-top: 0.35rem;
  word-break: break-all;
}

.admin-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
}

.admin-sidebar__link {
  display: block;
  padding: 0.45rem 0.5rem;
  font-size: 0.75rem;
  color: var(--text-dim);
  text-decoration: none;
  border-radius: var(--radius);
  background: none;
  border: none;
  font-family: var(--font);
  text-align: left;
  cursor: pointer;
  width: 100%;
}

.admin-sidebar__link:hover,
.admin-sidebar__link.active {
  color: var(--green);
  background: var(--bg-hover);
}

.admin-sidebar__footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.admin-sidebar__logout {
  width: 100%;
  justify-content: center;
}

.admin-main {
  flex: 1;
  padding: 2rem 1.5rem;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .admin-shell {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }

  .admin-sidebar__nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
