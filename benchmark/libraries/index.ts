// Export all library implementations
export { markdownHTMLLibrary } from './MarkdownHTML'
export { markedLibrary } from './Marked'
export { markdownItLibrary } from './MarkdownIt'

// Example: To add more libraries, simply:
// 1. Create a new file (e.g., CommonMark.ts)
// 2. Implement the MarkdownLibrary interface
// 3. Export it from this index file
// 4. Add it to the benchmarkConfig.libraries array in Markdown-HTML.ts
