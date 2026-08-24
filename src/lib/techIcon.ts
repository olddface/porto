import iconNames from './tech-icons.json'

const KNOWN_TECH_ICONS = new Set<string>(iconNames)

/**
 * Normalize a tech label to its icon filename (no extension).
 * "Vue 3" -> "vue3", "Node.js" -> "nodejs", "HTML/CSS" -> "htmlcss"
 */
export function normalizeTechName(tech: string): string {
  return tech.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/** Public URL for a tech SVG, whether or not the file exists. */
export function getTechIconPath(tech: string): string {
  return `/icon/${normalizeTechName(tech)}.svg`
}

/** Resolved icon URL, or null when no SVG was downloaded for this tech. */
export function getTechIcon(tech: string): string | null {
  const key = normalizeTechName(tech)
  return KNOWN_TECH_ICONS.has(key) ? `/icon/${key}.svg` : null
}

export function hasTechIcon(tech: string): boolean {
  return KNOWN_TECH_ICONS.has(normalizeTechName(tech))
}

export function listTechIcons(): readonly string[] {
  return iconNames
}
