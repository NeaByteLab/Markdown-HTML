# 📦 ESM Example Setup

Simple ESM setup for using `@neabyte/markdown-html` module.

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

- `package.json` - ESM package configuration
- `non-stream.js` - Basic usage example
- `stream.js` - Streaming example
- `README.md` - This file

## 🔧 Configuration

The `package.json` includes:
- ✅ `"type": "module"` - Enables ESM
- ✅ Local dependency - `"@neabyte/markdown-html": "file:../"`
- ✅ Node.js 22+ requirement
- ✅ Test scripts for both examples

## 📝 Usage Examples

### Basic Usage
```javascript
import MarkdownHTML from '@neabyte/markdown-html'

const markdown = `# Hello World`
const html = MarkdownHTML.parse(markdown)
console.log(html)
```

### Streaming Usage
```javascript
import MarkdownHTML from '@neabyte/markdown-html'

// Method 1: Simple string processing (same as parse)
const html = MarkdownHTML.parse(markdown)

// Method 2: Streaming with handlers and chunking
MarkdownHTML.stream(markdown, {
  outputHandler: (chunk) => console.log('Output:', chunk),
  errorHandler: (error) => console.error('Error:', error),
  chunkSize: 1000 // Process in 1KB chunks
})
```
