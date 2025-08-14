import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function RemoveDuplicates() {
  const tool = getToolBySlug('text', 'remove-duplicates');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [keepOrder, setKeepOrder] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [stats, setStats] = useState(null);

  const processDuplicates = () => {
    if (!inputText.trim()) {
      setOutputText('');
      setStats(null);
      return;
    }

    let lines = inputText.split('\n');
    const originalCount = lines.length;

    // Trim lines if enabled
    if (trimLines) {
      lines = lines.map(line => line.trim());
    }

    // Remove empty lines if enabled
    if (removeEmpty) {
      lines = lines.filter(line => line.length > 0);
    }

    const afterCleanup = lines.length;

    // Remove duplicates
    let uniqueLines;
    const seen = new Set();
    const duplicates = new Set();

    if (keepOrder) {
      uniqueLines = [];
      lines.forEach(line => {
        const checkLine = caseSensitive ? line : line.toLowerCase();
        if (seen.has(checkLine)) {
          duplicates.add(line);
        } else {
          seen.add(checkLine);
          uniqueLines.push(line);
        }
      });
    } else {
      // Sort alphabetically
      if (caseSensitive) {
        lines.forEach(line => {
          if (seen.has(line)) {
            duplicates.add(line);
          } else {
            seen.add(line);
          }
        });
        uniqueLines = Array.from(seen).sort();
      } else {
        const caseMap = new Map();
        lines.forEach(line => {
          const lowerLine = line.toLowerCase();
          if (caseMap.has(lowerLine)) {
            duplicates.add(line);
          } else {
            caseMap.set(lowerLine, line);
          }
        });
        uniqueLines = Array.from(caseMap.values()).sort((a, b) => 
          a.toLowerCase().localeCompare(b.toLowerCase())
        );
      }
    }

    const result = uniqueLines.join('\n');
    setOutputText(result);
    setStats({
      original: originalCount,
      afterCleanup: afterCleanup,
      duplicates: duplicates.size,
      unique: uniqueLines.length,
      removed: afterCleanup - uniqueLines.length
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setStats(null);
  };

  const loadSample = () => {
    const sample = `apple
banana
cherry
apple
date
banana
fig
grape
apple
cherry
date
kiwi
banana`;
    setInputText(sample);
  };

  const toolContent = (
    <div className="space-y-6">
      {/* Options */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">Processing Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="mr-2"
                data-testid="checkbox-case-sensitive"
              />
              <span className="text-slate-300">Case sensitive comparison</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={keepOrder}
                onChange={(e) => setKeepOrder(e.target.checked)}
                className="mr-2"
                data-testid="checkbox-keep-order"
              />
              <span className="text-slate-300">Keep original order</span>
            </label>
          </div>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={trimLines}
                onChange={(e) => setTrimLines(e.target.checked)}
                className="mr-2"
                data-testid="checkbox-trim-lines"
              />
              <span className="text-slate-300">Trim whitespace from lines</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={removeEmpty}
                onChange={(e) => setRemoveEmpty(e.target.checked)}
                className="mr-2"
                data-testid="checkbox-remove-empty"
              />
              <span className="text-slate-300">Remove empty lines</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium text-slate-200">Input Text</label>
            <div className="flex gap-2">
              <button 
                onClick={loadSample}
                className="text-slate-400 hover:text-slate-200 text-sm"
                data-testid="button-sample"
              >
                Load Sample
              </button>
              <button 
                onClick={clearAll}
                className="text-slate-400 hover:text-slate-200 text-sm"
                data-testid="button-clear"
              >
                Clear All
              </button>
            </div>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-64 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-100 focus:border-cyan-500 focus:outline-none resize-none font-mono text-sm"
            placeholder="Enter text with each line being an item to check for duplicates..."
            data-testid="input-text"
          />
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium text-slate-200">Unique Lines</label>
            {outputText && (
              <button 
                onClick={copyToClipboard}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                data-testid="button-copy"
              >
                <i className="fas fa-copy mr-2"></i>Copy
              </button>
            )}
          </div>
          <textarea
            value={outputText}
            readOnly
            className="w-full h-64 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-100 resize-none font-mono text-sm"
            placeholder="Unique lines will appear here..."
            data-testid="output-text"
          />
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-medium text-slate-200 mb-4">Processing Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-slate-300">{stats.original}</div>
              <div className="text-slate-400 text-sm">Original Lines</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-cyan-400">{stats.unique}</div>
              <div className="text-slate-400 text-sm">Unique Lines</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-400">{stats.removed}</div>
              <div className="text-slate-400 text-sm">Duplicates Removed</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">{Math.round((stats.removed / stats.afterCleanup) * 100) || 0}%</div>
              <div className="text-slate-400 text-sm">Reduction</div>
            </div>
          </div>
        </div>
      )}

      {/* Process Button */}
      <div className="flex justify-center">
        <motion.button
          onClick={processDuplicates}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!inputText.trim()}
          data-testid="button-process"
        >
          <i className="fas fa-filter mr-2"></i>Remove Duplicates
        </motion.button>
      </div>

      {/* How It Works */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
          <div>
            <h4 className="font-medium text-cyan-400 mb-2">Processing Steps:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Split input into individual lines</li>
              <li>Optionally trim whitespace from each line</li>
              <li>Optionally remove empty lines</li>
              <li>Compare lines (case-sensitive or insensitive)</li>
              <li>Keep only unique lines (first occurrence)</li>
              <li>Output results with statistics</li>
            </ol>
          </div>
          <div>
            <h4 className="font-medium text-cyan-400 mb-2">Options Explained:</h4>
            <ul className="space-y-1">
              <li><strong>Case sensitive:</strong> "Apple" ≠ "apple"</li>
              <li><strong>Keep order:</strong> Preserve original sequence</li>
              <li><strong>Trim lines:</strong> Remove leading/trailing spaces</li>
              <li><strong>Remove empty:</strong> Delete blank lines</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ToolShell
      tool={tool}
      faqs={[
        {
          question: 'How does case sensitivity affect duplicate detection?',
          answer: 'When case sensitive is enabled, "Apple" and "apple" are treated as different lines. When disabled, they are considered duplicates and only one will be kept.'
        },
        {
          question: 'What happens to the order of lines?',
          answer: 'If "Keep original order" is enabled, unique lines appear in the same order as they first appeared. If disabled, lines are sorted alphabetically.'
        },
        {
          question: 'Can this tool handle large amounts of text?',
          answer: 'Yes, the tool can process large text files efficiently. However, very large files (millions of lines) may take a few seconds to process due to browser memory limitations.'
        }
      ]}
      howToSteps={[
        'Paste your text with each item on a separate line',
        'Configure processing options (case sensitivity, order, etc.)',
        'Click "Remove Duplicates" to process the text',
        'Review the statistics and copy the unique lines'
      ]}
      benefits={[
        'Configurable duplicate detection',
        'Preserve or sort line order',
        'Handle case sensitivity options',
        'Detailed processing statistics'
      ]}
      useCases={[
        'Cleaning up mailing lists',
        'Removing duplicate entries from datasets',
        'Processing survey responses',
        'Deduplicating configuration files'
      ]}
    >
      {toolContent}
    </ToolShell>
  );
}