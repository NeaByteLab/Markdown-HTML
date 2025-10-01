import {
  parserNodeType,
  type ParserNode,
  type SegmentText,
  type DocumentNode
} from '@interfaces/index'
import { SegmentExtractor } from '@core/Extractor'
import { Document } from '@core/Document'

/**
 * Builder for strikethrough nodes.
 * @description Handles parsing of markdown strikethrough (~~text~~)
 */
export class Strikethrough {
  /**
   * Builds a strikethrough node from a token.
   * @param token - The strikethrough token to process
   * @param maxDepth - Maximum recursion depth
   * @param currentDepth - Current recursion depth
   * @returns Strikethrough node with text children
   */
  static build(token: SegmentText, maxDepth: number, currentDepth: number): ParserNode {
    const content: string =
      this.getTextFromMetadata(token.metadata) ??
      token.content.replace(/^~~/, '').replace(/~~$/, '')
    const hasBlockElements: boolean = this.containsBlockElements(content)
    if (currentDepth >= maxDepth - 1 || !hasBlockElements) {
      return {
        type: parserNodeType.STRIKETHROUGH,
        value: content,
        metadata: this.sanitizeMetadata(token.metadata),
        children: [{ type: parserNodeType.TEXT, value: content }]
      }
    }
    const contentTokens: SegmentText[] = new SegmentExtractor().extractSegments(content, true)
    const contentDoc: DocumentNode = new Document(contentTokens, maxDepth).buildDocumentTree()
    const flattenedChildren: ParserNode[] = this.flattenChildren(contentDoc.children ?? [])
    return {
      type: parserNodeType.STRIKETHROUGH,
      value: '',
      metadata: this.sanitizeMetadata(token.metadata),
      children: flattenedChildren
    }
  }

  /**
   * Safely extracts text from metadata.
   * @param metadata - Token metadata
   * @returns Text string or undefined
   */
  private static getTextFromMetadata(metadata?: unknown): string | undefined {
    if (
      metadata !== null &&
      metadata !== undefined &&
      typeof metadata === 'object' &&
      'text' in metadata
    ) {
      const { text }: { text: unknown } = metadata as { text: unknown }
      return typeof text === 'string' ? text : undefined
    }
    return undefined
  }

  /**
   * Checks if content contains block-level elements.
   * @param content - Content to check
   * @returns True if content contains block elements
   */
  private static containsBlockElements(content: string): boolean {
    const lines: string[] = content.split('\n')
    return lines.some((line: string) => {
      const trimmed: string = line.trimStart()
      return (
        trimmed.startsWith('- ') ||
        trimmed.startsWith('* ') ||
        trimmed.startsWith('+ ') ||
        /^\d+\.\s/.test(trimmed) ||
        /^[-*+]\s*\[[ x]\]/.test(trimmed) ||
        /^#{1,6}\s/.test(trimmed) ||
        trimmed.startsWith('```') ||
        trimmed.startsWith('>') ||
        /^[-*_]{3,}\s*$/.test(trimmed)
      )
    })
  }

  /**
   * Flattens children to remove unnecessary paragraph wrappers.
   * @param children - Array of document nodes
   * @returns Flattened array of document nodes
   */
  private static flattenChildren(children: DocumentNode[]): DocumentNode[] {
    const flattened: DocumentNode[] = []
    for (const child of children) {
      if (child.type === parserNodeType.PARAGRAPH && child.children) {
        if (child.children.length === 1) {
          flattened.push(child.children[0] as DocumentNode)
        } else {
          flattened.push(...child.children)
        }
      } else {
        flattened.push(child)
      }
    }
    return flattened
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
