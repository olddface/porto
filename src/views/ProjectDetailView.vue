<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { usePortfolio } from '@/composables/usePortfolio'
import { renderMarkdown } from '@/lib/markdown'
import type { Project } from '@/types/portfolio'

const route = useRoute()
const { getProjectBySlug, fetchProject } = usePortfolio()

const project = ref<Project | null>(null)
const loading = ref(true)

const renderedBody = computed(() =>
  project.value?.body ? renderMarkdown(project.value.body) : '',
)

async function loadProject(slug: string) {
  loading.value = true
  project.value = getProjectBySlug(slug) ?? (await fetchProject(slug))
  loading.value = false
}

watch(
  () => route.params.slug,
  (slug) => {
    if (typeof slug === 'string') loadProject(slug)
  },
  { immediate: true },
)
</script>

<template>
  <section class="detail section">
    <div class="container">
      <RouterLink to="/#projects" class="detail__back">
        <span class="prompt-symbol">$</span> cd ../projects
      </RouterLink>

      <div v-if="loading" class="detail__loading">
        <p class="detail__prompt prompt">
          <span class="prompt-user">guest</span><span class="prompt-symbol">@</span><span class="prompt-path">portfolio</span><span class="prompt-symbol">:~$</span>
          cat ./{{ route.params.slug }}/README.md<span class="cursor-blink" />
        </p>
      </div>

      <template v-else-if="project">
        <p class="detail__prompt prompt">
          <span class="prompt-user">guest</span><span class="prompt-symbol">@</span><span class="prompt-path">portfolio</span><span class="prompt-symbol">:~$</span>
          cat ./{{ project.slug }}/README.md
        </p>

        <h1 class="detail__name">
          <span class="prompt-symbol">./</span>{{ project.name }}
        </h1>

        <p class="detail__desc">{{ project.description }}</p>

        <div class="detail__stack">
          <span v-for="tech in project.stack" :key="tech" class="tag">
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
            <li v-for="(item, i) in project.highlights" :key="i" class="detail__highlight">
              <span class="detail__marker">&gt;</span>
              {{ item }}
            </li>
          </ul>
        </div>

        <div class="detail__actions">
          <a
            :href="project.repo"
            target="_blank"
            rel="noopener noreferrer"
            class="btn"
          >
            $ git clone [repo]
          </a>
          <a
            v-if="project.demo !== '#'"
            :href="project.demo"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn--filled"
          >
            $ open demo
          </a>
        </div>
      </template>

      <div v-else class="detail__not-found">
        <p class="detail__prompt prompt">
          <span class="prompt-user">guest</span><span class="prompt-symbol">@</span><span class="prompt-path">portfolio</span><span class="prompt-symbol">:~$</span>
          cat ./{{ route.params.slug }}/README.md
        </p>
        <p class="detail__error">error: project not found</p>
        <RouterLink to="/#projects" class="btn">$ cd ../projects</RouterLink>
      </div>
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

.detail__para {
  color: var(--text);
  line-height: 1.75;
  margin-bottom: 0.75rem;
}

.detail__para:last-child {
  margin-bottom: 0;
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

.detail__not-found,
.detail__loading {
  padding-block: 2rem;
}

.detail__error {
  color: var(--red);
  font-size: 1rem;
  margin-bottom: 1.5rem;
}
</style>
