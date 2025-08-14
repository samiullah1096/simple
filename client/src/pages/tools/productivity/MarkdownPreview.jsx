import React, { useState, useMemo } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const MarkdownPreview = ({ tool }) => {
  const [markdownInput, setMarkdownInput] = useState('');
  const [viewMode, setViewMode] = useState('split'); // split, edit, preview
  const [customCSS, setCustomCSS] = useState('');
  const [showCustomCSS, setShowCustomCSS] = useState(false);

  // Simple markdown parser
  const parseMarkdown = (markdown) => {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
    html = html.replace(/_(.*?)_/gim, '<em>$1</em>');

    // Strikethrough
    html = html.replace(/~~(.*?)~~/gim, '<del>$1</del>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');
    
    // Inline code
    html = html.replace(/`(.*?)`/gim, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img alt="$1" src="$2" style="max-width: 100%; height: auto;" />');

    // Unordered lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr>');
    html = html.replace(/^\*\*\*$/gim, '<hr>');

    // Line breaks
    html = html.replace(/\n\n/gim, '</p><p>');
    html = html.replace(/\n/gim, '<br>');

    // Wrap in paragraphs
    html = '<p>' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/gim, '');
    html = html.replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/gim, '$1');
    html = html.replace(/<p>(<ul>.*<\/ul>)<\/p>/gims, '$1');
    html = html.replace(/<p>(<blockquote>.*<\/blockquote>)<\/p>/gim, '$1');
    html = html.replace(/<p>(<hr>)<\/p>/gim, '$1');
    html = html.replace(/<p>(<pre><code>[\s\S]*?<\/code><\/pre>)<\/p>/gim, '$1');

    return html;
  };

  const htmlOutput = useMemo(() => parseMarkdown(markdownInput), [markdownInput]);

  const copyHTML = () => {
    navigator.clipboard.writeText(htmlOutput).then(() => {
      // Visual feedback could be added here
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = htmlOutput;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  };

  const downloadHTML = () => {
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Preview</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
        }
        h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 10px; }
        h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 8px; }
        h3 { font-size: 1.25em; }
        code {
            background-color: rgba(27,31,35,0.05);
            border-radius: 3px;
            padding: 2px 4px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 85%;
        }
        pre {
            background-color: #f6f8fa;
            border-radius: 6px;
            padding: 16px;
            overflow: auto;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 85%;
            line-height: 1.45;
        }
        blockquote {
            border-left: 4px solid #dfe2e5;
            padding: 0 16px;
            color: #6a737d;
        }
        ul, ol {
            padding-left: 2em;
        }
        a {
            color: #0366d6;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        hr {
            border: none;
            border-top: 1px solid #eaecef;
            margin: 24px 0;
        }
        ${customCSS}
    </style>
</head>
<body>
    ${htmlOutput}
</body>
</html>`;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown-preview.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSampleMarkdown = () => {
    const sample = `# Markdown Preview Demo

This is a **demo** of the Markdown Preview tool.

## Features

- **Bold text** and *italic text*
- ~~Strikethrough text~~
- \`inline code\` and code blocks
- [Links](https://example.com)
- Lists and more!

### Code Example

\`\`\`javascript
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

### List Example

1. First item
2. Second item
3. Third item

- Bullet point
- Another bullet
- And another

### Quote Example

> This is a blockquote.
> It can span multiple lines.

### Horizontal Rule

---

That's the demo! Try editing this text to see the preview update in real-time.`;
    setMarkdownInput(sample);
  };

  const clearAll = () => {
    setMarkdownInput('');
    setCustomCSS('');
  };

  return (
    <ToolShell tool={tool}>
      <div className="space-y-6">
        {/* View Mode Controls */}
        <div className="glassmorphism rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-100">View Mode</h3>
            <div className="flex space-x-2">
              <button
                onClick={loadSampleMarkdown}
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm"
                data-testid="button-load-sample"
              >
                <i className="fas fa-file-text mr-2"></i>
                Load Sample
              </button>
              <button
                onClick={clearAll}
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm"
                data-testid="button-clear"
              >
                <i className="fas fa-trash mr-2"></i>
                Clear
              </button>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {['split', 'edit', 'preview'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  viewMode === mode
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                data-testid={`button-view-${mode}`}
              >
                <i className={`fas ${mode === 'split' ? 'fa-columns' : mode === 'edit' ? 'fa-edit' : 'fa-eye'} mr-2`}></i>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Custom CSS Toggle */}
        <div className="glassmorphism rounded-xl p-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showCustomCSS}
              onChange={(e) => setShowCustomCSS(e.target.checked)}
              className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
              data-testid="checkbox-show-custom-css"
            />
            <span className="text-slate-300">Add Custom CSS</span>
          </label>
          
          {showCustomCSS && (
            <div className="mt-4">
              <label className="block text-slate-300 mb-2">Custom CSS</label>
              <textarea
                value={customCSS}
                onChange={(e) => setCustomCSS(e.target.value)}
                placeholder="Add your custom CSS here..."
                className="w-full h-32 px-4 py-3 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-green-400 font-mono text-sm resize-vertical"
                data-testid="textarea-custom-css"
              />
            </div>
          )}
        </div>

        {/* Editor/Preview Area */}
        <div className="glassmorphism rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-100">
              {viewMode === 'edit' ? 'Markdown Editor' : viewMode === 'preview' ? 'HTML Preview' : 'Editor & Preview'}
            </h3>
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className="flex space-x-2">
                <button
                  onClick={copyHTML}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  data-testid="button-copy-html"
                >
                  <i className="fas fa-copy mr-2"></i>
                  Copy HTML
                </button>
                <button
                  onClick={downloadHTML}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                  data-testid="button-download-html"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download
                </button>
              </div>
            )}
          </div>
          
          <div className={`grid ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-4`}>
            {/* Editor */}
            {(viewMode === 'edit' || viewMode === 'split') && (
              <div>
                {viewMode === 'split' && <h4 className="text-slate-300 font-medium mb-2">Markdown Input</h4>}
                <textarea
                  value={markdownInput}
                  onChange={(e) => setMarkdownInput(e.target.value)}
                  placeholder="Enter your Markdown here..."
                  className="w-full h-96 px-4 py-3 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-green-400 font-mono text-sm resize-vertical"
                  data-testid="textarea-markdown-input"
                />
              </div>
            )}
            
            {/* Preview */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div>
                {viewMode === 'split' && <h4 className="text-slate-300 font-medium mb-2">HTML Preview</h4>}
                <div
                  className="h-96 p-4 bg-white rounded-lg overflow-auto prose prose-sm max-w-none"
                  style={{ 
                    color: '#333',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    lineHeight: '1.6'
                  }}
                  dangerouslySetInnerHTML={{ __html: htmlOutput }}
                  data-testid="div-preview-output"
                />
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Features</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Real-time Markdown to HTML conversion</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Support for headers, lists, links, images, code blocks</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Bold, italic, strikethrough text formatting</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Custom CSS styling options</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Export as complete HTML file</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Multiple view modes: editor, preview, split view</span>
            </li>
          </ul>
        </div>
      </div>
    </ToolShell>
  );
};

export default MarkdownPreview;