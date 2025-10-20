# Markdown Tools Website

<div align="center">

![Markdown Tools Logo](https://img.shields.io/badge/Markdown-Tools-blue?style=for-the-badge&logo=markdown)

**A powerful and feature-rich Markdown editor with real-time preview, diagram generation, and format conversion capabilities.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)](https://vitejs.dev/)

[Live Demo](https://markdowntools.aibiei.com) · [Report Bug](https://github.com/chenyibai9527/markdown-tools-website/issues) · [Request Feature](https://github.com/chenyibai9527/markdown-tools-website/issues)

</div>

## ✨ Features

### 📝 **Professional Markdown Editor**
- **Syntax Highlighting** - Full Markdown syntax support with color highlighting
- **Line Numbers** - Clean line numbering for better code navigation
- **Auto Word Wrap** - Smart text wrapping for improved readability
- **Fullscreen Mode** - Distraction-free editing environment
- **Dark Theme** - Eye-friendly dark mode for extended editing sessions

### 👁️ **Real-time Preview**
- **Live Rendering** - Instant preview as you type
- **Synchronized Scrolling** - Editor and preview scroll together for perfect alignment
- **Responsive Design** - Mobile-friendly interface that works everywhere

### 📊 **Diagram Generation**
- **Mermaid Support** - Create beautiful diagrams with Mermaid syntax
- **Rich Template Library** - Pre-built templates for:
  - Flowcharts and sequence diagrams
  - Gantt charts and timelines
  - Class diagrams and ER diagrams
  - Mind maps and organizational charts
- **Easy Insertion** - One-click template insertion with customizable examples

### 📄 **Export Capabilities**
- **Multiple Formats** - Export your Markdown to:
  - HTML files with styling
  - PDF documents
  - DOCX files for Microsoft Word
- **Preserved Formatting** - All diagrams, tables, and formatting maintained

### 🔄 **Format Conversion**
- **Bidirectional Conversion** - Convert between:
  - Markdown ↔ HTML
  - Markdown ↔ JSON
- **Smart Parsing** - Intelligent structure recognition and conversion
- **Error Handling** - Clear feedback for conversion issues

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chenyibai9527/markdown-tools-website.git
   cd markdown-tools-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application in action.

### Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## 🛠️ Technology Stack

| Technology | Version | Description |
|------------|---------|-------------|
| **React** | 18.2+ | UI framework for building interactive interfaces |
| **TypeScript** | 5.0+ | Type-safe JavaScript development |
| **Vite** | 5.0+ | Fast build tool and development server |
| **Tailwind CSS** | 3.x | Utility-first CSS framework for styling |
| **CodeMirror** | 6.x | Professional code editor component |
| **Mermaid.js** | Latest | Diagram generation library |
| **React Markdown** | Latest | Markdown parsing and rendering |
| **HTML2Canvas + jsPDF** | Latest | Export functionality for PDF generation |

## 📖 Usage Guide

### Basic Editing

1. **Start Writing** - Simply type in the left editor panel
2. **Live Preview** - See your formatted content on the right
3. **Use Shortcuts** - Leverage Markdown syntax for quick formatting

### Adding Diagrams

1. Click the **"Diagram"** button in the editor toolbar
2. **Choose a Template** - Browse the categorized template library
3. **Customize** - Modify the template code to fit your needs
4. **Insert** - Add the diagram to your document

### Exporting Your Work

1. Click the **"Export"** button in the preview panel
2. **Select Format** - Choose HTML, PDF, or DOCX
3. **Download** - Get your formatted document instantly

### Format Conversion

1. Click **"Convert"** in the header menu
2. **Select Conversion Type** - Choose your desired conversion
3. **Input Content** - Either use current editor content or paste new content
4. **Convert & Copy** - Get your converted format immediately

## 🎨 Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| **Bold** | `Ctrl/Cmd + B` |
| **Italic** | `Ctrl/Cmd + I` |
| **Fullscreen Editor** | `Click fullscreen button` |
| **Exit Fullscreen** | `Esc` |
| **Copy Markdown** | `Click Copy button` |
| **Download .md** | `Click Download button` |

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Custom configuration (if needed)
VITE_APP_TITLE=Markdown Tools
VITE_APP_VERSION=1.0.0
```

### Customization

The application is built with customization in mind:

- **Themes** - Modify Tailwind CSS configuration for color schemes
- **Templates** - Add new Mermaid templates in `src/utils/mermaidTemplates.ts`
- **Export Options** - Extend export functionality in `src/utils/exportUtils.ts`

## 🤝 Contributing

We welcome contributions of all kinds! Here's how you can help:

### 🐛 Reporting Bugs

1. Check existing issues first
2. Use clear, descriptive titles
3. Include steps to reproduce
4. Provide environment details

### 💡 Suggesting Features

1. Open an issue with "Feature Request" label
2. Describe the use case and benefits
3. Consider providing mockups or examples

### 🔧 Pull Requests

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure responsive design considerations
- Test across different browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[CodeMirror](https://codemirror.net/)** - For the excellent code editor component
- **[Mermaid.js](https://mermaid-js.github.io/)** - For powerful diagram generation
- **[React Markdown](https://github.com/remarkjs/react-markdown)** - For robust Markdown parsing
- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - For beautiful icon components

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=chenyibai9527/markdown-tools-website&type=Date)](https://star-history.com/#chenyibai9527/markdown-tools-website&Date)

## 📞 Support

- 📧 **Email**: xiaochenjeffrey@gmail.com
- 💬 **Discussions**: [GitHub Discussions](https://github.com/chenyibai9527/markdown-tools-website/discussions)
- 🐦 **Twitter**: [@Jeffrey Chen](https://x.com/Jeffreyisunique)
- 🐛 **Issues**: [GitHub Issues](https://github.com/chenyibai9527/markdown-tools-website/issues)

---

<div align="center">

**Made with ❤️ by Jeffrey Chen**

[⬆ Back to top](#markdown-tools-website)

</div>