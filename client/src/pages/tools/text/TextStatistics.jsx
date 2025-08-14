import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function TextStatistics() {
  const tool = getToolBySlug('text', 'text-statistics');
  const [text, setText] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    calculateStats();
  }, [text]);

  const calculateStats = () => {
    if (!text.trim()) {
      setStats(null);
      return;
    }

    // Basic counts
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const sentenceCount = sentences.length;
    const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0);
    const paragraphCount = paragraphs.length;
    const lines = text.split('\n').length;

    // Advanced statistics
    const averageWordsPerSentence = sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : 0;
    const averageCharactersPerWord = wordCount > 0 ? (charactersNoSpaces / wordCount).toFixed(1) : 0;
    const averageSentencesPerParagraph = paragraphCount > 0 ? (sentenceCount / paragraphCount).toFixed(1) : 0;

    // Reading time estimates
    const readingTimeMinutes = Math.ceil(wordCount / 200); // 200 WPM average
    const speakingTimeMinutes = Math.ceil(wordCount / 150); // 150 WPM average

    // Word frequency analysis
    const wordFrequency = {};
    const cleanWords = words.map(word => word.toLowerCase().replace(/[^\w]/g, ''));
    cleanWords.forEach(word => {
      if (word.length > 0) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });

    const topWords = Object.entries(wordFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    // Character frequency
    const charFrequency = {};
    for (let char of text.replace(/\s/g, '').toLowerCase()) {
      if (char.match(/[a-z]/)) {
        charFrequency[char] = (charFrequency[char] || 0) + 1;
      }
    }

    // Readability scores (simplified versions)
    const avgWordsPerSent = parseFloat(averageWordsPerSentence) || 1;
    const avgSyllablesPerWord = calculateAverageSyllables(words);
    
    // Flesch Reading Ease Score (simplified)
    const fleschScore = 206.835 - (1.015 * avgWordsPerSent) - (84.6 * avgSyllablesPerWord);
    const fleschLevel = getFleschLevel(fleschScore);

    // Flesch-Kincaid Grade Level
    const gradeLevel = (0.39 * avgWordsPerSent) + (11.8 * avgSyllablesPerWord) - 15.59;

    // Unique word percentage
    const uniqueWords = Object.keys(wordFrequency).length;
    const lexicalDiversity = ((uniqueWords / wordCount) * 100).toFixed(1);

    setStats({
      basic: {
        characters,
        charactersNoSpaces,
        words: wordCount,
        sentences: sentenceCount,
        paragraphs: paragraphCount,
        lines
      },
      averages: {
        wordsPerSentence: averageWordsPerSentence,
        charactersPerWord: averageCharactersPerWord,
        sentencesPerParagraph: averageSentencesPerParagraph
      },
      time: {
        reading: readingTimeMinutes,
        speaking: speakingTimeMinutes
      },
      readability: {
        fleschScore: Math.max(0, Math.min(100, fleschScore)).toFixed(1),
        fleschLevel,
        gradeLevel: Math.max(0, gradeLevel).toFixed(1),
        lexicalDiversity
      },
      frequency: {
        topWords,
        uniqueWords,
        totalWords: wordCount
      }
    });
  };

  const calculateAverageSyllables = (words) => {
    if (words.length === 0) return 1;
    
    const totalSyllables = words.reduce((sum, word) => {
      return sum + countSyllables(word.toLowerCase().replace(/[^\w]/g, ''));
    }, 0);
    
    return totalSyllables / words.length;
  };

  const countSyllables = (word) => {
    if (word.length <= 3) return 1;
    const vowels = word.match(/[aeiouy]+/g);
    let syllableCount = vowels ? vowels.length : 1;
    if (word.endsWith('e')) syllableCount--;
    return Math.max(1, syllableCount);
  };

  const getFleschLevel = (score) => {
    if (score >= 90) return 'Very Easy';
    if (score >= 80) return 'Easy';
    if (score >= 70) return 'Fairly Easy';
    if (score >= 60) return 'Standard';
    if (score >= 50) return 'Fairly Difficult';
    if (score >= 30) return 'Difficult';
    return 'Very Difficult';
  };

  const loadSample = () => {
    const sample = `The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet at least once, making it perfect for testing various text statistics and readability metrics.

Text analysis is a fascinating field that combines linguistics, computer science, and statistics. By examining patterns in written language, we can gain insights into readability, complexity, and style.

Modern tools can calculate everything from basic word counts to sophisticated readability scores. These metrics help writers, educators, and content creators optimize their text for specific audiences and purposes.`;
    setText(sample);
  };

  const copyStats = () => {
    if (!stats) return;
    
    const statsText = `TEXT STATISTICS REPORT
====================

BASIC COUNTS:
- Characters: ${stats.basic.characters}
- Characters (no spaces): ${stats.basic.charactersNoSpaces}
- Words: ${stats.basic.words}
- Sentences: ${stats.basic.sentences}
- Paragraphs: ${stats.basic.paragraphs}
- Lines: ${stats.basic.lines}

AVERAGES:
- Words per sentence: ${stats.averages.wordsPerSentence}
- Characters per word: ${stats.averages.charactersPerWord}
- Sentences per paragraph: ${stats.averages.sentencesPerParagraph}

READING TIME:
- Reading time: ${stats.time.reading} minutes
- Speaking time: ${stats.time.speaking} minutes

READABILITY:
- Flesch Reading Ease: ${stats.readability.fleschScore} (${stats.readability.fleschLevel})
- Grade Level: ${stats.readability.gradeLevel}
- Lexical Diversity: ${stats.readability.lexicalDiversity}%

TOP WORDS:
${stats.frequency.topWords.map(([word, count]) => `- ${word}: ${count}`).join('\n')}`;
    
    navigator.clipboard.writeText(statsText);
  };

  const toolContent = (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-lg font-medium text-slate-200">Text to Analyze</label>
          <div className="flex gap-2">
            <button 
              onClick={loadSample}
              className="text-slate-400 hover:text-slate-200 text-sm"
              data-testid="button-sample"
            >
              Load Sample
            </button>
            <button 
              onClick={() => setText('')}
              className="text-slate-400 hover:text-slate-200 text-sm"
              data-testid="button-clear"
            >
              Clear
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-48 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-100 focus:border-cyan-500 focus:outline-none resize-none"
          placeholder="Paste or type your text here for detailed statistical analysis..."
          data-testid="input-text"
        />
      </div>

      {stats && (
        <>
          {/* Basic Statistics */}
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-200">Basic Statistics</h3>
              <button 
                onClick={copyStats}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                data-testid="button-copy-stats"
              >
                <i className="fas fa-copy mr-2"></i>Copy Report
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(stats.basic).map(([key, value]) => (
                <div key={key} className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400" data-testid={`stat-${key}`}>{value}</div>
                  <div className="text-slate-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Averages */}
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-lg font-medium text-slate-200 mb-4">Averages</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(stats.averages).map(([key, value]) => (
                <div key={key} className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-green-400" data-testid={`avg-${key}`}>{value}</div>
                  <div className="text-slate-400 text-sm">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reading Time & Readability */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glassmorphism rounded-xl p-6">
              <h3 className="text-lg font-medium text-slate-200 mb-4">Reading Time</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Reading Time (200 WPM)</span>
                  <span className="text-cyan-400 font-bold" data-testid="reading-time">{stats.time.reading} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Speaking Time (150 WPM)</span>
                  <span className="text-green-400 font-bold" data-testid="speaking-time">{stats.time.speaking} min</span>
                </div>
              </div>
            </div>

            <div className="glassmorphism rounded-xl p-6">
              <h3 className="text-lg font-medium text-slate-200 mb-4">Readability</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Flesch Reading Ease</span>
                  <span className="text-cyan-400 font-bold" data-testid="flesch-score">
                    {stats.readability.fleschScore} ({stats.readability.fleschLevel})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Grade Level</span>
                  <span className="text-yellow-400 font-bold" data-testid="grade-level">{stats.readability.gradeLevel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Lexical Diversity</span>
                  <span className="text-purple-400 font-bold" data-testid="lexical-diversity">{stats.readability.lexicalDiversity}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Word Frequency */}
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-lg font-medium text-slate-200 mb-4">
              Top 10 Words ({stats.frequency.uniqueWords} unique out of {stats.frequency.totalWords} total)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {stats.frequency.topWords.map(([word, count], index) => (
                <div key={word} className="bg-slate-800 rounded-lg p-3 text-center">
                  <div className="font-mono text-slate-300">{word}</div>
                  <div className="text-cyan-400 font-bold">{count}×</div>
                </div>
              ))}
            </div>
          </div>

          {/* Readability Guide */}
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-lg font-medium text-slate-200 mb-4">Readability Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-cyan-400 mb-3">Flesch Reading Ease Scale</h4>
                <div className="space-y-2">
                  <div>90-100: Very Easy (5th grade)</div>
                  <div>80-89: Easy (6th grade)</div>
                  <div>70-79: Fairly Easy (7th grade)</div>
                  <div>60-69: Standard (8th-9th grade)</div>
                  <div>50-59: Fairly Difficult (10th-12th grade)</div>
                  <div>30-49: Difficult (College level)</div>
                  <div>0-29: Very Difficult (Graduate)</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-cyan-400 mb-3">Recommendations</h4>
                <div className="space-y-2 text-slate-300">
                  <div>• <strong>Web content:</strong> Aim for 60-70 (8th-9th grade)</div>
                  <div>• <strong>Popular magazines:</strong> 50-60 (10th-12th grade)</div>
                  <div>• <strong>Academic writing:</strong> 30-50 (College level)</div>
                  <div>• <strong>Legal documents:</strong> Often below 30</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <ToolShell
      tool={tool}
      faqs={[
        {
          question: 'What is the Flesch Reading Ease score?',
          answer: 'The Flesch Reading Ease score rates text on a 100-point scale. Higher scores indicate easier readability. Scores of 60-70 are considered ideal for general web content, while 70-80 is suitable for casual reading.'
        },
        {
          question: 'How is lexical diversity calculated?',
          answer: 'Lexical diversity is the percentage of unique words in your text. Higher percentages indicate more varied vocabulary. Academic writing typically has higher lexical diversity than casual conversation.'
        },
        {
          question: 'Are the reading time estimates accurate?',
          answer: 'Reading times are based on average speeds: 200 words per minute for reading and 150 words per minute for speaking. Actual times vary based on content complexity and individual reading speed.'
        }
      ]}
      howToSteps={[
        'Paste or type your text in the analysis area',
        'View real-time statistics as you type',
        'Review basic counts, averages, and readability scores',
        'Check word frequency and lexical diversity',
        'Copy the complete report for reference'
      ]}
      benefits={[
        'Comprehensive text analysis',
        'Real-time readability scoring',
        'Word frequency analysis',
        'Professional-grade metrics'
      ]}
      useCases={[
        'Content optimization for target audiences',
        'Academic writing assessment',
        'SEO content analysis',
        'Educational material evaluation'
      ]}
    >
      {toolContent}
    </ToolShell>
  );
}