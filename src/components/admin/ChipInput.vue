<script setup lang="ts">
import { ref } from 'vue'

const items = defineModel<string[]>({ default: () => [] })
const input = ref('')

function addItem() {
  const value = input.value.trim()
  if (!value) return
  items.value = [...items.value, value]
  input.value = ''
}

function removeItem(index: number) {
  items.value = items.value.filter((_, i) => i !== index)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    addItem()
  }
}
</script>

<template>
  <div class="admin-chip-input">
    <span v-for="(item, i) in items" :key="`${item}-${i}`" class="admin-chip">
      {{ item }}
      <button type="button" aria-label="Remove" @click="removeItem(i)">×</button>
    </span>
    <input
      v-model="input"
      type="text"
      placeholder="Type and press Enter"
      @keydown="onKeydown"
    />
  </div>
</template>
