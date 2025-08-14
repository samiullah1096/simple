import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function URLEncoder() {
  const tool = getToolBySlug('text', 'url-encoder');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
  const [error, setError] = useState('');

  const handleEncode = () => {
    try {
      setError('');
      const encoded = encodeURIComponent(inputText);
      setOutputText(encoded);
    } catch (err) {
      setError('Error encoding text. Please check your input.');
      setOutputText('');
    }
  };

  const handleDecode = () => {
    try {
      setError('');
      const decoded = decodeURIComponent(inputText);
      setOutputText(decoded);
    } catch (err) {
      setError('Invalid URL encoded input. Please check your text.');
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
            <i className="fas fa-link mr-2"></i>URL Encode
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
            <i className="fas fa-unlink mr-2"></i>URL Decode
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium text-slate-200">
              {mode === 'encode' ? 'Plain Text' : 'URL Encoded Text'}
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
            placeholder={mode === 'encode' ? 'Enter text to URL encode...' : 'Enter URL encoded text to decode...'}
            data-testid="input-text"
          />
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium text-slate-200">
              {mode === 'encode' ? 'URL Encoded Text' : 'Plain Text'}
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
            placeholder={mode === 'encode' ? 'URL encoded text will appear here...' : 'Decoded plain text will appear here...'}
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
          <i className={`fas ${mode === 'encode' ? 'fa-link' : 'fa-unlink'} mr-2`}></i>
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
        <h3 className="text-lg font-medium text-slate-200 mb-4">About URL Encoding</h3>
        <div className="text-slate-300 space-y-4">
          <p><strong>URL encoding</strong> (percent encoding) converts characters into a format that can be transmitted over the Internet safely.</p>
          
          <div>
            <h4 className="font-medium text-slate-200 mb-2">Common URL Encoded Characters:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <div>Space → %20</div>
              <div>! → %21</div>
              <div># → %23</div>
              <div>$ → %24</div>
              <div>& → %26</div>
              <div>' → %27</div>
              <div>( → %28</div>
              <div>) → %29</div>
              <div>+ → %2B</div>
              <div>@ → %40</div>
              <div>? → %3F</div>
              <div>= → %3D</div>
            </div>
          </div>
          
          <p><strong>Use cases:</strong> Creating URLs with special characters, form data submission, API parameters, and web scraping.</p>
        </div>
      </div>
    </div>
  );

  return (
    <ToolShell
      tool={tool}
      faqs={[
        {
          question: 'When do I need to URL encode text?',
          answer: 'URL encoding is needed when you want to include special characters in URLs, such as spaces, symbols, or non-ASCII characters. It\'s essential for form data, query parameters, and API requests.'
        },
        {
          question: 'What characters need to be URL encoded?',
          answer: 'Reserved characters like spaces, &, ?, #, =, +, and non-ASCII characters need to be URL encoded. Each character is converted to a % followed by its hexadecimal code.'
        },
        {
          question: 'Is URL encoding the same as HTML encoding?',
          answer: 'No, they are different. URL encoding uses percent signs (%) followed by hex codes, while HTML encoding uses entities like &amp; or &#39;. Each serves a different purpose.'
        }
      ]}
      howToSteps={[
        'Choose whether to encode or decode URLs',
        'Enter your text in the input area',
        'Click the Encode or Decode button',
        'Copy the processed result'
      ]}
      benefits={[
        'Handle special characters in URLs',
        'Prepare data for web transmission',
        'Bidirectional encoding/decoding',
        'Support for all Unicode characters'
      ]}
      useCases={[
        'Creating URLs with spaces and symbols',
        'Processing form data for web submission',
        'API parameter encoding',
        'Web scraping and automation'
      ]}
    >
      {toolContent}
    </ToolShell>
  );
}