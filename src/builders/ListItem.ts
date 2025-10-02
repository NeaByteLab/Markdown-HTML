import {
  parserNodeType,
  type ParserNode,
  type SegmentText,
  type DocumentNode
} from '@interfaces/index'
import { SegmentExtractor } from '@core/Extractor'
import { Document } from '@core/Document'

/**
 * Builder for list item nodes (regular list items and task list items).
 * @description Handles parsing of markdown list items
 */
export class ListItem {
  /**
   * Builds a list item node from a token.
   * @param token - The list item token to process
   * @param maxDepth - Maximum recursion depth
   * @param currentDepth - Current recursion depth
   * @returns List item node
   */
  static buildListItem(token: SegmentText, maxDepth: number, currentDepth: number): ParserNode {
    if (currentDepth >= maxDepth - 1) {
      return {
        type: parserNodeType.LIST_ITEM,
        value: token.content,
        metadata: token.metadata as { level?: number; language?: string | null },
        children: [{ type: parserNodeType.TEXT, value: token.content }] as DocumentNode[]
      }
    }
    const contentTokens: SegmentText[] = new SegmentExtractor().extractSegments(token.content, true)
    const contentDoc: DocumentNode = new Document(contentTokens, maxDepth).buildDocumentTree()
    const fixedChildren: DocumentNode[] = contentDoc.children ?? []
    return {
      type: parserNodeType.LIST_ITEM,
      value: '',
      metadata: token.metadata as { level?: number; language?: string | null },
      children: fixedChildren
    }
  }

  /**
   * Builds a task list item node from a token.
   * @param token - The task list item token to process
   * @param maxDepth - Maximum recursion depth
   * @param currentDepth - Current recursion depth
   * @returns Task list item node
   */
  static buildTaskListItem(token: SegmentText, maxDepth: number, currentDepth: number): ParserNode {
    const isChecked: boolean = this.getCheckedFromMetadata(token.metadata)
    if (currentDepth >= maxDepth - 1) {
      return {
        type: parserNodeType.TASK_LIST_ITEM,
        value: token.content,
        metadata: { checked: isChecked },
        children: [{ type: parserNodeType.TEXT, value: token.content }] as DocumentNode[]
      }
    }
    const contentTokens: SegmentText[] = new SegmentExtractor().extractSegments(
      token.content,
      false
    )
    const contentDoc: DocumentNode = new Document(contentTokens, maxDepth).buildDocumentTree()
    const inlineChildren: DocumentNode[] = []
    if (contentDoc.children) {
      for (const child of contentDoc.children) {
        if (child.type === parserNodeType.PARAGRAPH && child.children) {
          inlineChildren.push(...child.children)
        } else if (child.type !== parserNodeType.PARAGRAPH) {
          inlineChildren.push(child)
        }
      }
    }
    return {
      type: parserNodeType.TASK_LIST_ITEM,
      value: '',
      metadata: { checked: isChecked },
      children: inlineChildren
    }
  }

  /**
   * Safely extracts checked state from metadata.
   * @param metadata - Token metadata
   * @returns Checked state boolean
   */
  private static getCheckedFromMetadata(metadata?: unknown): boolean {
    if (
      metadata !== null &&
      metadata !== undefined &&
      typeof metadata === 'object' &&
      'checked' in metadata
    ) {
      const { checked }: { checked: unknown } = metadata as { checked: unknown }
      return typeof checked === 'boolean' ? checked : false
    }
    return false
  }
}
