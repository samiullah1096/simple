import React, { useState } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const CSSMinifier = ({ tool }) => {
  const [cssInput, setCssInput] = useState('');
  const [minifiedCSS, setMinifiedCSS] = useState('');
  const [removeComments, setRemoveComments] = useState(true);
  const [removeWhitespace, setRemoveWhitespace] = useState(true);
  const [preserveImportant, setPreserveImportant] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionRatio, setCompressionRatio] = useState(0);

  const minifyCSS = () => {
    if (!cssInput.trim()) {
      alert('Please enter some CSS code to minify');
      return;
    }

    setIsProcessing(true);

    try {
      let minified = cssInput;

      // Remove comments (but preserve important ones if selected)
      if (removeComments) {
        if (preserveImportant) {
          // Keep comments with ! at the start
          minified = minified.replace(/\/\*(?!\s*![\s\S]*?)\*\//g, '');
        } else {
          // Remove all comments
          minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
        }
      }

      if (removeWhitespace) {
        // Remove extra whitespace and newlines
        minified = minified
          // Remove leading/trailing whitespace from lines
          .replace(/^\s+|\s+$/gm, '')
          // Remove empty lines
          .replace(/\n\s*\n/g, '\n')
          // Remove spaces around braces, colons, semicolons
          .replace(/\s*{\s*/g, '{')
          .replace(/\s*}\s*/g, '}')
          .replace(/\s*:\s*/g, ':')
          .replace(/\s*;\s*/g, ';')
          .replace(/\s*,\s*/g, ',')
          // Remove spaces around operators
          .replace(/\s*>\s*/g, '>')
          .replace(/\s*\+\s*/g, '+')
          .replace(/\s*~\s*/g, '~')
          // Remove newlines and extra spaces
          .replace(/\n/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      }

      // Calculate compression ratio
      const originalSize = new Blob([cssInput]).size;
      const minifiedSize = new Blob([minified]).size;
      const ratio = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);

      setMinifiedCSS(minified);
      setCompressionRatio(parseFloat(ratio));
      setIsProcessing(false);
    } catch (error) {
      console.error('CSS minification error:', error);
      alert('Error minifying CSS. Please check your CSS syntax.');
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(minifiedCSS).then(() => {
      // Visual feedback could be added here
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = minifiedCSS;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  };

  const downloadMinified = () => {
    const blob = new Blob([minifiedCSS], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setCssInput('');
    setMinifiedCSS('');
    setCompressionRatio(0);
  };

  const loadSampleCSS = () => {
    const sample = `/* Sample CSS for demonstration */
.header {
  background-color: #333;
  color: white;
  padding: 20px;
  margin: 0;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #0056b3;
}

/* Important comment to preserve */
.important-rule {
  display: flex !important;
  justify-content: space-between;
}`;
    setCssInput(sample);
  };

  return (
    <ToolShell tool={tool}>
      <div className="space-y-6">
        {/* CSS Input */}
        <div className="glassmorphism rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-100">CSS Input</h3>
            <button
              onClick={loadSampleCSS}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm"
              data-testid="button-load-sample"
            >
              <i className="fas fa-file-code mr-2"></i>
              Load Sample
            </button>
          </div>
          
          <textarea
            value={cssInput}
            onChange={(e) => setCssInput(e.target.value)}
            placeholder="Paste your CSS code here..."
            className="w-full h-64 px-4 py-3 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-green-400 font-mono text-sm resize-vertical"
            data-testid="textarea-css-input"
          />
          
          <div className="mt-4 text-slate-400 text-sm">
            Characters: {cssInput.length} | Size: {new Blob([cssInput]).size} bytes
          </div>
        </div>

        {/* Options */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Minification Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={removeComments}
                onChange={(e) => setRemoveComments(e.target.checked)}
                className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
                data-testid="checkbox-remove-comments"
              />
              <span className="text-slate-300">Remove Comments</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={removeWhitespace}
                onChange={(e) => setRemoveWhitespace(e.target.checked)}
                className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
                data-testid="checkbox-remove-whitespace"
              />
              <span className="text-slate-300">Remove Whitespace</span>
            </label>
            
            {removeComments && (
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preserveImportant}
                  onChange={(e) => setPreserveImportant(e.target.checked)}
                  className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
                  data-testid="checkbox-preserve-important"
                />
                <span className="text-slate-300">Preserve Important Comments</span>
              </label>
            )}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={clearAll}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
              data-testid="button-clear"
            >
              <i className="fas fa-trash mr-2"></i>
              Clear All
            </button>
            
            <button
              onClick={minifyCSS}
              disabled={isProcessing || !cssInput.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors"
              data-testid="button-minify"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Minifying...
                </>
              ) : (
                <>
                  <i className="fas fa-compress-alt mr-2"></i>
                  Minify CSS
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {minifiedCSS && (
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-100">Minified CSS</h3>
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  data-testid="button-copy"
                >
                  <i className="fas fa-copy mr-2"></i>
                  Copy
                </button>
                <button
                  onClick={downloadMinified}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                  data-testid="button-download"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download
                </button>
              </div>
            </div>
            
            <textarea
              value={minifiedCSS}
              readOnly
              className="w-full h-32 px-4 py-3 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 font-mono text-sm resize-vertical"
              data-testid="textarea-minified-output"
            />
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-slate-400">Original Size</div>
                <div className="text-slate-100 font-semibold">{new Blob([cssInput]).size} bytes</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-slate-400">Minified Size</div>
                <div className="text-slate-100 font-semibold">{new Blob([minifiedCSS]).size} bytes</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-slate-400">Compression</div>
                <div className="text-green-400 font-semibold">{compressionRatio}% saved</div>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Features</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Remove unnecessary whitespace and formatting</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Remove or preserve comments with options</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Preserve important comments marked with !</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Real-time compression statistics</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>One-click copy and download</span>
            </li>
          </ul>
        </div>
      </div>
    </ToolShell>
  );
};

export default CSSMinifier;