<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { NAV_ITEMS } from '@/types/portfolio'

const route = useRoute()
const menuOpen = ref(false)
const activeSection = ref('')

const sectionIds = NAV_ITEMS.map((n) => n.href.replace('#', ''))

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function navTo(href: string) {
  return href.startsWith('#') ? { path: '/', hash: href } : href
}

function isNavActive(href: string): boolean {
  if (href === '/projects') {
    return route.path === '/projects' || route.path.startsWith('/projects/')
  }
  const id = href.replace('#', '')
  return route.path === '/' && activeSection.value === id
}

let observer: IntersectionObserver | null = null

function setupObserver() {
  observer?.disconnect()
  if (route.path !== '/') return

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      }
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
  )

  for (const id of sectionIds) {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  }
}

onMounted(setupObserver)

watch(() => route.path, () => {
  setupObserver()
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <header class="nav">
    <div class="container nav__inner">
      <NuxtLink to="/" class="nav__prompt" aria-label="Home">
        <span class="prompt">
          <span class="prompt-user">guest</span><span class="prompt-symbol">@</span><span class="prompt-path">portfolio</span><span class="prompt-symbol">:~$</span>
        </span>
      </NuxtLink>

      <button
        class="nav__toggle"
        :aria-expanded="menuOpen"
        aria-controls="nav-menu"
        aria-label="Toggle navigation"
        @click="toggleMenu"
      >
        <span class="nav__toggle-icon" :class="{ open: menuOpen }" />
      </button>

      <nav id="nav-menu" class="nav__links" :class="{ open: menuOpen }">
        <NuxtLink
          v-for="link in NAV_ITEMS"
          :key="link.href"
          :to="navTo(link.href)"
          class="nav__link"
          :class="{ active: isNavActive(link.href) }"
          @click="closeMenu"
        >
          <span class="prompt-symbol">$</span> {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--nav-h);
  background: rgba(11, 13, 12, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.nav__prompt {
  font-size: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.nav__prompt:hover {
  color: inherit;
}

.nav__toggle {
  display: none;
  background: none;
  border: 1px solid var(--border-bright);
  border-radius: var(--radius);
  padding: 0.4rem;
  cursor: pointer;
}

.nav__toggle-icon,
.nav__toggle-icon::before,
.nav__toggle-icon::after {
  display: block;
  width: 1.1rem;
  height: 2px;
  background: var(--green);
  transition: transform 0.2s, opacity 0.2s;
  position: relative;
}

.nav__toggle-icon::before,
.nav__toggle-icon::after {
  content: '';
  position: absolute;
  left: 0;
}

.nav__toggle-icon::before {
  top: -5px;
}

.nav__toggle-icon::after {
  top: 5px;
}

.nav__toggle-icon.open {
  background: transparent;
}

.nav__toggle-icon.open::before {
  transform: rotate(45deg) translate(3.5px, 3.5px);
}

.nav__toggle-icon.open::after {
  transform: rotate(-45deg) translate(3.5px, -3.5px);
}

.nav__links {
  display: flex;
  gap: 0.25rem;
}

.nav__link {
  padding: 0.35rem 0.65rem;
  font-size: 0.75rem;
  color: var(--text-dim);
  border-radius: var(--radius);
  transition: color 0.15s, background 0.15s;
  text-decoration: none;
}

.nav__link:hover {
  color: var(--green);
  background: var(--bg-hover);
}

.nav__link.active {
  color: var(--green);
}

.nav__link .prompt-symbol {
  color: var(--green-dim);
  margin-right: 0.15rem;
}

@media (max-width: 640px) {
  .nav__toggle {
    display: block;
  }

  .nav__links {
    display: none;
    position: absolute;
    top: var(--nav-h);
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--bg-raised);
    border-bottom: 1px solid var(--border);
    padding: 0.5rem;
  }

  .nav__links.open {
    display: flex;
  }

  .nav__link {
    padding: 0.65rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>
