import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';

export default function JSONFormatter() {
  const tool = TOOLS.text.find(t => t.slug === 'json-formatter');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('format'); // 'format', 'minify', 'validate'
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(null);

  const formatJSON = () => {
    try {
      setError('');
      const parsed = JSON.parse(inputText);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutputText(formatted);
      setIsValid(true);
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      setOutputText('');
      setIsValid(false);
    }
  };

  const minifyJSON = () => {
    try {
      setError('');
      const parsed = JSON.parse(inputText);
      const minified = JSON.stringify(parsed);
      setOutputText(minified);
      setIsValid(true);
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      setOutputText('');
      setIsValid(false);
    }
  };

  const validateJSON = () => {
    try {
      setError('');
      JSON.parse(inputText);
      setIsValid(true);
      setOutputText('✅ Valid JSON');
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      setOutputText('❌ Invalid JSON');
      setIsValid(false);
    }
  };

  const handleProcess = () => {
    if (!inputText.trim()) {
      setError('Please enter some JSON to process.');
      return;
    }

    switch (mode) {
      case 'format':
        formatJSON();
        break;
      case 'minify':
        minifyJSON();
        break;
      case 'validate':
        validateJSON();
        break;
      default:
        formatJSON();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setError('');
    setIsValid(null);
  };

  const loadSampleJSON = () => {
    const sample = {
      "name": "John Doe",
      "age": 30,
      "city": "New York",
      "hobbies": ["reading", "swimming", "coding"],
      "address": {
        "street": "123 Main St",
        "zipCode": "10001"
      },
      "isActive": true
    };
    setInputText(JSON.stringify(sample));
  };

  const toolContent = (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">Operation Mode</h3>
        <div className="flex flex-wrap gap-4">
          <motion.button
            onClick={() => setMode('format')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              mode === 'format' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="button-format-mode"
          >
            <i className="fas fa-indent mr-2"></i>Format & Pretty Print
          </motion.button>
          <motion.button
            onClick={() => setMode('minify')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              mode === 'minify' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="button-minify-mode"
          >
            <i className="fas fa-compress mr-2"></i>Minify
          </motion.button>
          <motion.button
            onClick={() => setMode('validate')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              mode === 'validate' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="button-validate-mode"
          >
            <i className="fas fa-check-circle mr-2"></i>Validate Only
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium text-slate-200">Input JSON</label>
            <div className="flex gap-2">
              <button 
                onClick={loadSampleJSON}
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
            onChange={(e) => {setInputText(e.target.value); setError(''); setIsValid(null);}}
            className="w-full h-64 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-100 focus:border-cyan-500 focus:outline-none resize-none font-mono text-sm"
            placeholder="Paste your JSON here..."
            data-testid="input-json"
          />
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium text-slate-200">
              {mode === 'format' ? 'Formatted JSON' : mode === 'minify' ? 'Minified JSON' : 'Validation Result'}
            </label>
            {outputText && outputText !== '✅ Valid JSON' && outputText !== '❌ Invalid JSON' && (
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
            placeholder={`${mode === 'format' ? 'Formatted' : mode === 'minify' ? 'Minified' : 'Validation result will appear here...'}`}
            data-testid="output-json"
          />
        </div>
      </div>

      {/* Status & Error Display */}
      {isValid !== null && (
        <div className={`rounded-lg p-4 ${isValid ? 'bg-green-900/20 border border-green-500/50 text-green-400' : 'bg-red-900/20 border border-red-500/50 text-red-400'}`}>
          <i className={`fas ${isValid ? 'fa-check-circle' : 'fa-exclamation-triangle'} mr-2`}></i>
          {isValid ? 'JSON is valid!' : 'JSON validation failed'}
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <motion.button
          onClick={handleProcess}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!inputText.trim()}
          data-testid="button-process"
        >
          <i className={`fas ${mode === 'format' ? 'fa-indent' : mode === 'minify' ? 'fa-compress' : 'fa-check-circle'} mr-2`}></i>
          {mode === 'format' ? 'Format JSON' : mode === 'minify' ? 'Minify JSON' : 'Validate JSON'}
        </motion.button>
      </div>

      {/* JSON Info */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">JSON Operations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-800 rounded p-4">
            <h4 className="font-medium text-cyan-400 mb-2">Format & Pretty Print</h4>
            <p className="text-slate-300">Makes JSON readable with proper indentation and line breaks.</p>
          </div>
          <div className="bg-slate-800 rounded p-4">
            <h4 className="font-medium text-cyan-400 mb-2">Minify</h4>
            <p className="text-slate-300">Removes all unnecessary whitespace to reduce file size.</p>
          </div>
          <div className="bg-slate-800 rounded p-4">
            <h4 className="font-medium text-cyan-400 mb-2">Validate</h4>
            <p className="text-slate-300">Checks if your JSON syntax is valid and reports errors.</p>
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
          question: 'What is JSON formatting?',
          answer: 'JSON formatting adds proper indentation, line breaks, and spacing to make JSON data readable and easier to understand. It doesn\'t change the data, just its presentation.'
        },
        {
          question: 'When should I minify JSON?',
          answer: 'Minify JSON when you need to reduce file size for web transmission, APIs, or storage. Minified JSON removes all unnecessary whitespace while preserving the data structure.'
        },
        {
          question: 'What makes JSON invalid?',
          answer: 'Common JSON errors include missing quotes around keys, trailing commas, unescaped characters, mismatched brackets, or using single quotes instead of double quotes.'
        }
      ]}
      howToSteps={[
        'Paste or type your JSON in the input area',
        'Choose Format, Minify, or Validate mode',
        'Click the corresponding action button',
        'Copy the result or review validation errors'
      ]}
      benefits={[
        'Format JSON for better readability',
        'Minify JSON to reduce size',
        'Validate JSON syntax',
        'Detailed error reporting'
      ]}
      useCases={[
        'API response formatting',
        'Configuration file editing',
        'Data validation before transmission',
        'JSON file optimization'
      ]}
    >
      {toolContent}
    </ToolShell>
  );
}