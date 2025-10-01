const { StreamProcessor } = require('@neabyte/markdown-html')

const markdown = `# Stream Processing Example
This demonstrates **streaming** markdown to HTML conversion.

- Stream item 1
- Stream item 2

\`\`\`javascript
console.log('Streaming works!')
\`\`\`
`

// Method 1: Simple string processing
console.log('Streaming markdown to HTML...\n')
console.log('--- Method 1: Simple String Processing ---')
const processor1 = new StreamProcessor()
const html1 = processor1.processString(markdown)
console.log(html1)

// Method 2: Streaming with handlers
console.log('\n--- Method 2: Streaming with Handlers ---')
let htmlOutput = ''
const processor2 = new StreamProcessor({
  outputHandler: chunk => {
    htmlOutput += chunk
    console.log('📤 Chunk received:', chunk.length, 'characters')
  },
  errorHandler: error => {
    console.error('❌ Error:', error.message)
  }
})

// Process chunks
processor2.process('# Header\n')
processor2.process('This is **bold** text.\n')
processor2.process('And *italic* text.')
processor2.flush()

console.log('\n--- Final Streamed Output ---')
console.log(htmlOutput)
