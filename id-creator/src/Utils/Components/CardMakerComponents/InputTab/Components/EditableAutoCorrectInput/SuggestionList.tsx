import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { SuggestionProps } from '@tiptap/suggestion'
import { KeywordItem } from './KeywordExtension'
import './SuggestionList.css'

export interface SuggestionListProps extends SuggestionProps<KeywordItem> {
  items: KeywordItem[]
}

export interface SuggestionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

const SuggestionList = forwardRef<SuggestionListRef, SuggestionListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = (index: number) => {
      const item = props.items[index]
      if (item) {
        props.command(item)
      }
    }

    const upHandler = () => {
      setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
    }

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length)
    }

    const enterHandler = () => {
      selectItem(selectedIndex)
    }

    useEffect(() => setSelectedIndex(0), [props.items])

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          upHandler()
          return true
        }

        if (event.key === 'ArrowDown') {
          downHandler()
          return true
        }

        if (event.key === 'Enter') {
          enterHandler()
          return true
        }

        if (event.key === 'Tab') {
          downHandler()
          return true
        }

        return false
      },
    }))

    if (props.items.length === 0) {
      return null
    }

    return (
      <div className="suggestion-list">
        {props.items.map((item, index) => (
          <button
            className={`suggestion-item ${index === selectedIndex ? 'active' : ''}`}
            key={item.key}
            onClick={() => selectItem(index)}
          >
            <span dangerouslySetInnerHTML={{ __html: item.html }} />
          </button>
        ))}
      </div>
    )
  }
)

SuggestionList.displayName = 'SuggestionList'

export default SuggestionList
