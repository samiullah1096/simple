import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';

export default function Base64Encoder() {
  const tool = TOOLS.text.find(t => t.slug === 'base64');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
  const [error, setError] = useState('');

  const handleEncode = () => {
    try {
      setError('');
      const encoded = btoa(unescape(encodeURIComponent(inputText)));
      setOutputText(encoded);
    } catch (err) {
      setError('Error encoding text. Please check your input.');
      setOutputText('');
    }
  };

  const handleDecode = () => {
    try {
      setError('');
      const decoded = decodeURIComponent(escape(atob(inputText)));
      setOutputText(decoded);
    } catch (err) {
      setError('Invalid Base64 input. Please check your text.');
      setOutputText('');
    }
  };

  const handleProcess = () => {
    if (!inputText.trim()) {
      setError('Please enter some text to process.');
      return;
    }

    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setError('');
  };

  const swapTexts = () => {
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setError('');
  };

  const toolContent = (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">Operation Mode</h3>
        <div className="flex gap-4">
          <motion.button
            onClick={() => { setMode('encode'); setError(''); }}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              mode === 'encode' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="button-encode-mode"
          >
            <i className="fas fa-lock mr-2"></i>Encode to Base64
          </motion.button>
          <motion.button
            onClick={() => { setMode('decode'); setError(''); }}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              mode === 'decode' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="button-decode-mode"
          >
            <i className="fas fa-unlock mr-2"></i>Decode from Base64
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium text-slate-200">
              {mode === 'encode' ? 'Plain Text' : 'Base64 Text'}
            </label>
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
            onChange={(e) => {setInputText(e.target.value); setError('');}}
            className="w-full h-64 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-100 focus:border-cyan-500 focus:outline-none resize-none font-mono"
            placeholder={mode === 'encode' ? 'Enter plain text to encode...' : 'Enter Base64 text to decode...'}
            data-testid="input-text"
          />
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium text-slate-200">
              {mode === 'encode' ? 'Base64 Text' : 'Plain Text'}
            </label>
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
            className="w-full h-64 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-100 resize-none font-mono"
            placeholder={mode === 'encode' ? 'Base64 encoded text will appear here...' : 'Decoded plain text will appear here...'}
            data-testid="output-text"
          />
        </div>
      </div>

      {/* Error Display */}
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
          <i className={`fas ${mode === 'encode' ? 'fa-lock' : 'fa-unlock'} mr-2`}></i>
          {mode === 'encode' ? 'Encode' : 'Decode'}
        </motion.button>
        
        {outputText && (
          <motion.button
            onClick={swapTexts}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-3 rounded-lg font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="button-swap"
          >
            <i className="fas fa-exchange-alt mr-2"></i>Swap & Convert Back
          </motion.button>
        )}
      </div>

      {/* Info Box */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">About Base64 Encoding</h3>
        <div className="text-slate-300 space-y-2">
          <p><strong>Base64 encoding</strong> is a method of converting binary data into ASCII text. It's commonly used for:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Embedding images in emails or web pages</li>
            <li>Encoding data for transmission over text-based protocols</li>
            <li>Storing binary data in databases that only support text</li>
            <li>URL-safe data transmission</li>
          </ul>
          <p className="text-yellow-400 mt-4">
            <i className="fas fa-info-circle mr-2"></i>
            Note: Base64 is encoding, not encryption. It provides no security and can be easily decoded.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <ToolShell
      tool={tool}
      faqs={[
        {
          question: 'What is Base64 encoding used for?',
          answer: 'Base64 encoding is used to convert binary data into ASCII text format. It\'s commonly used for embedding images in emails, transmitting data over text-based protocols, and storing binary data in text-only systems.'
        },
        {
          question: 'Is Base64 encoding secure?',
          answer: 'No, Base64 is not a security measure. It\'s simply an encoding method that can be easily decoded by anyone. Do not use it to hide sensitive information.'
        },
        {
          question: 'Why does Base64 encoded text look random?',
          answer: 'Base64 uses a specific set of 64 characters (A-Z, a-z, 0-9, +, /) to represent binary data. The output may appear random but follows a specific encoding algorithm.'
        }
      ]}
      howToSteps={[
        'Choose whether to encode or decode',
        'Enter your text in the input area',
        'Click the Encode or Decode button',
        'Copy the result from the output area'
      ]}
      benefits={[
        'Bidirectional encoding/decoding',
        'Support for Unicode characters',
        'Instant processing',
        'Copy results with one click'
      ]}
      useCases={[
        'Preparing data for email transmission',
        'Embedding images in HTML/CSS',
        'API data encoding',
        'Database storage of binary data'
      ]}
    >
      {toolContent}
    </ToolShell>
  );
}