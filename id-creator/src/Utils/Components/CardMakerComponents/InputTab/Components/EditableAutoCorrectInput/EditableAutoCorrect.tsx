import React from "react";
import { ReactElement } from "react";
import "./EditableAutoCorrect.css"
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'
import { KeywordExtension, createKeywordSuggestion } from './KeywordExtension'
import { KeywordNode } from './KeywordNode'
import EditorToolbar from './EditorToolbar'

interface EditableAutoCorrectProps {
    inputId: string
    content: string
    changeHandler: (e: string) => void
    matchList: { [key: string]: string }
    showToolbar?: boolean
}

export default function EditableAutoCorrect({
    inputId,
    content,
    matchList,
    changeHandler,
    showToolbar = true
}: EditableAutoCorrectProps): ReactElement {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                hardBreak: false,
            }),
            Underline,
            TextStyle,
            Color,
            FontFamily,
            KeywordNode,
            KeywordExtension.configure({
                suggestion: createKeywordSuggestion(matchList),
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            changeHandler(editor.getHTML())
        },
    })

    return (
        <div className="editable-auto-correct-container" style={{ position: "relative" }}>
            {showToolbar && <EditorToolbar editor={editor} />}
            <EditorContent
                id={inputId}
                editor={editor}
                className={`input editable-auto-correct ${showToolbar ? 'with-toolbar' : ''}`}
            />
        </div>
    )
}
