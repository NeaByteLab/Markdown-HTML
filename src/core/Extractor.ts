import type { SegmentText } from '@interfaces/Segment'
import { tokenType } from '@interfaces/index'
import type { SegmentProcessor, ProcessingContext, ProcessingResult } from '@core/processors/Types'
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
} from '@core/processors/index'

/**
 * Main orchestrator for extracting markdown segments.
 * @description Delegates to specialized processors based on character type.
 */
export class SegmentExtractor {
  /** Array of registered processors */
  private processors: SegmentProcessor[] = []
  /** Content pending processing */
  private pendingContent: string = ''
  /** Current processing buffer */
  private buffer: string = ''
  /** Current position in buffer */
  private position: number = 0

  /**
   * Creates a new SegmentExtractor instance.
   * @description Registers all available processors in priority order.
   */
  constructor() {
    this.registerProcessors()
  }

  /**
   * Register all available processors in priority order.
   * CRITICAL FIX: Corrected priority order to prevent conflicts
   */
  private registerProcessors(): void {
    this.processors = [
      new EscapedCharProcessor(),
      new HeaderProcessor(),
      new BlockquoteProcessor(),
      new CodeBlockProcessor(),
      new ListsProcessor(),
      new HorizontalRuleProcessor(),
      new ImagesProcessor(),
      new LinksProcessor(),
      new InlineCodeProcessor(),
      new EmphasisProcessor(),
      new StrikethroughProcessor(),
      new TextProcessor()
    ].sort((a: SegmentProcessor, b: SegmentProcessor) => b.priority - a.priority)
  }

  /**
   * Extract segments from markdown input.
   * @param input - Text input to process
   * @param isEnd - Whether this is the final chunk of input
   * @returns Array of extracted segments
   */
  extractSegments(input: string, isEnd: boolean): SegmentText[] {
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
    const maxFailures: number = 10
    while (this.position < this.buffer.length && consecutiveFailures < maxFailures) {
      const context: ProcessingContext = this.createProcessingContext(isEnd)
      const result: ProcessingResult | null = this.processCurrentPosition(context)
      if (result) {
        this.handleSuccessfulProcessing(result, tokens)
        consecutiveFailures = 0
        if (result.pendingContent != null && result.pendingContent.length > 0) {
          this.pendingContent = result.pendingContent
          break
        }
      } else {
        this.handleFailedProcessing()
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
   * Handle failed processing by advancing position
   */
  private handleFailedProcessing(): void {
    const char: string = this.buffer[this.position] ?? ''
    if (this.isWhitespace(char)) {
      this.position++
    } else {
      const nextSafePos: number = this.findNextSafePosition(this.position)
      this.position = nextSafePos > this.position ? nextSafePos : this.position + 1
    }
  }

  /**
   * Check if character is whitespace
   * @param char - Character to check
   * @returns True if whitespace
   */
  private isWhitespace(char: string): boolean {
    return char === ' ' || char === '\t' || char === '\r' || char === '\n'
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
    if (remainingContent && tokens.length === 0) {
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

  /**
   * Finds the next safe position to advance to when no processor matches.
   * @param currentPos - Current position in buffer
   * @returns Next safe position to advance to
   */
  private findNextSafePosition(currentPos: number): number {
    return currentPos + 1
  }
}
