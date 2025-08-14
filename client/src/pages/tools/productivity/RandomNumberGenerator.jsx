import React, { useState } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const RandomNumberGenerator = ({ tool }) => {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);

  const generateNumbers = () => {
    const minNum = parseInt(min);
    const maxNum = parseInt(max);
    const countNum = parseInt(count);

    if (isNaN(minNum) || isNaN(maxNum) || isNaN(countNum)) {
      alert('Please enter valid numbers');
      return;
    }

    if (minNum >= maxNum) {
      alert('Minimum value must be less than maximum value');
      return;
    }

    if (countNum <= 0) {
      alert('Count must be greater than 0');
      return;
    }

    if (!allowDuplicates && countNum > (maxNum - minNum + 1)) {
      alert('Cannot generate more unique numbers than the range allows');
      return;
    }

    let numbers = [];
    const range = maxNum - minNum + 1;

    if (allowDuplicates) {
      for (let i = 0; i < countNum; i++) {
        numbers.push(Math.floor(Math.random() * range) + minNum);
      }
    } else {
      const availableNumbers = Array.from({length: range}, (_, i) => i + minNum);
      for (let i = 0; i < countNum; i++) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        numbers.push(availableNumbers.splice(randomIndex, 1)[0]);
      }
    }

    const result = {
      numbers,
      min: minNum,
      max: maxNum,
      count: countNum,
      allowDuplicates,
      timestamp: new Date().toLocaleString()
    };

    setResults(numbers);
    setHistory(prev => [result, ...prev.slice(0, 9)]);
  };

  const generateSingle = () => {
    const minNum = parseInt(min);
    const maxNum = parseInt(max);

    if (isNaN(minNum) || isNaN(maxNum)) {
      alert('Please enter valid numbers');
      return;
    }

    if (minNum >= maxNum) {
      alert('Minimum value must be less than maximum value');
      return;
    }

    const number = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    setResults([number]);
  };

  const copyResults = () => {
    if (results.length === 0) return;
    
    const text = results.join(', ');
    navigator.clipboard.writeText(text);
    alert('Numbers copied to clipboard!');
  };

  const generateLottery = () => {
    // Common lottery format: 6 numbers from 1-49
    const lotteryNumbers = [];
    const availableNumbers = Array.from({length: 49}, (_, i) => i + 1);
    
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      lotteryNumbers.push(availableNumbers.splice(randomIndex, 1)[0]);
    }
    
    lotteryNumbers.sort((a, b) => a - b);
    setResults(lotteryNumbers);
  };

  const generateDice = (sides = 6) => {
    const result = Math.floor(Math.random() * sides) + 1;
    setResults([result]);
  };

  return (
    <ToolShell
      title="Random Number Generator"
      description="Generate random numbers with custom ranges, counts, and various preset options"
      category="Productivity Tools"
      features={[
        "Custom range and count settings",
        "Unique or duplicate number options",
        "Quick preset generators (dice, lottery)",
        "Generation history tracking"
      ]}
      faqs={[
        {
          question: "How random are the generated numbers?",
          answer: "The numbers are generated using JavaScript's Math.random() function, which provides pseudorandom numbers suitable for most applications."
        },
        {
          question: "What's the difference between allowing and not allowing duplicates?",
          answer: "When duplicates are allowed, the same number can appear multiple times. When not allowed, each number in the set will be unique."
        },
        {
          question: "Can I generate lottery numbers?",
          answer: "Yes, there's a quick lottery button that generates 6 unique numbers from 1-49, which is a common lottery format."
        }
      ]}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Random Number Generator</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Minimum Value</label>
                <input
                  type="number"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Maximum Value</label>
                <input
                  type="number"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Count</label>
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowDuplicates"
                checked={allowDuplicates}
                onChange={(e) => setAllowDuplicates(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="allowDuplicates" className="text-sm">Allow duplicate numbers</label>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={generateNumbers}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Generate Numbers
              </button>
              
              <button
                onClick={generateSingle}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
              >
                Generate Single Number
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h4 className="font-semibold mb-4">Quick Generators</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => generateDice(6)}
              className="bg-purple-600 text-white py-2 px-3 rounded-md hover:bg-purple-700 transition duration-200 text-sm"
            >
              🎲 Dice (1-6)
            </button>
            
            <button
              onClick={() => generateDice(20)}
              className="bg-purple-600 text-white py-2 px-3 rounded-md hover:bg-purple-700 transition duration-200 text-sm"
            >
              🎲 D20 (1-20)
            </button>
            
            <button
              onClick={generateLottery}
              className="bg-yellow-600 text-white py-2 px-3 rounded-md hover:bg-yellow-700 transition duration-200 text-sm"
            >
              🎱 Lottery
            </button>
            
            <button
              onClick={() => {
                setMin('0');
                setMax('1');
                generateSingle();
              }}
              className="bg-indigo-600 text-white py-2 px-3 rounded-md hover:bg-indigo-700 transition duration-200 text-sm"
            >
              🪙 Coin Flip
            </button>
          </div>
        </div>
        
        {results.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Generated Numbers</h4>
            
            <div className="text-center mb-4">
              <div className="flex flex-wrap justify-center gap-2">
                {results.map((number, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg font-bold text-lg"
                  >
                    {number}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={copyResults}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
              >
                Copy Numbers
              </button>
              
              <button
                onClick={generateNumbers}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Generate Again
              </button>
            </div>
          </div>
        )}
        
        {history.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h4 className="font-semibold mb-4">Generation History</h4>
            <div className="space-y-3">
              {history.slice(0, 5).map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-mono text-sm">
                        {item.numbers.join(', ')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Range: {item.min}-{item.max}, Count: {item.count}
                        {!item.allowDuplicates ? ', Unique' : ''}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {item.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default RandomNumberGenerator;