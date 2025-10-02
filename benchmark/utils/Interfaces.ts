/**
 * Interface for markdown library implementations
 */
export interface MarkdownLibrary {
  name: string
  version?: string
  parse: (markdown: string) => string
}

/**
 * Library benchmark result interface
 */
export interface LibraryBenchmarkResult {
  library: string
  dataset: string
  iterations: number
  times: number[]
  minTime: number
  maxTime: number
  avgTime: number
  medianTime: number
  totalTime: number
  throughput: number
  outputLength: number
  memoryUsage?: {
    before: number
    after: number
    delta: number
  }
}
