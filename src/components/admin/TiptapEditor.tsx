"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

interface TiptapEditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export default function TiptapEditor({ value, onChange, disabled }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editable: !disabled,
  })

  if (!editor) {
    return null
  }

  return (
    <div className="border border-gray-300 rounded-md bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded px-2 py-1 text-sm font-medium ${
            editor.isActive("bold") ? "bg-blue-200 text-blue-800" : "text-gray-700 hover:bg-gray-200"
          }`}
          disabled={disabled}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded px-2 py-1 text-sm font-medium ${
            editor.isActive("italic") ? "bg-blue-200 text-blue-800" : "text-gray-700 hover:bg-gray-200"
          }`}
          disabled={disabled}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`rounded px-2 py-1 text-sm font-medium ${
            editor.isActive("heading", { level: 2 }) ? "bg-blue-200 text-blue-800" : "text-gray-700 hover:bg-gray-200"
          }`}
          disabled={disabled}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`rounded px-2 py-1 text-sm font-medium ${
            editor.isActive("heading", { level: 3 }) ? "bg-blue-200 text-blue-800" : "text-gray-700 hover:bg-gray-200"
          }`}
          disabled={disabled}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded px-2 py-1 text-sm font-medium ${
            editor.isActive("bulletList") ? "bg-blue-200 text-blue-800" : "text-gray-700 hover:bg-gray-200"
          }`}
          disabled={disabled}
        >
          List
        </button>
         <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded px-2 py-1 text-sm font-medium ${
            editor.isActive("orderedList") ? "bg-blue-200 text-blue-800" : "text-gray-700 hover:bg-gray-200"
          }`}
          disabled={disabled}
        >
          Ordered
        </button>
      </div>
      
      {/* Editor Area */}
      <div className="min-h-[300px] cursor-text bg-white">
         <EditorContent editor={editor} disabled={disabled} />
      </div>
    </div>
  )
}
