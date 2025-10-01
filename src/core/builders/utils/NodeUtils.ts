import { parserNodeType, type ParserNode } from '@interfaces/index'

/**
 * Utility functions for node creation and metadata handling.
 * @description Common utilities for building document nodes
 */
export class NodeUtils {
  /**
   * Creates a text node with the given content.
   * @param content - Text content for the node
   * @returns Text node
   */
  static createTextNode(content: string): ParserNode {
    return {
      type: parserNodeType.TEXT,
      value: content
    }
  }

  /**
   * Safely extracts list type from metadata.
   * @param metadata - Token metadata
   * @returns List type string
   */
  static getListTypeFromMetadata(metadata?: unknown): string {
    if (
      metadata !== null &&
      metadata !== undefined &&
      typeof metadata === 'object' &&
      'listType' in metadata
    ) {
      const { listType }: { listType: unknown } = metadata as { listType: unknown }
      return typeof listType === 'string' ? listType : 'unordered'
    }
    return 'unordered'
  }

  /**
   * Sanitizes metadata to ensure type safety.
   * @param metadata - Raw metadata
   * @returns Sanitized metadata
   */
  static sanitizeMetadata(metadata?: unknown): Record<string, unknown> {
    if (metadata !== null && metadata !== undefined && typeof metadata === 'object') {
      return metadata as Record<string, unknown>
    }
    return {}
  }
}
