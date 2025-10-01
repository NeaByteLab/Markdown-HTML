import type { SegmentText } from '@interfaces/index'

/**
 * Processing context for segment processors.
 */
export interface ProcessingContext {
  /** Current position in the buffer */
  position: number
  /** Full input buffer */
  buffer: string
  /** Whether we're at the start of a line */
  isAtLineStart: boolean
  /** Whether this is the final chunk of input */
  isEnd: boolean
}

/**
 * Result of processing a segment.
 */
export interface ProcessingResult {
  /** Extracted tokens */
  tokens: SegmentText[]
  /** New position after processing */
  newPosition: number
  /** Whether this processor consumed the input */
  consumed: boolean
  /** Pending content for later processing */
  pendingContent?: string
}

/**
 * Base interface for all segment processors.
 */
export interface SegmentProcessor {
  /** Check if this processor can handle the current character */
  canProcess(char: string, context?: ProcessingContext): boolean
  /** Process the segment and return tokens */
  process(input: string, start: number, context: ProcessingContext): ProcessingResult
  /** Priority for processing order (higher = processed first) */
  priority: number
}
