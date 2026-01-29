import React, { useCallback } from 'react'
import { Editor } from '@tiptap/core'
import './EditorToolbar.css'

interface EditorToolbarProps {
  editor: Editor | null
}

const FONT_COLORS = [
  { name: 'Default', value: '' },
  { name: 'Red', value: '#ff4444' },
  { name: 'Orange', value: '#ff9944' },
  { name: 'Yellow', value: '#ffff44' },
  { name: 'Green', value: '#44ff44' },
  { name: 'Blue', value: '#4444ff' },
  { name: 'Purple', value: '#9944ff' },
  { name: 'Pink', value: '#ff44ff' },
  { name: 'White', value: '#ffffff' },
  { name: 'Gray', value: '#888888' },
]

const FONT_FAMILIES = [
  { name: 'Default', value: '' },
  { name: 'Sans Serif', value: 'Arial, sans-serif' },
  { name: 'Serif', value: 'Georgia, serif' },
  { name: 'Monospace', value: 'Courier New, monospace' },
]

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const setFontColor = useCallback((color: string) => {
    if (!editor) return
    if (color === '') {
      editor.chain().focus().unsetColor().run()
    } else {
      editor.chain().focus().setColor(color).run()
    }
  }, [editor])

  const setFontFamily = useCallback((font: string) => {
    if (!editor) return
    if (font === '') {
      editor.chain().focus().unsetFontFamily().run()
    } else {
      editor.chain().focus().setFontFamily(font).run()
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="editor-toolbar">
      {/* Bold */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
        title="Bold"
      >
        <strong>B</strong>
      </button>

      {/* Italic */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
        title="Italic"
      >
        <em>I</em>
      </button>

      {/* Underline */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`toolbar-btn ${editor.isActive('underline') ? 'active' : ''}`}
        title="Underline"
      >
        <u>U</u>
      </button>

      <div className="toolbar-divider" />

      {/* Heading dropdown */}
      <select
        className="toolbar-select"
        value={
          editor.isActive('heading', { level: 1 }) ? '1' :
          editor.isActive('heading', { level: 2 }) ? '2' :
          editor.isActive('heading', { level: 3 }) ? '3' : '0'
        }
        onChange={(e) => {
          const level = parseInt(e.target.value)
          if (level === 0) {
            editor.chain().focus().setParagraph().run()
          } else {
            editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run()
          }
        }}
        title="Heading"
      >
        <option value="0">Normal</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>

      <div className="toolbar-divider" />

      {/* Bullet List */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`toolbar-btn ${editor.isActive('bulletList') ? 'active' : ''}`}
        title="Bullet List"
      >
        &#8226;
      </button>

      {/* Ordered List */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`toolbar-btn ${editor.isActive('orderedList') ? 'active' : ''}`}
        title="Numbered List"
      >
        1.
      </button>

      <div className="toolbar-divider" />

      {/* Font Family */}
      <select
        className="toolbar-select"
        onChange={(e) => setFontFamily(e.target.value)}
        title="Font Family"
        defaultValue=""
      >
        {FONT_FAMILIES.map((font) => (
          <option key={font.name} value={font.value}>
            {font.name}
          </option>
        ))}
      </select>

      {/* Font Color */}
      <select
        className="toolbar-select toolbar-color-select"
        onChange={(e) => setFontColor(e.target.value)}
        title="Font Color"
        defaultValue=""
      >
        {FONT_COLORS.map((color) => (
          <option key={color.name} value={color.value} style={{ color: color.value || 'inherit' }}>
            {color.name}
          </option>
        ))}
      </select>

      {/* Color picker for custom colors */}
      <input
        type="color"
        className="toolbar-color-picker"
        onChange={(e) => setFontColor(e.target.value)}
        title="Custom Color"
        defaultValue="#ffffff"
      />
    </div>
  )
}
