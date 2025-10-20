import { useState, useEffect, useRef, useCallback } from 'react'
import { Header } from './components/Header'
import { MarkdownEditor } from './components/MarkdownEditor'
import { MarkdownPreview } from './components/MarkdownPreview'
import { ExportModal } from './components/ExportModal'
import { MermaidModal } from './components/MermaidModal'
import { ConvertModal } from './components/ConvertModal'
import { AboutModal } from './components/AboutModal'

function App() {
  const [isMobile, setIsMobile] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [scrollSync] = useState(true)
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // 模态弹窗状态
  const [showExportModal, setShowExportModal] = useState(false)
  const [showMermaidModal, setShowMermaidModal] = useState(false)
  const [showConvertModal, setShowConvertModal] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [markdown, setMarkdown] = useState(`# Markdown Tools Website

Welcome to this powerful Markdown tools collection!

## Features

- 📝 **Real-time editing and preview**
- 📊 **Diagram generation** - Support Mermaid syntax
- 📄 **Multiple format export** - HTML, PDF, DOCX
- 🔄 **Format conversion** - Markdown and other format conversion

## Mermaid Diagram Examples

\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Execute Action]
    B -->|No| D[End]
    C --> D
\`\`\`

\`\`\`mermaid
sequenceDiagram
    participant A as User
    participant B as System
    A->>B: Send Request
    B-->>A: Return Response
\`\`\`

Start editing your Markdown document!`)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 处理图表插入
  const handleInsertMermaid = (template: string) => {
    const mermaidCode = `\`\`\`mermaid\n${template}\n\`\`\`\n\n`
    const newMarkdown = markdown + mermaidCode
    setMarkdown(newMarkdown)
  }

  // 简化的滚动同步处理
  const handleEditorScroll = useCallback((scrollTop: number, scrollHeight: number, clientHeight: number) => {
    if (!scrollSync || isMobile || !previewRef.current) return

    const preview = previewRef.current
    const scrollHeightDiff = scrollHeight - clientHeight
    if (scrollHeightDiff <= 0) return

    const scrollPercentage = scrollTop / scrollHeightDiff
    const targetScrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight)
    preview.scrollTop = targetScrollTop
  }, [scrollSync, isMobile, previewRef])

  const handlePreviewScroll = useCallback(() => {
    if (!scrollSync || isMobile || !editorRef.current || !previewRef.current) return

    const editor = editorRef.current
    const preview = previewRef.current

    let scroller = null
    if (editor && typeof editor.querySelector === 'function') {
      scroller = editor.querySelector('.cm-scroller')
    }
    if (!scroller) {
      scroller = document.querySelector('.cm-scroller')
    }
    if (!scroller) return

    const previewScrollHeightDiff = preview.scrollHeight - preview.clientHeight
    if (previewScrollHeightDiff <= 0) return

    const scrollPercentage = preview.scrollTop / previewScrollHeightDiff
    const scrollerScrollHeightDiff = scroller.scrollHeight - scroller.clientHeight
    if (scrollerScrollHeightDiff <= 0) return

    const targetScrollTop = scrollPercentage * scrollerScrollHeightDiff
    scroller.scrollTop = targetScrollTop
  }, [scrollSync, isMobile, editorRef, previewRef])

  useEffect(() => {
    if (!scrollSync || isMobile || !previewRef.current) return
    const preview = previewRef.current
    preview.addEventListener('scroll', handlePreviewScroll)
    return () => preview.removeEventListener('scroll', handlePreviewScroll)
  }, [scrollSync, isMobile, handlePreviewScroll, previewRef])

  if (isMobile) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <Header
          onConvertClick={() => setShowConvertModal(true)}
          onAboutClick={() => setShowAboutModal(true)}
        />
        <main className="flex-1 flex flex-col overflow-hidden mt-16">
          <div className="flex border-b border-gray-200 bg-white flex-shrink-0">
            <button
              onClick={() => setShowPreview(false)}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                !showPreview
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                showPreview
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Preview
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {!showPreview ? (
              <MarkdownEditor
                value={markdown}
                onChange={setMarkdown}
                onMermaidClick={() => setShowMermaidModal(true)}
                onScroll={handleEditorScroll}
              />
            ) : (
              <MarkdownPreview
                markdown={markdown}
                onExportClick={() => setShowExportModal(true)}
              />
            )}
          </div>

        </main>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header
        onConvertClick={() => setShowConvertModal(true)}
        onAboutClick={() => setShowAboutModal(true)}
      />
      <div className="flex flex-1 overflow-hidden mt-16">
        <main className="flex-1 flex">
          <div className="w-1/2 border-r border-gray-200 bg-white">
            <MarkdownEditor
              ref={editorRef}
              value={markdown}
              onChange={setMarkdown}
              onMermaidClick={() => setShowMermaidModal(true)}
              onScroll={handleEditorScroll}
            />
          </div>
          <div className="w-1/2 bg-white">
            <MarkdownPreview
              ref={previewRef}
              markdown={markdown}
              onExportClick={() => setShowExportModal(true)}
            />
          </div>
        </main>
      </div>

      {/* 模态弹窗 */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        markdown={markdown}
      />

      <MermaidModal
        isOpen={showMermaidModal}
        onClose={() => setShowMermaidModal(false)}
        onInsertTemplate={handleInsertMermaid}
      />

      <ConvertModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        markdown={markdown}
      />

      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />
    </div>
  )
}

export default App
