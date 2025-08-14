import React, { useState } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const PercentageCalculator = () => {
  const [calculationType, setCalculationType] = useState('basic');
  const [results, setResults] = useState({});

  // Basic percentage calculation
  const [basicValue, setBasicValue] = useState('');
  const [basicPercent, setBasicPercent] = useState('');

  // Percentage change calculation
  const [oldValue, setOldValue] = useState('');
  const [newValue, setNewValue] = useState('');

  // Find what percent
  const [partValue, setPartValue] = useState('');
  const [wholeValue, setWholeValue] = useState('');

  // Find the whole
  const [knownPart, setKnownPart] = useState('');
  const [knownPercent, setKnownPercent] = useState('');

  const calculateBasicPercentage = () => {
    if (!basicValue || !basicPercent) return;
    const result = (parseFloat(basicValue) * parseFloat(basicPercent)) / 100;
    setResults({
      type: 'basic',
      result: `${basicPercent}% of ${basicValue} = ${result.toFixed(2)}`
    });
  };

  const calculatePercentageChange = () => {
    if (!oldValue || !newValue) return;
    const old = parseFloat(oldValue);
    const newVal = parseFloat(newValue);
    const change = ((newVal - old) / old) * 100;
    const increase = change >= 0;
    
    setResults({
      type: 'change',
      result: `${increase ? 'Increase' : 'Decrease'} of ${Math.abs(change).toFixed(2)}%`,
      details: `From ${old} to ${newVal}`
    });
  };

  const calculateWhatPercent = () => {
    if (!partValue || !wholeValue) return;
    const percent = (parseFloat(partValue) / parseFloat(wholeValue)) * 100;
    setResults({
      type: 'whatPercent',
      result: `${partValue} is ${percent.toFixed(2)}% of ${wholeValue}`
    });
  };

  const calculateWhole = () => {
    if (!knownPart || !knownPercent) return;
    const whole = (parseFloat(knownPart) * 100) / parseFloat(knownPercent);
    setResults({
      type: 'whole',
      result: `If ${knownPart} is ${knownPercent}%, then the whole is ${whole.toFixed(2)}`
    });
  };

  const renderCalculator = () => {
    switch (calculationType) {
      case 'basic':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold">Calculate X% of Y</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Percentage (%)</label>
                <input
                  type="number"
                  value={basicPercent}
                  onChange={(e) => setBasicPercent(e.target.value)}
                  placeholder="e.g., 25"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Of Value</label>
                <input
                  type="number"
                  value={basicValue}
                  onChange={(e) => setBasicValue(e.target.value)}
                  placeholder="e.g., 200"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            <button
              onClick={calculateBasicPercentage}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Calculate
            </button>
          </div>
        );

      case 'change':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold">Percentage Change</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Original Value</label>
                <input
                  type="number"
                  value={oldValue}
                  onChange={(e) => setOldValue(e.target.value)}
                  placeholder="e.g., 100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Value</label>
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="e.g., 120"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            <button
              onClick={calculatePercentageChange}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Calculate Change
            </button>
          </div>
        );

      case 'whatPercent':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold">What Percent is X of Y?</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Part Value</label>
                <input
                  type="number"
                  value={partValue}
                  onChange={(e) => setPartValue(e.target.value)}
                  placeholder="e.g., 25"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Whole Value</label>
                <input
                  type="number"
                  value={wholeValue}
                  onChange={(e) => setWholeValue(e.target.value)}
                  placeholder="e.g., 200"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            <button
              onClick={calculateWhatPercent}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Calculate Percentage
            </button>
          </div>
        );

      case 'findWhole':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold">Find the Whole</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Known Part</label>
                <input
                  type="number"
                  value={knownPart}
                  onChange={(e) => setKnownPart(e.target.value)}
                  placeholder="e.g., 50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Percentage (%)</label>
                <input
                  type="number"
                  value={knownPercent}
                  onChange={(e) => setKnownPercent(e.target.value)}
                  placeholder="e.g., 25"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            <button
              onClick={calculateWhole}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Find Whole
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ToolShell
      title="Percentage Calculator"
      description="Calculate percentages, percentage changes, and solve various percentage problems"
      category="Productivity Tools"
      features={[
        "Basic percentage calculations",
        "Percentage increase/decrease",
        "Find what percent one number is of another",
        "Calculate the whole from a known percentage"
      ]}
      faqs={[
        {
          question: "How do I calculate percentage change?",
          answer: "Percentage change is calculated as ((New Value - Original Value) / Original Value) × 100. Positive values indicate an increase, negative values indicate a decrease."
        },
        {
          question: "What's the difference between percentage and percentile?",
          answer: "Percentage is a fraction of 100, while percentile indicates the value below which a certain percentage of data falls in a distribution."
        },
        {
          question: "How accurate are the calculations?",
          answer: "All calculations are performed with high precision and results are displayed with up to 2 decimal places for clarity."
        }
      ]}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Percentage Calculator</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Calculation Type</label>
            <select
              value={calculationType}
              onChange={(e) => {
                setCalculationType(e.target.value);
                setResults({});
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="basic">Basic: X% of Y</option>
              <option value="change">Percentage Change</option>
              <option value="whatPercent">What percent is X of Y?</option>
              <option value="findWhole">Find the whole</option>
            </select>
          </div>
          
          {renderCalculator()}
        </div>
        
        {results.result && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Result</h4>
            <p className="text-green-700 dark:text-green-300 text-lg font-mono">{results.result}</p>
            {results.details && (
              <p className="text-green-600 dark:text-green-400 text-sm mt-1">{results.details}</p>
            )}
          </div>
        )}
        
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Quick Examples</h4>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p>• 25% of 200 = 50</p>
            <p>• From 100 to 120 = 20% increase</p>
            <p>• 30 is 15% of 200</p>
            <p>• If 25 is 50%, then whole = 50</p>
          </div>
        </div>
      </div>
    </ToolShell>
  );
};

export default PercentageCalculator;