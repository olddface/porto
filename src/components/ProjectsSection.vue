<script setup lang="ts">
import { usePortfolio } from '@/composables/usePortfolio'

const { content } = usePortfolio()

const expanded = ref(false)
const initialCount = 3

const projects = computed(() => content.value?.projects ?? [])
const hasMore = computed(() => projects.value.length > initialCount)
const visibleProjects = computed(() =>
  expanded.value ? projects.value : projects.value.slice(0, initialCount),
)

function projectThumbnail(project: { image_url?: string | null; images?: { url: string }[] }) {
  return project.image_url || project.images?.[0]?.url || null
}

function showMore() {
  expanded.value = true
}

function showLess() {
  expanded.value = false
}
</script>

<template>
  <section id="projects" class="section">
    <div class="container">
      <h2 class="section-label">projects</h2>
      <div class="projects">
        <NuxtLink
          v-for="project in visibleProjects"
          :key="project.slug"
          :to="`/projects/${project.slug}`"
          class="project"
        >
          <div v-if="projectThumbnail(project)" class="project__thumb-wrap">
            <img
              :src="projectThumbnail(project)!"
              alt=""
              class="project__thumb"
            />
          </div>
          <div v-else class="project__thumb-wrap project__thumb-wrap--empty">
            <span class="prompt-symbol">?</span>
          </div>

          <div class="project__body">
            <header class="project__header">
              <h3 class="project__name">
                <span class="prompt-symbol">./</span>{{ project.name }}
              </h3>
              <span class="project__view">[view]</span>
            </header>
            <p class="project__desc">{{ project.description }}</p>
            <div class="project__stack">
              <span v-for="tech in project.stack" :key="tech" class="tag">
                <TechIcon :tech="tech" />{{ tech }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-if="hasMore" class="projects__more">
        <button v-if="!expanded" type="button" class="btn" @click="showMore">
          $ more projects ({{ projects.length - initialCount }})
        </button>
        <button v-else type="button" class="btn" @click="showLess">
          $ show less
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.project {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  padding: 1.25rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-raised);
  transition: border-color 0.15s;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.project:hover {
  border-color: var(--green-dim);
}

.project__thumb-wrap {
  width: 5.5rem;
  height: 5.5rem;
  flex-shrink: 0;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  overflow: hidden;
  background: var(--bg);
}

.project__thumb-wrap--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-dim);
  font-size: 1.25rem;
}

.project__thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 1 / 1;
  transform: scale(1.08);
  transition: filter 0.35s ease, transform 0.35s ease;
}

.project:hover .project__thumb,
.project:focus-visible .project__thumb {
  filter: none;
  transform: scale(1);
}

.project__body {
  flex: 1;
  min-width: 0;
}

.project__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.project__name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--green);
}

.project__view {
  font-size: 0.75rem;
  color: var(--text-dim);
  transition: color 0.15s;
}

.project:hover .project__view {
  color: var(--green);
}

.project__desc {
  color: var(--text);
  line-height: 1.7;
  margin-bottom: 0.75rem;
}

.project__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.projects__more {
  margin-top: 1.25rem;
}

@media (max-width: 640px) {
  .project {
    gap: 1rem;
    padding: 1rem;
  }

  .project__thumb-wrap {
    width: 4.5rem;
    height: 4.5rem;
  }
}
</style>
