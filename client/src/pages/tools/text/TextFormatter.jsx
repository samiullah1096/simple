import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function TextFormatter() {
  const tool = getToolBySlug('text', 'formatter');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const formatOptions = {
    removeExtraSpaces: (text) => text.replace(/\s+/g, ' ').trim(),
    removeExtraLineBreaks: (text) => text.replace(/\n\s*\n/g, '\n').trim(),
    trimLines: (text) => text.split('\n').map(line => line.trim()).join('\n'),
    removeEmptyLines: (text) => text.split('\n').filter(line => line.trim().length > 0).join('\n'),
    normalizeLineBreaks: (text) => text.replace(/\r\n/g, '\n').replace(/\r/g, '\n'),
    capitalizeFirst: (text) => text.replace(/^\s*\w|[.!?]\s*\w/g, c => c.toUpperCase()),
    fixPunctuation: (text) => text.replace(/\s+([.!?:;,])/g, '$1').replace(/([.!?:;,])(?=\w)/g, '$1 ')
  };

  const handleFormat = (options) => {
    let result = inputText;
    
    if (options.removeExtraSpaces) result = formatOptions.removeExtraSpaces(result);
    if (options.removeExtraLineBreaks) result = formatOptions.removeExtraLineBreaks(result);
    if (options.trimLines) result = formatOptions.trimLines(result);
    if (options.removeEmptyLines) result = formatOptions.removeEmptyLines(result);
    if (options.normalizeLineBreaks) result = formatOptions.normalizeLineBreaks(result);
    if (options.capitalizeFirst) result = formatOptions.capitalizeFirst(result);
    if (options.fixPunctuation) result = formatOptions.fixPunctuation(result);
    
    setOutputText(result);
  };

  const applyAllFormatting = () => {
    handleFormat({
      removeExtraSpaces: true,
      removeExtraLineBreaks: true,
      trimLines: true,
      removeEmptyLines: true,
      normalizeLineBreaks: true,
      capitalizeFirst: true,
      fixPunctuation: true
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
  };

  const toolContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium text-slate-200">Input Text</label>
            <button 
              onClick={clearAll}
              className="text-slate-400 hover:text-slate-200 text-sm"
              data-testid="button-clear"
            >
              Clear All
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-64 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-100 focus:border-cyan-500 focus:outline-none resize-none"
            placeholder="Paste your text here to format..."
            data-testid="input-text"
          />
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium text-slate-200">Formatted Text</label>
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
            className="w-full h-64 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-100 resize-none"
            placeholder="Formatted text will appear here..."
            data-testid="output-text"
          />
        </div>
      </div>

      {/* Format Options */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">Format Options</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {[
            { key: 'removeExtraSpaces', label: 'Remove Extra Spaces', icon: 'fas fa-compress' },
            { key: 'removeExtraLineBreaks', label: 'Fix Line Breaks', icon: 'fas fa-align-left' },
            { key: 'trimLines', label: 'Trim Lines', icon: 'fas fa-crop' },
            { key: 'removeEmptyLines', label: 'Remove Empty Lines', icon: 'fas fa-minus-circle' },
            { key: 'normalizeLineBreaks', label: 'Normalize Breaks', icon: 'fas fa-exchange-alt' },
            { key: 'capitalizeFirst', label: 'Fix Capitalization', icon: 'fas fa-font' },
            { key: 'fixPunctuation', label: 'Fix Punctuation', icon: 'fas fa-question' }
          ].map(({ key, label, icon }) => (
            <motion.button
              key={key}
              onClick={() => handleFormat({ [key]: true })}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg p-3 text-sm text-slate-200 transition-colors text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid={`button-${key}`}
            >
              <i className={`${icon} text-cyan-400 mb-2 block`}></i>
              {label}
            </motion.button>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-4">
          <motion.button
            onClick={applyAllFormatting}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!inputText}
            data-testid="button-format-all"
          >
            <i className="fas fa-magic mr-2"></i>Apply All Formatting
          </motion.button>
        </div>
      </div>
    </div>
  );

  return (
    <ToolShell
      tool={tool}
      faqs={[
        {
          question: 'What types of formatting can this tool perform?',
          answer: 'This tool can remove extra spaces, fix line breaks, trim lines, remove empty lines, normalize line breaks, fix capitalization, and correct punctuation spacing.'
        },
        {
          question: 'Will my original text be modified?',
          answer: 'No, your original text remains unchanged. The formatted version appears in the output section, and you can copy it when satisfied with the results.'
        },
        {
          question: 'Can I apply multiple formatting options at once?',
          answer: 'Yes, you can either apply individual formatting options one by one, or use "Apply All Formatting" to apply all available formatting options at once.'
        }
      ]}
      howToSteps={[
        'Paste or type your text in the input area',
        'Choose specific formatting options or click "Apply All Formatting"',
        'Review the formatted text in the output area',
        'Copy the formatted text to your clipboard'
      ]}
      benefits={[
        'Clean up messy text formatting',
        'Remove unwanted spaces and line breaks',
        'Fix capitalization and punctuation',
        'Prepare text for publishing or sharing'
      ]}
      useCases={[
        'Cleaning up copied text from websites',
        'Preparing text for publishing',
        'Standardizing document formatting',
        'Fixing text formatting issues'
      ]}
    >
      {toolContent}
    </ToolShell>
  );
}