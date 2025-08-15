import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercentage, setTipPercentage] = useState('18');
  const [numberOfPeople, setNumberOfPeople] = useState('1');
  const [customTipPercentage, setCustomTipPercentage] = useState('');
  const [includesTax, setIncludesTax] = useState(false);

  const tool = TOOLS.finance.find(t => t.slug === 'tip-calculator');

  const calculateTip = () => {
    const bill = parseFloat(billAmount) || 0;
    const tip = parseFloat(tipPercentage) || 0;
    const people = parseInt(numberOfPeople) || 1;

    const tipAmount = (bill * tip) / 100;
    const totalAmount = bill + tipAmount;
    const perPersonBill = bill / people;
    const perPersonTip = tipAmount / people;
    const perPersonTotal = totalAmount / people;

    return {
      tipAmount,
      totalAmount,
      perPersonBill,
      perPersonTip,
      perPersonTotal
    };
  };

  const results = calculateTip();

  const tipPresets = [
    { label: '10%', value: '10', desc: 'Poor Service' },
    { label: '15%', value: '15', desc: 'Fair Service' },
    { label: '18%', value: '18', desc: 'Good Service' },
    { label: '20%', value: '20', desc: 'Great Service' },
    { label: '22%', value: '22', desc: 'Excellent Service' },
    { label: '25%', value: '25', desc: 'Outstanding Service' }
  ];

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <ToolShell
      tool={tool}
      data-testid="tip-calculator"
    >
      <div className="space-y-8">
        {/* Input Section */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bill Amount ($)
              </label>
              <input
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                placeholder="Enter bill amount"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="bill-amount-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Number of People
              </label>
              <input
                type="number"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(e.target.value)}
                placeholder="Number of people"
                min="1"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="people-input"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includesTax}
                  onChange={(e) => setIncludesTax(e.target.checked)}
                  className="rounded border-gray-600 text-emerald-400 focus:ring-emerald-400"
                />
                <span className="ml-2 text-gray-300">Bill includes tax</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Tip Percentage Selection */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Select Tip Percentage</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            {tipPresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => {
                  setTipPercentage(preset.value);
                  setCustomTipPercentage('');
                }}
                className={`p-3 rounded-lg border transition-all ${
                  tipPercentage === preset.value
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : 'bg-black/20 border-gray-600 text-gray-300 hover:border-emerald-400'
                }`}
                data-testid={`tip-preset-${preset.value}`}
              >
                <div className="font-bold">{preset.label}</div>
                <div className="text-xs">{preset.desc}</div>
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-gray-300">Custom:</label>
            <input
              type="number"
              value={customTipPercentage}
              onChange={(e) => {
                setCustomTipPercentage(e.target.value);
                setTipPercentage(e.target.value);
              }}
              placeholder="Custom %"
              min="0"
              max="100"
              step="0.1"
              className="w-24 px-3 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
              data-testid="custom-tip-input"
            />
            <span className="text-gray-300">%</span>
          </div>
        </motion.div>

        {/* Results Section */}
        {billAmount && (
          <motion.div 
            className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm rounded-xl p-6 border border-emerald-400/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400 mb-4">Total Bill Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Subtotal:</span>
                    <span className="text-white font-medium">{formatCurrency(parseFloat(billAmount) || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Tip ({tipPercentage}%):</span>
                    <span className="text-emerald-400 font-medium">{formatCurrency(results.tipAmount)}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2">
                    <div className="flex justify-between">
                      <span className="text-white font-semibold">Total:</span>
                      <span className="text-emerald-400 font-bold text-xl">{formatCurrency(results.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Per Person Breakdown */}
              {parseInt(numberOfPeople) > 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-4">Per Person ({numberOfPeople} people)</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Bill per person:</span>
                      <span className="text-white font-medium">{formatCurrency(results.perPersonBill)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Tip per person:</span>
                      <span className="text-emerald-400 font-medium">{formatCurrency(results.perPersonTip)}</span>
                    </div>
                    <div className="border-t border-gray-600 pt-2">
                      <div className="flex justify-between">
                        <span className="text-white font-semibold">Total per person:</span>
                        <span className="text-emerald-400 font-bold text-xl">{formatCurrency(results.perPersonTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tip Guide */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Tipping Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-emerald-400 mb-2">Restaurant Service</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Poor service: 10-12%</li>
                <li>• Average service: 15-16%</li>
                <li>• Good service: 18-20%</li>
                <li>• Excellent service: 22-25%</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-emerald-400 mb-2">Other Services</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Food delivery: 15-20%</li>
                <li>• Taxi/Uber: 15-20%</li>
                <li>• Hair salon: 15-20%</li>
                <li>• Hotel service: $1-5 per service</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* How to Use */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Enter your bill amount in dollars</li>
            <li>Select the number of people splitting the bill</li>
            <li>Choose a tip percentage based on service quality</li>
            <li>Or enter a custom tip percentage</li>
            <li>View the total bill and per-person amounts</li>
          </ol>
        </motion.div>
      </div>
    </ToolShell>
  );
}