export class ConvertUtils {
  // Markdown 转 HTML
  static markdownToHTML(markdown: string): string {
    let html = markdown
      // 标题转换
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // 粗体和斜体
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // 代码块
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      // 行内代码
      .replace(/`(.+?)`/g, '<code>$1</code>')
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // 列表
      .replace(/^\* (.+)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      // 段落
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');

    return html;
  }

  // HTML 转 Markdown（简化版本）
  static htmlToMarkdown(html: string): string {
    let markdown = html
      // 标题转换
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      // 粗体和斜体
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      // 代码块
      .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n')
      // 行内代码
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
      // 链接
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      // 列表
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '* $1')
      // 段落
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      // 清理多余空白
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return markdown;
  }

  // Markdown 转 JSON（结构化）
  static markdownToJSON(markdown: string): any {
    const lines = markdown.split('\n');
    const result: any = {
      metadata: {},
      content: [],
      raw: markdown
    };

    let currentSection = null;
    let currentList = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // 标题
      if (line.startsWith('#')) {
        if (currentList.length > 0) {
          result.content.push({ type: 'list', items: currentList });
          currentList = [];
        }

        const level = line.match(/^#+/)?.[0].length || 1;
        const title = line.replace(/^#+\s*/, '');

        currentSection = {
          type: 'heading',
          level,
          title,
          children: [] as any[]
        };
        result.content.push(currentSection);
      }
      // 列表项
      else if (line.startsWith('*') || line.startsWith('-') || line.match(/^\d+\./)) {
        const item = line.replace(/^[*\-\d.]\s*/, '');
        currentList.push(item);
      }
      // 普通段落
      else if (line && !line.startsWith('```')) {
        if (currentList.length > 0) {
          result.content.push({ type: 'list', items: currentList });
          currentList = [];
        }

        const paragraph = {
          type: 'paragraph',
          text: line
        };

        if (currentSection) {
          currentSection.children.push(paragraph);
        } else {
          result.content.push(paragraph);
        }
      }
    }

    // 添加最后的列表
    if (currentList.length > 0) {
      result.content.push({ type: 'list', items: currentList });
    }

    return result;
  }

  // JSON 转 Markdown
  static jsonToMarkdown(json: any): string {
    if (!json.content && !json.raw) {
      return '';
    }

    if (json.raw) {
      return json.raw;
    }

    let markdown = '';

    const processNode = (node: any) => {
      switch (node.type) {
        case 'heading':
          markdown += '#'.repeat(node.level) + ' ' + node.title + '\n\n';
          if (node.children) {
            node.children.forEach(processNode);
          }
          break;
        case 'paragraph':
          markdown += node.text + '\n\n';
          break;
        case 'list':
          node.items.forEach((item: string) => {
            markdown += '* ' + item + '\n';
          });
          markdown += '\n';
          break;
      }
    };

    if (json.content) {
      json.content.forEach(processNode);
    }

    return markdown.trim();
  }

  // 文本统计
  static getTextStats(text: string): any {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const lines = text.split('\n').length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

    return {
      words: words.length,
      characters,
      charactersNoSpaces,
      lines,
      paragraphs,
      readingTime: Math.ceil(words.length / 200) // 假设每分钟读200词
    };
  }
}