import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function FindReplace() {
  const tool = getToolBySlug('text', 'find-replace');
  const [inputText, setInputText] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [replaceAll, setReplaceAll] = useState(true);
  const [matchCount, setMatchCount] = useState(0);

  const performFindReplace = () => {
    if (!inputText || !findText) {
      setOutputText(inputText);
      setMatchCount(0);
      return;
    }

    try {
      let result;
      let count = 0;

      if (useRegex) {
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(findText, replaceAll ? flags : (caseSensitive ? '' : 'i'));
        
        if (replaceAll) {
          const matches = inputText.match(regex);
          count = matches ? matches.length : 0;
          result = inputText.replace(regex, replaceText);
        } else {
          const match = inputText.match(regex);
          count = match ? 1 : 0;
          result = inputText.replace(regex, replaceText);
        }
      } else {
        const searchText = caseSensitive ? findText : findText.toLowerCase();
        const sourceText = caseSensitive ? inputText : inputText.toLowerCase();
        
        if (replaceAll) {
          const regex = new RegExp(escapeRegExp(findText), caseSensitive ? 'g' : 'gi');
          const matches = inputText.match(regex);
          count = matches ? matches.length : 0;
          result = inputText.replace(regex, replaceText);
        } else {
          const index = sourceText.indexOf(searchText);
          if (index !== -1) {
            count = 1;
            result = inputText.substring(0, index) + 
                    replaceText + 
                    inputText.substring(index + findText.length);
          } else {
            count = 0;
            result = inputText;
          }
        }
      }

      setOutputText(result);
      setMatchCount(count);
    } catch (error) {
      setOutputText(inputText);
      setMatchCount(0);
      alert('Invalid regular expression. Please check your pattern.');
    }
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
  };

  const clearAll = () => {
    setInputText('');
    setFindText('');
    setReplaceText('');
    setOutputText('');
    setMatchCount(0);
  };

  const toolContent = (
    <div className="space-y-6">
      {/* Search Options */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">Search & Replace Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Find Text</label>
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:border-cyan-500 focus:outline-none"
              placeholder="Enter text to find..."
              data-testid="input-find"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Replace With</label>
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:border-cyan-500 focus:outline-none"
              placeholder="Enter replacement text..."
              data-testid="input-replace"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useRegex}
              onChange={(e) => setUseRegex(e.target.checked)}
              className="mr-2"
              data-testid="checkbox-regex"
            />
            <span className="text-slate-300">Use Regular Expression</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="mr-2"
              data-testid="checkbox-case-sensitive"
            />
            <span className="text-slate-300">Case Sensitive</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={replaceAll}
              onChange={(e) => setReplaceAll(e.target.checked)}
              className="mr-2"
              data-testid="checkbox-replace-all"
            />
            <span className="text-slate-300">Replace All</span>
          </label>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <motion.button
            onClick={performFindReplace}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!findText}
            data-testid="button-find-replace"
          >
            <i className="fas fa-search mr-2"></i>Find & Replace
          </motion.button>
          <button 
            onClick={clearAll}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-3 rounded-lg font-medium transition-colors"
            data-testid="button-clear"
          >
            <i className="fas fa-trash mr-2"></i>Clear All
          </button>
        </div>
        
        {matchCount > 0 && (
          <div className="mt-4 text-slate-300">
            <i className="fas fa-info-circle mr-2"></i>
            Found and replaced {matchCount} occurrence{matchCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <label className="text-lg font-medium text-slate-200">Original Text</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-64 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-100 focus:border-cyan-500 focus:outline-none resize-none"
            placeholder="Paste your text here..."
            data-testid="input-text"
          />
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium text-slate-200">Result</label>
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
            placeholder="Processed text will appear here..."
            data-testid="output-text"
          />
        </div>
      </div>
    </div>
  );

  return (
    <ToolShell
      tool={tool}
      faqs={[
        {
          question: 'What is the difference between regular text search and regex?',
          answer: 'Regular text search looks for exact matches of your search term. Regex (Regular Expression) allows you to use patterns and special characters for more advanced searching, like finding all email addresses or phone numbers.'
        },
        {
          question: 'How do I use regular expressions?',
          answer: 'Enable "Use Regular Expression" and use regex patterns. For example: "\\d+" finds any number, "\\w+@\\w+\\.\\w+" finds email addresses, "[A-Z]+" finds uppercase words.'
        },
        {
          question: 'Can I replace text with nothing to delete it?',
          answer: 'Yes, leave the "Replace With" field empty to delete all occurrences of the found text.'
        }
      ]}
      howToSteps={[
        'Enter your text in the Original Text area',
        'Type the text you want to find',
        'Enter the replacement text (or leave empty to delete)',
        'Choose your search options (regex, case sensitive, replace all)',
        'Click "Find & Replace" to process the text'
      ]}
      benefits={[
        'Support for regular expressions',
        'Case-sensitive and case-insensitive search',
        'Replace all occurrences or just the first match',
        'Real-time match counting'
      ]}
      useCases={[
        'Bulk text replacements',
        'Removing unwanted characters',
        'Standardizing text formats',
        'Data cleaning and processing'
      ]}
    >
      {toolContent}
    </ToolShell>
  );
}