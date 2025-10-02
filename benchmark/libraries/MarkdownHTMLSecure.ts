import MarkdownHTML from '../../dist/index.mjs'
import type { MarkdownLibrary } from '../utils/index'

/**
 * MarkdownHTML library with security sanitization enabled
 */
export const markdownHTMLSecureLibrary: MarkdownLibrary = {
  name: 'MarkdownHTML-Secure',
  version: '1.1.0',
  parse: (markdown: string): string => {
    return MarkdownHTML.parse(markdown, { sanitization: true })
  }
}
