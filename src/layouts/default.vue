<script setup lang="ts">
import { fetchPortfolioContent } from '@/api/portfolio'

const { data: content, error, pending: loading } = await useAsyncData('portfolio', () =>
  fetchPortfolioContent(),
)
</script>

<template>
  <a href="#main" class="skip-link">Skip to contents</a>

  <div v-if="loading" class="state-screen">
    <div class="container">
      <p class="state-screen__prompt prompt">
        <span class="prompt-user">guest</span><span class="prompt-symbol">@</span><span class="prompt-path">portfolio</span><span class="prompt-symbol">:~$</span>
        loading portfolio data<span class="cursor-blink" />
      </p>
    </div>
  </div>

  <div v-else-if="error" class="state-screen">
    <div class="container">
      <p class="state-screen__prompt prompt">
        <span class="prompt-user">guest</span><span class="prompt-symbol">@</span><span class="prompt-path">portfolio</span><span class="prompt-symbol">:~$</span>
        fetch content
      </p>
      <p class="state-screen__error">error: {{ error.message }}</p>
      <p class="state-screen__hint">
        Check <code>NUXT_PUBLIC_SUPABASE_URL</code> and
        <code>NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> are set, then run <code>supabase/schema.sql</code> in the SQL Editor.
      </p>
    </div>
  </div>

  <template v-else-if="content">
    <SiteNav />
    <main id="main">
      <slot />
    </main>
    <SiteFooter />
  </template>
</template>

<style scoped>
.state-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-block: 4rem;
}

.state-screen__prompt {
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

.state-screen__error {
  color: var(--red);
  font-size: 1rem;
  margin-bottom: 1rem;
}

.state-screen__hint {
  color: var(--text-dim);
  font-size: 0.8rem;
  line-height: 1.7;
  max-width: 36rem;
}

.state-screen__hint code {
  color: var(--amber);
  font-size: 0.75rem;
}
</style>
