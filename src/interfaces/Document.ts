/** Document node types for AST structure */
export enum DocumentType {
  BLOCKQUOTE = 'blockquote',
  CODE_BLOCK = 'code_block',
  DOCUMENT = 'document',
  EMPHASIS = 'emphasis',
  HEADER = 'header',
  HORIZONTAL_RULE = 'horizontal_rule',
  IMAGE = 'image',
  INLINE_CODE = 'inline_code',
  LINEBREAK = 'linebreak',
  LINK = 'link',
  LIST = 'list',
  LIST_ITEM = 'list_item',
  PARAGRAPH = 'paragraph',
  STRIKETHROUGH = 'strikethrough',
  TASK_LIST = 'task_list',
  TASK_LIST_ITEM = 'task_list_item',
  TEXT = 'text'
}

/** Code block metadata */
export interface CodeBlockMetadata {
  /** Programming language identifier */
  language?: string | null
}

/** Base document node interface for AST structure */
export interface DocumentNode {
  /** Type of the document node */
  type: DocumentType
  /** Text content value for leaf nodes */
  value?: string
  /** Child nodes for container nodes */
  children?: DocumentNode[]
  /** Additional metadata for specific node types */
  metadata?: {
    /** Header level (1-6) */
    level?: number
    /** Programming language for code blocks */
    language?: string | null
    /** List type (unordered, ordered, task) */
    listType?: string
    /** Whether task is checked */
    checked?: boolean
    /** URL for links and images */
    url?: string
    /** Title for links and images */
    title?: string
    /** Text content for links */
    text?: string
    /** Source URL for images */
    src?: string
    /** Alt text for images */
    alt?: string
  }
}

/** Code block node with language and content */
export interface CodeBlockNode extends DocumentNode {
  type: DocumentType.CODE_BLOCK
  /** Code content */
  value: string
  /** Code block metadata including language */
  metadata: CodeBlockMetadata
}

/** Emphasis node containing emphasized content */
export interface EmphasisNode extends DocumentNode {
  type: DocumentType.EMPHASIS
  /** Child nodes containing emphasized content */
  children: DocumentNode[]
}

/** Header level metadata */
export interface HeaderMetadata {
  /** Header level from 1 to 6 */
  level: 1 | 2 | 3 | 4 | 5 | 6
}

/** Header node with level and text content */
export interface HeaderNode extends DocumentNode {
  type: DocumentType.HEADER
  /** Single text child containing header content */
  children: [TextNode]
  /** Header level metadata */
  metadata: HeaderMetadata
}

/** Line break node for structural breaks */
export interface LineBreakNode extends DocumentNode {
  type: DocumentType.LINEBREAK
}

/** Paragraph node containing text content */
export interface ParagraphNode extends DocumentNode {
  type: DocumentType.PARAGRAPH
  /** Child nodes containing paragraph content */
  children: DocumentNode[]
}

/** Parser processing options */
export interface ProcessingOptions {
  /** How to handle whitespace in the document */
  readonly whitespaceMode: 'preserve' | 'normalize'
  /** How to handle line breaks */
  readonly defaultLineBreaks: 'structural' | 'paragraph'
  /** Whether to use strict parsing mode */
  readonly strictMode?: boolean
  /** Maximum nesting depth for parsing */
  readonly maxDepth?: number
}

/** Text node containing plain text content */
export interface TextNode extends DocumentNode {
  type: DocumentType.TEXT
  /** Text content value */
  value: string
}

/** Task list metadata */
export interface TaskListMetadata {
  /** Whether the task is checked */
  checked: boolean
}

/** Task list item node containing task content */
export interface TaskListItemNode extends DocumentNode {
  type: DocumentType.TASK_LIST_ITEM
  /** Child nodes containing task content */
  children: DocumentNode[]
  /** Task list metadata including checked state */
  metadata: TaskListMetadata
}

/** Task list node containing task list items */
export interface TaskListNode extends DocumentNode {
  type: DocumentType.TASK_LIST
  /** Child nodes containing task list items */
  children: TaskListItemNode[]
}

/** Type guard to check if a node is a code block node */
export const isCodeBlockNode: (node: DocumentNode) => node is CodeBlockNode = (
  node: DocumentNode
): node is CodeBlockNode => node.type === DocumentType.CODE_BLOCK

/** Type guard to check if a node is an emphasis node */
export const isEmphasisNode: (node: DocumentNode) => node is EmphasisNode = (
  node: DocumentNode
): node is EmphasisNode => node.type === DocumentType.EMPHASIS

/** Type guard to check if a node is a header node */
export const isHeaderNode: (node: DocumentNode) => node is HeaderNode = (
  node: DocumentNode
): node is HeaderNode => node.type === DocumentType.HEADER

/** Type guard to check if a node is a line break node */
export const isLineBreakNode: (node: DocumentNode) => node is LineBreakNode = (
  node: DocumentNode
): node is LineBreakNode => node.type === DocumentType.LINEBREAK

/** Type guard to check if a node is a paragraph node */
export const isParagraphNode: (node: DocumentNode) => node is ParagraphNode = (
  node: DocumentNode
): node is ParagraphNode => node.type === DocumentType.PARAGRAPH

/** Type guard to check if a node is a text node */
export const isTextNode: (node: DocumentNode) => node is TextNode = (
  node: DocumentNode
): node is TextNode => node.type === DocumentType.TEXT

/** Type guard to check if a node is a task list item node */
export const isTaskListItemNode: (node: DocumentNode) => node is TaskListItemNode = (
  node: DocumentNode
): node is TaskListItemNode => node.type === DocumentType.TASK_LIST_ITEM

/** Type guard to check if a node is a task list node */
export const isTaskListNode: (node: DocumentNode) => node is TaskListNode = (
  node: DocumentNode
): node is TaskListNode => node.type === DocumentType.TASK_LIST

/** Utility type to extract document type from union */
export type ExtractDocumentType<T, U> = T extends { type: U } ? T : never

/** Node processor function type for specific document types */
export type NodeProcessor<T extends DocumentType> = (
  segment: import('@interfaces/Segment').SegmentText
) => ExtractDocumentType<DocumentNode, T>

/** Parser node type enum alias */
export const parserNodeType: typeof DocumentType = DocumentType
/** Parser node type alias */
export type ParserNode = DocumentNode
/** Parser options type alias */
export type ParserOptions = ProcessingOptions
