const { SegmentExtractor, Document, Element, Generator } = require('@neabyte/markdown-html')

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

// Step 1: Extract segments
const extractor = new SegmentExtractor()
const segments = extractor.extractSegments(markdown, true)
console.log('Segments extracted:', segments.length)

// Step 2: Build document tree
const document = new Document(segments)
const ast = document.buildDocumentTree()
console.log('AST built with', ast.children?.length || 0, 'children')

// Step 3: Convert to HTML elements
const element = new Element()
const htmlTree = element.convertToHtml(ast)
console.log('HTML tree created')

// Step 4: Generate HTML string
const generator = new Generator()
const html = generator.generateString(htmlTree)
console.log('\n--- Generated HTML ---')
console.log(html)
