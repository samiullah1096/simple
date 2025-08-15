import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [loanTerm, setLoanTerm] = useState('30');
  const [interestRate, setInterestRate] = useState('');
  const [propertyTax, setPropertyTax] = useState('');
  const [homeInsurance, setHomeInsurance] = useState('');
  const [pmi, setPmi] = useState('');
  const [hoaFees, setHoaFees] = useState('');

  const tool = TOOLS.finance.find(t => t.slug === 'mortgage-calculator');

  const calculateMortgage = () => {
    const price = parseFloat(homePrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const term = parseFloat(loanTerm) || 30;
    const rate = parseFloat(interestRate) || 0;
    const tax = parseFloat(propertyTax) || 0;
    const insurance = parseFloat(homeInsurance) || 0;
    const pmiAmount = parseFloat(pmi) || 0;
    const hoa = parseFloat(hoaFees) || 0;

    if (price <= 0 || down < 0 || rate <= 0) {
      return null;
    }

    const loanAmount = price - down;
    const monthlyRate = rate / 100 / 12;
    const totalPayments = term * 12;
    
    // Calculate monthly principal and interest
    const monthlyPI = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    // Calculate other monthly costs
    const monthlyTax = tax / 12;
    const monthlyInsurance = insurance / 12;
    const monthlyPMI = pmiAmount / 12;
    const monthlyHOA = hoa / 12;

    const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI + monthlyHOA;
    const totalCost = (monthlyPI * totalPayments) + (tax * term) + (insurance * term) + (pmiAmount * term) + (hoa * term);
    const totalInterest = (monthlyPI * totalPayments) - loanAmount;

    const downPaymentPercent = (down / price) * 100;
    const loanToValue = ((price - down) / price) * 100;

    return {
      loanAmount,
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyPMI,
      monthlyHOA,
      totalMonthlyPayment,
      totalCost,
      totalInterest,
      downPaymentPercent,
      loanToValue
    };
  };

  const results = calculateMortgage();

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercent = (percent) => {
    return `${percent.toFixed(1)}%`;
  };

  return (
    <ToolShell
      tool={tool}
      data-testid="mortgage-calculator"
    >
      <div className="space-y-8">
        {/* Home Purchase Information */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">Home Purchase Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Home Price ($)
              </label>
              <input
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(e.target.value)}
                placeholder="Enter home price"
                step="1000"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="home-price-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Down Payment ($)
              </label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder="Enter down payment"
                step="1000"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="down-payment-input"
              />
            </div>
          </div>
        </motion.div>

        {/* Loan Details */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">Loan Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Loan Term (Years)
              </label>
              <select
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="loan-term-select"
              >
                <option value="15">15 years</option>
                <option value="20">20 years</option>
                <option value="25">25 years</option>
                <option value="30">30 years</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Interest Rate (% APR)
              </label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="Enter interest rate"
                step="0.01"
                min="0"
                max="20"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="interest-rate-input"
              />
            </div>
          </div>
        </motion.div>

        {/* Additional Costs */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">Additional Monthly Costs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Property Tax (Annual $)
              </label>
              <input
                type="number"
                value={propertyTax}
                onChange={(e) => setPropertyTax(e.target.value)}
                placeholder="Annual property tax"
                step="100"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="property-tax-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Home Insurance (Annual $)
              </label>
              <input
                type="number"
                value={homeInsurance}
                onChange={(e) => setHomeInsurance(e.target.value)}
                placeholder="Annual home insurance"
                step="100"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="home-insurance-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                PMI (Annual $)
                <span className="text-xs text-gray-400 ml-1">(If down payment &lt; 20%)</span>
              </label>
              <input
                type="number"
                value={pmi}
                onChange={(e) => setPmi(e.target.value)}
                placeholder="Annual PMI premium"
                step="50"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="pmi-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                HOA Fees (Monthly $)
              </label>
              <input
                type="number"
                value={hoaFees}
                onChange={(e) => setHoaFees(e.target.value)}
                placeholder="Monthly HOA fees"
                step="25"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="hoa-fees-input"
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
            transition={{ delay: 0.4 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly Payment Breakdown */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400 mb-4">Monthly Payment Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-600">
                    <span className="text-gray-300">Principal & Interest:</span>
                    <span className="text-white font-medium">{formatCurrency(results.monthlyPI)}</span>
                  </div>
                  {results.monthlyTax > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-600">
                      <span className="text-gray-300">Property Tax:</span>
                      <span className="text-white font-medium">{formatCurrency(results.monthlyTax)}</span>
                    </div>
                  )}
                  {results.monthlyInsurance > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-600">
                      <span className="text-gray-300">Home Insurance:</span>
                      <span className="text-white font-medium">{formatCurrency(results.monthlyInsurance)}</span>
                    </div>
                  )}
                  {results.monthlyPMI > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-600">
                      <span className="text-gray-300">PMI:</span>
                      <span className="text-white font-medium">{formatCurrency(results.monthlyPMI)}</span>
                    </div>
                  )}
                  {results.monthlyHOA > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-600">
                      <span className="text-gray-300">HOA Fees:</span>
                      <span className="text-white font-medium">{formatCurrency(results.monthlyHOA)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-white font-semibold text-lg">Total Monthly Payment:</span>
                    <span className="text-emerald-400 font-bold text-2xl">{formatCurrency(results.totalMonthlyPayment)}</span>
                  </div>
                </div>
              </div>

              {/* Loan Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400 mb-4">Loan Summary</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-gray-300 text-sm">Home Price</div>
                    <div className="text-white font-medium">{formatCurrency(parseFloat(homePrice) || 0)}</div>
                  </div>
                  <div>
                    <div className="text-gray-300 text-sm">Down Payment ({formatPercent(results.downPaymentPercent)})</div>
                    <div className="text-white font-medium">{formatCurrency(parseFloat(downPayment) || 0)}</div>
                  </div>
                  <div>
                    <div className="text-gray-300 text-sm">Loan Amount</div>
                    <div className="text-white font-medium">{formatCurrency(results.loanAmount)}</div>
                  </div>
                  <div>
                    <div className="text-gray-300 text-sm">Loan-to-Value Ratio</div>
                    <div className="text-white font-medium">{formatPercent(results.loanToValue)}</div>
                  </div>
                  <div>
                    <div className="text-gray-300 text-sm">Total Interest Paid</div>
                    <div className="text-red-400 font-medium">{formatCurrency(results.totalInterest)}</div>
                  </div>
                  <div>
                    <div className="text-gray-300 text-sm">Total Cost of Home</div>
                    <div className="text-white font-bold">{formatCurrency(results.totalCost)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Affordability Alert */}
            {results.totalMonthlyPayment > 0 && (
              <div className="mt-6 p-4 bg-yellow-600/20 border border-yellow-400/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-info-circle text-yellow-400"></i>
                  <div>
                    <div className="text-yellow-400 font-medium">Affordability Tip</div>
                    <div className="text-gray-300 text-sm">
                      Your total monthly payment should typically be no more than 28% of your gross monthly income.
                      {results.totalMonthlyPayment > 0 && (
                        <span className="block mt-1">
                          You would need a gross monthly income of at least <strong>{formatCurrency(results.totalMonthlyPayment / 0.28)}</strong> to comfortably afford this home.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Mortgage Tips */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Mortgage Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-emerald-400 mb-2">Before You Buy</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Get pre-approved for a mortgage</li>
                <li>• Save for a 20% down payment to avoid PMI</li>
                <li>• Factor in closing costs (2-5% of home price)</li>
                <li>• Consider total monthly housing costs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-emerald-400 mb-2">Save Money</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Shop around for the best mortgage rates</li>
                <li>• Consider a shorter loan term for lower rates</li>
                <li>• Make extra principal payments when possible</li>
                <li>• Refinance if rates drop significantly</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* How to Use */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Enter the home price and your down payment amount</li>
            <li>Select your loan term and enter the interest rate</li>
            <li>Add property tax, insurance, and other monthly costs</li>
            <li>Review your total monthly payment breakdown</li>
            <li>Ensure the payment fits within your budget (28% rule)</li>
          </ol>
        </motion.div>
      </div>
    </ToolShell>
  );
}