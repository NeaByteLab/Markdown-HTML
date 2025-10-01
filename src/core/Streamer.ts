import type { ElementHTML, ParserNode, SegmentText } from '@interfaces/index'
import { Document, Element, Generator, SegmentExtractor } from '@core/index'

/**
 * Universal stream processor that converts markdown text to HTML.
 * @description Works in both browser and Node.js environments.
 */
export class StreamProcessor {
  /** Element transformer for converting AST to HTML */
  private readonly transformer: Element
  /** HTML generator for creating final output */
  private readonly renderer: Generator
  /** Internal buffer for accumulating input chunks */
  private buffer: string
  /** Tokenizer for extracting markdown segments */
  private tokenizer: SegmentExtractor
  /** Document parser for building AST */
  private parser: Document
  /** Output handler for processed chunks */
  private outputHandler: ((chunk: string) => void) | undefined
  /** Error handler for processing errors */
  private errorHandler: ((error: Error) => void) | undefined

  /**
   * Creates a new stream processor instance.
   * @param options - Stream configuration options
   */
  constructor(options?: {
    outputHandler?: (chunk: string) => void
    errorHandler?: (error: Error) => void
  }) {
    this.buffer = ''
    this.tokenizer = new SegmentExtractor()
    this.parser = new Document([])
    this.transformer = new Element()
    this.renderer = new Generator()
    this.outputHandler = options?.outputHandler ?? undefined
    this.errorHandler = options?.errorHandler ?? undefined
  }

  /**
   * Processes incoming data chunks and accumulates them in buffer.
   * @param chunk - Data chunk to process (string or Uint8Array)
   * @param callback - Optional callback to signal completion or error
   */
  process(chunk: string | Uint8Array, callback?: (error?: Error) => void): void {
    try {
      const stringChunk: string = this.convertToString(chunk)
      this.buffer += stringChunk
      callback?.()
    } catch (error) {
      const err: Error = error instanceof Error ? error : new Error(String(error))
      this.errorHandler?.(err)
      callback?.(err)
    }
  }

  /**
   * Flushes remaining buffer content and generates final HTML output.
   * @param callback - Optional callback to signal completion or error
   */
  flush(callback?: (error?: Error) => void): void {
    try {
      if (this.buffer.length > 0) {
        const tokens: SegmentText[] = this.tokenizer.extractSegments(this.buffer, true)
        if (tokens.length > 0) {
          const ast: ParserNode = this.parser.buildDocumentTree(tokens)
          const renderTree: ElementHTML = this.transformer.convertToHtml(ast)
          const html: string = this.renderer.generateString(renderTree)
          if (html.length > 0) {
            this.outputHandler?.(html)
          }
        }
        this.buffer = ''
      }
      callback?.()
    } catch (error) {
      const err: Error = error instanceof Error ? error : new Error(String(error))
      this.errorHandler?.(err)
      callback?.(err)
    }
  }

  /**
   * Processes a complete markdown string and returns HTML.
   * @param markdown - Complete markdown string to process
   * @returns Generated HTML string
   */
  processString(markdown: string): string {
    try {
      const tokens: SegmentText[] = this.tokenizer.extractSegments(markdown, true)
      if (tokens.length === 0) {
        return ''
      }
      const ast: ParserNode = this.parser.buildDocumentTree(tokens)
      const renderTree: ElementHTML = this.transformer.convertToHtml(ast)
      return this.renderer.generateString(renderTree)
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error))
    }
  }

  /**
   * Resets the processor state for reuse.
   */
  reset(): void {
    this.buffer = ''
    this.tokenizer = new SegmentExtractor()
    this.parser = new Document([])
  }

  /**
   * Converts various input types to string.
   * @param input - Input to convert
   * @returns String representation
   */
  private convertToString(input: string | Uint8Array): string {
    if (typeof input === 'string') {
      return input
    }
    if (input instanceof Uint8Array) {
      return new TextDecoder().decode(input)
    }
    return String(input)
  }

  /**
   * Sets the output handler for processed chunks.
   * @param handler - Function to handle output chunks
   */
  setOutputHandler(handler: (chunk: string) => void): void {
    this.outputHandler = handler
  }

  /**
   * Sets the error handler for processing errors.
   * @param handler - Function to handle errors
   */
  setErrorHandler(handler: (error: Error) => void): void {
    this.errorHandler = handler
  }
}
