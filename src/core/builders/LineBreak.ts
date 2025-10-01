import { parserNodeType, type ParserNode, type SegmentText } from '@interfaces/index'

/**
 * Builder for line break nodes.
 * @description Handles parsing of markdown line breaks
 */
export class LineBreak {
  /**
   * Builds a line break node from a token.
   * @param token - The line break token to process
   * @returns Line break node
   */
  static build(token: SegmentText): ParserNode {
    return {
      type: parserNodeType.LINEBREAK,
      value: '',
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
