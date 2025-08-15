import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';

// Major world currencies with exchange rates (simulated)
const CURRENCIES = {
  USD: { name: 'US Dollar', symbol: '$', rate: 1.0000 },
  EUR: { name: 'Euro', symbol: '€', rate: 0.9234 },
  GBP: { name: 'British Pound', symbol: '£', rate: 0.7834 },
  JPY: { name: 'Japanese Yen', symbol: '¥', rate: 149.85 },
  CAD: { name: 'Canadian Dollar', symbol: 'C$', rate: 1.3645 },
  AUD: { name: 'Australian Dollar', symbol: 'A$', rate: 1.5234 },
  CHF: { name: 'Swiss Franc', symbol: 'CHF', rate: 0.8734 },
  CNY: { name: 'Chinese Yuan', symbol: '¥', rate: 7.2456 },
  INR: { name: 'Indian Rupee', symbol: '₹', rate: 83.1234 },
  BRL: { name: 'Brazilian Real', symbol: 'R$', rate: 4.9876 },
  RUB: { name: 'Russian Ruble', symbol: '₽', rate: 91.2345 },
  KRW: { name: 'South Korean Won', symbol: '₩', rate: 1321.45 },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', rate: 1.3456 },
  HKD: { name: 'Hong Kong Dollar', symbol: 'HK$', rate: 7.8234 },
  SEK: { name: 'Swedish Krona', symbol: 'kr', rate: 10.9876 }
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);

  const tool = TOOLS.finance.find(t => t.slug === 'currency-converter');

  const convertCurrency = () => {
    if (!amount || isNaN(amount)) return;
    
    const amountNum = parseFloat(amount);
    const fromRate = CURRENCIES[fromCurrency].rate;
    const toRate = CURRENCIES[toCurrency].rate;
    
    // Convert to USD first, then to target currency
    const usdAmount = amountNum / fromRate;
    const convertedAmount = usdAmount * toRate;
    const rate = toRate / fromRate;
    
    setResult(convertedAmount);
    setExchangeRate(rate);
  };

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      convertCurrency();
    }
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatCurrency = (value, currencyCode) => {
    const currency = CURRENCIES[currencyCode];
    return `${currency.symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <ToolShell
      tool={tool}
      data-testid="currency-converter"
    >
      <div className="space-y-8">
        {/* Input Section */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="amount-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                From Currency
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                data-testid="from-currency-select"
              >
                {Object.entries(CURRENCIES).map(([code, currency]) => (
                  <option key={code} value={code} className="bg-gray-800">
                    {code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                To Currency
              </label>
              <div className="flex gap-2">
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="flex-1 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  data-testid="to-currency-select"
                >
                  {Object.entries(CURRENCIES).map(([code, currency]) => (
                    <option key={code} value={code} className="bg-gray-800">
                      {code} - {currency.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={swapCurrencies}
                  className="px-3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  data-testid="swap-currencies-btn"
                  title="Swap currencies"
                >
                  ⇄
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Result Section */}
        {result !== null && (
          <motion.div 
            className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm rounded-xl p-6 border border-emerald-400/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center space-y-4">
              <div className="text-3xl font-bold text-emerald-400">
                {formatCurrency(result, toCurrency)}
              </div>
              <div className="text-gray-300">
                {formatCurrency(parseFloat(amount), fromCurrency)} = {formatCurrency(result, toCurrency)}
              </div>
              <div className="text-sm text-gray-400">
                Exchange Rate: 1 {fromCurrency} = {exchangeRate?.toFixed(4)} {toCurrency}
              </div>
              <div className="text-xs text-gray-500">
                * Rates are simulated for demo purposes. Use real exchange rate APIs for actual conversions.
              </div>
            </div>
          </motion.div>
        )}

        {/* Popular Conversions */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Popular Conversions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ['USD', 'EUR'], ['USD', 'GBP'], ['USD', 'JPY'],
              ['EUR', 'GBP'], ['USD', 'INR'], ['USD', 'CAD']
            ].map(([from, to]) => {
              const rate = CURRENCIES[to].rate / CURRENCIES[from].rate;
              return (
                <div key={`${from}-${to}`} className="bg-black/20 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">{from} → {to}</span>
                    <span className="text-emerald-400 font-medium">{rate.toFixed(4)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* How to Use */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Enter the amount you want to convert</li>
            <li>Select the currency you're converting from</li>
            <li>Select the currency you're converting to</li>
            <li>View the instant conversion result with exchange rate</li>
            <li>Use the swap button to quickly reverse currencies</li>
          </ol>
        </motion.div>
      </div>
    </ToolShell>
  );
}