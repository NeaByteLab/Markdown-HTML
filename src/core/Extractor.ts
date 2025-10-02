import {
  tokenType,
  type ProcessingContext,
  type ProcessingResult,
  type SegmentProcessor,
  type SegmentText
} from '@interfaces/index'
import {
  BlockquoteProcessor,
  CodeBlockProcessor,
  EscapedCharProcessor,
  EmphasisProcessor,
  HeaderProcessor,
  HorizontalRuleProcessor,
  ImagesProcessor,
  InlineCodeProcessor,
  LinksProcessor,
  ListsProcessor,
  StrikethroughProcessor,
  TextProcessor
} from '@processors/index'

/**
 * Main orchestrator for extracting markdown segments.
 * @description Delegates to specialized processors based on character type.
 */
export class SegmentExtractor {
  /** Array of registered processors */
  private processors: SegmentProcessor[] = []
  /** Whether processors have been initialized */
  private processorsReady: boolean = false
  /** Content pending processing */
  private pendingContent: string = ''
  /** Current processing buffer */
  private buffer: string = ''
  /** Current position in buffer */
  private position: number = 0
  /** Whether to enable URL sanitization */
  private readonly sanitizationEnabled: boolean

  /**
   * Creates a new SegmentExtractor instance.
   * @param sanitization - Whether to enable URL sanitization (default: false)
   * @description Processors are lazy-loaded on first use.
   */
  constructor(sanitization: boolean = false) {
    this.sanitizationEnabled = sanitization
    // Processors will be initialized lazily
  }

  /**
   * Lazy-load processors in priority order.
   */
  private initializeProcessors(): void {
    if (this.processorsReady) {
      return
    }
    this.processors = [
      new EscapedCharProcessor(),
      new HeaderProcessor(),
      new BlockquoteProcessor(),
      new CodeBlockProcessor(),
      new ListsProcessor(),
      new HorizontalRuleProcessor(),
      new ImagesProcessor(this.sanitizationEnabled),
      new LinksProcessor(this.sanitizationEnabled),
      new InlineCodeProcessor(),
      new EmphasisProcessor(),
      new StrikethroughProcessor(),
      new TextProcessor()
    ].sort((a: SegmentProcessor, b: SegmentProcessor) => b.priority - a.priority)
    this.processorsReady = true
  }

  /**
   * Extract segments from markdown input.
   * @param input - Text input to process
   * @param isEnd - Whether this is the final chunk of input
   * @returns Array of extracted segments
   */
  extractSegments(input: string, isEnd: boolean): SegmentText[] {
    this.initializeProcessors()
    this.initializeBuffer(input)
    const tokens: SegmentText[] = []
    if (this.buffer.length === 0) {
      return tokens
    }
    this.processBuffer(tokens, isEnd)
    this.handleRemainingContent(tokens, isEnd)
    return tokens
  }

  /**
   * Initialize the processing buffer
   * @param input - Text input to process
   */
  private initializeBuffer(input: string): void {
    this.buffer = this.pendingContent + input
    this.position = 0
    this.pendingContent = ''
  }

  /**
   * Process the buffer content
   * @param tokens - Array to collect tokens
   * @param isEnd - Whether this is the final chunk
   */
  private processBuffer(tokens: SegmentText[], isEnd: boolean): void {
    let consecutiveFailures: number = 0
    const maxFailures: number = this.processors.length + 1
    while (this.position < this.buffer.length && consecutiveFailures < maxFailures) {
      const context: ProcessingContext = this.createProcessingContext(isEnd)
      const result: ProcessingResult | null = this.processCurrentPosition(context)
      if (result) {
        this.handleSuccessfulProcessing(result, tokens)
        consecutiveFailures = 0
        if (result.pendingContent != null && result.pendingContent.length > 0 && !isEnd) {
          this.pendingContent = result.pendingContent
          break
        }
      } else {
        this.position++
        consecutiveFailures++
      }
    }
  }

  /**
   * Handle successful processing result
   * @param result - Processing result
   * @param tokens - Array to collect tokens
   */
  private handleSuccessfulProcessing(result: ProcessingResult, tokens: SegmentText[]): void {
    tokens.push(...result.tokens)
    if (result.newPosition > this.position) {
      this.position = result.newPosition
    } else {
      this.position++
    }
  }

  /**
   * Handle remaining content after processing
   * @param tokens - Array to collect tokens
   * @param isEnd - Whether this is the final chunk
   */
  private handleRemainingContent(tokens: SegmentText[], isEnd: boolean): void {
    if (this.position < this.buffer.length) {
      if (isEnd) {
        this.handleEndOfInput(tokens)
      } else {
        this.handlePartialInput()
      }
    }
  }

  /**
   * Handle remaining content when input is complete
   * @param tokens - Array to collect tokens
   */
  private handleEndOfInput(tokens: SegmentText[]): void {
    const remainingContent: string = this.buffer.slice(this.position).trim()
    if (remainingContent) {
      tokens.push({ type: tokenType.TEXT, content: remainingContent })
    }
  }

  /**
   * Handle remaining content when input is partial
   */
  private handlePartialInput(): void {
    this.pendingContent = this.buffer.slice(this.position)
  }

  /**
   * Create processing context for current position.
   * @param isEnd - Whether this is the final chunk of input
   * @returns Processing context object
   */
  private createProcessingContext(isEnd: boolean): ProcessingContext {
    return {
      position: this.position,
      buffer: this.buffer,
      isAtLineStart: this.position === 0 || this.buffer[this.position - 1] === '\n',
      isEnd
    }
  }

  /**
   * Process the current position using appropriate processor.
   * @param context - The processing context
   * @returns Processing result or null if no processor matches
   */
  private processCurrentPosition(context: ProcessingContext): ProcessingResult | null {
    const char: string = this.buffer[this.position] ?? ''
    for (const processor of this.processors) {
      if (processor.canProcess(char, context)) {
        return processor.process(this.buffer, this.position, context)
      }
    }
    return null
  }
}
