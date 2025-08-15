import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [termUnit, setTermUnit] = useState('years');
  const [extraPayment, setExtraPayment] = useState('');

  const tool = TOOLS.finance.find(t => t.slug === 'loan-calculator');

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount) || 0;
    const annualRate = parseFloat(interestRate) || 0;
    const termValue = parseFloat(loanTerm) || 0;
    const extra = parseFloat(extraPayment) || 0;

    if (principal <= 0 || annualRate <= 0 || termValue <= 0) {
      return null;
    }

    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = termUnit === 'years' ? termValue * 12 : termValue;

    // Calculate monthly payment using loan payment formula
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalPayment = monthlyPayment * totalMonths;
    const totalInterest = totalPayment - principal;

    // Calculate with extra payments
    let remainingBalance = principal;
    let totalInterestWithExtra = 0;
    let monthsToPayOff = 0;
    let schedule = [];

    for (let month = 1; month <= totalMonths && remainingBalance > 0; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      let principalPayment = monthlyPayment - interestPayment;
      
      if (extra > 0 && month > 1) {
        principalPayment += extra;
      }

      if (principalPayment > remainingBalance) {
        principalPayment = remainingBalance;
      }

      remainingBalance -= principalPayment;
      totalInterestWithExtra += interestPayment;
      monthsToPayOff = month;

      if (month <= 12) {
        schedule.push({
          month,
          payment: monthlyPayment + (extra && month > 1 ? extra : 0),
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, remainingBalance)
        });
      }
    }

    const interestSavings = extra > 0 ? totalInterest - totalInterestWithExtra : 0;
    const timeSavings = extra > 0 ? totalMonths - monthsToPayOff : 0;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      totalInterestWithExtra,
      interestSavings,
      timeSavings,
      monthsToPayOff,
      schedule
    };
  };

  const results = calculateLoan();

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMonths = (months) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years > 0 && remainingMonths > 0) {
      return `${years} years, ${remainingMonths} months`;
    } else if (years > 0) {
      return `${years} years`;
    } else {
      return `${remainingMonths} months`;
    }
  };

  return (
    <ToolShell
      tool={tool}
      data-testid="loan-calculator"
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
                Loan Amount ($)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="Enter loan amount"
                step="100"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="loan-amount-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="Enter interest rate"
                step="0.01"
                min="0"
                max="50"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="interest-rate-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Loan Term
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  placeholder="Term"
                  min="1"
                  className="flex-1 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  data-testid="loan-term-input"
                />
                <select
                  value={termUnit}
                  onChange={(e) => setTermUnit(e.target.value)}
                  className="px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  data-testid="term-unit-select"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Extra Monthly Payment ($)
                <span className="text-xs text-gray-400 ml-1">(Optional)</span>
              </label>
              <input
                type="number"
                value={extraPayment}
                onChange={(e) => setExtraPayment(e.target.value)}
                placeholder="Extra payment"
                step="10"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="extra-payment-input"
              />
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        {results && (
          <motion.div 
            className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm rounded-xl p-6 border border-emerald-400/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Payment Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400 mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-gray-300 text-sm">Monthly Payment</div>
                    <div className="text-white font-bold text-xl">{formatCurrency(results.monthlyPayment)}</div>
                  </div>
                  <div>
                    <div className="text-gray-300 text-sm">Total Payment</div>
                    <div className="text-white font-medium">{formatCurrency(results.totalPayment)}</div>
                  </div>
                  <div>
                    <div className="text-gray-300 text-sm">Total Interest</div>
                    <div className="text-red-400 font-medium">{formatCurrency(results.totalInterest)}</div>
                  </div>
                </div>
              </div>

              {/* Extra Payment Benefits */}
              {parseFloat(extraPayment) > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-4">With Extra Payment</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-gray-300 text-sm">Total Interest</div>
                      <div className="text-green-400 font-medium">{formatCurrency(results.totalInterestWithExtra)}</div>
                    </div>
                    <div>
                      <div className="text-gray-300 text-sm">Interest Savings</div>
                      <div className="text-emerald-400 font-bold">{formatCurrency(results.interestSavings)}</div>
                    </div>
                    <div>
                      <div className="text-gray-300 text-sm">Time Savings</div>
                      <div className="text-emerald-400 font-medium">{formatMonths(results.timeSavings)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loan Breakdown */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400 mb-4">Loan Breakdown</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-gray-300 text-sm">Principal Amount</div>
                    <div className="text-white font-medium">{formatCurrency(parseFloat(loanAmount))}</div>
                  </div>
                  <div>
                    <div className="text-gray-300 text-sm">Interest Rate</div>
                    <div className="text-white font-medium">{interestRate}% annual</div>
                  </div>
                  <div>
                    <div className="text-gray-300 text-sm">Loan Term</div>
                    <div className="text-white font-medium">{loanTerm} {termUnit}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Payment Schedule Preview */}
        {results && results.schedule.length > 0 && (
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Payment Schedule (First 12 Months)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-2 text-gray-300">Month</th>
                    <th className="text-right py-2 text-gray-300">Payment</th>
                    <th className="text-right py-2 text-gray-300">Principal</th>
                    <th className="text-right py-2 text-gray-300">Interest</th>
                    <th className="text-right py-2 text-gray-300">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {results.schedule.map((payment, index) => (
                    <tr key={index} className="border-b border-gray-700/50">
                      <td className="py-2 text-gray-300">{payment.month}</td>
                      <td className="py-2 text-right text-white">{formatCurrency(payment.payment)}</td>
                      <td className="py-2 text-right text-emerald-400">{formatCurrency(payment.principal)}</td>
                      <td className="py-2 text-right text-red-400">{formatCurrency(payment.interest)}</td>
                      <td className="py-2 text-right text-white">{formatCurrency(payment.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Loan Tips */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Loan Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-emerald-400 mb-2">Save on Interest</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Make extra principal payments</li>
                <li>• Pay bi-weekly instead of monthly</li>
                <li>• Round up your payments</li>
                <li>• Consider refinancing for lower rates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-emerald-400 mb-2">Before Borrowing</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Shop around for the best rates</li>
                <li>• Check your credit score</li>
                <li>• Consider the total cost, not just monthly payment</li>
                <li>• Have a repayment plan</li>
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
            <li>Enter the loan amount you want to borrow</li>
            <li>Input the annual interest rate offered by the lender</li>
            <li>Set the loan term in years or months</li>
            <li>Optionally add extra monthly payment to see savings</li>
            <li>Review the payment schedule and total costs</li>
          </ol>
        </motion.div>
      </div>
    </ToolShell>
  );
}