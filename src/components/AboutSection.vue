<script setup lang="ts">
import { usePortfolio } from '@/composables/usePortfolio'

const { content } = usePortfolio()
</script>

<template>
  <section id="about" class="section">
    <div class="container">
      <h2 class="section-label">about</h2>
      <div class="about">
        <p v-for="(para, i) in content!.about" :key="i" class="about__para">
          <span class="about__line-num">{{ String(i + 1).padStart(2, '0') }}</span>
          {{ para }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 42rem;
}

.about__para {
  display: flex;
  gap: 1rem;
  color: var(--text);
  line-height: 1.75;
}

.about__line-num {
  flex-shrink: 0;
  color: var(--text-dim);
  font-size: 0.7rem;
  padding-top: 0.2rem;
  user-select: none;
}
</style>
