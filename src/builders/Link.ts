import { parserNodeType, type ParserNode, type SegmentText } from '@interfaces/index'

/**
 * Builder for link and image nodes.
 * @description Handles parsing of markdown links and images
 */
export class Link {
  /**
   * Builds a link node from a token.
   * @param token - The link token to process
   * @returns Link node
   */
  static buildLink(token: SegmentText): ParserNode {
    return {
      type: parserNodeType.LINK,
      value: token.content,
      metadata: this.sanitizeMetadata(token.metadata)
    }
  }

  /**
   * Builds an image node from a token.
   * @param token - The image token to process
   * @returns Image node
   */
  static buildImage(token: SegmentText): ParserNode {
    return {
      type: parserNodeType.IMAGE,
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
