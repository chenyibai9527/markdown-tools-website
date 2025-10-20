import { useState, useCallback, forwardRef, useEffect, useMemo } from 'react'
import { Maximize2, Minimize2, Copy, Check, FileDown, Plus } from 'lucide-react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import { lineNumbers, EditorView, keymap, ViewPlugin } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  onMermaidClick?: () => void
  onScroll?: (scrollTop: number, scrollHeight: number, clientHeight: number) => void
}

const MarkdownEditorInner = ({ value, onChange, onMermaidClick, onScroll }: MarkdownEditorProps, ref: React.Ref<any>) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }, [value])

  const handleDownload = useCallback(() => {
    const blob = new Blob([value], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    a.click()
    URL.revokeObjectURL(url)
  }, [value])

  // Create scroll plugin
  const scrollPlugin = useMemo(() => {
    if (!onScroll) return null

    return ViewPlugin.fromClass(class {
      private view: EditorView

      constructor(view: EditorView) {
        this.view = view
        this.setupScrollListener()
      }

      private setupScrollListener() {
        const scroller = this.view.scrollDOM
        if (!scroller || !onScroll) return

        const handleScroll = () => {
          const rect = this.view.contentDOM.getBoundingClientRect()
          const scrollTop = Math.max(0, -rect.top)
          const scrollHeight = scroller.scrollHeight
          const clientHeight = scroller.clientHeight
          onScroll(scrollTop, scrollHeight, clientHeight)
        }

        scroller.addEventListener('scroll', handleScroll, { passive: true })
        ;(this as any)._cleanup = () => scroller.removeEventListener('scroll', handleScroll)
      }

      destroy() {
        if ((this as any)._cleanup) (this as any)._cleanup()
      }
    })
  }, [onScroll])

  // ESC键退出全屏
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen])

  return (
    <div className={`flex flex-col h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-200 h-14">
        <h2 className="font-medium text-gray-900">Editor</h2>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleCopy}
            className={`group relative px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
              copySuccess
                ? 'text-green-600 bg-green-50 hover:bg-green-100'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            title={copySuccess ? 'Copied!' : 'Copy Markdown source'}
          >
            {copySuccess ? (
              <>
                <Check className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                <span className="text-xs font-medium text-blue-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                <span className="text-xs font-medium text-blue-600">Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="group relative px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 flex items-center space-x-2"
            title="Download as .md file"
          >
            <FileDown className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-xs font-medium text-green-600">Download</span>
          </button>

          <div className="w-px h-6 bg-gray-300"></div>

          <button
            onClick={onMermaidClick}
            className="group relative px-3 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 flex items-center space-x-2"
            title="Insert Mermaid diagram (flowchart, sequence, etc.)"
          >
            <Plus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-xs font-medium text-purple-600">Diagram</span>
          </button>

          <div className="w-px h-6 bg-gray-300"></div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="group relative px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center space-x-2"
            title={isFullscreen ? 'Exit fullscreen editing mode' : 'Enter fullscreen editing mode'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                <span className="text-xs font-medium text-gray-900">Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                <span className="text-xs font-medium text-gray-900">Fullscreen</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <CodeMirror
          ref={ref}
          value={value}
          height="100%"
          onChange={(val) => onChange(val)}
          extensions={[
            markdown(),
            lineNumbers(),
            keymap.of(defaultKeymap),
            EditorView.theme({
              "&": {
                height: "100%",
                fontSize: "14px",
                fontFamily: 'ui-monospace, SFMono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Liberation Mono", "Menlo", monospace',
              },
              ".cm-scroller": {
                overflow: "auto",
                fontFamily: 'ui-monospace, SFMono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Liberation Mono", "Menlo", monospace',
                fontSize: '14px',
                lineHeight: '1.5'
              },
              ".cm-content": {
                padding: "16px",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word"
              },
              ".cm-line": {
                whiteSpace: "pre-wrap",
                wordWrap: "break-word"
              }
            }),
            EditorView.lineWrapping,
            ...(scrollPlugin ? [scrollPlugin] : []),
            oneDark,
          ]}
          theme="light"
        />
      </div>

      {isFullscreen && (
        <div className="absolute bottom-4 left-4 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm">
          Press ESC to exit fullscreen
        </div>
      )}
    </div>
  )
}

export const MarkdownEditor = forwardRef(MarkdownEditorInner)