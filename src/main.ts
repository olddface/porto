import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import TechIcon from '@/components/TechIcon.vue'
import { getAuth } from '@/composables/useAuth'
import './styles/base.css'
import './styles/admin.css'

const auth = getAuth()

router.beforeEach(async (to) => {
  if (!auth.initialized.value) {
    await auth.init()
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const guestOnly = to.matched.some((record) => record.meta.guestOnly)

  if (requiresAuth && !auth.session.value) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  }

  if (guestOnly && auth.session.value) {
    return { name: 'admin-dashboard' }
  }
})

createApp(App).component('TechIcon', TechIcon).use(router).mount('#app')
