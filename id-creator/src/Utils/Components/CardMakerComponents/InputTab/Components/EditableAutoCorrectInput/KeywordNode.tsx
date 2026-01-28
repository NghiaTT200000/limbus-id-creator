import { Node, mergeAttributes } from '@tiptap/core'

export interface KeywordNodeOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    keywordNode: {
      insertKeyword: (html: string) => ReturnType
    }
  }
}

export const KeywordNode = Node.create<KeywordNodeOptions>({
  name: 'keywordNode',

  group: 'inline',

  inline: true,

  atom: true, // This makes it non-editable as a single unit

  addOptions() {
    return {
      HTMLAttributes: {
        contenteditable: 'false',
      },
    }
  },

  addAttributes() {
    return {
      class: {
        default: null,
      },
      style: {
        default: null,
      },
      innerHTML: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[contenteditable="false"]',
        getAttrs: (node) => {
          if (typeof node === 'string') return false
          const element = node as HTMLElement
          return {
            class: element.getAttribute('class'),
            style: element.getAttribute('style'),
            innerHTML: element.innerHTML,
          }
        },
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const span = document.createElement('span')
    span.setAttribute('contenteditable', 'false')

    if (HTMLAttributes.class) {
      span.setAttribute('class', HTMLAttributes.class)
    }
    if (HTMLAttributes.style) {
      span.setAttribute('style', HTMLAttributes.style)
    }
    if (node.attrs.innerHTML) {
      span.innerHTML = node.attrs.innerHTML
    }

    return span
  },

  addCommands() {
    return {
      insertKeyword:
        (html: string) =>
        ({ commands, editor }) => {
          // Parse the HTML to extract attributes
          const tempDiv = document.createElement('div')
          tempDiv.innerHTML = html
          const span = tempDiv.querySelector('span')

          if (span) {
            return commands.insertContent({
              type: this.name,
              attrs: {
                class: span.getAttribute('class'),
                style: span.getAttribute('style'),
                innerHTML: span.innerHTML,
              },
            })
          }

          // If not a span, insert as raw HTML
          return commands.insertContent(html)
        },
    }
  },
})