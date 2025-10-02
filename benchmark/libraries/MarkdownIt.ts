import MarkdownIt from 'markdown-it'
import { MarkdownLibrary } from '../utils/index'

/**
 * Initialize markdown-it instance
 */
const md = new MarkdownIt()

/**
 * Real implementation for markdown-it library
 */
export const markdownItLibrary: MarkdownLibrary = {
  name: 'markdown-it',
  version: '14.1.0',
  parse: (markdown: string): string => {
    return md.render(markdown)
  }
}
