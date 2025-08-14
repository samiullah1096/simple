import React, { useState } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const DateCalculator = ({ tool }) => {
  const [calculationType, setCalculationType] = useState('difference');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [addYears, setAddYears] = useState('');
  const [addMonths, setAddMonths] = useState('');
  const [addDays, setAddDays] = useState('');
  const [result, setResult] = useState(null);

  const calculateDateDifference = () => {
    if (!startDate || !endDate) {
      alert('Please enter both dates');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      alert('Start date must be before end date');
      return;
    }

    // Calculate differences
    const timeDiff = end - start;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const weeksDiff = Math.floor(daysDiff / 7);
    const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const yearsDiff = end.getFullYear() - start.getFullYear();

    // More precise calculation for years, months, days
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setResult({
      type: 'difference',
      daysDiff,
      weeksDiff,
      monthsDiff,
      yearsDiff,
      preciseDays: days,
      preciseMonths: months,
      preciseYears: years,
      startDate: start.toDateString(),
      endDate: end.toDateString()
    });
  };

  const calculateDateAdd = () => {
    const base = new Date(baseDate);
    const newDate = new Date(base);

    if (addYears) newDate.setFullYear(newDate.getFullYear() + parseInt(addYears));
    if (addMonths) newDate.setMonth(newDate.getMonth() + parseInt(addMonths));
    if (addDays) newDate.setDate(newDate.getDate() + parseInt(addDays));

    setResult({
      type: 'add',
      originalDate: base.toDateString(),
      newDate: newDate.toDateString(),
      added: {
        years: addYears || 0,
        months: addMonths || 0,
        days: addDays || 0
      }
    });
  };

  const getWeekday = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getDayOfYear = (dateString) => {
    const date = new Date(dateString);
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <ToolShell
      title="Date Calculator"
      description="Calculate differences between dates and add/subtract time periods"
      category="Productivity Tools"
      features={[
        "Calculate exact date differences",
        "Add or subtract years, months, days",
        "Multiple time unit displays",
        "Weekday and day-of-year calculations"
      ]}
      faqs={[
        {
          question: "How is the date difference calculated?",
          answer: "Date differences are calculated accounting for leap years, different month lengths, and provide results in multiple units (days, weeks, months, years)."
        },
        {
          question: "Can I add negative values to go backwards in time?",
          answer: "Yes, you can enter negative values in the add/subtract calculator to go backwards from the base date."
        },
        {
          question: "What time zone is used for calculations?",
          answer: "All calculations use your local time zone, and dates are processed at midnight of the specified date."
        }
      ]}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Date Calculator</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Calculation Type</label>
            <select
              value={calculationType}
              onChange={(e) => {
                setCalculationType(e.target.value);
                setResult(null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="difference">Calculate Date Difference</option>
              <option value="add">Add/Subtract Time</option>
            </select>
          </div>
          
          {calculationType === 'difference' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
              <button
                onClick={calculateDateDifference}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Calculate Difference
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Base Date</label>
                <input
                  type="date"
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Add Years</label>
                  <input
                    type="number"
                    value={addYears}
                    onChange={(e) => setAddYears(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Add Months</label>
                  <input
                    type="number"
                    value={addMonths}
                    onChange={(e) => setAddMonths(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Add Days</label>
                  <input
                    type="number"
                    value={addDays}
                    onChange={(e) => setAddDays(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
              <button
                onClick={calculateDateAdd}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Calculate New Date
              </button>
            </div>
          )}
        </div>
        
        {result && result.type === 'difference' && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4">Date Difference Results</h4>
            
            <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">From: {result.startDate}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">To: {result.endDate}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.daysDiff}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Days</div>
              </div>
              <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{result.weeksDiff}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Weeks</div>
              </div>
              <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{result.monthsDiff}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Months</div>
              </div>
              <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{result.yearsDiff}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Years</div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Precise Difference</h5>
              <p className="text-blue-700 dark:text-blue-300">
                {result.preciseYears} years, {result.preciseMonths} months, {result.preciseDays} days
              </p>
            </div>
          </div>
        )}
        
        {result && result.type === 'add' && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4">Date Calculation Result</h4>
            
            <div className="space-y-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">Original Date</div>
                <div className="text-lg font-semibold">{result.originalDate}</div>
                <div className="text-sm text-gray-500">{getWeekday(result.originalDate)} (Day {getDayOfYear(result.originalDate)} of year)</div>
              </div>
              
              <div className="text-center py-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Added: {result.added.years} years, {result.added.months} months, {result.added.days} days
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
                <div className="text-sm text-gray-600 dark:text-gray-400">New Date</div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">{result.newDate}</div>
                <div className="text-sm text-gray-500">{getWeekday(result.newDate)} (Day {getDayOfYear(result.newDate)} of year)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default DateCalculator;