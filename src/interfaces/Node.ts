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

/** Parser node type enum alias */
export const parserNodeType: typeof DocumentType = DocumentType

/** Parser node type alias */
export type ParserNode = DocumentNode
