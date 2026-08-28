<script setup lang="ts">
import { updateProject } from '@/api/admin'
import { deleteImagesFromR2, uploadImageToR2 } from '@/composables/useR2Upload'

const imageUrl = defineModel<string>({ default: '' })

const props = defineProps<{
  uploadPrefix: string
  projectId?: string
}>()

const emit = defineEmits<{
  uploaded: [url: string]
}>()

const uploading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)
const previewBroken = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

function openFilePicker() {
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
  previewBroken.value = false

  const previousUrl = imageUrl.value

  try {
    const url = await uploadImageToR2(file, props.uploadPrefix)

    if (previousUrl && previousUrl !== url) {
      await deleteImagesFromR2([previousUrl])
    }

    imageUrl.value = url
    emit('uploaded', url)

    if (props.projectId) {
      await updateProject(props.projectId, { image_url: url })
      success.value = 'Uploaded to R2 and saved to project.'
    } else {
      success.value = 'Uploaded to R2. Save the project to store the URL in Supabase.'
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Upload failed'
    imageUrl.value = ''
  } finally {
    uploading.value = false
  }
}

async function removeImage() {
  const urlToDelete = imageUrl.value
  if (!urlToDelete || uploading.value) return

  uploading.value = true
  error.value = null
  success.value = null

  try {
    await deleteImagesFromR2([urlToDelete])

    if (props.projectId) {
      await updateProject(props.projectId, { image_url: null })
    }

    imageUrl.value = ''
    previewBroken.value = false
    success.value = props.projectId
      ? 'Thumbnail removed from R2 and project.'
      : 'Thumbnail removed from R2.'
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to remove image'
  } finally {
    uploading.value = false
  }
}

function onPreviewError() {
  previewBroken.value = true
}
</script>

<template>
  <div class="project-image-upload">
    <div v-if="imageUrl" class="project-image-upload__preview">
      <img :src="imageUrl" alt="Project image preview" @error="onPreviewError" />
      <p v-if="previewBroken" class="admin-message admin-message--error" style="margin-top: 0.5rem">
        Preview failed — check R2 public access and public_base_url in Settings.
      </p>
      <p class="admin-page__subtitle project-image-upload__url">{{ imageUrl }}</p>
      <div class="project-image-upload__actions">
        <button type="button" class="btn btn--sm" :disabled="uploading" @click="openFilePicker">
          {{ uploading ? 'uploading...' : 'replace' }}
        </button>
        <button type="button" class="btn btn--sm btn--danger" :disabled="uploading" @click="removeImage">
          remove
        </button>
      </div>
    </div>

    <div v-else class="project-image-upload__empty">
      <button type="button" class="btn" :disabled="uploading" @click="openFilePicker">
        {{ uploading ? 'uploading...' : '$ upload image' }}
      </button>
      <p class="admin-page__subtitle" style="margin-top: 0.5rem">
        Image file goes to Cloudflare R2. Only the URL is stored in Supabase.
      </p>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="project-image-upload__input"
      @change="handleFileChange"
    />

    <p v-if="success" class="admin-message admin-message--success">{{ success }}</p>
    <p v-if="error" class="admin-message admin-message--error">{{ error }}</p>
  </div>
</template>

<style scoped>
.project-image-upload__input {
  display: none;
}

.project-image-upload__preview img {
  display: block;
  max-width: 100%;
  max-height: 16rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  object-fit: cover;
}

.project-image-upload__url {
  margin-top: 0.5rem;
  font-size: 0.65rem;
  word-break: break-all;
}

.project-image-upload__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.project-image-upload__empty {
  padding: 1rem;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  text-align: center;
}
</style>
