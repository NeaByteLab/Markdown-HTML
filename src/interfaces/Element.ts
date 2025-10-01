/** Base HTML element interface */
export interface BaseElementHTML {
  /** HTML tag name */
  readonly tag: ElementTag
  /** HTML attributes */
  readonly attributes?: ElementAttr
  /** Child elements */
  readonly children?: ElementHTML[]
}

/** Container HTML element interface */
export interface ContainerElementHTML extends BaseElementHTML {
  /** Indicates this is not a self-closing element */
  readonly selfClosing?: false
  /** Text content for the element */
  readonly content?: string
  /** Child elements */
  readonly children?: ElementHTML[]
}

/** HTML element attributes interface */
export interface ElementAttr {
  readonly [key: string]: HtmlAttributeValue
  /** CSS class name */
  readonly class?: string
  /** Element ID */
  readonly id?: string
  /** Inline CSS styles */
  readonly style?: string
}

/** Self-closing HTML element interface */
export interface SelfClosingElementHTML extends BaseElementHTML {
  /** Indicates this is a self-closing element */
  readonly selfClosing: true
  /** Self-closing elements cannot have children */
  readonly children?: never
}

/** Supported HTML element tags */
export type ElementTag =
  | 'a'
  | 'blockquote'
  | 'br'
  | 'code'
  | 'del'
  | 'div'
  | 'em'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'hr'
  | 'img'
  | 'input'
  | 'label'
  | 'li'
  | 'ol'
  | 'p'
  | 'pre'
  | 'span'
  | 'strong'
  | 'ul'

/** Union type for all HTML element types */
export type ElementHTML = SelfClosingElementHTML | ContainerElementHTML

/** Element factory function type based on tag type */
export type ElementFactory<T extends ElementTag> = T extends 'br' | 'hr' | 'img' | 'input'
  ? (attributes?: ElementAttr) => SelfClosingElementHTML
  : (attributes?: ElementAttr, content?: string, children?: ElementHTML[]) => ContainerElementHTML

/** Element processor function type for document nodes */
export type ElementProcessor<T extends import('@interfaces/Document').DocumentNode> = (
  node: T
) => ElementHTML

/** Utility type to extract element type based on tag */
export type ExtractElementType<T extends ElementTag> = T extends 'br' | 'hr' | 'img' | 'input'
  ? SelfClosingElementHTML
  : ContainerElementHTML

/** Valid HTML attribute value types */
export type HtmlAttributeValue = string | number | boolean

/** Type guard to check if an element is a container */
export const isContainerElement: (element: ElementHTML) => element is ContainerElementHTML = (
  element: ElementHTML
): element is ContainerElementHTML => element.selfClosing !== true

/** Type guard to check if an element is self-closing */
export const isSelfClosingElement: (element: ElementHTML) => element is SelfClosingElementHTML = (
  element: ElementHTML
): element is SelfClosingElementHTML => element.selfClosing === true
