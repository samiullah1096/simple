import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';

export default function HashGenerator() {
  const tool = TOOLS.text.find(t => t.slug === 'hash-generator');
  const [inputText, setInputText] = useState('');
  const [hashes, setHashes] = useState({});
  const [selectedAlgorithms, setSelectedAlgorithms] = useState({
    md5: true,
    sha1: true,
    sha256: true,
    sha512: false
  });

  // Simple MD5 implementation
  const md5 = (str) => {
    const rotateLeft = (lValue, iShiftBits) => (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    const addUnsigned = (lX, lY) => {
      const lX4 = lX & 0x40000000;
      const lY4 = lY & 0x40000000;
      const lX8 = lX & 0x80000000;
      const lY8 = lY & 0x80000000;
      const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
      if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
      if (lX4 | lY4) {
        if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
        else return lResult ^ 0x40000000 ^ lX8 ^ lY8;
      } else return lResult ^ lX8 ^ lY8;
    };

    const f = (x, y, z) => (x & y) | (~x & z);
    const g = (x, y, z) => (x & z) | (y & ~z);
    const h = (x, y, z) => x ^ y ^ z;
    const i = (x, y, z) => y ^ (x | ~z);

    const ff = (a, b, c, d, x, s, ac) => {
      a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const gg = (a, b, c, d, x, s, ac) => {
      a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const hh = (a, b, c, d, x, s, ac) => {
      a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const ii = (a, b, c, d, x, s, ac) => {
      a = addUnsigned(a, addUnsigned(addUnsigned(i(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const convertToWordArray = (str) => {
      let lWordCount;
      const lMessageLength = str.length;
      const lNumberOfWords_temp1 = lMessageLength + 8;
      const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
      const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
      const lWordArray = Array(lNumberOfWords - 1);
      let lBytePosition = 0;
      let lByteCount = 0;
      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition);
        lByteCount++;
      }
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    };

    const wordToHex = (lValue) => {
      let wordToHexValue = '';
      for (let lCount = 0; lCount <= 3; lCount++) {
        const lByte = (lValue >>> (lCount * 8)) & 255;
        const lByteToHex = '0' + lByte.toString(16);
        wordToHexValue += lByteToHex.substr(lByteToHex.length - 2, 2);
      }
      return wordToHexValue;
    };

    const x = convertToWordArray(str);
    let a = 0x67452301;
    let b = 0xefcdab89;
    let c = 0x98badcfe;
    let d = 0x10325476;

    for (let k = 0; k < x.length; k += 16) {
      const AA = a;
      const BB = b;
      const CC = c;
      const DD = d;
      a = ff(a, b, c, d, x[k + 0], 7, 0xd76aa478);
      d = ff(d, a, b, c, x[k + 1], 12, 0xe8c7b756);
      c = ff(c, d, a, b, x[k + 2], 17, 0x242070db);
      b = ff(b, c, d, a, x[k + 3], 22, 0xc1bdceee);
      a = ff(a, b, c, d, x[k + 4], 7, 0xf57c0faf);
      d = ff(d, a, b, c, x[k + 5], 12, 0x4787c62a);
      c = ff(c, d, a, b, x[k + 6], 17, 0xa8304613);
      b = ff(b, c, d, a, x[k + 7], 22, 0xfd469501);
      a = ff(a, b, c, d, x[k + 8], 7, 0x698098d8);
      d = ff(d, a, b, c, x[k + 9], 12, 0x8b44f7af);
      c = ff(c, d, a, b, x[k + 10], 17, 0xffff5bb1);
      b = ff(b, c, d, a, x[k + 11], 22, 0x895cd7be);
      a = ff(a, b, c, d, x[k + 12], 7, 0x6b901122);
      d = ff(d, a, b, c, x[k + 13], 12, 0xfd987193);
      c = ff(c, d, a, b, x[k + 14], 17, 0xa679438e);
      b = ff(b, c, d, a, x[k + 15], 22, 0x49b40821);
      a = gg(a, b, c, d, x[k + 1], 5, 0xf61e2562);
      d = gg(d, a, b, c, x[k + 6], 9, 0xc040b340);
      c = gg(c, d, a, b, x[k + 11], 14, 0x265e5a51);
      b = gg(b, c, d, a, x[k + 0], 20, 0xe9b6c7aa);
      a = gg(a, b, c, d, x[k + 5], 5, 0xd62f105d);
      d = gg(d, a, b, c, x[k + 10], 9, 0x2441453);
      c = gg(c, d, a, b, x[k + 15], 14, 0xd8a1e681);
      b = gg(b, c, d, a, x[k + 4], 20, 0xe7d3fbc8);
      a = gg(a, b, c, d, x[k + 9], 5, 0x21e1cde6);
      d = gg(d, a, b, c, x[k + 14], 9, 0xc33707d6);
      c = gg(c, d, a, b, x[k + 3], 14, 0xf4d50d87);
      b = gg(b, c, d, a, x[k + 8], 20, 0x455a14ed);
      a = gg(a, b, c, d, x[k + 13], 5, 0xa9e3e905);
      d = gg(d, a, b, c, x[k + 2], 9, 0xfcefa3f8);
      c = gg(c, d, a, b, x[k + 7], 14, 0x676f02d9);
      b = gg(b, c, d, a, x[k + 12], 20, 0x8d2a4c8a);
      a = hh(a, b, c, d, x[k + 5], 4, 0xfffa3942);
      d = hh(d, a, b, c, x[k + 8], 11, 0x8771f681);
      c = hh(c, d, a, b, x[k + 11], 16, 0x6d9d6122);
      b = hh(b, c, d, a, x[k + 14], 23, 0xfde5380c);
      a = hh(a, b, c, d, x[k + 1], 4, 0xa4beea44);
      d = hh(d, a, b, c, x[k + 4], 11, 0x4bdecfa9);
      c = hh(c, d, a, b, x[k + 7], 16, 0xf6bb4b60);
      b = hh(b, c, d, a, x[k + 10], 23, 0xbebfbc70);
      a = hh(a, b, c, d, x[k + 13], 4, 0x289b7ec6);
      d = hh(d, a, b, c, x[k + 0], 11, 0xeaa127fa);
      c = hh(c, d, a, b, x[k + 3], 16, 0xd4ef3085);
      b = hh(b, c, d, a, x[k + 6], 23, 0x4881d05);
      a = hh(a, b, c, d, x[k + 9], 4, 0xd9d4d039);
      d = hh(d, a, b, c, x[k + 12], 11, 0xe6db99e5);
      c = hh(c, d, a, b, x[k + 15], 16, 0x1fa27cf8);
      b = hh(b, c, d, a, x[k + 2], 23, 0xc4ac5665);
      a = ii(a, b, c, d, x[k + 0], 6, 0xf4292244);
      d = ii(d, a, b, c, x[k + 7], 10, 0x432aff97);
      c = ii(c, d, a, b, x[k + 14], 15, 0xab9423a7);
      b = ii(b, c, d, a, x[k + 5], 21, 0xfc93a039);
      a = ii(a, b, c, d, x[k + 12], 6, 0x655b59c3);
      d = ii(d, a, b, c, x[k + 3], 10, 0x8f0ccc92);
      c = ii(c, d, a, b, x[k + 10], 15, 0xffeff47d);
      b = ii(b, c, d, a, x[k + 1], 21, 0x85845dd1);
      a = ii(a, b, c, d, x[k + 8], 6, 0x6fa87e4f);
      d = ii(d, a, b, c, x[k + 15], 10, 0xfe2ce6e0);
      c = ii(c, d, a, b, x[k + 6], 15, 0xa3014314);
      b = ii(b, c, d, a, x[k + 13], 21, 0x4e0811a1);
      a = ii(a, b, c, d, x[k + 4], 6, 0xf7537e82);
      d = ii(d, a, b, c, x[k + 11], 10, 0xbd3af235);
      c = ii(c, d, a, b, x[k + 2], 15, 0x2ad7d2bb);
      b = ii(b, c, d, a, x[k + 9], 21, 0xeb86d391);
      a = addUnsigned(a, AA);
      b = addUnsigned(b, BB);
      c = addUnsigned(c, CC);
      d = addUnsigned(d, DD);
    }

    return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
  };

  const generateHashes = async () => {
    if (!inputText) {
      setHashes({});
      return;
    }

    const newHashes = {};
    const encoder = new TextEncoder();
    const data = encoder.encode(inputText);

    try {
      if (selectedAlgorithms.md5) {
        newHashes.md5 = md5(inputText);
      }

      if (selectedAlgorithms.sha1) {
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        newHashes.sha1 = Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      }

      if (selectedAlgorithms.sha256) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        newHashes.sha256 = Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      }

      if (selectedAlgorithms.sha512) {
        const hashBuffer = await crypto.subtle.digest('SHA-512', data);
        newHashes.sha512 = Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      }

      setHashes(newHashes);
    } catch (error) {
      console.error('Error generating hashes:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const copyAllHashes = () => {
    const hashText = Object.entries(hashes)
      .map(([algorithm, hash]) => `${algorithm.toUpperCase()}: ${hash}`)
      .join('\n');
    navigator.clipboard.writeText(hashText);
  };

  const clearAll = () => {
    setInputText('');
    setHashes({});
  };

  const handleAlgorithmToggle = (algorithm) => {
    setSelectedAlgorithms(prev => ({
      ...prev,
      [algorithm]: !prev[algorithm]
    }));
  };

  const toolContent = (
    <div className="space-y-6">
      {/* Algorithm Selection */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">Hash Algorithms</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(selectedAlgorithms).map(([algorithm, selected]) => (
            <label key={algorithm} className="flex items-center">
              <input
                type="checkbox"
                checked={selected}
                onChange={() => handleAlgorithmToggle(algorithm)}
                className="mr-2"
                data-testid={`checkbox-${algorithm}`}
              />
              <span className="text-slate-300 font-mono">{algorithm.toUpperCase()}</span>
            </label>
          ))}
        </div>
      </div>

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
          className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-100 focus:border-cyan-500 focus:outline-none resize-none"
          placeholder="Enter text to generate hashes..."
          data-testid="input-text"
        />
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <motion.button
          onClick={generateHashes}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!inputText.trim() || Object.values(selectedAlgorithms).every(v => !v)}
          data-testid="button-generate"
        >
          <i className="fas fa-hashtag mr-2"></i>Generate Hashes
        </motion.button>
      </div>

      {/* Hash Results */}
      {Object.keys(hashes).length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-slate-200">Generated Hashes</h3>
            <button 
              onClick={copyAllHashes}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              data-testid="button-copy-all"
            >
              <i className="fas fa-copy mr-2"></i>Copy All
            </button>
          </div>
          
          <div className="space-y-3">
            {Object.entries(hashes).map(([algorithm, hash]) => (
              <div key={algorithm} className="glassmorphism rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-300 font-mono">{algorithm.toUpperCase()}</h4>
                  <button 
                    onClick={() => copyToClipboard(hash)}
                    className="text-slate-400 hover:text-slate-200 text-sm"
                    data-testid={`button-copy-${algorithm}`}
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 font-mono text-sm text-slate-100 break-all" data-testid={`hash-${algorithm}`}>
                  {hash}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Algorithm Information */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">Hash Algorithm Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-cyan-400 mb-2">MD5</h4>
              <p className="text-slate-300">128-bit hash, fast but cryptographically broken. Use only for non-security purposes like checksums.</p>
            </div>
            <div>
              <h4 className="font-medium text-cyan-400 mb-2">SHA-1</h4>
              <p className="text-slate-300">160-bit hash, deprecated for security use due to collision vulnerabilities. Still used in some legacy systems.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-cyan-400 mb-2">SHA-256</h4>
              <p className="text-slate-300">256-bit hash, part of SHA-2 family. Secure and widely used for cryptographic applications.</p>
            </div>
            <div>
              <h4 className="font-medium text-cyan-400 mb-2">SHA-512</h4>
              <p className="text-slate-300">512-bit hash, stronger variant of SHA-2. Higher security but larger output and slower computation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-xl p-6">
        <div className="flex items-start">
          <i className="fas fa-exclamation-triangle text-yellow-400 mt-1 mr-3"></i>
          <div className="text-slate-300">
            <h4 className="font-medium text-yellow-400 mb-2">Security Notice</h4>
            <p className="text-sm">
              Hash functions are one-way operations designed for data integrity verification and password storage. 
              They are not encryption and cannot be reversed. MD5 and SHA-1 should not be used for security-critical applications.
            </p>
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
          question: 'What is the difference between hash algorithms?',
          answer: 'MD5 produces 128-bit hashes (faster but insecure), SHA-1 produces 160-bit hashes (deprecated), SHA-256 produces 256-bit hashes (secure and recommended), and SHA-512 produces 512-bit hashes (highest security).'
        },
        {
          question: 'Can I reverse a hash to get the original text?',
          answer: 'No, hash functions are one-way operations by design. You cannot reverse a hash to get the original input. However, identical inputs will always produce identical hashes.'
        },
        {
          question: 'Which hash algorithm should I use?',
          answer: 'For security applications, use SHA-256 or SHA-512. For simple checksums or non-security purposes, MD5 is acceptable. Avoid SHA-1 for new applications due to known vulnerabilities.'
        }
      ]}
      howToSteps={[
        'Select the hash algorithms you want to use',
        'Enter your text in the input area',
        'Click "Generate Hashes" to compute all selected hashes',
        'Copy individual hashes or all hashes at once'
      ]}
      benefits={[
        'Multiple hash algorithms in one tool',
        'Secure client-side computation',
        'Easy copying of results',
        'Educational algorithm information'
      ]}
      useCases={[
        'Data integrity verification',
        'Password hashing (for understanding)',
        'File checksums',
        'Unique identifier generation'
      ]}
    >
      {toolContent}
    </ToolShell>
  );
}