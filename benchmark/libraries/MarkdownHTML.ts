import MarkdownHTML from '../../dist/index.mjs'
import { MarkdownLibrary } from '../utils/index'

/**
 * MarkdownHTML library implementation
 */
export const markdownHTMLLibrary: MarkdownLibrary = {
  name: 'MarkdownHTML',
  version: '1.1.0',
  parse: (markdown: string): string => {
    return MarkdownHTML.parse(markdown)
  }
}
