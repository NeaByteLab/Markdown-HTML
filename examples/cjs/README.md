# 📦 CommonJS Example Setup

Simple CommonJS setup for using `@neabyte/markdown-html` module.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run non-streaming example
npm run test:non-stream

# Run streaming example
npm run test:stream
```

## 📁 Files

- `package.json` - CommonJS package configuration
- `non-stream.js` - Basic usage example
- `stream.js` - Streaming example
- `README.md` - This file

## 🔧 Configuration

The `package.json` includes:
- ✅ CommonJS module system (default)
- ✅ Local dependency - `"@neabyte/markdown-html": "file:../../"`
- ✅ Node.js 22+ requirement
- ✅ Test scripts for both examples

## 📝 Usage Examples

### Basic Usage
```javascript
const { SegmentExtractor, Document, Element, Generator } = require('@neabyte/markdown-html')

const markdown = `# Hello World`
const segments = new SegmentExtractor().extractSegments(markdown, true)
const ast = new Document(segments).buildDocumentTree()
const htmlTree = new Element().convertToHtml(ast)
const html = new Generator().generateString(htmlTree)
```

### Streaming Usage
```javascript
const { StreamProcessor } = require('@neabyte/markdown-html')

// Method 1: Simple string processing
const processor = new StreamProcessor()
const html = processor.processString(markdown)

// Method 2: Streaming with handlers
const streamProcessor = new StreamProcessor({
  outputHandler: (chunk) => console.log('Output:', chunk),
  errorHandler: (error) => console.error('Error:', error)
})

streamProcessor.process('# Header\n')
streamProcessor.process('**Bold** text')
streamProcessor.flush()
```
