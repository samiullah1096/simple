import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [results, setResults] = useState(null);

  const tool = TOOLS.finance.find(t => t.slug === 'sip-calculator');

  const calculateSIP = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = timePeriod * 12;
    
    // SIP Future Value Formula: PMT * [((1 + r)^n - 1) / r] * (1 + r)
    const futureValue = monthlyInvestment * 
      (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
    
    const totalInvested = monthlyInvestment * totalMonths;
    const totalReturns = futureValue - totalInvested;
    
    // Calculate year-wise breakdown
    const yearlyBreakdown = [];
    for (let year = 1; year <= timePeriod; year++) {
      const months = year * 12;
      const yearlyFV = monthlyInvestment * 
        (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
      const yearlyInvested = monthlyInvestment * months;
      const yearlyReturns = yearlyFV - yearlyInvested;
      
      yearlyBreakdown.push({
        year,
        invested: yearlyInvested,
        returns: yearlyReturns,
        total: yearlyFV
      });
    }
    
    setResults({
      futureValue: futureValue,
      totalInvested: totalInvested,
      totalReturns: totalReturns,
      yearlyBreakdown: yearlyBreakdown
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const faqs = [
    {
      question: 'What is SIP and how does it work?',
      answer: 'SIP (Systematic Investment Plan) allows you to invest a fixed amount regularly in mutual funds. It helps in rupee cost averaging and building wealth through disciplined investing.'
    },
    {
      question: 'What is a good expected return rate for SIP?',
      answer: 'Equity mutual funds historically deliver 10-15% returns over long term. For calculation purposes, 12% is commonly used as a reasonable expectation.'
    },
    {
      question: 'How accurate are SIP calculator projections?',
      answer: 'SIP calculators provide estimates based on assumed returns. Actual returns may vary due to market conditions, fund performance, and economic factors.'
    }
  ];

  const howToSteps = [
    'Enter your monthly SIP investment amount',
    'Set the expected annual return rate (typically 10-15%)',
    'Choose your investment time period in years',
    'Click "Calculate SIP" to see projections',
    'Review the detailed breakdown and year-wise growth'
  ];

  const benefits = [
    'Wealth accumulation through disciplined investing',
    'Power of compounding over long term',
    'Rupee cost averaging benefits',
    'Goal-based investment planning',
    'Financial independence planning'
  ];

  return (
    <ToolShell tool={tool} faqs={faqs} howToSteps={howToSteps} benefits={benefits}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-slate-100">SIP Investment Details</h2>
          
          <div className="glassmorphism rounded-2xl p-6 space-y-6">
            <div>
              <label className="block text-slate-300 font-medium mb-3">
                Monthly Investment Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">₹</span>
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-600 rounded-xl pl-8 pr-4 py-3 text-slate-200 focus:border-emerald-400 focus:outline-none"
                  min="500"
                  step="500"
                  data-testid="input-monthly-investment"
                />
              </div>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full mt-2 accent-emerald-400"
                data-testid="slider-monthly-investment"
              />
              <div className="flex justify-between text-sm text-slate-500 mt-1">
                <span>₹500</span>
                <span>₹1,00,000</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-3">
                Expected Annual Return (%)
              </label>
              <input
                type="number"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-slate-200 focus:border-emerald-400 focus:outline-none"
                min="1"
                max="30"
                step="0.5"
                data-testid="input-expected-return"
              />
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full mt-2 accent-emerald-400"
                data-testid="slider-expected-return"
              />
              <div className="flex justify-between text-sm text-slate-500 mt-1">
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-3">
                Time Period (Years)
              </label>
              <input
                type="number"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-slate-200 focus:border-emerald-400 focus:outline-none"
                min="1"
                max="50"
                data-testid="input-time-period"
              />
              <input
                type="range"
                min="1"
                max="50"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full mt-2 accent-emerald-400"
                data-testid="slider-time-period"
              />
              <div className="flex justify-between text-sm text-slate-500 mt-1">
                <span>1 Year</span>
                <span>50 Years</span>
              </div>
            </div>

            <button
              onClick={calculateSIP}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl text-lg font-semibold transition-colors"
              data-testid="button-calculate"
            >
              <i className="fas fa-calculator mr-2"></i>
              Calculate SIP
            </button>
          </div>
        </motion.div>

        {/* Results Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-slate-100">SIP Projection Results</h2>
          
          {!results ? (
            <div className="glassmorphism rounded-2xl p-8 text-center">
              <i className="fas fa-chart-line text-4xl text-emerald-400 mb-4 block"></i>
              <p className="text-slate-400">
                Enter your SIP details and click calculate to see projections
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-4">
                <div className="glassmorphism rounded-xl p-4">
                  <div className="text-center">
                    <p className="text-slate-400 text-sm">Total Investment</p>
                    <p className="text-2xl font-bold text-blue-400" data-testid="total-invested">
                      {formatCurrency(results.totalInvested)}
                    </p>
                  </div>
                </div>
                
                <div className="glassmorphism rounded-xl p-4">
                  <div className="text-center">
                    <p className="text-slate-400 text-sm">Total Returns</p>
                    <p className="text-2xl font-bold text-green-400" data-testid="total-returns">
                      {formatCurrency(results.totalReturns)}
                    </p>
                  </div>
                </div>
                
                <div className="glassmorphism rounded-xl p-4">
                  <div className="text-center">
                    <p className="text-slate-400 text-sm">Maturity Value</p>
                    <p className="text-3xl font-bold text-emerald-400" data-testid="maturity-value">
                      {formatCurrency(results.futureValue)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Year-wise Breakdown */}
              <div className="glassmorphism rounded-xl p-4">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Year-wise Growth</h3>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {results.yearlyBreakdown.slice(-10).map((year) => (
                    <div key={year.year} className="flex justify-between items-center p-2 hover:bg-slate-700/30 rounded">
                      <span className="text-slate-300">Year {year.year}</span>
                      <div className="text-right">
                        <div className="text-emerald-400 font-semibold">
                          {formatCurrency(year.total)}
                        </div>
                        <div className="text-xs text-slate-500">
                          Returns: {formatCurrency(year.returns)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </ToolShell>
  );
}