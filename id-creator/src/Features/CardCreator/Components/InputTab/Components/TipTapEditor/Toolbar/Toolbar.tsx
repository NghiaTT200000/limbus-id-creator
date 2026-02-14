import React from "react"
import { Editor } from "@tiptap/react"
import "./Toolbar.css"

interface ToolbarProps {
    editor: Editor | null
}

export default function Toolbar({ editor }: ToolbarProps) {
    if (!editor) return null

    return (
        <div className="tiptap-toolbar">
            <button
                type="button"
                className={`toolbar-btn ${editor.isActive("bold") ? "is-active" : ""}`}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <b>B</b>
            </button>
            <button
                type="button"
                className={`toolbar-btn ${editor.isActive("italic") ? "is-active" : ""}`}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <i>I</i>
            </button>
            <button
                type="button"
                className={`toolbar-btn ${editor.isActive("underline") ? "is-active" : ""}`}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                <u>U</u>
            </button>

            <span className="toolbar-separator" />

            <label className="toolbar-color-label" title="Text color">
                <input
                    type="color"
                    className="toolbar-color-input"
                    value={editor.getAttributes("textStyle").color || "#ffffff"}
                    onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                />
            </label>
            <button
                type="button"
                className="toolbar-btn toolbar-btn-sm"
                onClick={() => editor.chain().focus().unsetColor().run()}
                title="Reset color"
            >
                ✕
            </button>

            <span className="toolbar-separator" />

            <select
                className="toolbar-select"
                value={editor.getAttributes("textStyle").fontSize || ""}
                onChange={(e) => {
                    const size = e.target.value
                    if (size) {
                        editor.chain().focus().setFontSize(size).run()
                    } else {
                        editor.chain().focus().unsetFontSize().run()
                    }
                }}
            >
                <option value="">Size</option>
                <option value="10px">10</option>
                <option value="12px">12</option>
                <option value="14px">14</option>
                <option value="16px">16</option>
                <option value="18px">18</option>
                <option value="20px">20</option>
                <option value="24px">24</option>
            </select>
        </div>
    )
}
