import { marked } from 'marked'
import { MarkdownLibrary } from '../utils/index'

/**
 * Real implementation for marked.js library
 */
export const markedLibrary: MarkdownLibrary = {
  name: 'marked',
  version: '16.3.0',
  parse: (markdown: string): string => {
    const result = marked(markdown)
    if (typeof result === 'string') {
      return result
    }
    throw new Error('marked returned a Promise - this version requires async parsing')
  }
}
