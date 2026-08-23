<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import EasyMDE from 'easymde'
import 'easymde/dist/easymde.min.css'

const model = defineModel<string>({ default: '' })

const textareaRef = ref<HTMLTextAreaElement | null>(null)
let editor: EasyMDE | null = null

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
  </div>
</template>
