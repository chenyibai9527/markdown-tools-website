import { useState, useEffect } from 'react'
import { Copy, RefreshCw, ArrowUpDown, ChevronDown } from 'lucide-react'
import { ConvertUtils } from '../utils/convertUtils'
import { Modal } from './Modal'

interface ConvertModalProps {
  isOpen: boolean
  onClose: () => void
  markdown: string
}

export function ConvertModal({ isOpen, onClose, markdown }: ConvertModalProps) {
  const [conversionInput, setConversionInput] = useState<string>('')
  const [conversionOutput, setConversionOutput] = useState<string>('')
  const [conversionType, setConversionType] = useState<string>('md-to-html')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const conversionOptions = [
    { value: 'md-to-html', label: 'Markdown → HTML' },
    { value: 'html-to-md', label: 'HTML → Markdown' },
    { value: 'md-to-json', label: 'Markdown → JSON' },
    { value: 'json-to-md', label: 'JSON → Markdown' }
  ]

  // Handle dropdown interactions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        const target = event.target as HTMLElement
        if (!target.closest('.relative')) {
          setIsDropdownOpen(false)
        }
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isDropdownOpen])

  const handleConvert = () => {
    const input = conversionInput || markdown

    try {
      let output = ''

      switch (conversionType) {
        case 'md-to-html':
          output = ConvertUtils.markdownToHTML(input)
          break
        case 'html-to-md':
          output = ConvertUtils.htmlToMarkdown(input)
          break
        case 'md-to-json':
          output = JSON.stringify(ConvertUtils.markdownToJSON(input), null, 2)
          break
        case 'json-to-md':
          try {
            const jsonData = JSON.parse(input)
            output = ConvertUtils.jsonToMarkdown(jsonData)
          } catch (e) {
            output = 'JSON format error, please check your input'
          }
          break
        default:
          output = 'Unsupported conversion type'
      }

      setConversionOutput(output)
    } catch (error) {
      setConversionOutput(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleSwapConversion = () => {
    setConversionOutput(conversionInput)
    setConversionInput(conversionOutput)

    // 交换转换类型
    const typeMap: Record<string, string> = {
      'md-to-html': 'html-to-md',
      'html-to-md': 'md-to-html',
      'md-to-json': 'json-to-md',
      'json-to-md': 'md-to-json'
    }

    setConversionType(typeMap[conversionType] || conversionType)
  }

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(conversionOutput)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Format Conversion" size="lg">
      <div className="space-y-4">
        {/* Conversion type selection */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Select Conversion Type</h3>
          <button
            onClick={handleSwapConversion}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Swap input/output"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-between group"
            >
              <div className="flex items-center">
                <span className="text-gray-900 group-hover:text-gray-700">{conversionOptions.find(opt => opt.value === conversionType)?.label}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <div className="py-1 max-h-48 overflow-y-auto">
                  {conversionOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setConversionType(option.value)
                        setIsDropdownOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 flex items-center"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 输入输出区域 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input Content
            </label>
            <textarea
              value={conversionInput}
              onChange={(e) => setConversionInput(e.target.value)}
              placeholder="Enter content to convert, leave empty to use current editor content"
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm font-mono"
            />
            {!conversionInput && (
              <p className="text-xs text-gray-500 mt-1">
                Will use {markdown.length} characters from current editor
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Conversion Result
              </label>
              {conversionOutput && (
                <button
                  onClick={handleCopyOutput}
                  className="flex items-center px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded text-sm transition-colors"
                  title="Copy result"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </button>
              )}
            </div>
            <textarea
              value={conversionOutput}
              readOnly
              placeholder="Conversion result will be displayed here"
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm resize-none font-mono"
            />
          </div>
        </div>

        {/* Convert button */}
        <button
          onClick={handleConvert}
          className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Start Conversion
        </button>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Usage Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Leave input empty to automatically use current editor content</li>
            <li>• Click swap button to quickly switch input/output and conversion direction</li>
            <li>• JSON format supports conversion between structured data and Markdown</li>
            <li>• Conversion results can be directly copied and used</li>
          </ul>
        </div>
      </div>
    </Modal>
  )
}