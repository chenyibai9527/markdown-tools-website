import { Code, FileDown, Globe, Github, Mail } from 'lucide-react'
import { Modal } from './Modal'

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="About Markdown Tools" size="md">
      <div className="space-y-6">
        {/* Logo 和标题 */}
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileDown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Markdown Tools</h2>
          <p className="text-gray-600 mt-2">Professional Markdown Editor & Tools</p>
          <div className="mt-4 text-sm text-gray-500">
            Version 1.0.0
          </div>
        </div>

        {/* 特性介绍 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Code className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Real-time Preview</div>
                <div className="text-sm text-gray-500">See changes instantly as you type</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileDown className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Multiple Export Formats</div>
                <div className="text-sm text-gray-500">Export to HTML, PDF, and more</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Diagram Support</div>
                <div className="text-sm text-gray-500">Create flowcharts, sequence diagrams & more</div>
              </div>
            </div>
          </div>
        </div>

        {/* 技术栈 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Built With</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">React 18</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">TypeScript</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Tailwind CSS</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Vite</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Mermaid.js</span>
          </div>
        </div>

        {/* 联系信息 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Get In Touch</h3>
          <div className="space-y-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>
            <a
              href="mailto:support@example.com"
              className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>support@example.com</span>
            </a>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © 2024 Markdown Tools. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Made with ❤️ for the Markdown community
          </p>
        </div>
      </div>
    </Modal>
  )
}