import { marked } from 'marked'
import xss from 'xss'

marked.setOptions({
  gfm: true,
  breaks: true,
})

export function renderMarkdown(markdown: string): string {
  const html = marked.parse(markdown) as string
  return xss(html)
}
