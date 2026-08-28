<script setup lang="ts">
import { fetchProjectBySlug } from '@/api/portfolio'
import { renderMarkdown } from '@/lib/markdown'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { status, data: project } = await useLazyAsyncData(
  () => `project-${slug.value}`,
  () => fetchProjectBySlug(slug.value),
)

const renderedBody = computed(() =>
  project.value?.body ? renderMarkdown(project.value.body) : '',
)

function isRepoLink(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return false
  if (/^https?:\/\//i.test(trimmed)) return true
  if (/^www\./i.test(trimmed)) return true
  return /^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(trimmed)
}

function repoHref(value: string): string {
  const trimmed = value.trim()
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

const projectRepo = computed(() => project.value?.repo?.trim() ?? '')
const repoIsLink = computed(() => isRepoLink(projectRepo.value))

useHead({
  title: () => (project.value ? `${project.value.name} — Olddface` : 'Project — Olddface'),
})
</script>

<template>
  <section class="detail section">
    <div class="container">
      <NuxtLink to="/projects" class="detail__back">
        <span class="prompt-symbol">$</span> cd ../projects
      </NuxtLink>
      <div v-if="status === 'error'" class="detail__not-found">
        <p class="detail__prompt prompt">
          <span class="prompt-user">guest</span><span class="prompt-symbol">@</span><span class="prompt-path">portfolio</span><span class="prompt-symbol">:~$</span>
          cat ./{{ slug }}/README.md
        </p>
        <p class="detail__error">error: project not found</p>
        <NuxtLink to="/projects" class="btn">$ cd ../projects</NuxtLink>
      </div>

      <template v-else-if="status === 'success'">
        <p class="detail__prompt prompt">
          <span class="prompt-user">guest</span><span class="prompt-symbol">@</span><span class="prompt-path">portfolio</span><span class="prompt-symbol">:~$</span>
          cat ./{{ project?.slug }}/README.md
        </p>

        <h1 class="detail__name">
          <span class="prompt-symbol">./</span>{{ project.name }}
        </h1>

        <p class="detail__desc">{{ project?.description }}</p>

        <div v-if="project?.image_url" class="detail__hero">
          <img :src="project?.image_url" alt="" class="detail__hero-image" />
        </div>

        <div v-if="project?.images?.length" class="detail__gallery">
          <img
            v-for="(image, i) in project?.images"
            :key="i"
            :src="image.url"
            alt=""
            class="detail__gallery-image"
          />
        </div>

        <div class="detail__stack">
          <span v-for="tech in project?.stack" :key="tech" class="tag">
            <TechIcon :tech="tech" />{{ tech }}
          </span>
        </div>

        <div class="detail__body">
          <h2 class="detail__heading">
            <span class="prompt-symbol">//</span> overview
          </h2>
          <div class="detail__body-content markdown-body" v-html="renderedBody" />

          <h2 class="detail__heading">
            <span class="prompt-symbol">//</span> highlights
          </h2>
          <ul class="detail__highlights">
            <li v-for="(item, i) in project?.highlights" :key="i" class="detail__highlight">
              <span class="detail__marker">&gt;</span>
              {{ item }}
            </li>
          </ul>
        </div>

        <div class="detail__actions">
          <a
            v-if="repoIsLink"
            :href="repoHref(projectRepo)"
            target="_blank"
            rel="noopener noreferrer"
            class="btn"
          >
            $ git clone [repo]
          </a>
          <span v-else-if="projectRepo" class="btn detail__repo-note">
            $ {{ projectRepo }}
          </span>
          <a
            v-if="project?.demo !== '#'"
            :href="project?.demo"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn--filled"
          >
            $ open demo
          </a>
        </div>
      </template>
      <template v-else>
        <div class="detail__loading" aria-busy="true" aria-label="Loading project">
          <p class="detail__loading-prompt prompt">
            <span class="prompt-user">guest</span><span class="prompt-symbol">@</span><span class="prompt-path">portfolio</span><span class="prompt-symbol">:~$</span>
            cat ./{{ slug }}/README.md<span class="cursor-blink" />
          </p>
          <div class="detail__loading-spinner" aria-hidden="true" />
        </div>
      </template>

    </div>
  </section>
</template>

<style scoped>
.detail {
  padding-top: 3rem;
  min-height: 60vh;
}

.detail__back {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-dim);
  margin-bottom: 1.5rem;
  text-decoration: none;
}

.detail__back:hover {
  color: var(--green);
}

.detail__prompt {
  font-size: 0.75rem;
  margin-bottom: 1rem;
}

.detail__name {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 700;
  color: var(--green);
  margin-bottom: 0.75rem;
}

.detail__desc {
  color: var(--text);
  line-height: 1.7;
  max-width: 42rem;
  margin-bottom: 1rem;
}

.detail__hero {
  margin-bottom: 1rem;
}

.detail__hero-image {
  display: block;
  width: 100%;
  max-height: 16rem;
  object-fit: cover;
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.detail__gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.detail__gallery-image {
  width: 6rem;
  height: 6rem;
  object-fit: cover;
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.detail__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 2rem;
}

.detail__body {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-raised);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.detail__heading {
  font-size: 0.75rem;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
}

.detail__heading:not(:first-child) {
  margin-top: 1.5rem;
}

.detail__highlights {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail__highlight {
  display: flex;
  gap: 0.5rem;
  color: var(--text);
  line-height: 1.6;
  font-size: 0.8125rem;
}

.detail__marker {
  color: var(--green-dim);
  flex-shrink: 0;
}

.detail__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.detail__repo-note {
  cursor: default;
}

.detail__repo-note:hover {
  background: transparent;
  border-color: var(--green-dim);
  color: var(--green);
}

.detail__not-found {
  padding-block: 2rem;
}

.detail__error {
  color: var(--red);
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.detail__loading {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  padding-block: 2rem 4rem;
  min-height: 40vh;
}

.detail__loading-prompt {
  font-size: 0.75rem;
}

.detail__loading-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--border-bright);
  border-top-color: var(--green);
  border-radius: 50%;
  animation: detail-spin 0.7s linear infinite;
}

@keyframes detail-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
