<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import EasyMDE from 'easymde'
import 'easymde/dist/easymde.min.css'
import { uploadImageToR2 } from '@/composables/useR2Upload'

const model = defineModel<string>({ default: '' })

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadError = ref<string | null>(null)
let editor: EasyMDE | null = null

function openImagePicker() {
  if (uploading.value) return
  fileInputRef.value?.click()
}

async function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''

  if (!file || !editor) return

  uploading.value = true
  uploadError.value = null

  try {
    const url = await uploadImageToR2(file, 'markdown')
    const cm = editor.codemirror
    const markdown = `![](${url})`
    cm.replaceSelection(markdown)
    model.value = editor.value()
  } catch (e) {
    uploadError.value = e instanceof Error ? e.message : 'Image upload failed'
  } finally {
    uploading.value = false
  }
}

onMounted(() => {
  if (!textareaRef.value) return

  editor = new EasyMDE({
    element: textareaRef.value,
    initialValue: model.value,
    spellChecker: false,
    status: ['lines', 'words'],
    minHeight: '200px',
    toolbar: [
      'bold',
      'italic',
      'heading',
      '|',
      'quote',
      'unordered-list',
      'ordered-list',
      '|',
      'link',
      {
        name: 'upload-image',
        action: openImagePicker,
        className: 'fa fa-picture-o',
        title: uploading.value ? 'Uploading...' : 'Upload image',
      },
      'code',
      'horizontal-rule',
      '|',
      'preview',
      'side-by-side',
      'fullscreen',
    ],
  })

  editor.codemirror.on('change', () => {
    model.value = editor?.value() ?? ''
  })
})

watch(model, (value) => {
  if (editor && editor.value() !== value) {
    editor.value(value)
  }
})

onUnmounted(() => {
  editor?.toTextArea()
  editor?.cleanup()
  editor = null
})
</script>

<template>
  <div class="markdown-editor">
    <textarea ref="textareaRef" />
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="markdown-editor__file-input"
      @change="handleImageUpload"
    />
    <p v-if="uploading" class="admin-page__subtitle" style="margin-top: 0.5rem">Uploading image...</p>
    <p v-if="uploadError" class="admin-message admin-message--error" style="margin-top: 0.5rem">
      {{ uploadError }}
    </p>
  </div>
</template>

<style scoped>
.markdown-editor__file-input {
  display: none;
}
</style>
