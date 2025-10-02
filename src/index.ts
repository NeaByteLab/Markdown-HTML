import { StreamProcessor } from '@core/index'

/**
 * Main MarkdownHTML class with static APIs
 * @description Provides markdown to HTML conversion.
 */
export default class MarkdownHTML {
  /**
   * Parse markdown string to HTML
   * @param markdown - Markdown string to convert
   * @returns Generated HTML string
   */
  static parse(markdown: string): string {
    return new StreamProcessor().processString(markdown)
  }

  /**
   * Stream markdown with configurable chunked processing
   * Outputs HTML in configurable character chunks (min: 1k, max: 100k chars)
   * @param markdown - Markdown string to convert
   * @param options - Stream options with handlers and chunk size
   * @returns StreamProcessor instance for chaining
   */
  static stream(
    markdown: string,
    options?: {
      outputHandler?: (chunk: string) => void
      errorHandler?: (error: Error) => void
      chunkSize?: number
    }
  ): StreamProcessor {
    const processor: StreamProcessor = new StreamProcessor(options)
    processor.process(markdown)
    processor.flush(undefined, options?.chunkSize)
    return processor
  }
}
