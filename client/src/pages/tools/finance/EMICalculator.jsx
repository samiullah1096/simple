import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function EMICalculator() {
  const tool = getToolBySlug('finance', 'emi-calculator');
  const [inputs, setInputs] = useState({
    loanAmount: 1000000,
    interestRate: 8.5,
    loanTenure: 20,
    tenureType: 'years' // 'years' or 'months'
  });
  
  const [results, setResults] = useState({
    emi: 0,
    totalAmount: 0,
    totalInterest: 0,
    monthlyBreakdown: []
  });

  useEffect(() => {
    calculateEMI();
  }, [inputs]);

  const calculateEMI = () => {
    const { loanAmount, interestRate, loanTenure, tenureType } = inputs;
    
    if (!loanAmount || !interestRate || !loanTenure) {
      setResults({ emi: 0, totalAmount: 0, totalInterest: 0, monthlyBreakdown: [] });
      return;
    }

    const principal = parseFloat(loanAmount);
    const monthlyRate = parseFloat(interestRate) / 12 / 100;
    const totalMonths = tenureType === 'years' ? parseInt(loanTenure) * 12 : parseInt(loanTenure);

    // EMI calculation using formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    const totalAmount = emi * totalMonths;
    const totalInterest = totalAmount - principal;

    // Generate monthly breakdown for first year
    const monthlyBreakdown = [];
    let outstandingPrincipal = principal;
    
    for (let month = 1; month <= Math.min(12, totalMonths); month++) {
      const interestPayment = outstandingPrincipal * monthlyRate;
      const principalPayment = emi - interestPayment;
      outstandingPrincipal -= principalPayment;
      
      monthlyBreakdown.push({
        month,
        emi: emi,
        principal: principalPayment,
        interest: interestPayment,
        balance: outstandingPrincipal
      });
    }

    setResults({
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      monthlyBreakdown
    });
  };

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(num));
  };

  const resetCalculator = () => {
    setInputs({
      loanAmount: 1000000,
      interestRate: 8.5,
      loanTenure: 20,
      tenureType: 'years'
    });
  };

  return (
    <ToolShell tool={tool} category="finance">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-slate-100">Loan Details</h2>
          
          <div className="space-y-6">
            {/* Loan Amount */}
            <div className="glassmorphism p-6 rounded-xl">
              <label className="block text-slate-100 font-medium mb-3">
                <i className="fas fa-rupee-sign text-emerald-400 mr-2"></i>
                Loan Amount
              </label>
              <input
                type="number"
                value={inputs.loanAmount}
                onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                data-testid="input-loan-amount"
              />
              <div className="mt-2 text-sm text-slate-400">
                Amount: {formatCurrency(inputs.loanAmount || 0)}
              </div>
              <div className="mt-3">
                <input
                  type="range"
                  min="100000"
                  max="10000000"
                  step="100000"
                  value={inputs.loanAmount}
                  onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>₹1L</span>
                  <span>₹1Cr</span>
                </div>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="glassmorphism p-6 rounded-xl">
              <label className="block text-slate-100 font-medium mb-3">
                <i className="fas fa-percentage text-blue-400 mr-2"></i>
                Annual Interest Rate
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.interestRate}
                onChange={(e) => handleInputChange('interestRate', e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                data-testid="input-interest-rate"
              />
              <div className="mt-2 text-sm text-slate-400">
                Rate: {inputs.interestRate}% per annum
              </div>
              <div className="mt-3">
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.1"
                  value={inputs.interestRate}
                  onChange={(e) => handleInputChange('interestRate', e.target.value)}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1%</span>
                  <span>20%</span>
                </div>
              </div>
            </div>

            {/* Loan Tenure */}
            <div className="glassmorphism p-6 rounded-xl">
              <label className="block text-slate-100 font-medium mb-3">
                <i className="fas fa-calendar text-purple-400 mr-2"></i>
                Loan Tenure
              </label>
              <div className="flex space-x-3 mb-3">
                <input
                  type="number"
                  value={inputs.loanTenure}
                  onChange={(e) => handleInputChange('loanTenure', e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                  data-testid="input-loan-tenure"
                />
                <select
                  value={inputs.tenureType}
                  onChange={(e) => handleInputChange('tenureType', e.target.value)}
                  className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                  data-testid="select-tenure-type"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
              <div className="mt-2 text-sm text-slate-400">
                Duration: {inputs.loanTenure} {inputs.tenureType} 
                {inputs.tenureType === 'years' && ` (${inputs.loanTenure * 12} months)`}
              </div>
              <div className="mt-3">
                <input
                  type="range"
                  min={inputs.tenureType === 'years' ? '1' : '12'}
                  max={inputs.tenureType === 'years' ? '30' : '360'}
                  step="1"
                  value={inputs.loanTenure}
                  onChange={(e) => handleInputChange('loanTenure', e.target.value)}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>{inputs.tenureType === 'years' ? '1Y' : '1M'}</span>
                  <span>{inputs.tenureType === 'years' ? '30Y' : '30Y'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={resetCalculator}
                className="flex-1 glassmorphism hover:bg-slate-700/50 text-slate-300 py-3 rounded-xl transition-colors"
                data-testid="button-reset"
              >
                <i className="fas fa-redo mr-2"></i>
                Reset
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
          <h2 className="text-2xl font-bold text-slate-100">EMI Calculation Results</h2>
          
          {/* Primary Results */}
          <div className="grid gap-4">
            <div className="glassmorphism p-6 rounded-xl text-center bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-emerald-500/20">
              <div className="text-sm text-slate-400 mb-2">Monthly EMI</div>
              <div className="text-3xl font-bold text-emerald-400" data-testid="result-emi">
                {formatCurrency(results.emi)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="glassmorphism p-4 rounded-xl text-center">
                <div className="text-xs text-slate-400 mb-1">Total Amount</div>
                <div className="text-lg font-bold text-slate-100" data-testid="result-total-amount">
                  {formatCurrency(results.totalAmount)}
                </div>
              </div>
              <div className="glassmorphism p-4 rounded-xl text-center">
                <div className="text-xs text-slate-400 mb-1">Total Interest</div>
                <div className="text-lg font-bold text-orange-400" data-testid="result-total-interest">
                  {formatCurrency(results.totalInterest)}
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Chart */}
          <div className="glassmorphism p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Payment Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Principal Amount</span>
                <span className="text-slate-100 font-medium">{formatCurrency(inputs.loanAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Interest Amount</span>
                <span className="text-orange-400 font-medium">{formatCurrency(results.totalInterest)}</span>
              </div>
              
              {/* Visual breakdown */}
              <div className="mt-4">
                <div className="flex h-4 rounded-lg overflow-hidden">
                  <div 
                    className="bg-emerald-500"
                    style={{ 
                      width: `${(inputs.loanAmount / results.totalAmount) * 100}%` 
                    }}
                  ></div>
                  <div 
                    className="bg-orange-500"
                    style={{ 
                      width: `${(results.totalInterest / results.totalAmount) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>Principal ({((inputs.loanAmount / results.totalAmount) * 100).toFixed(1)}%)</span>
                  <span>Interest ({((results.totalInterest / results.totalAmount) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Breakdown Table */}
          {results.monthlyBreakdown.length > 0 && (
            <div className="glassmorphism p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">
                First Year Payment Schedule
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-slate-400 pb-2">Month</th>
                      <th className="text-right text-slate-400 pb-2">EMI</th>
                      <th className="text-right text-slate-400 pb-2">Principal</th>
                      <th className="text-right text-slate-400 pb-2">Interest</th>
                      <th className="text-right text-slate-400 pb-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.monthlyBreakdown.map((month) => (
                      <tr key={month.month} className="border-b border-slate-800">
                        <td className="py-2 text-slate-100">{month.month}</td>
                        <td className="py-2 text-right text-slate-100">{formatNumber(month.emi)}</td>
                        <td className="py-2 text-right text-emerald-400">{formatNumber(month.principal)}</td>
                        <td className="py-2 text-right text-orange-400">{formatNumber(month.interest)}</td>
                        <td className="py-2 text-right text-slate-100">{formatNumber(month.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Key Insights */}
          <div className="glassmorphism p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              <i className="fas fa-lightbulb text-yellow-400 mr-2"></i>
              Key Insights
            </h3>
            <div className="space-y-2 text-sm text-slate-400">
              <p>• Your EMI represents {((results.emi / inputs.loanAmount) * 100).toFixed(2)}% of the loan amount</p>
              <p>• Total interest is {((results.totalInterest / inputs.loanAmount) * 100).toFixed(0)}% of the principal amount</p>
              <p>• Consider prepayments to reduce total interest burden</p>
              <p>• Lower interest rates or shorter tenure can significantly reduce total cost</p>
            </div>
          </div>
        </motion.div>
      </div>
    </ToolShell>
  );
}
