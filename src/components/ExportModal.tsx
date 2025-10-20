import { useState } from 'react'
import { Download, FileText, Share, Loader, BarChart3 } from 'lucide-react'
import { ExportUtils } from '../utils/exportUtils'
import { ConvertUtils } from '../utils/convertUtils'
import { Modal } from './Modal'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  markdown: string
}

export function ExportModal({ isOpen, onClose, markdown }: ExportModalProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null)

  const handleExport = async (format: string) => {
    setIsExporting(format)
    try {
      switch (format) {
        case 'html':
          await ExportUtils.exportToHTML(markdown)
          break
        case 'pdf':
          const previewElement = document.querySelector('.prose') as HTMLElement
          if (previewElement) {
            await ExportUtils.exportToPDF(previewElement)
          } else {
            throw new Error('Preview element not found')
          }
          break
        case 'markdown':
          await ExportUtils.exportToMarkdown(markdown)
          break
        case 'text':
          await ExportUtils.exportToText(markdown)
          break
        default:
          throw new Error('Unsupported export format')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsExporting(null)
    }
  }

  const stats = ConvertUtils.getTextStats(markdown)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Document" size="md">
      <div className="space-y-6">
        {/* 导出格式选项 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Export Format</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleExport('html')}
              disabled={isExporting !== null}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors group"
            >
              <FileText className="w-5 h-5 mr-2 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium">HTML</span>
              {isExporting === 'html' && <Loader className="w-4 h-4 ml-2 animate-spin" />}
            </button>

            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting !== null}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors group"
            >
              <Download className="w-5 h-5 mr-2 text-red-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium">PDF</span>
              {isExporting === 'pdf' && <Loader className="w-4 h-4 ml-2 animate-spin" />}
            </button>

            <button
              onClick={() => handleExport('markdown')}
              disabled={isExporting !== null}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors group"
            >
              <FileText className="w-5 h-5 mr-2 text-green-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Markdown</span>
              {isExporting === 'markdown' && <Loader className="w-4 h-4 ml-2 animate-spin" />}
            </button>

            <button
              onClick={() => handleExport('text')}
              disabled={isExporting !== null}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors group"
            >
              <Share className="w-5 h-5 mr-2 text-gray-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Plain Text</span>
              {isExporting === 'text' && <Loader className="w-4 h-4 ml-2 animate-spin" />}
            </button>
          </div>
        </div>

        {/* 文档统计 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <BarChart3 className="w-5 h-5 mr-2 text-gray-700" />
            <h3 className="text-lg font-medium text-gray-900">Document Statistics</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Characters:</span>
              <span className="font-medium text-gray-900">{stats.characters.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Words:</span>
              <span className="font-medium text-gray-900">{stats.words.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Lines:</span>
              <span className="font-medium text-gray-900">{stats.lines}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Paragraphs:</span>
              <span className="font-medium text-gray-900">{stats.paragraphs}</span>
            </div>
            <div className="flex justify-between col-span-2">
              <span className="text-gray-600">Reading Time:</span>
              <span className="font-medium text-gray-900">{stats.readingTime} min</span>
            </div>
          </div>
        </div>

        {/* 提示信息 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Export Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• PDF export includes current preview content, Mermaid charts are rendered as images</li>
            <li>• HTML format preserves all styles and interactive effects</li>
            <li>• Plain text format is suitable for copying to other editors</li>
          </ul>
        </div>
      </div>
    </Modal>
  )
}