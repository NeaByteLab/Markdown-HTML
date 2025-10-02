import { parserNodeType, tokenType, type ParserNode, type SegmentText } from '@interfaces/index'
import { ListItem } from '@builders/index'

/**
 * Builder for list nodes (regular lists and task lists).
 * @description Handles parsing of markdown lists (- item, 1. item, - [ ] task)
 */
export class List {
  /**
   * Builds a list node by grouping consecutive list items.
   * @param tokens - Array of tokens
   * @param current - Current position in tokens
   * @param maxDepth - Maximum recursion depth
   * @param depth - Current recursion depth
   * @param hasReachedEnd - Function to check if reached end
   * @param peekCurrentToken - Function to peek at current token
   * @param advanceToNextToken - Function to advance to next token
   * @param getListTypeFromMetadata - Function to get list type from metadata
   * @returns List node containing grouped list items
   */
  static buildList(
    _tokens: SegmentText[],
    _current: number,
    maxDepth: number,
    depth: number,
    hasReachedEnd: () => boolean,
    peekCurrentToken: () => SegmentText,
    advanceToNextToken: () => SegmentText,
    getListTypeFromMetadata: (metadata?: unknown) => string
  ): ParserNode {
    const listItems: ParserNode[] = []
    const firstToken: SegmentText = peekCurrentToken()
    const listType: string = getListTypeFromMetadata(firstToken.metadata)
    while (!hasReachedEnd()) {
      const token: SegmentText = peekCurrentToken()
      if (token.type !== tokenType.LIST_ITEM) {
        break
      }
      const currentListType: string = getListTypeFromMetadata(token.metadata)
      if (currentListType !== listType) {
        break
      }
      const listItem: ParserNode = ListItem.buildListItem(advanceToNextToken(), maxDepth, depth)
      listItems.push(listItem)
    }
    return {
      type: parserNodeType.LIST,
      value: '',
      metadata: { listType },
      children: listItems
    }
  }

  /**
   * Builds a task list node by grouping consecutive task list items.
   * @param tokens - Array of tokens
   * @param current - Current position in tokens
   * @param maxDepth - Maximum recursion depth
   * @param depth - Current recursion depth
   * @param hasReachedEnd - Function to check if reached end
   * @param peekCurrentToken - Function to peek at current token
   * @param advanceToNextToken - Function to advance to next token
   * @returns Task list node containing grouped task list items
   */
  static buildTaskList(
    _tokens: SegmentText[],
    _current: number,
    maxDepth: number,
    depth: number,
    hasReachedEnd: () => boolean,
    peekCurrentToken: () => SegmentText,
    advanceToNextToken: () => SegmentText
  ): ParserNode {
    const taskItems: ParserNode[] = []
    while (!hasReachedEnd()) {
      const token: SegmentText = peekCurrentToken()
      if (token.type !== tokenType.TASK_LIST_ITEM) {
        break
      }
      const taskItem: ParserNode = ListItem.buildTaskListItem(advanceToNextToken(), maxDepth, depth)
      taskItems.push(taskItem)
    }
    return {
      type: parserNodeType.TASK_LIST,
      value: '',
      metadata: { listType: 'task' },
      children: taskItems
    }
  }
}
