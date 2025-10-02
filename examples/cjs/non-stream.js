const MarkdownHTML = require('@neabyte/markdown-html')

const markdown = `# Hello World
This is **bold** and *italic* text.

- List item 1
- List item 2

\`\`\`typescript
function hello() {
  console.log('Hello World')
}
\`\`\`
`
console.log('Converting markdown to HTML...\n')

// Simple one-step conversion using the new API
const html = MarkdownHTML.parse(markdown)
console.log('\n--- Generated HTML ---')
console.log(html)
