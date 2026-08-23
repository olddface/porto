<script setup lang="ts">
import { usePortfolio } from '@/composables/usePortfolio'

const { content } = usePortfolio()
</script>

<template>
  <section id="contact" class="section">
    <div class="container">
      <h2 class="section-label">contact</h2>
      <div class="contact">
        <p class="contact__prompt prompt">
          <span class="prompt-user">guest</span><span class="prompt-symbol">@</span><span class="prompt-path">portfolio</span><span class="prompt-symbol">:~$</span>
          echo "Let's build something."
        </p>
        <p class="contact__msg">Let's build something.</p>
        <p class="contact__sub">
          Open to full-time roles and interesting contract work. Drop a line — I actually read my inbox.
        </p>
        <a :href="`mailto:${content!.email}`" class="btn btn--filled contact__email">
          $ mail {{ content!.email }}
        </a>
        <div class="contact__socials">
          <a
            v-for="social in content!.socials"
            :key="social.label"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            class="contact__social"
          >
            {{ social.label }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  max-width: 36rem;
}

.contact__prompt {
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
}

.contact__msg {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  color: var(--green);
  margin-bottom: 0.75rem;
}

.contact__sub {
  color: var(--text-dim);
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

.contact__email {
  margin-bottom: 1.5rem;
}

.contact__socials {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.contact__social {
  font-size: 0.8rem;
  color: var(--text-dim);
  border-bottom: 1px solid var(--border-bright);
  padding-bottom: 0.1rem;
}

.contact__social:hover {
  color: var(--green);
  border-color: var(--green-dim);
}
</style>
