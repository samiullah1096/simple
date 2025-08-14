import React, { useState } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const AgeCalculator = ({ tool }) => {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState(null);

  const calculateAge = () => {
    if (!birthDate) {
      alert('Please enter your birth date');
      return;
    }

    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    
    if (birth > target) {
      alert('Birth date cannot be after target date');
      return;
    }

    // Calculate detailed age
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total values
    const totalDays = Math.floor((target - birth) / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;
    const totalMonths = years * 12 + months;
    const totalWeeks = Math.floor(totalDays / 7);

    // Calculate next birthday
    let nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= target) {
      nextBirthday.setFullYear(target.getFullYear() + 1);
    }
    const daysToNextBirthday = Math.ceil((nextBirthday - target) / (1000 * 60 * 60 * 24));

    setResult({
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      totalMonths,
      totalWeeks,
      daysToNextBirthday,
      nextBirthday: nextBirthday.toDateString()
    });
  };

  return (
    <ToolShell
      tool={tool}
      features={[
        "Calculate exact age in multiple units",
        "Days until next birthday",
        "Total time lived calculations",
        "Flexible target date selection"
      ]}
      faqs={[
        {
          question: "How accurate is the age calculation?",
          answer: "The calculator provides precise age calculations down to the day, considering leap years and different month lengths."
        },
        {
          question: "Can I calculate age for a specific date in the past?",
          answer: "Yes, you can set any target date to calculate what your age was on that specific date."
        },
        {
          question: "What does the 'total days' calculation include?",
          answer: "Total days includes every single day you've been alive, accounting for leap years and exact date differences."
        }
      ]}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Age Calculation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Birth Date</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Calculate Age On</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
          
          <button
            onClick={calculateAge}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Calculate Age
          </button>
        </div>
        
        {result && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4">Your Age Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {result.years}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Years</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {result.months}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Months</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {result.days}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Days</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {result.totalDays.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Days</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {result.totalWeeks.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Weeks</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {result.totalMonths}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Months</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Next Birthday</h5>
              <p className="text-blue-700 dark:text-blue-300">
                {result.daysToNextBirthday} days until your next birthday ({result.nextBirthday})
              </p>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold">{result.totalHours.toLocaleString()}</div>
                <div className="text-gray-600 dark:text-gray-400">Total Hours</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{result.totalMinutes.toLocaleString()}</div>
                <div className="text-gray-600 dark:text-gray-400">Total Minutes</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{result.totalSeconds.toLocaleString()}</div>
                <div className="text-gray-600 dark:text-gray-400">Total Seconds</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default AgeCalculator;