import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function WordCounter() {
  const tool = getToolBySlug('text', 'word-counter');
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0
  });

  useEffect(() => {
    const calculateStats = () => {
      if (!text.trim()) {
        setStats({
          words: 0,
          characters: 0,
          charactersNoSpaces: 0,
          sentences: 0,
          paragraphs: 0,
          readingTime: 0,
          speakingTime: 0
        });
        return;
      }

      // Words (split by whitespace and filter empty strings)
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      const wordCount = words.length;

      // Characters
      const characters = text.length;
      const charactersNoSpaces = text.replace(/\s/g, '').length;

      // Sentences (split by sentence-ending punctuation)
      const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
      const sentenceCount = sentences.length;

      // Paragraphs (split by double line breaks)
      const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0);
      const paragraphCount = paragraphs.length;

      // Reading time (average 200 words per minute)
      const readingTime = Math.ceil(wordCount / 200);

      // Speaking time (average 150 words per minute)
      const speakingTime = Math.ceil(wordCount / 150);

      setStats({
        words: wordCount,
        characters,
        charactersNoSpaces,
        sentences: sentenceCount,
        paragraphs: paragraphCount,
        readingTime,
        speakingTime
      });
    };

    calculateStats();
  }, [text]);

  const handleClearText = () => {
    setText('');
  };

  const handleSampleText = () => {
    const sampleText = `Welcome to ToolsUniverse Word Counter! This is a sample text to demonstrate the functionality of our word counting tool.

This tool provides comprehensive text analysis including word count, character count, sentence count, and paragraph count. It also estimates reading and speaking time based on average rates.

You can use this tool for various purposes:
- Academic writing and research papers
- Blog posts and articles
- Social media content
- Business communications
- Creative writing projects

The tool processes everything locally in your browser, ensuring your text remains private and secure. No data is sent to any servers, making it perfect for sensitive or confidential content.

Try replacing this sample text with your own content to see the real-time analysis!`;
    setText(sampleText);
  };

  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <ToolShell tool={tool} category="text">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-slate-100">Input Text</h2>
          
          <div className="space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here to analyze..."
              className="w-full h-80 bg-slate-800/50 border border-slate-600 rounded-xl p-4 text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 resize-none"
              data-testid="input-text-area"
            />
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleClearText}
                disabled={!text}
                className="px-4 py-2 glassmorphism text-slate-300 hover:text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                data-testid="button-clear-text"
              >
                <i className="fas fa-trash mr-2"></i>
                Clear Text
              </button>
              <button
                onClick={handleSampleText}
                className="px-4 py-2 glassmorphism text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                data-testid="button-sample-text"
              >
                <i className="fas fa-file-alt mr-2"></i>
                Load Sample
              </button>
              <button
                onClick={() => copyToClipboard(text)}
                disabled={!text}
                className="px-4 py-2 glassmorphism text-slate-300 hover:text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                data-testid="button-copy-text"
              >
                <i className="fas fa-copy mr-2"></i>
                Copy Text
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-slate-100">Analysis Results</h2>
          
          {/* Primary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glassmorphism p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2" data-testid="stat-words">
                {stats.words.toLocaleString()}
              </div>
              <div className="text-slate-400 text-sm">Words</div>
            </div>
            <div className="glassmorphism p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2" data-testid="stat-characters">
                {stats.characters.toLocaleString()}
              </div>
              <div className="text-slate-400 text-sm">Characters</div>
            </div>
            <div className="glassmorphism p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-green-400 mb-2" data-testid="stat-sentences">
                {stats.sentences.toLocaleString()}
              </div>
              <div className="text-slate-400 text-sm">Sentences</div>
            </div>
            <div className="glassmorphism p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2" data-testid="stat-paragraphs">
                {stats.paragraphs.toLocaleString()}
              </div>
              <div className="text-slate-400 text-sm">Paragraphs</div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="glassmorphism p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Detailed Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Characters (no spaces):</span>
                <span className="text-slate-100" data-testid="stat-characters-no-spaces">
                  {stats.charactersNoSpaces.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Average words per sentence:</span>
                <span className="text-slate-100" data-testid="stat-avg-words-sentence">
                  {stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Average characters per word:</span>
                <span className="text-slate-100" data-testid="stat-avg-chars-word">
                  {stats.words > 0 ? (stats.charactersNoSpaces / stats.words).toFixed(1) : '0'}
                </span>
              </div>
            </div>
          </div>

          {/* Reading Time */}
          <div className="glassmorphism p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Time Estimates</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Reading time:</span>
                <span className="text-slate-100" data-testid="stat-reading-time">
                  {stats.readingTime === 1 ? '1 minute' : `${stats.readingTime} minutes`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Speaking time:</span>
                <span className="text-slate-100" data-testid="stat-speaking-time">
                  {stats.speakingTime === 1 ? '1 minute' : `${stats.speakingTime} minutes`}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Based on average reading speed of 200 WPM and speaking speed of 150 WPM
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="glassmorphism p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Export Results</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const results = `Text Analysis Results\n\nWords: ${stats.words}\nCharacters: ${stats.characters}\nCharacters (no spaces): ${stats.charactersNoSpaces}\nSentences: ${stats.sentences}\nParagraphs: ${stats.paragraphs}\nReading Time: ${stats.readingTime} minutes\nSpeaking Time: ${stats.speakingTime} minutes`;
                  copyToClipboard(results);
                }}
                disabled={!text}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                data-testid="button-copy-results"
              >
                <i className="fas fa-copy mr-2"></i>
                Copy Results
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </ToolShell>
  );
}
