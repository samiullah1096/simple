import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function LoremIpsumGenerator() {
  const tool = getToolBySlug('text', 'lorem-ipsum');
  const [outputText, setOutputText] = useState('');
  const [count, setCount] = useState(5);
  const [type, setType] = useState('paragraphs'); // 'words', 'sentences', 'paragraphs'
  const [startWithLorem, setStartWithLorem] = useState(true);

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
    'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
    'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
    'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
    'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
    'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos', 'accusamus', 'accusantium',
    'doloremque', 'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
    'inventore', 'veritatis', 'architecto', 'beatae', 'vitae', 'dicta', 'explicabo', 'nemo',
    'ipsam', 'quia', 'voluptas', 'aspernatur', 'odit', 'aut', 'fugit', 'consequuntur', 'magni',
    'dolores', 'ratione', 'sequi', 'nesciunt', 'neque', 'porro', 'quisquam', 'dolorem', 'adipisci',
    'numquam', 'eius', 'modi', 'tempora', 'incidunt', 'magnam', 'quam', 'voluptatem', 'fuga',
    'harum', 'quidem', 'rerum', 'facilis', 'distinctio', 'nam', 'libero', 'tempore', 'cum',
    'soluta', 'nobis', 'eleifend', 'option', 'congue', 'nihil', 'imperdiet', 'doming', 'placerat',
    'facer', 'possim', 'assum', 'typi', 'non', 'habent', 'claritatem', 'insitam', 'processus',
    'dynamicus', 'sequitur', 'mutationem', 'consuetudium', 'lectorum', 'mirum', 'notare', 'quam',
    'littera', 'gothica', 'quam', 'nunc', 'putamus', 'parum', 'claram', 'anteposuerit', 'litterarum',
    'formas', 'humanitatis', 'per', 'seacula', 'quarta', 'decima', 'quinta', 'decima', 'eodem',
    'modo', 'typi', 'qui', 'sequuntur', 'mutationem', 'consuetudium', 'lectorum'
  ];

  const getRandomWords = (wordCount) => {
    const words = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    return words;
  };

  const generateWords = (wordCount) => {
    let words = [];
    if (startWithLorem && wordCount > 0) {
      words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet'];
      const remainingWords = Math.max(0, wordCount - 5);
      words = words.concat(getRandomWords(remainingWords));
      words = words.slice(0, wordCount);
    } else {
      words = getRandomWords(wordCount);
    }
    return words.join(' ');
  };

  const generateSentences = (sentenceCount) => {
    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      const wordCount = Math.floor(Math.random() * 10) + 8; // 8-17 words per sentence
      let sentence = generateWords(wordCount);
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
      sentences.push(sentence);
    }
    return sentences.join(' ');
  };

  const generateParagraphs = (paragraphCount) => {
    const paragraphs = [];
    for (let i = 0; i < paragraphCount; i++) {
      const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-6 sentences per paragraph
      paragraphs.push(generateSentences(sentenceCount));
    }
    return paragraphs.join('\n\n');
  };

  const handleGenerate = () => {
    let result = '';
    switch (type) {
      case 'words':
        result = generateWords(count);
        break;
      case 'sentences':
        result = generateSentences(count);
        break;
      case 'paragraphs':
        result = generateParagraphs(count);
        break;
      default:
        result = generateParagraphs(count);
    }
    setOutputText(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
  };

  const clearOutput = () => {
    setOutputText('');
  };

  const toolContent = (
    <div className="space-y-6">
      {/* Generation Options */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">Generation Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Generate</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:border-cyan-500 focus:outline-none"
              data-testid="select-type"
            >
              <option value="words">Words</option>
              <option value="sentences">Sentences</option>
              <option value="paragraphs">Paragraphs</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Count</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max="100"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:border-cyan-500 focus:outline-none"
              data-testid="input-count"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="mr-2"
              data-testid="checkbox-start-lorem"
            />
            <span className="text-slate-300">Start with "Lorem ipsum dolor sit amet"</span>
          </label>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">Quick Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: '1 Paragraph', type: 'paragraphs', count: 1 },
            { label: '3 Paragraphs', type: 'paragraphs', count: 3 },
            { label: '5 Sentences', type: 'sentences', count: 5 },
            { label: '50 Words', type: 'words', count: 50 }
          ].map((preset) => (
            <motion.button
              key={preset.label}
              onClick={() => {
                setType(preset.type);
                setCount(preset.count);
              }}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg p-3 text-sm text-slate-200 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid={`preset-${preset.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {preset.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex flex-wrap gap-4">
        <motion.button
          onClick={handleGenerate}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          data-testid="button-generate"
        >
          <i className="fas fa-magic mr-2"></i>Generate Lorem Ipsum
        </motion.button>
        
        {outputText && (
          <button 
            onClick={clearOutput}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-3 rounded-lg font-medium transition-colors"
            data-testid="button-clear"
          >
            <i className="fas fa-trash mr-2"></i>Clear
          </button>
        )}
      </div>

      {/* Output Section */}
      {outputText && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium text-slate-200">Generated Text</label>
            <button 
              onClick={copyToClipboard}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              data-testid="button-copy"
            >
              <i className="fas fa-copy mr-2"></i>Copy
            </button>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 max-h-96 overflow-y-auto">
            <p className="text-slate-100 leading-relaxed whitespace-pre-wrap font-serif" data-testid="output-text">
              {outputText}
            </p>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">About Lorem Ipsum</h3>
        <div className="text-slate-300 space-y-2">
          <p>
            Lorem Ipsum is placeholder text used in the printing and typesetting industry since the 1500s. 
            It's derived from a work by Cicero written in 45 BC, making it over 2000 years old.
          </p>
          <p>
            <strong>Common uses:</strong> Web design mockups, print layouts, font testing, content management systems, 
            and any situation where you need placeholder text that won't distract from the design.
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
          question: 'What is Lorem Ipsum?',
          answer: 'Lorem Ipsum is placeholder text that has been used in the printing and typesetting industry since the 1500s. It\'s derived from classical Latin literature and is designed to be meaningless so it doesn\'t distract from design elements.'
        },
        {
          question: 'Why use Lorem Ipsum instead of regular text?',
          answer: 'Lorem Ipsum provides consistent, non-distracting placeholder text that allows designers and developers to focus on layout and visual elements without being influenced by readable content.'
        },
        {
          question: 'Is Lorem Ipsum always the same?',
          answer: 'While it traditionally starts with "Lorem ipsum dolor sit amet," the full text can vary. Our generator creates variations while maintaining the characteristic Latin-like appearance.'
        }
      ]}
      howToSteps={[
        'Select the type of text you want (words, sentences, or paragraphs)',
        'Set the count for how much text to generate',
        'Choose whether to start with the classic "Lorem ipsum" phrase',
        'Click Generate to create your placeholder text'
      ]}
      benefits={[
        'Classic placeholder text for design',
        'Customizable length and format',
        'Distraction-free content for mockups',
        'Industry-standard dummy text'
      ]}
      useCases={[
        'Website design mockups',
        'Print layout testing',
        'Content management system demos',
        'Typography and font testing'
      ]}
    >
      {toolContent}
    </ToolShell>
  );
}