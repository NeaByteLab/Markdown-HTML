# ⚡ Performance Benchmarks

Performance analysis of MarkdownHTML compared to popular markdown libraries.

## 🚀 Running Benchmarks

To run the benchmark tests yourself:

### Prerequisites
- Node.js v22.0.0+ installed
- Dependencies installed: `npm install`

### Run Benchmark
```bash
npx tsx benchmark/index.ts
```

### What Gets Tested
- **4 libraries**: MarkdownHTML, MarkdownHTML-Secure, marked, markdown-it
- **5 datasets**: small (20.8KB), medium (95.5KB), large (191.1KB), extraLarge (384.8KB), massive (8.6MB)
- **Methodology**: 10 iterations per test with 3 warmup runs
- **Output**: Real-time progress and detailed performance metrics

### Expected Runtime
- **Total time**: ~12-15 seconds
- **Per library**: ~3-4 seconds
- **Per dataset**: ~30-60 seconds

### ⚠️ Benchmark Fairness Note

**This benchmark may not be entirely fair when comparing based on features supported:**

- **MarkdownHTML**: Custom implementation with specific feature set
- **markdown-it**: Extensive plugin ecosystem and CommonMark compliance
- **marked**: 100% CommonMark support

---

## 📊 Benchmark Results

**Performance testing with various document sizes:**

**Test Environment:**
- **Hardware:** MacBook Pro with Apple M3 Pro chip, 18GB RAM
- **Runtime:** Node.js v22.16.0 on macOS (darwin arm64)
- **Method:** 10 iterations with 3 warmup runs, sanitization disabled

| Dataset | Processing Time | Throughput | Output Size |
|---------|----------------|------------|------------|
| **Small** | **909μs** | **23.4M chars/s** | 22.14 KB |
| **Medium** | **308μs** | **316M chars/s** | 95.68 KB |
| **Large** | **4.29ms** | **45.6M chars/s** | 185.36 KB |
| **Extra Large** | **8.30ms** | **47.5M chars/s** | 372.85 KB |
| **Massive** | **201.95ms** | **43.6M chars/s** | 8.13 MB |

## 🚀 Key Highlights

- **Fast Processing**: Sub-millisecond for small-medium documents
- **Consistent Performance**: Reliable across all dataset sizes
- **High Throughput**: Up to **316M characters/second**

## 📈 Comparison with Other Libraries

### Performance vs Popular Libraries

| Library | Small Dataset | Medium Dataset | Large Dataset | Massive Dataset |
|---------|---------------|----------------|---------------|-----------------|
| **MarkdownHTML** | **909μs** | **308μs** | **4.29ms** | **201.95ms** |
| **MarkdownHTML-Secure** | **744μs** | **1.77ms** | **7.30ms** | **357.11ms** |
| **marked** | 1.74ms | 3.65ms | 5.86ms | 305.10ms |
| **markdown-it** | 1.77ms | 3.34ms | 5.19ms | 276.22ms |

### Throughput Comparison

| Library | Small | Medium | Large | Massive |
|---------|-------|--------|-------|---------|
| **MarkdownHTML** | **23.4M** | **316M** | **45.6M** | **43.6M** |
| **MarkdownHTML-Secure** | **28.5M** | **55.3M** | **26.8M** | **24.6M** |
| **marked** | 12.2M | 26.8M | 33.4M | 28.9M |
| **markdown-it** | 12.0M | 29.3M | 37.7M | 31.9M |

---

## 🔬 Testing Methodology

### Benchmark Configuration
- **Iterations**: 10 runs per test
- **Warmup**: 3 iterations to eliminate JIT compilation bias
- **Environment**: Isolated Node.js process
- **Memory tracking**: Monitored memory usage per test

### Dataset Sizes
- **Small**: 20.8KB (752 lines, 21,253 characters)
- **Medium**: 95.5KB (2,318 lines, 97,742 characters)
- **Large**: 191.1KB (5,180 lines, 195,643 characters)
- **Extra Large**: 384.8KB (10,332 lines, 394,000 characters)
- **Massive**: 8.6MB (226,394 lines, 8,802,210 characters)

### Test Content
Each dataset contains realistic markdown content:
- Headers of various levels
- Text formatting (bold, italic, strikethrough)
- Lists (ordered and unordered)
- Code blocks in multiple languages
- Tables with data
- Links and images
- Blockquotes with nested content
- Task lists with checkboxes

---

## 📋 Capabilities Reference

**Performance comparisons should be considered in context of supported features:**

- **MarkdownHTML**: Core CommonMark features + streaming + security
- **marked**: 100% CommonMark specification compliance
- **markdown-it**: CommonMark + extensive plugin ecosystem

**See [Capabilities Documentation](./CAPABILITIES.md) for detailed feature comparison.**

**Speed advantages may reflect different feature completeness levels.**

---

*Benchmark data collected on 2025-10-02 using Node.js v22.16.0 on macOS with Apple M3 Pro chip.*
