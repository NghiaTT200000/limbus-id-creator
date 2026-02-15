import React, { useEffect, useRef } from "react"
import { useEditor, EditorContent, ReactRenderer } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Underline } from "@tiptap/extension-underline"
import { TextStyle, FontSize } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { Image } from "@tiptap/extension-image"
import tippy, { Instance as TippyInstance } from "tippy.js"
import KeywordSuggestion from "./Extensions/KeywordSuggestion"
import StatusEffectNode from "./Extensions/StatusEffectNode"
import SuggestionDropdown, { SuggestionDropdownRef } from "./SuggestionDropdown/SuggestionDropdown"
import Toolbar from "./Toolbar/Toolbar"
import "./TipTapEditor.css"

function replaceKeyWordAsNodes(str: string, keyWord: { [key: string]: string }): string {
    const suggestions = str.match(/\[([^ ]+)\](?!<([^ ]+)>)/g)
    if (suggestions) {
        suggestions.forEach((suggestion) => {
            const key = suggestion.slice(1, suggestion.length - 1).toLowerCase().replace(/&amp;/g, "&")
            const selectedWord = keyWord[key]
            if (selectedWord) {
                const escaped = selectedWord.replace(/"/g, "&quot;")
                str = str.replace(suggestion, `<span data-status-effect="${escaped}">${selectedWord}</span>`)
            }
        })
    }
    return str
}

interface TipTapEditorProps {
    inputId: string
    content: string
    changeHandler: (html: string) => void
    matchList: { [key: string]: string }
}

export default function TipTapEditor({ inputId, content, changeHandler, matchList }: TipTapEditorProps) {
    const matchListRef = useRef(matchList)
    matchListRef.current = matchList

    const changeHandlerRef = useRef(changeHandler)
    changeHandlerRef.current = changeHandler

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                blockquote: false,
                codeBlock: false,
                bulletList: false,
                orderedList: false,
                listItem: false,
            }),
            Underline,
            TextStyle,
            Color,
            Image.configure({ inline: true, allowBase64: true }),
            FontSize,
            StatusEffectNode,
            KeywordSuggestion.configure({
                suggestion: {
                    char: "[",
                    allowSpaces: false,
                    items: ({ query }) => {
                        const list = matchListRef.current
                        const lowerQuery = query.toLowerCase()
                        return Object.keys(list)
                            .filter((key) => key.toLowerCase().startsWith(lowerQuery))
                            .slice(0, 10)
                            .map((key) => ({ keyword: key, html: list[key] }))
                    },
                    command: ({ editor, range, props }) => {
                        editor
                            .chain()
                            .focus()
                            .deleteRange(range)
                            .insertContent([
                                { type: "statusEffect", attrs: { html: props.html } },
                                { type: "text", text: " " },
                            ])
                            .run()
                    },
                    render: () => {
                        let component: ReactRenderer<SuggestionDropdownRef>
                        let popup: TippyInstance[]
                        let currentQuery = ""
                        let currentCommand: ((props: any) => void) | null = null

                        return {
                            onStart: (props) => {
                                currentQuery = props.query
                                currentCommand = props.command
                                component = new ReactRenderer(SuggestionDropdown, {
                                    props,
                                    editor: props.editor,
                                })

                                if (!props.clientRect) return

                                popup = tippy("body", {
                                    getReferenceClientRect: props.clientRect as () => DOMRect,
                                    appendTo: () => document.body,
                                    content: component.element,
                                    showOnCreate: true,
                                    interactive: true,
                                    trigger: "manual",
                                    placement: "bottom-start",
                                })
                            },
                            onUpdate: (props) => {
                                currentQuery = props.query
                                currentCommand = props.command
                                component?.updateProps(props)
                                if (props.clientRect && popup?.[0]) {
                                    popup[0].setProps({
                                        getReferenceClientRect: props.clientRect as () => DOMRect,
                                    })
                                }
                            },
                            onKeyDown: (props) => {
                                if (props.event.key === "Escape") {
                                    popup?.[0]?.hide()
                                    return true
                                }
                                // When ']' is typed, auto-complete if exact keyword match exists
                                if (props.event.key === "]" && currentCommand) {
                                    const list = matchListRef.current
                                    const key = currentQuery.toLowerCase()
                                    if (list[key]) {
                                        currentCommand({ keyword: key, html: list[key] })
                                        return true
                                    }
                                }
                                return component?.ref?.onKeyDown(props) ?? false
                            },
                            onExit: () => {
                                popup?.[0]?.destroy()
                                component?.destroy()
                            },
                        }
                    },
                },
            }),
        ],
        content,
        editorProps: {
            handlePaste: (view, event) => {
                event.preventDefault()
                const text = event.clipboardData?.getData("text/plain") ?? ""
                view.dispatch(view.state.tr.insertText(text))
                return true
            },
        },
        onUpdate: ({ editor }) => {
            let html = editor.getHTML()
            // Check if there are any [keyword] patterns to replace
            const hasKeywords = /\[([^ ]+)\](?!<([^ ]+)>)/g.test(html)
            if (hasKeywords) {
                // Use node-wrapped version for TipTap internal content
                const processedForEditor = replaceKeyWordAsNodes(html, matchListRef.current)
                if (processedForEditor !== html) {
                    const { from } = editor.state.selection
                    editor.commands.setContent(processedForEditor, { emitUpdate: false })
                    const maxPos = editor.state.doc.content.size
                    const safePos = Math.min(from, maxPos)
                    editor.commands.focus(safePos)
                    html = editor.getHTML()
                }
            }
            // Output the final HTML (getHTML already renders StatusEffectNodes as raw HTML)
            changeHandlerRef.current(html)
        },
    })

    useEffect(() => {
        if (editor && !editor.isDestroyed) {
            editor.commands.setContent(content, { emitUpdate: false })
        }
    }, [inputId])

    useEffect(() => {
        if (editor && !editor.isDestroyed) {
            const currentHtml = editor.getHTML()
            if (content !== currentHtml) {
                editor.commands.setContent(content, { emitUpdate: false })
            }
        }
    }, [content])

    return (
        <div className="tiptap-editor-wrapper">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} className="tiptap-editor-content" />
        </div>
    )
}
