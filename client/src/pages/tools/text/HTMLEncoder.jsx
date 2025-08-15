import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';

export default function HTMLEncoder() {
  const tool = TOOLS.text.find(t => t.slug === 'html-encoder');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'

  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    ' ': '&nbsp;'
  };

  const reverseEntities = Object.fromEntries(
    Object.entries(htmlEntities).map(([key, value]) => [value, key])
  );

  const handleEncode = () => {
    let result = inputText;
    Object.entries(htmlEntities).forEach(([char, entity]) => {
      const regex = new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      result = result.replace(regex, entity);
    });
    setOutputText(result);
  };

  const handleDecode = () => {
    let result = inputText;
    // First decode named entities
    Object.entries(reverseEntities).forEach(([entity, char]) => {
      result = result.replace(new RegExp(entity, 'g'), char);
    });
    // Then decode numeric entities
    result = result.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
    result = result.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
    setOutputText(result);
  };

  const handleProcess = () => {
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
  };

  const toolContent = (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">Operation Mode</h3>
        <div className="flex gap-4">
          <motion.button
            onClick={() => setMode('encode')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              mode === 'encode' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="button-encode-mode"
          >
            <i className="fab fa-html5 mr-2"></i>HTML Encode
          </motion.button>
          <motion.button
            onClick={() => setMode('decode')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              mode === 'decode' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="button-decode-mode"
          >
            <i className="fas fa-code mr-2"></i>HTML Decode
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <label className="text-lg font-medium text-slate-200">
            {mode === 'encode' ? 'Plain Text' : 'HTML Encoded Text'}
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-64 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-100 focus:border-cyan-500 focus:outline-none resize-none font-mono"
            placeholder={mode === 'encode' ? 'Enter text to HTML encode...' : 'Enter HTML encoded text to decode...'}
            data-testid="input-text"
          />
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium text-slate-200">
              {mode === 'encode' ? 'HTML Encoded Text' : 'Plain Text'}
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
            placeholder={mode === 'encode' ? 'HTML encoded text will appear here...' : 'Decoded text will appear here...'}
            data-testid="output-text"
          />
        </div>
      </div>

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
        
        <button 
          onClick={clearAll}
          className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-3 rounded-lg font-medium transition-colors"
          data-testid="button-clear"
        >
          <i className="fas fa-trash mr-2"></i>Clear All
        </button>
      </div>

      {/* HTML Entities Reference */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">Common HTML Entities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
          {Object.entries(htmlEntities).map(([char, entity]) => (
            <div key={char} className="bg-slate-800 rounded p-2">
              <span className="text-slate-400">{char}</span>
              <span className="mx-2 text-slate-500">→</span>
              <span className="text-cyan-400 font-mono">{entity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <ToolShell
      tool={tool}
      faqs={[
        {
          question: 'What is HTML encoding used for?',
          answer: 'HTML encoding converts special characters into HTML entities to prevent them from being interpreted as HTML code. It\'s essential for displaying text that contains HTML characters safely on web pages.'
        },
        {
          question: 'Which characters need to be HTML encoded?',
          answer: 'Characters like <, >, &, ", and \' need to be encoded because they have special meaning in HTML. Other characters may be encoded for compatibility or security reasons.'
        },
        {
          question: 'Is this the same as URL encoding?',
          answer: 'No, HTML encoding and URL encoding serve different purposes. HTML encoding uses entities like &lt; while URL encoding uses percent notation like %3C.'
        }
      ]}
      howToSteps={[
        'Choose to encode or decode HTML entities',
        'Paste your text in the input area',
        'Click Encode or Decode',
        'Copy the processed result'
      ]}
      benefits={[
        'Prevent XSS attacks',
        'Display HTML code safely',
        'Handle special characters in web content',
        'Ensure proper text rendering'
      ]}
      useCases={[
        'Displaying code snippets on websites',
        'Preventing XSS vulnerabilities',
        'Processing user-generated content',
        'Email template creation'
      ]}
    >
      {toolContent}
    </ToolShell>
  );
}