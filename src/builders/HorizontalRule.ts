import { parserNodeType, type ParserNode, type SegmentText } from '@interfaces/index'

/**
 * Builder for horizontal rule nodes.
 * @description Handles parsing of markdown horizontal rules (---)
 */
export class HorizontalRule {
  /**
   * Builds a horizontal rule node from a token.
   * @param token - The horizontal rule token to process
   * @returns Horizontal rule parser node
   */
  static build(token: SegmentText): ParserNode {
    return {
      type: parserNodeType.HORIZONTAL_RULE,
      value: token.content,
      metadata: this.sanitizeMetadata(token.metadata)
    }
  }

  /**
   * Sanitizes metadata to ensure type safety.
   * @param metadata - Raw metadata
   * @returns Sanitized metadata
   */
  private static sanitizeMetadata(metadata?: unknown): Record<string, unknown> {
    if (metadata !== null && metadata !== undefined && typeof metadata === 'object') {
      return metadata as Record<string, unknown>
    }
    return {}
  }
}
