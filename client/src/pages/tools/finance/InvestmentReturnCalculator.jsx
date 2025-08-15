import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';

export default function InvestmentReturnCalculator() {
  const [initialAmount, setInitialAmount] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [annualReturn, setAnnualReturn] = useState('');
  const [investmentPeriod, setInvestmentPeriod] = useState('');
  const [periodUnit, setPeriodUnit] = useState('years');
  const [dividendYield, setDividendYield] = useState('');
  const [reinvestDividends, setReinvestDividends] = useState(true);
  const [taxRate, setTaxRate] = useState('');
  const [inflationRate, setInflationRate] = useState('3');

  const tool = TOOLS.finance.find(t => t.slug === 'investment-return');

  const calculateInvestment = () => {
    const initial = parseFloat(initialAmount) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const returnRate = parseFloat(annualReturn) || 0;
    const period = parseFloat(investmentPeriod) || 0;
    const dividend = parseFloat(dividendYield) || 0;
    const tax = parseFloat(taxRate) || 0;
    const inflation = parseFloat(inflationRate) || 0;

    if (initial <= 0 || returnRate <= 0 || period <= 0) {
      return null;
    }

    const totalMonths = periodUnit === 'years' ? period * 12 : period;
    const monthlyReturnRate = returnRate / 100 / 12;
    const monthlyDividendRate = dividend / 100 / 12;
    const monthlyInflationRate = inflation / 100 / 12;

    let currentValue = initial;
    let totalContributions = initial;
    let totalDividends = 0;
    let yearlyBreakdown = [];

    for (let month = 1; month <= totalMonths; month++) {
      // Add monthly contribution
      if (monthly > 0) {
        currentValue += monthly;
        totalContributions += monthly;
      }

      // Apply investment growth
      const growthReturn = currentValue * monthlyReturnRate;
      currentValue += growthReturn;

      // Calculate dividends
      const dividendReturn = currentValue * monthlyDividendRate;
      totalDividends += dividendReturn;
      
      if (reinvestDividends) {
        currentValue += dividendReturn;
      }

      // Track yearly breakdown
      if (month % 12 === 0) {
        const year = month / 12;
        yearlyBreakdown.push({
          year,
          value: currentValue,
          contributions: totalContributions,
          growth: currentValue - totalContributions - (reinvestDividends ? 0 : totalDividends),
          dividends: totalDividends
        });
      }
    }

    // Final calculations
    const totalReturn = currentValue - totalContributions - (reinvestDividends ? 0 : totalDividends);
    const totalValue = currentValue + (reinvestDividends ? 0 : totalDividends);
    const absoluteReturn = totalValue - totalContributions;
    const percentageReturn = (absoluteReturn / totalContributions) * 100;
    const annualizedReturn = Math.pow(totalValue / totalContributions, 1 / (totalMonths / 12)) - 1;
    
    // Tax calculations
    const taxableGains = absoluteReturn;
    const taxOwed = tax > 0 ? taxableGains * (tax / 100) : 0;
    const afterTaxValue = totalValue - taxOwed;
    
    // Inflation-adjusted value
    const inflationAdjustedValue = totalValue / Math.pow(1 + inflation / 100, totalMonths / 12);

    return {
      finalValue: totalValue,
      totalContributions,
      totalReturn: absoluteReturn,
      totalDividends,
      percentageReturn,
      annualizedReturn: annualizedReturn * 100,
      taxOwed,
      afterTaxValue,
      inflationAdjustedValue,
      yearlyBreakdown: yearlyBreakdown.slice(-5) // Show last 5 years
    };
  };

  const results = calculateInvestment();

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercent = (percent) => {
    return `${percent.toFixed(2)}%`;
  };

  return (
    <ToolShell
      tool={tool}
      data-testid="investment-return-calculator"
    >
      <div className="space-y-8">
        {/* Investment Details */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">Investment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Initial Investment ($)
              </label>
              <input
                type="number"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                placeholder="Enter initial amount"
                step="100"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="initial-amount-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Monthly Contribution ($)
              </label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                placeholder="Monthly contribution"
                step="50"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="monthly-contribution-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Expected Annual Return (%)
              </label>
              <input
                type="number"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(e.target.value)}
                placeholder="Expected return rate"
                step="0.1"
                min="0"
                max="50"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="annual-return-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Investment Period
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={investmentPeriod}
                  onChange={(e) => setInvestmentPeriod(e.target.value)}
                  placeholder="Period"
                  min="1"
                  className="flex-1 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  data-testid="investment-period-input"
                />
                <select
                  value={periodUnit}
                  onChange={(e) => setPeriodUnit(e.target.value)}
                  className="px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  data-testid="period-unit-select"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Advanced Options */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">Advanced Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dividend Yield (% Annual)
              </label>
              <input
                type="number"
                value={dividendYield}
                onChange={(e) => setDividendYield(e.target.value)}
                placeholder="Annual dividend yield"
                step="0.1"
                min="0"
                max="20"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="dividend-yield-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tax Rate on Gains (%)
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                placeholder="Capital gains tax rate"
                step="1"
                min="0"
                max="50"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="tax-rate-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Expected Inflation Rate (%)
              </label>
              <input
                type="number"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                placeholder="Annual inflation rate"
                step="0.1"
                min="0"
                max="10"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="inflation-rate-input"
              />
            </div>
            
            <div className="flex items-center pt-8">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reinvestDividends}
                  onChange={(e) => setReinvestDividends(e.target.checked)}
                  className="rounded border-gray-600 text-emerald-400 focus:ring-emerald-400"
                  data-testid="reinvest-dividends-checkbox"
                />
                <span className="ml-2 text-gray-300">Reinvest dividends</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        {results && (
          <motion.div 
            className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm rounded-xl p-6 border border-emerald-400/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Investment Summary */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400 mb-4">Investment Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <div className="text-gray-300 text-sm">Final Portfolio Value</div>
                      <div className="text-emerald-400 font-bold text-2xl">{formatCurrency(results.finalValue)}</div>
                    </div>
                    <div>
                      <div className="text-gray-300 text-sm">Total Contributions</div>
                      <div className="text-white font-medium">{formatCurrency(results.totalContributions)}</div>
                    </div>
                    <div>
                      <div className="text-gray-300 text-sm">Total Return</div>
                      <div className="text-green-400 font-bold">{formatCurrency(results.totalReturn)}</div>
                    </div>
                    {results.totalDividends > 0 && (
                      <div>
                        <div className="text-gray-300 text-sm">Total Dividends</div>
                        <div className="text-blue-400 font-medium">{formatCurrency(results.totalDividends)}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-gray-300 text-sm">Total Return (%)</div>
                      <div className="text-emerald-400 font-bold text-xl">{formatPercent(results.percentageReturn)}</div>
                    </div>
                    <div>
                      <div className="text-gray-300 text-sm">Annualized Return</div>
                      <div className="text-emerald-400 font-medium">{formatPercent(results.annualizedReturn)}</div>
                    </div>
                    {results.taxOwed > 0 && (
                      <>
                        <div>
                          <div className="text-gray-300 text-sm">Tax Owed</div>
                          <div className="text-red-400 font-medium">{formatCurrency(results.taxOwed)}</div>
                        </div>
                        <div>
                          <div className="text-gray-300 text-sm">After-Tax Value</div>
                          <div className="text-white font-medium">{formatCurrency(results.afterTaxValue)}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Inflation Impact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400 mb-4">Inflation Impact</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-gray-300 text-sm">Nominal Value</div>
                    <div className="text-white font-medium">{formatCurrency(results.finalValue)}</div>
                  </div>
                  <div>
                    <div className="text-gray-300 text-sm">Real Value (Inflation-Adjusted)</div>
                    <div className="text-yellow-400 font-medium">{formatCurrency(results.inflationAdjustedValue)}</div>
                  </div>
                  <div>
                    <div className="text-gray-300 text-sm">Purchasing Power Loss</div>
                    <div className="text-red-400 font-medium">
                      {formatCurrency(results.finalValue - results.inflationAdjustedValue)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Investment Tips */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Investment Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-emerald-400 mb-2">Maximize Returns</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Start investing early to benefit from compound interest</li>
                <li>• Diversify your portfolio across different asset classes</li>
                <li>• Reinvest dividends for exponential growth</li>
                <li>• Consider low-cost index funds for long-term investing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-emerald-400 mb-2">Risk Management</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Don't invest more than you can afford to lose</li>
                <li>• Have an emergency fund before investing</li>
                <li>• Consider your time horizon and risk tolerance</li>
                <li>• Review and rebalance your portfolio regularly</li>
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
            <li>Enter your initial investment amount</li>
            <li>Set monthly contribution amount (if any)</li>
            <li>Enter expected annual return rate</li>
            <li>Set your investment time horizon</li>
            <li>Configure advanced options like dividends and taxes</li>
            <li>Review projected returns and inflation impact</li>
          </ol>
        </motion.div>
      </div>
    </ToolShell>
  );
}