import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [interestRate, setInterestRate] = useState(8);
  const [timePeriod, setTimePeriod] = useState(5);
  const [compoundingFrequency, setCompoundingFrequency] = useState(1);
  const [monthlyDeposit, setMonthlyDeposit] = useState(0);
  const [results, setResults] = useState(null);

  const tool = TOOLS.finance.find(t => t.slug === 'compound-interest');

  const compoundingOptions = [
    { value: 1, label: 'Annually' },
    { value: 2, label: 'Semi-Annually' },
    { value: 4, label: 'Quarterly' },
    { value: 12, label: 'Monthly' },
    { value: 365, label: 'Daily' }
  ];

  const calculateCompoundInterest = () => {
    // Standard compound interest formula: A = P(1 + r/n)^(nt)
    const r = interestRate / 100;
    const n = compoundingFrequency;
    const t = timePeriod;
    
    let finalAmount = principal * Math.pow(1 + r/n, n * t);
    
    // Add monthly deposits if any
    if (monthlyDeposit > 0) {
      // Future value of annuity formula for monthly deposits
      const monthlyRate = r / 12;
      const totalMonths = t * 12;
      const annuityFV = monthlyDeposit * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate));
      finalAmount += annuityFV;
    }
    
    const totalDeposits = monthlyDeposit * 12 * t;
    const totalPrincipal = principal + totalDeposits;
    const compoundInterest = finalAmount - totalPrincipal;
    
    // Calculate year-wise breakdown
    const yearlyBreakdown = [];
    for (let year = 1; year <= timePeriod; year++) {
      let yearlyAmount = principal * Math.pow(1 + r/n, n * year);
      
      if (monthlyDeposit > 0) {
        const monthlyRate = r / 12;
        const months = year * 12;
        const yearlyAnnuity = monthlyDeposit * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));
        yearlyAmount += yearlyAnnuity;
      }
      
      const yearlyPrincipal = principal + (monthlyDeposit * 12 * year);
      const yearlyInterest = yearlyAmount - yearlyPrincipal;
      
      yearlyBreakdown.push({
        year,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        total: yearlyAmount
      });
    }
    
    setResults({
      finalAmount,
      totalPrincipal,
      compoundInterest,
      yearlyBreakdown
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
      question: 'What is compound interest?',
      answer: 'Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. It\'s "interest on interest" that accelerates wealth growth.'
    },
    {
      question: 'How does compounding frequency affect returns?',
      answer: 'Higher compounding frequency (monthly vs annually) results in slightly higher returns because interest is calculated and added more frequently.'
    },
    {
      question: 'What investments benefit from compound interest?',
      answer: 'Fixed deposits, mutual funds, PPF, bonds, and any investment where returns are reinvested benefit from compound interest over time.'
    }
  ];

  const howToSteps = [
    'Enter your initial investment (principal amount)',
    'Set the annual interest rate percentage',
    'Choose the investment time period in years',
    'Select how often interest compounds (monthly, quarterly, etc.)',
    'Add monthly deposits if you plan regular investments'
  ];

  const benefits = [
    'Exponential wealth growth over time',
    'Power of starting early with investments',
    'Mathematical precision in calculations',
    'Compare different investment scenarios',
    'Plan long-term financial goals'
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
          <h2 className="text-2xl font-bold text-slate-100">Investment Parameters</h2>
          
          <div className="glassmorphism rounded-2xl p-6 space-y-6">
            <div>
              <label className="block text-slate-300 font-medium mb-3">
                Initial Investment (Principal)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">₹</span>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-600 rounded-xl pl-8 pr-4 py-3 text-slate-200 focus:border-emerald-400 focus:outline-none"
                  min="1000"
                  step="1000"
                  data-testid="input-principal"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-3">
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-slate-200 focus:border-emerald-400 focus:outline-none"
                min="0.1"
                max="50"
                step="0.1"
                data-testid="input-interest-rate"
              />
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
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-3">
                Compounding Frequency
              </label>
              <select
                value={compoundingFrequency}
                onChange={(e) => setCompoundingFrequency(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-slate-200 focus:border-emerald-400 focus:outline-none"
                data-testid="select-compounding"
              >
                {compoundingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-3">
                Monthly Additional Deposit (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">₹</span>
                <input
                  type="number"
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-600 rounded-xl pl-8 pr-4 py-3 text-slate-200 focus:border-emerald-400 focus:outline-none"
                  min="0"
                  step="500"
                  data-testid="input-monthly-deposit"
                />
              </div>
            </div>

            <button
              onClick={calculateCompoundInterest}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl text-lg font-semibold transition-colors"
              data-testid="button-calculate"
            >
              <i className="fas fa-percentage mr-2"></i>
              Calculate Compound Interest
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
          <h2 className="text-2xl font-bold text-slate-100">Growth Projection</h2>
          
          {!results ? (
            <div className="glassmorphism rounded-2xl p-8 text-center">
              <i className="fas fa-percentage text-4xl text-emerald-400 mb-4 block"></i>
              <p className="text-slate-400">
                Enter investment details to see compound interest calculations
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-4">
                <div className="glassmorphism rounded-xl p-4">
                  <div className="text-center">
                    <p className="text-slate-400 text-sm">Total Principal</p>
                    <p className="text-2xl font-bold text-blue-400" data-testid="total-principal">
                      {formatCurrency(results.totalPrincipal)}
                    </p>
                  </div>
                </div>
                
                <div className="glassmorphism rounded-xl p-4">
                  <div className="text-center">
                    <p className="text-slate-400 text-sm">Compound Interest</p>
                    <p className="text-2xl font-bold text-green-400" data-testid="compound-interest">
                      {formatCurrency(results.compoundInterest)}
                    </p>
                  </div>
                </div>
                
                <div className="glassmorphism rounded-xl p-4">
                  <div className="text-center">
                    <p className="text-slate-400 text-sm">Final Amount</p>
                    <p className="text-3xl font-bold text-emerald-400" data-testid="final-amount">
                      {formatCurrency(results.finalAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Growth Chart Simulation */}
              <div className="glassmorphism rounded-xl p-4">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Growth Visualization</h3>
                <div className="space-y-2">
                  {results.yearlyBreakdown.map((year) => {
                    const principalWidth = (year.principal / results.finalAmount) * 100;
                    const interestWidth = (year.interest / results.finalAmount) * 100;
                    
                    return (
                      <div key={year.year} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Year {year.year}</span>
                          <span className="text-emerald-400">{formatCurrency(year.total)}</span>
                        </div>
                        <div className="flex h-4 bg-slate-700 rounded overflow-hidden">
                          <div 
                            className="bg-blue-500" 
                            style={{ width: `${principalWidth}%` }}
                            title={`Principal: ${formatCurrency(year.principal)}`}
                          ></div>
                          <div 
                            className="bg-green-500" 
                            style={{ width: `${interestWidth}%` }}
                            title={`Interest: ${formatCurrency(year.interest)}`}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center space-x-4 mt-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                    <span className="text-slate-400">Principal</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                    <span className="text-slate-400">Interest</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </ToolShell>
  );
}