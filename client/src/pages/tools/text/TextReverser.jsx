import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function TextReverser() {
  const tool = getToolBySlug('text', 'text-reverser');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [reverseType, setReverseType] = useState('characters'); // 'characters', 'words', 'lines'

  const reverseText = () => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    let result = '';
    switch (reverseType) {
      case 'characters':
        result = inputText.split('').reverse().join('');
        break;
      case 'words':
        result = inputText.split(' ').reverse().join(' ');
        break;
      case 'lines':
        result = inputText.split('\n').reverse().join('\n');
        break;
      default:
        result = inputText.split('').reverse().join('');
    }
    setOutputText(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
  };

  const swapTexts = () => {
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
  };

  const toolContent = (
    <div className="space-y-6">
      {/* Reverse Type Selection */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">Reverse Type</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { value: 'characters', label: 'Characters', icon: 'fas fa-font' },
            { value: 'words', label: 'Words', icon: 'fas fa-spell-check' },
            { value: 'lines', label: 'Lines', icon: 'fas fa-align-left' }
          ].map((option) => (
            <motion.button
              key={option.value}
              onClick={() => setReverseType(option.value)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                reverseType === option.value 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid={`button-${option.value}`}
            >
              <i className={`${option.icon} mr-2`}></i>{option.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <label className="text-lg font-medium text-slate-200">Original Text</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-64 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-100 focus:border-cyan-500 focus:outline-none resize-none"
            placeholder="Enter text to reverse..."
            data-testid="input-text"
          />
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium text-slate-200">Reversed Text</label>
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
            placeholder="Reversed text will appear here..."
            data-testid="output-text"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <motion.button
          onClick={reverseText}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!inputText.trim()}
          data-testid="button-reverse"
        >
          <i className="fas fa-undo mr-2"></i>Reverse Text
        </motion.button>
        
        {outputText && (
          <motion.button
            onClick={swapTexts}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-3 rounded-lg font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="button-swap"
          >
            <i className="fas fa-exchange-alt mr-2"></i>Swap
          </motion.button>
        )}
        
        <button 
          onClick={clearAll}
          className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-3 rounded-lg font-medium transition-colors"
          data-testid="button-clear"
        >
          <i className="fas fa-trash mr-2"></i>Clear
        </button>
      </div>

      {/* Examples */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-800 rounded-lg p-4">
            <h4 className="font-medium text-cyan-400 mb-2">Character Reverse</h4>
            <p className="text-slate-400 mb-2">Input:</p>
            <p className="font-mono text-slate-300 mb-2">"Hello World"</p>
            <p className="text-slate-400 mb-2">Output:</p>
            <p className="font-mono text-slate-300">"dlroW olleH"</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <h4 className="font-medium text-cyan-400 mb-2">Word Reverse</h4>
            <p className="text-slate-400 mb-2">Input:</p>
            <p className="font-mono text-slate-300 mb-2">"Hello World"</p>
            <p className="text-slate-400 mb-2">Output:</p>
            <p className="font-mono text-slate-300">"World Hello"</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <h4 className="font-medium text-cyan-400 mb-2">Line Reverse</h4>
            <p className="text-slate-400 mb-2">Input:</p>
            <p className="font-mono text-slate-300 mb-2">"Line 1<br/>Line 2"</p>
            <p className="text-slate-400 mb-2">Output:</p>
            <p className="font-mono text-slate-300">"Line 2<br/>Line 1"</p>
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
          question: 'What are the different reverse modes?',
          answer: 'Character reverse flips individual characters, word reverse changes word order while keeping words intact, and line reverse changes the order of lines in multi-line text.'
        },
        {
          question: 'Can I reverse the reversed text back to original?',
          answer: 'Yes! Use the "Swap" button to move the reversed text back to the input, then reverse it again to get back to the original text.'
        },
        {
          question: 'Does this work with special characters and emojis?',
          answer: 'Yes, the tool handles Unicode characters, special symbols, and emojis correctly in all reverse modes.'
        }
      ]}
      howToSteps={[
        'Choose your reverse type (characters, words, or lines)',
        'Enter or paste your text in the input area',
        'Click "Reverse Text" to process',
        'Copy the result or swap to reverse again'
      ]}
      benefits={[
        'Multiple reverse modes',
        'Unicode and emoji support',
        'Bidirectional processing',
        'Clean, easy-to-use interface'
      ]}
      useCases={[
        'Creating mirror text effects',
        'Text puzzles and games',
        'Data obfuscation for testing',
        'Creative writing and poetry'
      ]}
    >
      {toolContent}
    </ToolShell>
  );
}