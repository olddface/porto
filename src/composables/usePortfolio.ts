import { inject, provide, ref, type InjectionKey, type Ref } from 'vue'
import { fetchPortfolioContent, fetchProjectBySlug } from '@/api/portfolio'
import type { PortfolioContent, Project } from '@/types/portfolio'

export interface PortfolioState {
  content: Ref<PortfolioContent | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  getProjectBySlug: (slug: string) => Project | undefined
  fetchProject: (slug: string) => Promise<Project | null>
}

export const portfolioKey: InjectionKey<PortfolioState> = Symbol('portfolio')

export function providePortfolio() {
  const content = ref<PortfolioContent | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  function getProjectBySlug(slug: string): Project | undefined {
    return content.value?.projects.find((p) => p.slug === slug)
  }

  async function fetchProject(slug: string): Promise<Project | null> {
    const cached = getProjectBySlug(slug)
    if (cached) return cached
    return fetchProjectBySlug(slug)
  }

  async function load() {
    loading.value = true
    error.value = null

    try {
      content.value = await fetchPortfolioContent()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load portfolio content'
    } finally {
      loading.value = false
    }
  }

  const state: PortfolioState = {
    content,
    loading,
    error,
    getProjectBySlug,
    fetchProject,
  }

  provide(portfolioKey, state)
  load()

  return state
}

export function usePortfolio(): PortfolioState {
  const state = inject(portfolioKey)
  if (!state) {
    throw new Error('usePortfolio() must be used within a component that calls providePortfolio()')
  }
  return state
}
