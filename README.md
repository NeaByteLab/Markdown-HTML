# 📝 Markdown HTML

Converts Markdown text to HTML syntax with TypeScript type safety, streaming support for large documents.

## 🎬 Preview

![Preview](./assets/preview.gif)

> *Live demo showing LLM-style streaming markdown to HTML conversion with real-time rendering*

## 🚀 Quick Start

```typescript
import MarkdownHTML from '@neabyte/markdown-html'

// Simple static API
const html = MarkdownHTML.parse('# Hello **World**')
console.log(html) // <div class="markdown-content"><h1>Hello <strong>World</strong></h1></div>

// Streaming API with configurable chunk size
MarkdownHTML.stream(markdown, {
  chunkSize: 1000, // 1k-1M characters per chunk
  outputHandler: (chunk) => console.log(chunk),
  errorHandler: (error) => console.error(error)
})
```

## 📦 Installation

### NPM
```bash
npm install @neabyte/markdown-html
```

### CDN (Browser)
```html
<!-- ES Modules (Recommended) -->
<script type="module">
  import MarkdownHTML from 'https://cdn.jsdelivr.net/npm/@neabyte/markdown-html/+esm'
  // or
  import MarkdownHTML from 'https://esm.sh/@neabyte/markdown-html'
  // or
  import MarkdownHTML from 'https://esm.run/@neabyte/markdown-html'

  // Simple static API
  const html = MarkdownHTML.parse('# Hello World')

  // Streaming API with configurable chunk size
  MarkdownHTML.stream(markdown, {
    chunkSize: 1000, // 1k-1M characters per chunk
    outputHandler: (chunk) => document.body.innerHTML += chunk
  })
</script>
```

## 📚 Examples

### 🌐 Browser Example
**Live interactive demo with real-time markdown editing:**
- [Browser Demo](./examples/browser/index.html) - Interactive markdown editor with live HTML preview

### 📦 Node.js Examples

**CommonJS (Traditional Node.js):**
- [CJS Non-Streaming](./examples/cjs/non-stream.js) - Basic usage example
- [CJS Streaming](./examples/cjs/stream.js) - Streaming with handlers

**ES Modules (Modern Node.js):**
- [ESM Non-Streaming](./examples/esm/non-stream.js) - Basic usage example
- [ESM Streaming](./examples/esm/stream.js) - Streaming with handlers

### ⚙️ Configurable Chunk Sizes

**Streaming with different chunk sizes for optimal performance:**

```typescript
// Real-time chat (1k chunks)
MarkdownHTML.stream(markdown, {
  chunkSize: 1000,
  outputHandler: (chunk) => updateChat(chunk)
})

// Progressive loading (10k chunks)
MarkdownHTML.stream(markdown, {
  chunkSize: 10000,
  outputHandler: (chunk) => updateUI(chunk)
})

// Batch processing (1M chunks - fastest)
MarkdownHTML.stream(markdown, {
  chunkSize: 1000000,
  outputHandler: (chunk) => processBatch(chunk)
})
```

**Chunk Size Guidelines:**
- **1k-10k**: Real-time applications, chat interfaces
- **10k-100k**: Progressive loading, medium documents
- **100k-1M**: Large documents, batch processing (fastest performance)

---

## ⚡ Performance

### 📊 Memory Usage Benchmarks

Performance testing with various document sizes shows memory usage patterns:

**Test Environment:**
- **Hardware:** MacBook Pro with Apple M3 Pro chip, 18GB RAM
- **Runtime:** Node.js v22.16.0 on macOS (darwin arm64)
- **Method:** `process.memoryUsage()` with garbage collection enabled

| Document Size | Input Size | HTML Output | Processing Time | Speed |
|---------------|------------|-------------|----------------|-------|
| Small         | 18.95 KB   | 19.91 KB    | **0.41ms**     | **46k chars/ms** |
| Medium        | 94.02 KB   | 95.81 KB    | **0.40ms**     | **235k chars/ms** |
| Large         | 188.57 KB  | 191.37 KB   | **0.52ms**     | **363k chars/ms** |
| Extra Large   | 382.81 KB  | 387.68 KB   | **0.62ms**     | **617k chars/ms** |
| Massive       | 8.39 MB    | 8.48 MB     | **7.36ms**     | **1.14M chars/ms** |

## 🏗️ Architecture

For detailed information about the internal architecture, processor system, and design decisions:

- [Architecture Documentation](./ARCHITECTURE.md) - Complete technical overview

---

## 📄 License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.