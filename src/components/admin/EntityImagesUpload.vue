<script setup lang="ts">
import { deleteImage, fetchImagesForParent, insertImage, type DbImage, type ImageParentTable } from '@/api/images'
import { uploadImageToR2 } from '@/composables/useR2Upload'

const props = defineProps<{
  fromTable: ImageParentTable
  fromId: string
}>()

const images = ref<DbImage[]>([])
const loading = ref(true)
const uploading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

async function loadImages() {
  loading.value = true
  error.value = null
  try {
    images.value = await fetchImagesForParent(props.fromTable, props.fromId)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load images'
  } finally {
    loading.value = false
  }
}

watch(
  () => props.fromId,
  (id) => {
    if (id) loadImages()
  },
  { immediate: true },
)

function openFilePicker() {
  if (uploading.value) return
  fileInputRef.value?.click()
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''

  if (!file) return

  uploading.value = true
  error.value = null
  success.value = null

  try {
    const prefix = `${props.fromTable}/${props.fromId}`
    const url = await uploadImageToR2(file, prefix)
    const image = await insertImage(props.fromTable, props.fromId, url)
    images.value = [...images.value, image]
    success.value = 'Image uploaded.'
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Upload failed'
  } finally {
    uploading.value = false
  }
}

async function removeImage(image: DbImage) {
  error.value = null
  success.value = null
  try {
    await deleteImage(image.id)
    images.value = images.value.filter((row) => row.id !== image.id)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to remove image'
  }
}
</script>

<template>
  <div class="entity-images">
    <p v-if="loading" class="admin-page__subtitle">Loading images...</p>

    <div v-else class="entity-images__grid">
      <div v-for="image in images" :key="image.id" class="entity-images__item">
        <img :src="image.url" alt="" />
        <button type="button" class="btn btn--sm btn--danger entity-images__remove" @click="removeImage(image)">
          ×
        </button>
      </div>

      <button
        type="button"
        class="entity-images__add btn"
        :disabled="uploading"
        @click="openFilePicker"
      >
        {{ uploading ? 'uploading...' : '+ add image' }}
      </button>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="entity-images__input"
      @change="handleFileChange"
    />

    <p v-if="success" class="admin-message admin-message--success" style="margin-top: 0.5rem">{{ success }}</p>
    <p v-if="error" class="admin-message admin-message--error" style="margin-top: 0.5rem">{{ error }}</p>
  </div>
</template>

<style scoped>
.entity-images__input {
  display: none;
}

.entity-images__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: flex-start;
}

.entity-images__item {
  position: relative;
  width: 7rem;
}

.entity-images__item img {
  display: block;
  width: 7rem;
  height: 7rem;
  object-fit: cover;
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.entity-images__remove {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  min-width: 1.5rem;
  padding: 0.15rem 0.35rem;
}

.entity-images__add {
  width: 7rem;
  height: 7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
}
</style>
