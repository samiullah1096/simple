import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';

export default function BudgetCalculator() {
  const [income, setIncome] = useState({
    salary: '',
    freelance: '',
    investment: '',
    other: ''
  });

  const [expenses, setExpenses] = useState({
    housing: '',
    transportation: '',
    food: '',
    utilities: '',
    insurance: '',
    healthcare: '',
    entertainment: '',
    shopping: '',
    personal: '',
    debt: '',
    savings: '',
    other: ''
  });

  const tool = TOOLS.finance.find(t => t.slug === 'budget-calculator');

  const calculateTotals = () => {
    const totalIncome = Object.values(income)
      .reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
    
    const totalExpenses = Object.values(expenses)
      .reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
    
    const remainingMoney = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((parseFloat(expenses.savings) || 0) / totalIncome) * 100 : 0;
    
    return {
      totalIncome,
      totalExpenses,
      remainingMoney,
      savingsRate
    };
  };

  const totals = calculateTotals();

  const expenseCategories = [
    { key: 'housing', label: 'Housing (Rent/Mortgage)', icon: 'fas fa-home', recommended: 25 },
    { key: 'transportation', label: 'Transportation', icon: 'fas fa-car', recommended: 15 },
    { key: 'food', label: 'Food & Groceries', icon: 'fas fa-utensils', recommended: 10 },
    { key: 'utilities', label: 'Utilities', icon: 'fas fa-bolt', recommended: 5 },
    { key: 'insurance', label: 'Insurance', icon: 'fas fa-shield-alt', recommended: 5 },
    { key: 'healthcare', label: 'Healthcare', icon: 'fas fa-heartbeat', recommended: 5 },
    { key: 'entertainment', label: 'Entertainment', icon: 'fas fa-film', recommended: 5 },
    { key: 'shopping', label: 'Shopping & Clothing', icon: 'fas fa-shopping-bag', recommended: 5 },
    { key: 'personal', label: 'Personal Care', icon: 'fas fa-user', recommended: 3 },
    { key: 'debt', label: 'Debt Payments', icon: 'fas fa-credit-card', recommended: 5 },
    { key: 'savings', label: 'Savings & Investments', icon: 'fas fa-piggy-bank', recommended: 20 },
    { key: 'other', label: 'Other Expenses', icon: 'fas fa-ellipsis-h', recommended: 2 }
  ];

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercent = (percent) => {
    return `${percent.toFixed(1)}%`;
  };

  const getExpensePercentage = (amount) => {
    return totals.totalIncome > 0 ? (amount / totals.totalIncome) * 100 : 0;
  };

  const getStatusColor = (actual, recommended) => {
    if (actual <= recommended) return 'text-green-400';
    if (actual <= recommended * 1.2) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <ToolShell
      tool={tool}
      data-testid="budget-calculator"
    >
      <div className="space-y-8">
        {/* Monthly Income */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">Monthly Income</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-briefcase mr-2"></i>
                Salary/Wages (After Tax)
              </label>
              <input
                type="number"
                value={income.salary}
                onChange={(e) => setIncome({...income, salary: e.target.value})}
                placeholder="Monthly salary"
                step="100"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="salary-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-laptop mr-2"></i>
                Freelance/Side Income
              </label>
              <input
                type="number"
                value={income.freelance}
                onChange={(e) => setIncome({...income, freelance: e.target.value})}
                placeholder="Freelance income"
                step="50"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="freelance-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-chart-line mr-2"></i>
                Investment Income
              </label>
              <input
                type="number"
                value={income.investment}
                onChange={(e) => setIncome({...income, investment: e.target.value})}
                placeholder="Investment income"
                step="25"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="investment-income-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-plus mr-2"></i>
                Other Income
              </label>
              <input
                type="number"
                value={income.other}
                onChange={(e) => setIncome({...income, other: e.target.value})}
                placeholder="Other income"
                step="25"
                min="0"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="other-income-input"
              />
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-600">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-medium">Total Monthly Income:</span>
              <span className="text-emerald-400 font-bold text-xl">{formatCurrency(totals.totalIncome)}</span>
            </div>
          </div>
        </motion.div>

        {/* Monthly Expenses */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">Monthly Expenses</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {expenseCategories.map((category) => {
              const amount = parseFloat(expenses[category.key]) || 0;
              const percentage = getExpensePercentage(amount);
              
              return (
                <div key={category.key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    <i className={`${category.icon} mr-2`}></i>
                    {category.label}
                    <span className="text-xs text-gray-400 ml-2">
                      (Recommended: {category.recommended}%)
                    </span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={expenses[category.key]}
                      onChange={(e) => setExpenses({...expenses, [category.key]: e.target.value})}
                      placeholder={`${category.label} amount`}
                      step="25"
                      min="0"
                      className="flex-1 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                      data-testid={`${category.key}-input`}
                    />
                    {amount > 0 && (
                      <div className={`text-sm font-medium ${getStatusColor(percentage, category.recommended)}`}>
                        {formatPercent(percentage)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-600">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-medium">Total Monthly Expenses:</span>
              <span className="text-red-400 font-bold text-xl">{formatCurrency(totals.totalExpenses)}</span>
            </div>
          </div>
        </motion.div>

        {/* Budget Summary */}
        {totals.totalIncome > 0 && (
          <motion.div 
            className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm rounded-xl p-6 border border-emerald-400/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-emerald-400 mb-6">Budget Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-gray-300 text-sm">Total Income</div>
                <div className="text-emerald-400 font-bold text-2xl">{formatCurrency(totals.totalIncome)}</div>
              </div>
              
              <div className="text-center">
                <div className="text-gray-300 text-sm">Total Expenses</div>
                <div className="text-red-400 font-bold text-2xl">{formatCurrency(totals.totalExpenses)}</div>
              </div>
              
              <div className="text-center">
                <div className="text-gray-300 text-sm">Remaining</div>
                <div className={`font-bold text-2xl ${totals.remainingMoney >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(Math.abs(totals.remainingMoney))}
                  {totals.remainingMoney < 0 && <div className="text-sm text-red-400">Deficit</div>}
                </div>
              </div>
            </div>

            {/* Savings Rate */}
            <div className="bg-black/20 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Savings Rate:</span>
                <span className={`font-bold text-lg ${totals.savingsRate >= 20 ? 'text-green-400' : totals.savingsRate >= 10 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {formatPercent(totals.savingsRate)}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Recommended: 20% or more for financial health
              </div>
            </div>

            {/* Budget Status Alert */}
            {totals.remainingMoney < 0 ? (
              <div className="p-4 bg-red-600/20 border border-red-400/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-exclamation-triangle text-red-400"></i>
                  <div>
                    <div className="text-red-400 font-medium">Budget Deficit</div>
                    <div className="text-gray-300 text-sm">
                      You're spending {formatCurrency(Math.abs(totals.remainingMoney))} more than you earn. 
                      Consider reducing expenses or increasing income.
                    </div>
                  </div>
                </div>
              </div>
            ) : totals.remainingMoney > 0 && totals.savingsRate < 20 ? (
              <div className="p-4 bg-yellow-600/20 border border-yellow-400/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-lightbulb text-yellow-400"></i>
                  <div>
                    <div className="text-yellow-400 font-medium">Savings Opportunity</div>
                    <div className="text-gray-300 text-sm">
                      You have {formatCurrency(totals.remainingMoney)} remaining. 
                      Consider increasing your savings to reach the 20% target.
                    </div>
                  </div>
                </div>
              </div>
            ) : totals.savingsRate >= 20 ? (
              <div className="p-4 bg-green-600/20 border border-green-400/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-green-400"></i>
                  <div>
                    <div className="text-green-400 font-medium">Great Budget!</div>
                    <div className="text-gray-300 text-sm">
                      You're saving {formatPercent(totals.savingsRate)} of your income. Keep it up!
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        )}

        {/* Budget Tips */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Budgeting Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-emerald-400 mb-2">50/30/20 Rule</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• 50% for needs (housing, food, utilities)</li>
                <li>• 30% for wants (entertainment, dining out)</li>
                <li>• 20% for savings and debt repayment</li>
                <li>• Adjust percentages based on your goals</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-emerald-400 mb-2">Cost Reduction Tips</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Track expenses for 30 days to identify patterns</li>
                <li>• Cancel unused subscriptions and memberships</li>
                <li>• Cook at home more often</li>
                <li>• Look for better rates on insurance and utilities</li>
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
            <li>Enter all your monthly income sources</li>
            <li>Input your monthly expenses by category</li>
            <li>Review your budget summary and remaining money</li>
            <li>Check your savings rate (aim for 20% or more)</li>
            <li>Adjust spending or increase income to balance your budget</li>
            <li>Use the recommended percentages as guidelines</li>
          </ol>
        </motion.div>
      </div>
    </ToolShell>
  );
}