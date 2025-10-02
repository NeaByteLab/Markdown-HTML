import type { ProcessingContext, ProcessingResult } from '@interfaces/Processor'

/** Token type enum for backward compatibility */
export enum TokenType {
  BLOCKQUOTE = 'blockquote',
  CODE_BLOCK = 'code_block',
  EMPHASIS = 'emphasis',
  HEADER = 'header',
  HORIZONTAL_RULE = 'horizontal_rule',
  IMAGE = 'image',
  INLINE_CODE = 'inline_code',
  LINE_BREAK = 'line_break',
  LINK = 'link',
  LIST_ITEM = 'list_item',
  PARAGRAPH_BREAK = 'paragraph_break',
  STRIKETHROUGH = 'strikethrough',
  TASK_LIST_ITEM = 'task_list_item',
  TEXT = 'text',
  UNKNOWN = 'unknown'
}

/** Base segment text interface with type and content */
export type SegmentText<T extends TokenType = TokenType> = {
  /** Type of the segment */
  type: T
  /** Text content of the segment */
  content: string
  /** Optional metadata for the segment */
  metadata?: Record<string, unknown>
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

/** Token type enum alias for backward compatibility */
export const tokenType: typeof TokenType = TokenType
