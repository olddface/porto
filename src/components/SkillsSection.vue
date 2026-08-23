<script setup lang="ts">
import { usePortfolio } from '@/composables/usePortfolio'

const { content } = usePortfolio()
</script>

<template>
  <section id="skills" class="section">
    <div class="container">
      <h2 class="section-label">skills</h2>
      <div class="skills">
        <div v-for="group in content!.skills" :key="group.category" class="skills__group">
          <h3 class="skills__category">
            <span class="prompt-symbol">$</span> ls {{ group.category.toLowerCase() }}/
          </h3>
          <div class="skills__tags">
            <span v-for="skill in group.skills" :key="skill" class="tag">{{ skill }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 1.5rem;
}

.skills__group {
  padding: 1.25rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-raised);
}

.skills__category {
  font-size: 0.75rem;
  color: var(--text-dim);
  margin-bottom: 0.85rem;
}

.skills__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
</style>
