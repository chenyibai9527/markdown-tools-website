import { useState, useEffect } from 'react'
import { Plus, Search, ChevronDown } from 'lucide-react'
import { mermaidTemplates, getAllCategories, getTemplatesByCategory } from '../utils/mermaidTemplates'
import { Modal } from './Modal'

interface MermaidModalProps {
  isOpen: boolean
  onClose: () => void
  onInsertTemplate: (template: string) => void
}

export function MermaidModal({ isOpen, onClose, onInsertTemplate }: MermaidModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)


  const handleInsertTemplate = (template: string) => {
    onInsertTemplate(template)
    onClose()
  }

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

  const getFilteredTemplates = () => {
    let templates = selectedCategory === 'All'
      ? mermaidTemplates
      : getTemplatesByCategory(selectedCategory)

    if (searchTerm) {
      templates = templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return templates
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Insert Diagram" size="lg">
      <div className="space-y-4">
        {/* Search and category filter */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chart templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="relative w-48">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-between group"
          >
            <span className="text-gray-900 group-hover:text-gray-700">{selectedCategory}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <div className="py-1 max-h-60 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All')
                    setIsDropdownOpen(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                >
                  All Categories
                </button>
                {getAllCategories().map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category)
                      setIsDropdownOpen(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        </div>

        {/* Chart template grid */}
        <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {getFilteredTemplates().map(template => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 text-sm">{template.name}</h5>
                  <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                </div>
                <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">
                  {template.category}
                </span>
              </div>

              {/* Template preview */}
              <div className="bg-gray-50 rounded p-2 mb-3 text-xs font-mono text-gray-700 max-h-20 overflow-auto">
                <pre>{template.template.substring(0, 100)}{template.template.length > 100 ? '...' : ''}</pre>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleInsertTemplate(template.template)}
                  className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm transition-colors font-medium"
                  title="Insert to editor"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Insert to Editor
                </button>
              </div>
            </div>
          ))}
        </div>

        {getFilteredTemplates().length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No matching chart templates found</p>
          </div>
        )}

        {/* Usage Instructions */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">📝 How to Use</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Select a chart template and click "Insert" to add it to the editor</li>
            <li>• You can also click "Copy" to copy the template code to clipboard</li>
            <li>• Use ```mermaid code blocks in the editor to wrap chart code</li>
            <li>• Charts will automatically render in the preview area</li>
          </ul>
        </div>
      </div>
    </Modal>
  )
}