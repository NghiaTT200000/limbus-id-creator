import { ReactRenderer } from '@tiptap/react'
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'
import { Extension } from '@tiptap/core'
import tippy, { Instance as TippyInstance } from 'tippy.js'
import SuggestionList, { SuggestionListRef, SuggestionListProps } from './SuggestionList'

export interface KeywordItem {
  key: string
  html: string
}

export interface KeywordExtensionOptions {
  suggestion: Omit<SuggestionOptions<KeywordItem>, 'editor'>
}

export const KeywordExtension = Extension.create<KeywordExtensionOptions>({
  name: 'keyword',

  addOptions() {
    return {
      suggestion: {
        char: '[',
        allowSpaces: false,
        startOfLine: false,
        command: ({ editor, range, props }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertKeyword(props.html)
            .insertContent(' ')
            .run()
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})

export function createKeywordSuggestion(matchList: { [key: string]: string }): Omit<SuggestionOptions<KeywordItem>, 'editor'> {
  return {
    char: '[',
    allowSpaces: false,
    startOfLine: false,

    items: ({ query }): KeywordItem[] => {
      const lowerQuery = query.toLowerCase().replace(/_/g, ' ')
      return Object.keys(matchList)
        .filter(key => key.toLowerCase().replace(/_/g, ' ').includes(lowerQuery))
        .slice(0, 8)
        .map(key => ({
          key,
          html: matchList[key],
        }))
    },

    command: ({ editor, range, props }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertKeyword(props.html)
        .insertContent(' ')
        .run()
    },

    render: () => {
      let component: ReactRenderer<SuggestionListRef, SuggestionListProps> | null = null
      let popup: TippyInstance[] | null = null

      return {
        onStart: (props) => {
          component = new ReactRenderer(SuggestionList, {
            props: {
              ...props,
              items: props.items as KeywordItem[],
            },
            editor: props.editor,
          })

          if (!props.clientRect) {
            return
          }

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect as () => DOMRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          })
        },

        onUpdate: (props) => {
          component?.updateProps({
            ...props,
            items: props.items as KeywordItem[],
          })

          if (!props.clientRect) {
            return
          }

          popup?.[0]?.setProps({
            getReferenceClientRect: props.clientRect as () => DOMRect,
          })
        },

        onKeyDown: (props) => {
          if (props.event.key === 'Escape') {
            popup?.[0]?.hide()
            return true
          }

          return component?.ref?.onKeyDown(props) ?? false
        },

        onExit: () => {
          popup?.[0]?.destroy()
          component?.destroy()
        },
      }
    },
  }
}