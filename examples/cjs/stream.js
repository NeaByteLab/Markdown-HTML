const MarkdownHTML = require('@neabyte/markdown-html')

const markdown = `# Stream Processing Example
This demonstrates **streaming** markdown to HTML conversion.

- Stream item 1
- Stream item 2

\`\`\`javascript
console.log('Streaming works!')
\`\`\`
`

console.log('Streaming markdown to HTML...\n')

// Method 1: Simple string processing (same as parse)
console.log('--- Method 1: Simple String Processing ---')
const html1 = MarkdownHTML.parse(markdown)
console.log(html1)

// Method 2: Streaming with handlers and chunking
console.log('\n--- Method 2: Streaming with Handlers ---')
let htmlOutput = ''
MarkdownHTML.stream(markdown, {
  outputHandler: chunk => {
    htmlOutput += chunk
    console.log('📤 Chunk received:', chunk.length, 'characters')
  },
  errorHandler: error => {
    console.error('❌ Error:', error.message)
  },
  chunkSize: 1000 // Process in 1KB chunks
})

console.log('\n--- Final Streamed Output ---')
console.log(htmlOutput)
