<script setup lang="ts">
const props = defineProps<{
  images: { url: string }[]
  index: number
}>()

const emit = defineEmits<{
  close: []
  'update:index': [index: number]
}>()

const current = computed(() => props.images[props.index])
const hasPrev = computed(() => props.index > 0)
const hasNext = computed(() => props.index < props.images.length - 1)

function prev() {
  if (hasPrev.value) emit('update:index', props.index - 1)
}

function next() {
  if (hasNext.value) emit('update:index', props.index + 1)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
}

const WHEEL_COOLDOWN_MS = 350
let wheelCooldown = false

function onWheel(e: WheelEvent) {
  if (props.images.length <= 1 || wheelCooldown) return

  const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX
  if (delta === 0) return

  wheelCooldown = true
  window.setTimeout(() => {
    wheelCooldown = false
  }, WHEEL_COOLDOWN_MS)

  if (delta > 0) next()
  else prev()
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      class="lightbox"
      role="dialog"
      aria-modal="true"
      @click.self="emit('close')"
      @wheel.prevent="onWheel"
    >
      <button type="button" class="lightbox__close" aria-label="Close" @click="emit('close')">
        ×
      </button>

      <button
        v-if="hasPrev"
        type="button"
        class="lightbox__nav lightbox__nav--prev"
        aria-label="Previous image"
        @click="prev"
      >
        ‹
      </button>

      <img :src="current.url" alt="" class="lightbox__image" />

      <button
        v-if="hasNext"
        type="button"
        class="lightbox__nav lightbox__nav--next"
        aria-label="Next image"
        @click="next"
      >
        ›
      </button>

      <p v-if="images.length > 1" class="lightbox__counter">
        {{ index + 1 }} / {{ images.length }}
      </p>
    </div>
  </Teleport>
</template>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(11, 13, 12, 0.92);
  backdrop-filter: blur(4px);
}

.lightbox__image {
  max-width: min(90vw, 56rem);
  max-height: 85vh;
  object-fit: contain;
  border: 1px solid var(--border-bright);
  border-radius: var(--radius);
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
}

.lightbox__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--border-bright);
  border-radius: var(--radius);
  background: var(--bg-raised);
  color: var(--text);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}

.lightbox__close:hover {
  color: var(--green);
  border-color: var(--green-dim);
}

.lightbox__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--border-bright);
  border-radius: var(--radius);
  background: var(--bg-raised);
  color: var(--text);
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}

.lightbox__nav:hover {
  color: var(--green);
  border-color: var(--green-dim);
}

.lightbox__nav--prev {
  left: 1rem;
}

.lightbox__nav--next {
  right: 1rem;
}

.lightbox__counter {
  position: absolute;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: var(--text-dim);
}
</style>
