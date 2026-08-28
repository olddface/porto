<script setup lang="ts">
import type { Project } from '@/types/portfolio'
import { usePortfolio } from '@/composables/usePortfolio'

const { content } = usePortfolio()

const projects = computed(() => content.value?.projects ?? [])

function projectThumbnail(project: Pick<Project, 'image_url' | 'images'>) {
  return project.image_url || project.images?.[0]?.url || null
}

useHead({
  title: 'Projects — Olddface',
  meta: [
    {
      name: 'description',
      content: 'Portfolio projects by Olddface — software engineering work and side builds.',
    },
  ],
})
</script>

<template>
  <section class="projects-page section">
    <div class="container">
      <NuxtLink to="/" class="projects-page__back">
        <span class="prompt-symbol">$</span> cd ../
      </NuxtLink>

      <p class="projects-page__prompt prompt">
        <span class="prompt-user">guest</span><span class="prompt-symbol">@</span><span class="prompt-path">portfolio</span><span class="prompt-symbol">:~$</span>
        ls ./projects/
      </p>

      <h1 class="projects-page__title section-label">projects</h1>
      <p class="projects-page__count">
        <span class="prompt-symbol">{{ projects.length }}</span> entries found
      </p>

      <div v-if="projects.length" class="projects-page__grid">
        <NuxtLink
          v-for="project in projects"
          :key="project.slug"
          :to="`/projects/${project.slug}`"
          class="project-card"
        >
          <div v-if="projectThumbnail(project)" class="project-card__media">
            <img
              :src="projectThumbnail(project)!"
              alt=""
              class="project-card__image"
            />
          </div>
          <div v-else class="project-card__media project-card__media--empty">
            <span class="prompt-symbol">?</span>
          </div>

          <div class="project-card__body">
            <header class="project-card__header">
              <h2 class="project-card__name">
                <span class="prompt-symbol">./</span>{{ project.name }}
              </h2>
              <span class="project-card__view">[view]</span>
            </header>
            <p class="project-card__desc">{{ project.description }}</p>
            <div class="project-card__stack">
              <span v-for="tech in project.stack" :key="tech" class="tag">
                <TechIcon :tech="tech" />{{ tech }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <p v-else class="projects-page__empty">No projects yet.</p>
    </div>
  </section>
</template>

<style scoped>
.projects-page {
  padding-top: 3rem;
  min-height: 60vh;
}

.projects-page__back {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-dim);
  margin-bottom: 1.5rem;
  text-decoration: none;
}

.projects-page__back:hover {
  color: var(--green);
}

.projects-page__prompt {
  font-size: 0.75rem;
  margin-bottom: 1rem;
}

.projects-page__title {
  margin-bottom: 0.5rem;
}

.projects-page__count {
  font-size: 0.75rem;
  color: var(--text-dim);
  margin-bottom: 2rem;
}

.projects-page__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.project-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-raised);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition: border-color 0.15s;
}

.project-card:hover {
  border-color: var(--green-dim);
}

.project-card__media {
  aspect-ratio: 16 / 9;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  overflow: hidden;
}

.project-card__media--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-dim);
  font-size: 1.5rem;
}

.project-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05);
  transition: transform 0.35s ease;
}

.project-card:hover .project-card__image,
.project-card:focus-visible .project-card__image {
  transform: scale(1);
}

.project-card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.25rem;
  min-width: 0;
}

.project-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.project-card__name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--green);
  line-height: 1.4;
}

.project-card__view {
  flex-shrink: 0;
  font-size: 0.75rem;
  color: var(--text-dim);
  transition: color 0.15s;
}

.project-card:hover .project-card__view {
  color: var(--green);
}

.project-card__desc {
  color: var(--text);
  line-height: 1.7;
  margin-bottom: 1rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-card__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.projects-page__empty {
  color: var(--text-dim);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .projects-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
