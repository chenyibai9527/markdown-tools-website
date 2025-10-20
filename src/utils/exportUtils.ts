import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { ConvertUtils } from './convertUtils'

export class ExportUtils {
  static convertMarkdownToHTML(markdown: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Markdown Document</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #ffffff;
        }

        h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
        }

        h1 { font-size: 2em; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
        h2 { font-size: 1.5em; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
        h3 { font-size: 1.25em; }

        p { margin-bottom: 16px; }

        ul, ol { margin-bottom: 16px; padding-left: 2em; }

        li { margin-bottom: 4px; }

        blockquote {
            margin: 16px 0;
            padding: 0 16px;
            border-left: 4px solid #e5e7eb;
            color: #6b7280;
            font-style: italic;
        }

        code {
            background: #f3f4f6;
            padding: 2px 4px;
            border-radius: 4px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 0.875em;
        }

        pre {
            background: #f3f4f6;
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
            margin-bottom: 16px;
        }

        pre code {
            background: none;
            padding: 0;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 16px;
        }

        th, td {
            border: 1px solid #e5e7eb;
            padding: 8px 12px;
            text-align: left;
        }

        th {
            background: #f9fafb;
            font-weight: 600;
        }

        a {
            color: #3b82f6;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .mermaid {
            text-align: center;
            margin: 20px 0;
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }

        hr {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 24px 0;
        }
    </style>
</head>
<body>
    ${this.renderMarkdownToHTML(markdown)}
</body>
</html>`
  }

  private static renderMarkdownToHTML(markdown: string): string {
    return ConvertUtils.markdownToHTML(markdown)
  }

  static async exportToHTML(markdown: string, filename: string = 'document.html'): Promise<void> {
    const html = this.convertMarkdownToHTML(markdown)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  static async exportToPDF(element: HTMLElement, filename: string = 'document.pdf'): Promise<void> {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height

      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 200
      const imgX = (pdfWidth - imgWidth * ratio / 200) / 2
      const imgY = 10

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio / 200, imgHeight * ratio / 200)
      pdf.save(filename)
    } catch (error) {
      console.error('PDF export error:', error)
      throw new Error('PDF export failed')
    }
  }

  static async exportToMarkdown(markdown: string, filename: string = 'document.md'): Promise<void> {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  static async exportToText(markdown: string, filename: string = 'document.txt'): Promise<void> {
    const text = markdown.replace(/```mermaid\n[\s\S]*?```/g, '[Chart content omitted]')
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}