export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const auth = getAuth()
  if (!auth.initialized.value) {
    await auth.init()
  }

  if (auth.session.value) {
    return navigateTo('/admin')
  }
})
