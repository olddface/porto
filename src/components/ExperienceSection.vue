<script setup lang="ts">
import ImageLightbox from '@/components/ImageLightbox.vue'
import { usePortfolio } from '@/composables/usePortfolio'

const { content } = usePortfolio()

const lightbox = ref<{ images: { url: string }[]; index: number } | null>(null)

function openLightbox(images: { url: string }[], index: number) {
  lightbox.value = { images, index }
}

function closeLightbox() {
  lightbox.value = null
}
</script>

<template>
  <section id="experience" class="section">
    <div class="container">
      <h2 class="section-label">experience</h2>
      <div class="timeline">
        <article v-for="(job, i) in content!.experience" :key="i" class="timeline__item">
          <div class="timeline__marker">
            <span class="timeline__dot" />
            <span v-if="i < content!.experience.length - 1" class="timeline__line" />
          </div>
          <div class="timeline__body">
            <header class="timeline__header">
              <div>
                <h3 class="timeline__role">{{ job.role }}</h3>
                <p class="timeline__company">
                  <span class="prompt-symbol">@</span>{{ job.company }}
                </p>
              </div>
              <div class="timeline__meta">
                <span class="tag">{{ job.period }}</span>
                <span class="timeline__location">{{ job.location }}</span>
              </div>
            </header>
            <ul class="timeline__bullets">
              <li v-for="(bullet, j) in job.bullets" :key="j" class="timeline__bullet">
                <span class="timeline__bullet-marker">&gt;</span>
                {{ bullet }}
              </li>
            </ul>
            <div v-if="job.images?.length" class="timeline__images">
              <button
                v-for="(image, k) in job.images"
                :key="k"
                type="button"
                class="timeline__image-btn"
                :aria-label="`View image ${k + 1}`"
                @click="openLightbox(job.images!, k)"
              >
                <img :src="image.url" alt="" class="timeline__image" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>

    <ImageLightbox
      v-if="lightbox"
      :images="lightbox.images"
      :index="lightbox.index"
      @close="closeLightbox"
      @update:index="lightbox.index = $event"
    />
  </section>
</template>

<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline__item {
  display: flex;
  gap: 1.25rem;
}

.timeline__marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0.35rem;
  width: 1rem;
  flex-shrink: 0;
}

.timeline__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 6px var(--green-dim);
  flex-shrink: 0;
}

.timeline__line {
  flex: 1;
  width: 1px;
  background: var(--border-bright);
  margin-block: 0.5rem;
  min-height: 2rem;
}

.timeline__body {
  flex: 1;
  padding-bottom: 2.5rem;
}

.timeline__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.timeline__role {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.15rem;
}

.timeline__company {
  font-size: 0.8rem;
  color: var(--amber);
}

.timeline__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
}

.timeline__location {
  font-size: 0.7rem;
  color: var(--text-dim);
}

.timeline__bullets {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.timeline__bullet {
  display: flex;
  gap: 0.5rem;
  color: var(--text);
  font-size: 0.8125rem;
  line-height: 1.6;
}

.timeline__bullet-marker {
  color: var(--green-dim);
  flex-shrink: 0;
  user-select: none;
}

.timeline__images {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.timeline__image-btn {
  padding: 0;
  border: none;
  background: none;
  cursor: zoom-in;
  border-radius: var(--radius);
}

.timeline__image-btn:focus-visible {
  outline: 2px solid var(--green);
  outline-offset: 2px;
}

.timeline__image {
  display: block;
  width: 4.5rem;
  height: 4.5rem;
  object-fit: cover;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: border-color 0.15s;
}

.timeline__image-btn:hover .timeline__image {
  border-color: var(--green-dim);
}

@media (max-width: 640px) {
  .timeline__meta {
    align-items: flex-start;
    flex-direction: row;
    gap: 0.5rem;
  }
}
</style>
