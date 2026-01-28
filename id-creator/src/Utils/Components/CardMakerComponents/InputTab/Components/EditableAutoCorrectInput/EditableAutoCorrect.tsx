import React from "react";
import { ReactElement } from "react";
import "./EditableAutoCorrect.css"
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { KeywordExtension, createKeywordSuggestion } from './KeywordExtension'
import { KeywordNode } from './KeywordNode'

interface EditableAutoCorrectProps {
    inputId: string
    content: string
    changeHandler: (e: string) => void
    matchList: { [key: string]: string }
}

export default function EditableAutoCorrect({ inputId, content, matchList, changeHandler }: EditableAutoCorrectProps): ReactElement {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                hardBreak: false,
            }),
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
            <EditorContent
                id={inputId}
                editor={editor}
                className="input editable-auto-correct"
            />
        </div>
    )
}