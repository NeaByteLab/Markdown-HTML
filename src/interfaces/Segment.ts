/** Segment types for markdown parsing */
export enum SegmentType {
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
export type SegmentText<T extends SegmentType = SegmentType> = {
  /** Type of the segment */
  type: T
  /** Text content of the segment */
  content: string
  /** Optional metadata for the segment */
  metadata?: SegmentMetadata<T>
}

/** Segment metadata type based on segment type */
export type SegmentMetadata<T extends SegmentType> = T extends 'blockquote'
  ? { level: number }
  : T extends 'header'
    ? { level: number }
    : T extends 'code_block'
      ? { language?: string }
      : T extends 'emphasis'
        ? { marker: '*' | '_' }
        : T extends 'task_list_item'
          ? { checked: boolean; listType: string; marker: string; level: number }
          : T extends 'list_item'
            ? { listType: string; marker?: string; number?: string; level: number }
            : T extends 'horizontal_rule'
              ? { marker: '-' | '*' | '_' }
              : T extends 'link'
                ? { text: string; url: string; title: string; isReference: boolean }
                : T extends 'image'
                  ? { alt: string; src: string; title: string; isReference: boolean }
                  : T extends 'strikethrough'
                    ? { marker: '~~'; text: string }
                    : T extends 'line_break'
                      ? { breakType: 'hard'; spaceCount: number }
                      : never

/** Mapping of segment types to their corresponding segment text types */
export type SegmentTextMap = {
  [SegmentType.TEXT]: SegmentText<SegmentType.TEXT>
  [SegmentType.HEADER]: SegmentText<SegmentType.HEADER>
  [SegmentType.CODE_BLOCK]: SegmentText<SegmentType.CODE_BLOCK>
  [SegmentType.EMPHASIS]: SegmentText<SegmentType.EMPHASIS>
  [SegmentType.TASK_LIST_ITEM]: SegmentText<SegmentType.TASK_LIST_ITEM>
  [SegmentType.UNKNOWN]: SegmentText<SegmentType.UNKNOWN>
}

/** Type guard to check if a segment is a code block segment */
export const isCodeBlockSegment: (
  segment: SegmentText
) => segment is SegmentText<SegmentType.CODE_BLOCK> = (
  segment: SegmentText
): segment is SegmentText<SegmentType.CODE_BLOCK> => segment.type === SegmentType.CODE_BLOCK

/** Type guard to check if a segment is a header segment */
export const isHeaderSegment: (
  segment: SegmentText
) => segment is SegmentText<SegmentType.HEADER> = (
  segment: SegmentText
): segment is SegmentText<SegmentType.HEADER> => segment.type === SegmentType.HEADER

/** Type guard to check if a segment is a task list item segment */
export const isTaskListItemSegment: (
  segment: SegmentText
) => segment is SegmentText<SegmentType.TASK_LIST_ITEM> = (
  segment: SegmentText
): segment is SegmentText<SegmentType.TASK_LIST_ITEM> => segment.type === SegmentType.TASK_LIST_ITEM

/** Type guard to check if a segment is of a specific type */
export const isSegmentText: <T extends SegmentType>(
  segment: SegmentText,
  type: T
) => segment is SegmentText<T> = <T extends SegmentType>(
  segment: SegmentText,
  type: T
): segment is SegmentText<T> => segment.type === type

/** Token type enum alias for backward compatibility */
export const tokenType: typeof SegmentType = SegmentType
