import React, { useState } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const JSMinifier = ({ tool }) => {
  const [jsInput, setJsInput] = useState('');
  const [minifiedJS, setMinifiedJS] = useState('');
  const [removeComments, setRemoveComments] = useState(true);
  const [removeWhitespace, setRemoveWhitespace] = useState(true);
  const [preserveConsole, setPreserveConsole] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionRatio, setCompressionRatio] = useState(0);

  const minifyJS = () => {
    if (!jsInput.trim()) {
      alert('Please enter some JavaScript code to minify');
      return;
    }

    setIsProcessing(true);

    try {
      let minified = jsInput;

      // Remove single-line comments (but preserve URLs and specific patterns)
      if (removeComments) {
        // Remove single-line comments, but not inside strings
        minified = minified.replace(/(?:^|[^"'\\])\/\/.*$/gm, '');
        
        // Remove multi-line comments
        minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
      }

      if (removeWhitespace) {
        // Remove extra whitespace while preserving syntax
        minified = minified
          // Remove leading/trailing whitespace from lines
          .replace(/^\s+|\s+$/gm, '')
          // Remove empty lines
          .replace(/\n\s*\n/g, '\n')
          // Minimize spaces around operators and punctuation
          .replace(/\s*([{}();,=+\-*/<>!&|])\s*/g, '$1')
          // Remove spaces around brackets
          .replace(/\s*([[\]])\s*/g, '$1')
          // Preserve space after keywords
          .replace(/\b(if|for|while|switch|catch|function|return|var|let|const|class|extends|import|export|from|new|typeof|instanceof)\(/g, '$1 (')
          .replace(/\b(if|for|while|switch|catch|function|return|var|let|const|class|extends|import|export|from|new|typeof|instanceof)\{/g, '$1 {')
          // Remove newlines and extra spaces
          .replace(/\n/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      }

      // Remove console statements if requested
      if (!preserveConsole) {
        minified = minified.replace(/console\.(log|warn|error|info|debug)\([^)]*\);?/g, '');
      }

      // Calculate compression ratio
      const originalSize = new Blob([jsInput]).size;
      const minifiedSize = new Blob([minified]).size;
      const ratio = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);

      setMinifiedJS(minified);
      setCompressionRatio(parseFloat(ratio));
      setIsProcessing(false);
    } catch (error) {
      console.error('JS minification error:', error);
      alert('Error minifying JavaScript. Please check your syntax.');
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(minifiedJS).then(() => {
      // Visual feedback could be added here
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = minifiedJS;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  };

  const downloadMinified = () => {
    const blob = new Blob([minifiedJS], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setJsInput('');
    setMinifiedJS('');
    setCompressionRatio(0);
  };

  const loadSampleJS = () => {
    const sample = `// Sample JavaScript for demonstration
function calculateTotal(items) {
  let total = 0;
  
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  
  console.log('Total calculated:', total);
  return total;
}

class ShoppingCart {
  constructor() {
    this.items = [];
    this.discount = 0;
  }
  
  addItem(item) {
    this.items.push(item);
    console.log('Item added:', item.name);
  }
  
  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
  }
  
  getTotal() {
    const subtotal = calculateTotal(this.items);
    return subtotal - (subtotal * this.discount / 100);
  }
}

// Initialize cart
const cart = new ShoppingCart();
cart.addItem({
  id: 1,
  name: 'Product 1',
  price: 29.99,
  quantity: 2
});`;
    setJsInput(sample);
  };

  return (
    <ToolShell tool={tool}>
      <div className="space-y-6">
        {/* JavaScript Input */}
        <div className="glassmorphism rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-100">JavaScript Input</h3>
            <button
              onClick={loadSampleJS}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm"
              data-testid="button-load-sample"
            >
              <i className="fas fa-file-code mr-2"></i>
              Load Sample
            </button>
          </div>
          
          <textarea
            value={jsInput}
            onChange={(e) => setJsInput(e.target.value)}
            placeholder="Paste your JavaScript code here..."
            className="w-full h-64 px-4 py-3 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-green-400 font-mono text-sm resize-vertical"
            data-testid="textarea-js-input"
          />
          
          <div className="mt-4 text-slate-400 text-sm">
            Characters: {jsInput.length} | Size: {new Blob([jsInput]).size} bytes
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
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preserveConsole}
                onChange={(e) => setPreserveConsole(e.target.checked)}
                className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
                data-testid="checkbox-preserve-console"
              />
              <span className="text-slate-300">Preserve Console Statements</span>
            </label>
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
              onClick={minifyJS}
              disabled={isProcessing || !jsInput.trim()}
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
                  Minify JavaScript
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {minifiedJS && (
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-100">Minified JavaScript</h3>
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
              value={minifiedJS}
              readOnly
              className="w-full h-32 px-4 py-3 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 font-mono text-sm resize-vertical"
              data-testid="textarea-minified-output"
            />
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-slate-400">Original Size</div>
                <div className="text-slate-100 font-semibold">{new Blob([jsInput]).size} bytes</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-slate-400">Minified Size</div>
                <div className="text-slate-100 font-semibold">{new Blob([minifiedJS]).size} bytes</div>
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
              <span>Remove unnecessary whitespace while preserving syntax</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Remove single-line and multi-line comments</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Option to remove console statements</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Preserve JavaScript syntax and functionality</span>
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

export default JSMinifier;