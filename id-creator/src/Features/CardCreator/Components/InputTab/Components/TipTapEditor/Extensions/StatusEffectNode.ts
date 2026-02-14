import { Node } from "@tiptap/core"

/**
 * A custom inline atom node that stores raw HTML from status effects / keywords.
 * This preserves all attributes (class, contenteditable, CSS variables) that
 * TipTap's default schema would otherwise strip.
 *
 * - In the editor: rendered via addNodeView with dangerouslySetInnerHTML-style rendering
 * - For getHTML(): outputs the raw HTML directly so card preview works
 * - For parseHTML(): recognizes <span data-status-effect> wrappers
 */
const StatusEffectNode = Node.create({
    name: "statusEffect",
    group: "inline",
    inline: true,
    atom: true,

    addAttributes() {
        return {
            html: {
                default: "",
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: "span[data-status-effect]",
                getAttrs: (node) => {
                    const el = node as HTMLElement
                    return { html: el.getAttribute("data-status-effect") }
                },
            },
            {
                // Recognize existing saved status effect spans (contenteditable='false')
                tag: "span[contenteditable='false']",
                getAttrs: (node) => {
                    const el = node as HTMLElement
                    return { html: el.outerHTML }
                },
            },
        ]
    },

    renderHTML({ node }) {
        // Build real DOM so getHTML() outputs the original status effect HTML,
        // not a data-attribute wrapper. This keeps card preview compatible.
        const wrapper = document.createElement("span")
        wrapper.setAttribute("data-status-effect", node.attrs.html)
        wrapper.innerHTML = node.attrs.html
        return { dom: wrapper }
    },

    addNodeView() {
        return ({ node }) => {
            const dom = document.createElement("span")
            dom.setAttribute("data-status-effect", node.attrs.html)
            dom.innerHTML = node.attrs.html
            dom.contentEditable = "false"
            return { dom }
        }
    },
})

export default StatusEffectNode