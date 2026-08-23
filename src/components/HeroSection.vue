<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePortfolio } from '@/composables/usePortfolio'

const { content } = usePortfolio()

const typedText = ref('')
const command = 'whoami'
const done = ref(false)

onMounted(() => {
  let i = 0
  const interval = setInterval(() => {
    if (i < command.length) {
      typedText.value += command[i]
      i++
    } else {
      done.value = true
      clearInterval(interval)
    }
  }, 80)
})
</script>

<template>
  <section class="hero">
    <div class="container">
      <p class="hero__prompt prompt">
        <span class="prompt-user">guest</span><span class="prompt-symbol">@</span><span class="prompt-path">portfolio</span><span class="prompt-symbol">:~$</span>
        <span class="hero__cmd"> {{ typedText }}<span v-if="!done" class="cursor-blink" /><span v-else class="hero__cursor">▋</span></span>
      </p>

      <h1 class="hero__name">{{ content!.name }}</h1>
      <p class="hero__title">
        <span class="tag">{{ content!.title }}</span>
        <span class="hero__sep">·</span>
        <span>{{ content!.yearsExperience }}</span>
        <span class="hero__sep">·</span>
        <span>{{ content!.location }}</span>
      </p>
      <p class="hero__tagline">{{ content!.tagline }}</p>

      <div class="hero__actions">
        <a :href="content!.resume" class="btn btn--filled">$ cat resume.pdf</a>
        <a href="#contact" class="btn">$ ./contact.sh</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-block: 6rem 4rem;
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.hero__prompt {
  font-size: 0.8rem;
  margin-bottom: 1.5rem;
}

.hero__cmd {
  color: var(--text);
}

.hero__cursor {
  color: var(--green);
  animation: blink 1s step-end infinite;
}

.hero__name {
  font-size: clamp(2rem, 6vw, 3.25rem);
  font-weight: 700;
  color: var(--green);
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin-bottom: 0.75rem;
}

.hero__title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-dim);
  font-size: 0.8rem;
  margin-bottom: 1.25rem;
}

.hero__sep {
  color: var(--border-bright);
}

.hero__tagline {
  max-width: 36rem;
  color: var(--text);
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

@media (max-width: 640px) {
  .hero {
    padding-block: 4rem 3rem;
    min-height: auto;
  }
}
</style>
