import { fetchPortfolioContent, fetchProjectBySlug } from '@/api/portfolio'
import type { PortfolioContent, Project } from '@/types/portfolio'

export function usePortfolio() {
  const { data: content, error, pending: loading } = useNuxtData<PortfolioContent>('portfolio')

  function getProjectBySlug(slug: string): Project | undefined {
    return content.value?.projects.find((p) => p.slug === slug)
  }

  async function fetchProject(slug: string): Promise<Project | null> {
    const cached = getProjectBySlug(slug)
    if (cached) return cached
    return fetchProjectBySlug(slug)
  }

  return {
    content,
    loading,
    error: computed(() => (error.value as Error | null)?.message ?? null),
    getProjectBySlug,
    fetchProject,
  }
}
