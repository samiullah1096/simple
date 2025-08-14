import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function TextDiff() {
  const tool = getToolBySlug('text', 'text-diff');
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [differences, setDifferences] = useState([]);
  const [showInline, setShowInline] = useState(false);

  const generateDiff = () => {
    if (!text1 && !text2) {
      setDifferences([]);
      return;
    }

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);
    const diffs = [];

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 !== line2) {
        if (line1 && !line2) {
          diffs.push({ type: 'removed', line: i + 1, content: line1, side: 'left' });
        } else if (!line1 && line2) {
          diffs.push({ type: 'added', line: i + 1, content: line2, side: 'right' });
        } else {
          diffs.push({ 
            type: 'modified', 
            line: i + 1, 
            content: line1, 
            newContent: line2,
            side: 'both'
          });
        }
      } else if (line1 === line2 && line1 !== '') {
        diffs.push({ type: 'unchanged', line: i + 1, content: line1 });
      }
    }

    setDifferences(diffs);
  };

  const clearAll = () => {
    setText1('');
    setText2('');
    setDifferences([]);
  };

  const swapTexts = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
    generateDiff();
  };

  const loadSample = () => {
    const sample1 = `The quick brown fox jumps over the lazy dog.
This is the first version of the text.
Some content that will be modified.
This line will be removed.
Common line that stays the same.`;

    const sample2 = `The quick brown fox leaps over the lazy dog.
This is the second version of the text.
Some content that has been modified.
Common line that stays the same.
This is a new line added at the end.`;

    setText1(sample1);
    setText2(sample2);
  };

  const toolContent = (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <motion.button
          onClick={generateDiff}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          data-testid="button-compare"
        >
          <i className="fas fa-not-equal mr-2"></i>Compare Texts
        </motion.button>
        
        <button 
          onClick={swapTexts}
          className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-3 rounded-lg font-medium transition-colors"
          data-testid="button-swap"
        >
          <i className="fas fa-exchange-alt mr-2"></i>Swap
        </button>
        
        <button 
          onClick={loadSample}
          className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-3 rounded-lg font-medium transition-colors"
          data-testid="button-sample"
        >
          <i className="fas fa-file-import mr-2"></i>Load Sample
        </button>
        
        <button 
          onClick={clearAll}
          className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-3 rounded-lg font-medium transition-colors"
          data-testid="button-clear"
        >
          <i className="fas fa-trash mr-2"></i>Clear All
        </button>
      </div>

      {/* View Options */}
      <div className="glassmorphism rounded-xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-slate-200">View Options</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showInline}
              onChange={(e) => setShowInline(e.target.checked)}
              className="mr-2"
              data-testid="checkbox-inline"
            />
            <span className="text-slate-300">Show inline diff</span>
          </label>
        </div>
      </div>

      {/* Input Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="text-lg font-medium text-slate-200">Text 1 (Original)</label>
          <textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            className="w-full h-64 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-100 focus:border-cyan-500 focus:outline-none resize-none font-mono text-sm"
            placeholder="Enter the first text to compare..."
            data-testid="input-text1"
          />
        </div>

        <div className="space-y-4">
          <label className="text-lg font-medium text-slate-200">Text 2 (Modified)</label>
          <textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            className="w-full h-64 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-100 focus:border-cyan-500 focus:outline-none resize-none font-mono text-sm"
            placeholder="Enter the second text to compare..."
            data-testid="input-text2"
          />
        </div>
      </div>

      {/* Differences Display */}
      {differences.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-slate-200">Comparison Results</h3>
            <div className="flex gap-4 text-sm">
              <span className="text-red-400">
                <i className="fas fa-minus mr-1"></i>
                {differences.filter(d => d.type === 'removed').length} removed
              </span>
              <span className="text-green-400">
                <i className="fas fa-plus mr-1"></i>
                {differences.filter(d => d.type === 'added').length} added
              </span>
              <span className="text-yellow-400">
                <i className="fas fa-edit mr-1"></i>
                {differences.filter(d => d.type === 'modified').length} modified
              </span>
            </div>
          </div>

          <div className="glassmorphism rounded-xl overflow-hidden">
            {showInline ? (
              // Inline view
              <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                {differences.map((diff, index) => (
                  <div key={index} className="font-mono text-sm">
                    {diff.type === 'unchanged' && (
                      <div className="text-slate-300 py-1">
                        <span className="text-slate-500 w-8 inline-block">{diff.line}</span>
                        {diff.content}
                      </div>
                    )}
                    {diff.type === 'removed' && (
                      <div className="bg-red-900/20 text-red-300 py-1 px-2 rounded">
                        <span className="text-red-500 w-8 inline-block">-{diff.line}</span>
                        {diff.content}
                      </div>
                    )}
                    {diff.type === 'added' && (
                      <div className="bg-green-900/20 text-green-300 py-1 px-2 rounded">
                        <span className="text-green-500 w-8 inline-block">+{diff.line}</span>
                        {diff.content}
                      </div>
                    )}
                    {diff.type === 'modified' && (
                      <div className="space-y-1">
                        <div className="bg-red-900/20 text-red-300 py-1 px-2 rounded">
                          <span className="text-red-500 w-8 inline-block">-{diff.line}</span>
                          {diff.content}
                        </div>
                        <div className="bg-green-900/20 text-green-300 py-1 px-2 rounded">
                          <span className="text-green-500 w-8 inline-block">+{diff.line}</span>
                          {diff.newContent}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Side-by-side view
              <div className="grid grid-cols-2 divide-x divide-slate-700">
                <div className="p-4">
                  <h4 className="font-medium text-slate-300 mb-3">Text 1 (Original)</h4>
                  <div className="space-y-1 max-h-96 overflow-y-auto font-mono text-sm">
                    {differences.map((diff, index) => (
                      <div key={`left-${index}`}>
                        {(diff.type === 'unchanged' || diff.type === 'removed' || diff.type === 'modified') && (
                          <div className={`py-1 ${diff.type === 'removed' ? 'bg-red-900/20 text-red-300 px-2 rounded' : 
                                                    diff.type === 'modified' ? 'bg-yellow-900/20 text-yellow-300 px-2 rounded' : 
                                                    'text-slate-300'}`}>
                            <span className="text-slate-500 w-8 inline-block">{diff.line}</span>
                            {diff.content}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-slate-300 mb-3">Text 2 (Modified)</h4>
                  <div className="space-y-1 max-h-96 overflow-y-auto font-mono text-sm">
                    {differences.map((diff, index) => (
                      <div key={`right-${index}`}>
                        {(diff.type === 'unchanged' || diff.type === 'added' || diff.type === 'modified') && (
                          <div className={`py-1 ${diff.type === 'added' ? 'bg-green-900/20 text-green-300 px-2 rounded' : 
                                                    diff.type === 'modified' ? 'bg-yellow-900/20 text-yellow-300 px-2 rounded' : 
                                                    'text-slate-300'}`}>
                            <span className="text-slate-500 w-8 inline-block">{diff.line}</span>
                            {diff.type === 'modified' ? diff.newContent : diff.content}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className="text-slate-300">Removed lines</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className="text-slate-300">Added lines</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span className="text-slate-300">Modified lines</span>
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
          question: 'What types of differences can this tool detect?',
          answer: 'This tool can detect added lines (present in text 2 but not text 1), removed lines (present in text 1 but not text 2), and modified lines (different content between the two texts).'
        },
        {
          question: 'How does the comparison work?',
          answer: 'The tool compares texts line by line, highlighting differences between the two inputs. It shows what was added, removed, or modified between the original and modified versions.'
        },
        {
          question: 'Can I switch between different view modes?',
          answer: 'Yes, you can toggle between side-by-side view (showing both texts in separate columns) and inline view (showing differences in a single column with +/- indicators).'
        }
      ]}
      howToSteps={[
        'Paste your original text in the first text area',
        'Paste the modified text in the second text area',
        'Click "Compare Texts" to analyze differences',
        'Choose between inline or side-by-side view',
        'Review the highlighted differences'
      ]}
      benefits={[
        'Line-by-line comparison',
        'Multiple viewing modes',
        'Color-coded differences',
        'Detailed change statistics'
      ]}
      useCases={[
        'Comparing document revisions',
        'Code review and version control',
        'Proofreading and editing',
        'Content change tracking'
      ]}
    >
      {toolContent}
    </ToolShell>
  );
}