import {
  calculateMedian,
  datasetLoader,
  DatasetInfo,
  formatBytes,
  formatTime,
  getMemoryUsage,
  LibraryBenchmarkResult,
  MarkdownLibrary
} from './utils/index'
import { markdownHTMLLibrary } from './libraries/MarkdownHTML'
import { markdownHTMLSecureLibrary } from './libraries/MarkdownHTMLSecure'
import { markdownItLibrary } from './libraries/MarkdownIt'
import { markedLibrary } from './libraries/Marked'

/**
 * Test configuration
 */
const benchmarkConfig: BenchmarkConfig = {
  iterations: 10,
  warmupIterations: 3,
  libraries: [markdownHTMLLibrary, markdownHTMLSecureLibrary, markedLibrary, markdownItLibrary]
}

/**
 * Benchmark configuration
 */
interface BenchmarkConfig {
  iterations: number
  warmupIterations: number
  libraries: MarkdownLibrary[]
}

/**
 * Run warmup iterations to ensure consistent performance
 */
function warmup(content: string, library: MarkdownLibrary, iterations: number): void {
  for (let i = 0; i < iterations; i++) {
    library.parse(content)
  }
}

/**
 * Run benchmark for a single dataset and library
 */
function benchmarkDataset(dataset: DatasetInfo, library: MarkdownLibrary): LibraryBenchmarkResult {
  const { content, metadata } = datasetLoader.loadDataset(dataset.name)
  console.log(`\n🔄 Benchmarking ${dataset.name} dataset with ${library.name}...`)
  console.log(
    `📊 Size: ${formatBytes(metadata.fileSize)} | Lines: ${metadata.lineCount} | Characters: ${metadata.characterCount}`
  )
  console.log(`🔥 Warming up with ${benchmarkConfig.warmupIterations} iterations...`)
  warmup(content, library, benchmarkConfig.warmupIterations)
  const memoryBefore = getMemoryUsage()
  const times: number[] = []
  let outputLength = 0
  console.log(`⚡ Running ${benchmarkConfig.iterations} benchmark iterations...`)
  for (let i = 0; i < benchmarkConfig.iterations; i++) {
    const startTime = performance.now()
    const html = library.parse(content)
    const endTime = performance.now()
    const duration = endTime - startTime
    times.push(duration)
    if (!html || typeof html !== 'string') {
      throw new Error(`Invalid output from ${library.name}.parse for dataset ${dataset.name}`)
    }
    if (i === 0) {
      outputLength = html.length
    }
    process.stdout.write(
      `  Iteration ${i + 1}/${benchmarkConfig.iterations}: ${formatTime(duration)}\r`
    )
  }
  const memoryAfter = getMemoryUsage()
  const minTime = Math.min(...times)
  const maxTime = Math.max(...times)
  const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length
  const medianTime = calculateMedian(times)
  const totalTime = times.reduce((sum, time) => sum + time, 0)
  const throughput = metadata.characterCount / avgTime
  return {
    library: library.name,
    dataset: metadata.name,
    iterations: benchmarkConfig.iterations,
    times,
    minTime,
    maxTime,
    avgTime,
    medianTime,
    totalTime,
    throughput,
    outputLength,
    memoryUsage: {
      before: memoryBefore,
      after: memoryAfter,
      delta: memoryAfter - memoryBefore
    }
  }
}

/**
 * Display benchmark results in a formatted table
 */
function displayResults(results: LibraryBenchmarkResult[]): void {
  console.log('\n' + '='.repeat(90))
  console.log('📈 BENCHMARK RESULTS')
  console.log('='.repeat(90))
  console.log(
    'Library'.padEnd(12) +
      'Dataset'.padEnd(12) +
      'Min'.padEnd(10) +
      'Max'.padEnd(10) +
      'Avg'.padEnd(10) +
      'Median'.padEnd(10) +
      'Throughput'.padEnd(15) +
      'Output'.padEnd(10) +
      'Memory'.padEnd(10)
  )
  console.log('-'.repeat(90))
  for (const result of results) {
    const min = formatTime(result.minTime)
    const max = formatTime(result.maxTime)
    const avg = formatTime(result.avgTime)
    const median = formatTime(result.medianTime)
    const throughput = `${(result.throughput * 1000).toFixed(0)} chars/s`
    const output = formatBytes(result.outputLength)
    let memory = 'N/A'
    if (
      result.memoryUsage &&
      result.memoryUsage.delta !== undefined &&
      !isNaN(result.memoryUsage.delta)
    ) {
      memory = formatBytes(result.memoryUsage.delta)
    }
    console.log(
      result.library.padEnd(12) +
        result.dataset.padEnd(12) +
        min.padEnd(10) +
        max.padEnd(10) +
        avg.padEnd(10) +
        median.padEnd(10) +
        throughput.padEnd(15) +
        output.padEnd(10) +
        memory.padEnd(10)
    )
  }
  console.log('='.repeat(90))
  const totalTime = results.reduce((sum, r) => sum + r.totalTime, 0)
  const avgThroughput = results.reduce((sum, r) => sum + r.throughput, 0) / results.length
  const uniqueLibraries = [...new Set(results.map(r => r.library))]
  const uniqueDatasets = [...new Set(results.map(r => r.dataset))]
  console.log(`\n📊 SUMMARY:`)
  console.log(`   Libraries tested: ${uniqueLibraries.join(', ')}`)
  console.log(`   Datasets processed: ${uniqueDatasets.length}`)
  console.log(`   Total benchmark runs: ${results.length}`)
  console.log(`   Total benchmark time: ${formatTime(totalTime)}`)
  console.log(`   Average throughput: ${(avgThroughput * 1000).toFixed(0)} characters/second`)
}

/**
 * Run comprehensive benchmark across all datasets and libraries
 */
function runBenchmark(): void {
  console.log('🚀 Starting Markdown Library Benchmark')
  console.log(
    `⚙️  Configuration: ${benchmarkConfig.iterations} iterations, ${benchmarkConfig.warmupIterations} warmup`
  )
  console.log(`📚 Libraries: ${benchmarkConfig.libraries.map(l => l.name).join(', ')}`)
  try {
    const availableDatasets = datasetLoader.getAvailableDatasets()
    if (availableDatasets.length === 0) {
      throw new Error('No datasets found in benchmark/dataset directory')
    }
    console.log(
      `📁 Found ${availableDatasets.length} datasets: ${availableDatasets.map(d => d.name).join(', ')}`
    )
    const results: LibraryBenchmarkResult[] = []
    for (const library of benchmarkConfig.libraries) {
      for (const dataset of availableDatasets) {
        const result = benchmarkDataset(dataset, library)
        results.push(result)
      }
    }
    displayResults(results)
    console.log('\n✅ Benchmark completed successfully!')
  } catch (error) {
    console.error('\n❌ Benchmark failed:', error.message)
    process.exit(1)
  }
}

/**
 * Run the benchmark
 */
runBenchmark()
