import { FileDown, Github, Info, RefreshCw } from 'lucide-react'

interface HeaderProps {
  onConvertClick?: () => void
  onAboutClick?: () => void
}

export function Header({ onConvertClick, onAboutClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-6 py-4 backdrop-blur-sm bg-opacity-95">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FileDown className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Markdown Tools
            </h1>
          </div>
          <span className="text-sm text-gray-500">
            Professional Markdown Editor & Tools
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onConvertClick}
            className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors group"
            title="Format converter tool"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <button
            onClick={onAboutClick}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="About Markdown Tools"
          >
            <Info className="w-5 h-5" />
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="View on GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  )
}