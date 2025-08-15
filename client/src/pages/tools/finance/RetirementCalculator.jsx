import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState('');
  const [retirementAge, setRetirementAge] = useState('65');
  const [currentIncome, setCurrentIncome] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [monthlySavings, setMonthlySavings] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('7');
  const [inflationRate, setInflationRate] = useState('3');
  const [incomeNeeded, setIncomeNeeded] = useState('80');
  const [socialSecurityBenefit, setSocialSecurityBenefit] = useState('');
  const [pensionBenefit, setPensionBenefit] = useState('');

  const tool = TOOLS.finance.find(t => t.slug === 'retirement-calculator');

  const calculateRetirement = () => {
    const ageNow = parseInt(currentAge) || 0;
    const ageRetire = parseInt(retirementAge) || 65;
    const income = parseFloat(currentIncome) || 0;
    const savings = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlySavings) || 0;
    const returnRate = parseFloat(expectedReturn) || 7;
    const inflation = parseFloat(inflationRate) || 3;
    const incomePercent = parseFloat(incomeNeeded) || 80;
    const socialSecurity = parseFloat(socialSecurityBenefit) || 0;
    const pension = parseFloat(pensionBenefit) || 0;

    if (ageNow <= 0 || ageRetire <= ageNow || income <= 0) {
      return null;
    }

    const yearsToRetirement = ageRetire - ageNow;
    const yearsInRetirement = 85 - ageRetire; // Assume living to 85
    const monthsToRetirement = yearsToRetirement * 12;
    
    // Calculate future value of current savings
    const futureValueCurrentSavings = savings * Math.pow(1 + returnRate / 100, yearsToRetirement);
    
    // Calculate future value of monthly contributions
    const monthlyReturnRate = returnRate / 100 / 12;
    let futureValueMonthlySavings = 0;
    
    if (monthly > 0 && monthsToRetirement > 0) {
      futureValueMonthlySavings = monthly * 
        ((Math.pow(1 + monthlyReturnRate, monthsToRetirement) - 1) / monthlyReturnRate);
    }
    
    const totalRetirementSavings = futureValueCurrentSavings + futureValueMonthlySavings;
    
    // Calculate income needed in retirement (adjusted for inflation)
    const currentIncomeNeeded = (income * incomePercent) / 100;
    const futureIncomeNeeded = currentIncomeNeeded * Math.pow(1 + inflation / 100, yearsToRetirement);
    const annualIncomeNeeded = futureIncomeNeeded;
    
    // Calculate income from other sources (adjusted for inflation)
    const futureSocialSecurity = socialSecurity * Math.pow(1 + inflation / 100, yearsToRetirement);
    const futurePension = pension * Math.pow(1 + inflation / 100, yearsToRetirement);
    const otherAnnualIncome = futureSocialSecurity + futurePension;
    
    // Calculate required savings to cover gap
    const incomeGap = Math.max(0, annualIncomeNeeded - otherAnnualIncome);
    
    // Using 4% withdrawal rule for retirement
    const requiredSavingsFor4PercentRule = incomeGap * 25; // 1/0.04 = 25
    
    // Alternative calculation using annuity formula
    const retirementReturnRate = Math.max(returnRate - inflation, 1) / 100; // Real return rate
    const requiredSavingsAnnuity = incomeGap * 
      ((1 - Math.pow(1 + retirementReturnRate, -yearsInRetirement)) / retirementReturnRate);
    
    const savingsShortfall = Math.max(0, requiredSavingsFor4PercentRule - totalRetirementSavings);
    const additionalMonthlySavingsNeeded = savingsShortfall > 0 ? 
      savingsShortfall / ((Math.pow(1 + monthlyReturnRate, monthsToRetirement) - 1) / monthlyReturnRate) : 0;
    
    // Calculate replacement ratio
    const replacementRatio = ((totalRetirementSavings * 0.04) + otherAnnualIncome) / annualIncomeNeeded * 100;
    
    return {
      yearsToRetirement,
      totalRetirementSavings,
      annualIncomeNeeded,
      otherAnnualIncome,
      incomeGap,
      requiredSavingsFor4PercentRule,
      savingsShortfall,
      additionalMonthlySavingsNeeded,
      replacementRatio,
      futureValueCurrentSavings,
      futureValueMonthlySavings,
      monthlyContributionTotal: monthly * monthsToRetirement
    };
  };

  const results = calculateRetirement();

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatPercent = (percent) => {
    return `${percent.toFixed(1)}%`;
  };

  return (
    <ToolShell
      tool={tool}
      data-testid="retirement-calculator"
    >
      <div className="space-y-8">
        {/* Personal Information */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Age
              </label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                placeholder="Enter your age"
                min="18"
                max="80"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="current-age-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Planned Retirement Age
              </label>
              <input
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(e.target.value)}
                placeholder="Retirement age"
                min="50"
                max="80"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="retirement-age-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Annual Income ($)
              </label>
              <input
                type="number"
                value={currentIncome}
                onChange={(e) => setCurrentIncome(e.target.value)}
                placeholder="Enter annual income"
                step="1000"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="current-income-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Income Needed in Retirement (%)
              </label>
              <input
                type="number"
                value={incomeNeeded}
                onChange={(e) => setIncomeNeeded(e.target.value)}
                placeholder="Percentage of current income"
                min="50"
                max="100"
                step="5"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="income-needed-input"
              />
            </div>
          </div>
        </motion.div>

        {/* Current Savings */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">Current Savings & Contributions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Retirement Savings ($)
              </label>
              <input
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(e.target.value)}
                placeholder="Total current savings"
                step="1000"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="current-savings-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Monthly Savings Contribution ($)
              </label>
              <input
                type="number"
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(e.target.value)}
                placeholder="Monthly contribution"
                step="50"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="monthly-savings-input"
              />
            </div>
          </div>
        </motion.div>

        {/* Investment & Economic Assumptions */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">Investment & Economic Assumptions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Expected Annual Return (%)
              </label>
              <input
                type="number"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
                placeholder="Expected return rate"
                step="0.5"
                min="1"
                max="15"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="expected-return-input"
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
                placeholder="Inflation rate"
                step="0.1"
                min="1"
                max="10"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="inflation-rate-input"
              />
            </div>
          </div>
        </motion.div>

        {/* Other Income Sources */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">Other Retirement Income Sources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Expected Social Security (Annual $)
              </label>
              <input
                type="number"
                value={socialSecurityBenefit}
                onChange={(e) => setSocialSecurityBenefit(e.target.value)}
                placeholder="Annual Social Security benefit"
                step="1000"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="social-security-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Pension/Other Income (Annual $)
              </label>
              <input
                type="number"
                value={pensionBenefit}
                onChange={(e) => setPensionBenefit(e.target.value)}
                placeholder="Annual pension/other income"
                step="1000"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="pension-input"
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
            transition={{ delay: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Retirement Projection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400 mb-4">Retirement Projection</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-gray-300 text-sm">Years to Retirement</div>
                    <div className="text-white font-bold text-2xl">{results.yearsToRetirement} years</div>
                  </div>
                  <div>
                    <div className="text-gray-300 text-sm">Projected Retirement Savings</div>
                    <div className="text-emerald-400 font-bold text-xl">{formatCurrency(results.totalRetirementSavings)}</div>
                  </div>
                  <div>
                    <div className="text-gray-300 text-sm">Annual Income Needed</div>
                    <div className="text-white font-medium">{formatCurrency(results.annualIncomeNeeded)}</div>
                  </div>
                  <div>
                    <div className="text-gray-300 text-sm">Income Replacement Ratio</div>
                    <div className={`font-bold text-xl ${results.replacementRatio >= 100 ? 'text-green-400' : results.replacementRatio >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {formatPercent(results.replacementRatio)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Savings Analysis */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400 mb-4">Savings Analysis</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-gray-300 text-sm">Required Savings (4% Rule)</div>
                    <div className="text-white font-medium">{formatCurrency(results.requiredSavingsFor4PercentRule)}</div>
                  </div>
                  {results.savingsShortfall > 0 ? (
                    <>
                      <div>
                        <div className="text-gray-300 text-sm">Savings Shortfall</div>
                        <div className="text-red-400 font-bold">{formatCurrency(results.savingsShortfall)}</div>
                      </div>
                      <div>
                        <div className="text-gray-300 text-sm">Additional Monthly Savings Needed</div>
                        <div className="text-yellow-400 font-bold text-lg">{formatCurrency(results.additionalMonthlySavingsNeeded)}</div>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 bg-green-600/20 border border-green-400/30 rounded-lg">
                      <div className="text-green-400 font-medium">✓ On Track for Retirement!</div>
                      <div className="text-gray-300 text-sm">Your projected savings meet your retirement goals.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Savings Breakdown */}
            <div className="mt-6 pt-6 border-t border-gray-600">
              <h4 className="font-medium text-emerald-400 mb-3">Savings Breakdown</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-gray-300 text-sm">Current Savings Growth</div>
                  <div className="text-white font-medium">{formatCurrency(results.futureValueCurrentSavings)}</div>
                </div>
                <div>
                  <div className="text-gray-300 text-sm">Monthly Contributions Growth</div>
                  <div className="text-white font-medium">{formatCurrency(results.futureValueMonthlySavings)}</div>
                </div>
                <div>
                  <div className="text-gray-300 text-sm">Total Contributions</div>
                  <div className="text-gray-400 font-medium">{formatCurrency((parseFloat(currentSavings) || 0) + results.monthlyContributionTotal)}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Retirement Planning Tips */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Retirement Planning Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-emerald-400 mb-2">Maximize Your Savings</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Contribute to employer 401(k) match programs</li>
                <li>• Max out IRA contributions ($6,000-$7,000 annually)</li>
                <li>• Use catch-up contributions if you're over 50</li>
                <li>• Consider Roth vs. Traditional retirement accounts</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-emerald-400 mb-2">Investment Strategy</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Diversify across asset classes</li>
                <li>• Adjust risk as you approach retirement</li>
                <li>• Consider low-cost index funds</li>
                <li>• Review and rebalance annually</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* How to Use */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Enter your current age and planned retirement age</li>
            <li>Input your current income and desired retirement income percentage</li>
            <li>Add your current savings and monthly contribution amounts</li>
            <li>Set realistic investment return and inflation expectations</li>
            <li>Include expected Social Security and pension benefits</li>
            <li>Review your retirement readiness and adjust savings as needed</li>
          </ol>
        </motion.div>
      </div>
    </ToolShell>
  );
}