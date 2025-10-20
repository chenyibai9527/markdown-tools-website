import { useEffect, useRef, useState, forwardRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Maximize2, Minimize2, Download } from 'lucide-react'
import { useDebounce } from '../hooks/useDebounce'

interface MarkdownPreviewProps {
  markdown: string
  onExportClick?: () => void
}

const MarkdownPreviewInner = ({ markdown, onExportClick }: MarkdownPreviewProps, ref: React.Ref<HTMLDivElement>) => {
  const internalPreviewRef = useRef<HTMLDivElement>(null)
  const previewRef = (ref as React.RefObject<HTMLDivElement>) || internalPreviewRef
  const [mermaidInitialized, setMermaidInitialized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const debouncedMarkdown = useDebounce(markdown, 300)

  
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

  useEffect(() => {
    const initMermaid = async () => {
      if (!mermaidInitialized) {
        try {
          const mermaid = await import('mermaid')
          mermaid.default.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            themeVariables: {
              primaryColor: '#3b82f6',
              primaryTextColor: '#1f2937',
              primaryBorderColor: '#e5e7eb',
              lineColor: '#6b7280',
              sectionBkgColor: '#f9fafb',
              altSectionBkgColor: '#ffffff',
              gridColor: '#e5e7eb',
              secondaryColor: '#10b981',
              tertiaryColor: '#f59e0b'
            }
          })
          setMermaidInitialized(true)
        } catch (error) {
          console.error('Failed to initialize Mermaid:', error)
        }
      }
    }

    initMermaid()
  }, [mermaidInitialized])

  useEffect(() => {
    if (mermaidInitialized && previewRef.current) {
      import('mermaid').then((mermaid) => {
        const mermaidElements = previewRef.current?.querySelectorAll('.mermaid')
        if (mermaidElements && mermaidElements.length > 0) {
          mermaid.default.run({
            nodes: Array.from(mermaidElements) as HTMLElement[]
          }).catch((error: any) => {
            console.error('Mermaid rendering error:', error)
          })
        }
      })
    }
  }, [debouncedMarkdown, mermaidInitialized])

  return (
    <div className={`flex flex-col h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-200 h-14">
        <div className="flex items-center space-x-3">
          <h2 className="font-medium text-gray-900">
            Preview
          </h2>
          <div className="text-sm text-gray-500">
            Real-time Markdown preview
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={onExportClick}
            className="group relative px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 flex items-center space-x-2"
            title="Export document (HTML, PDF, etc.)"
          >
            <Download className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-xs font-medium text-indigo-600">Export</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="group relative px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center space-x-2"
            title={isFullscreen ? 'Exit fullscreen preview' : 'Enter fullscreen preview'}
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

      <div
        ref={previewRef}
        className="flex-1 overflow-auto p-4"
      >
        <div className="prose prose-gray max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '')
                const language = match ? match[1] : ''
                const isInline = !className

                if (language === 'mermaid' && !isInline) {
                  return (
                    <div className="mermaid p-4 bg-gray-50 rounded-lg">
                      {String(children).replace(/\n$/, '')}
                    </div>
                  )
                }

                if (!isInline && language) {
                  return (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={language}
                      PreTag="div"
                      className="rounded-lg"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  )
                }

                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
              table({ children }) {
                return (
                  <div className="overflow-x-auto my-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      {children}
                    </table>
                  </div>
                )
              },
              th({ children }) {
                return (
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    {children}
                  </th>
                )
              },
              td({ children }) {
                return (
                  <td className="px-3 py-2 text-sm text-gray-900">
                    {children}
                  </td>
                )
              }
            }}
          >
            {debouncedMarkdown}
          </ReactMarkdown>
        </div>
      </div>

      {isFullscreen && (
        <div className="absolute bottom-4 left-4 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm">
          Press ESC to exit fullscreen
        </div>
      )}
    </div>
  )
}

export const MarkdownPreview = forwardRef(MarkdownPreviewInner)