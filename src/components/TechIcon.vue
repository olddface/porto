<script setup lang="ts">
import { computed } from 'vue'
import { getTechIcon } from '@/lib/techIcon'

const props = withDefaults(
  defineProps<{
    tech: string
    size?: number
    alt?: string
  }>(),
  { size: 14 },
)

const src = computed(() => getTechIcon(props.tech))
</script>

<template>
  <img
    v-if="src"
    :src="src"
    :alt="alt ?? tech"
    :width="size"
    :height="size"
    class="tech-icon"
  />
</template>

<style scoped>
.tech-icon {
  display: inline-block;
  flex-shrink: 0;
  object-fit: contain;
  vertical-align: middle;
  /* simple-icons SVGs are black paths — tint to match terminal green */
  filter: brightness(0) saturate(100%) invert(72%) sepia(18%) saturate(742%) hue-rotate(93deg)
    brightness(95%) contrast(88%);
}
</style>
