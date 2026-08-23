<script setup lang="ts">
import { provideAuth } from '@/composables/useAuth'

provideAuth()
</script>

<template>
  <RouterView />
</template>
