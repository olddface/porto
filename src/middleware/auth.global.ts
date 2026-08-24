export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return
  if (to.path === '/admin/login') return
  if (import.meta.server) return

  const auth = getAuth()
  if (!auth.initialized.value) {
    await auth.init()
  }

  if (!auth.session.value) {
    return navigateTo({ path: '/admin/login', query: { redirect: to.fullPath } })
  }
})
