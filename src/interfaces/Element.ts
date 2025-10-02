/** HTML element interface */
export interface ElementHTML {
  /** HTML tag name */
  readonly tag: string
  /** HTML attributes */
  readonly attributes?: {
    readonly [key: string]: string | number | boolean
    /** CSS class name */
    readonly class?: string
    /** Element ID */
    readonly id?: string
    /** Inline CSS styles */
    readonly style?: string
  }
  /** Indicates if this is a self-closing element */
  readonly selfClosing?: boolean
  /** Text content for the element */
  readonly content?: string
  /** Child elements */
  readonly children?: ElementHTML[]
}
