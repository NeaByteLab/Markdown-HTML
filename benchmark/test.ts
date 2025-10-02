import MarkdownHTML from '../dist/index.cjs'
import MarkdownIt from 'markdown-it'
import { marked } from 'marked'

/**
 * Test markdown
 */
const testMarkdown = '# Hello\n\nThis is **bold** text.'
console.log('\n=== MarkdownHTML output ===')
console.log(MarkdownHTML.parse(testMarkdown))
console.log('\n=== markdown-it output ===')
const md = new MarkdownIt()
console.log(md.render(testMarkdown))
console.log('\n=== marked output ===')
console.log(marked(testMarkdown))
