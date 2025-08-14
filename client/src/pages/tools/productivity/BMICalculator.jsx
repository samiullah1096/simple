import React, { useState } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const BMICalculator = ({ tool }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('metric'); // metric or imperial
  const [result, setResult] = useState(null);

  const calculateBMI = () => {
    if (!height || !weight) {
      alert('Please enter both height and weight');
      return;
    }

    let heightInMeters, weightInKg;

    if (unit === 'metric') {
      heightInMeters = parseFloat(height) / 100; // cm to meters
      weightInKg = parseFloat(weight);
    } else {
      // Imperial: height in inches, weight in pounds
      heightInMeters = parseFloat(height) * 0.0254; // inches to meters
      weightInKg = parseFloat(weight) * 0.453592; // pounds to kg
    }

    const bmi = weightInKg / (heightInMeters * heightInMeters);
    
    let category, color, advice;
    
    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-blue-600';
      advice = 'Consider consulting with a healthcare provider about healthy weight gain strategies.';
    } else if (bmi < 25) {
      category = 'Normal Weight';
      color = 'text-green-600';
      advice = 'Great! You are in the healthy weight range. Maintain your current lifestyle.';
    } else if (bmi < 30) {
      category = 'Overweight';
      color = 'text-yellow-600';
      advice = 'Consider a balanced diet and regular exercise to reach a healthy weight.';
    } else {
      category = 'Obese';
      color = 'text-red-600';
      advice = 'Consider consulting with a healthcare provider for a personalized weight management plan.';
    }

    // Calculate ideal weight range (BMI 18.5-25)
    const idealWeightMin = 18.5 * (heightInMeters * heightInMeters);
    const idealWeightMax = 25 * (heightInMeters * heightInMeters);
    
    let idealWeightMinDisplay, idealWeightMaxDisplay;
    if (unit === 'metric') {
      idealWeightMinDisplay = `${idealWeightMin.toFixed(1)} kg`;
      idealWeightMaxDisplay = `${idealWeightMax.toFixed(1)} kg`;
    } else {
      idealWeightMinDisplay = `${(idealWeightMin * 2.20462).toFixed(1)} lbs`;
      idealWeightMaxDisplay = `${(idealWeightMax * 2.20462).toFixed(1)} lbs`;
    }

    setResult({
      bmi: bmi.toFixed(1),
      category,
      color,
      advice,
      idealWeightMin: idealWeightMinDisplay,
      idealWeightMax: idealWeightMaxDisplay
    });
  };

  return (
    <ToolShell
      tool={tool}
      features={[
        "Support for metric and imperial units",
        "WHO standard BMI categories",
        "Ideal weight range calculation",
        "Personalized health recommendations"
      ]}
      faqs={[
        {
          question: "What is BMI and how is it calculated?",
          answer: "BMI (Body Mass Index) is calculated by dividing weight in kilograms by height in meters squared. It's a screening tool for weight categories."
        },
        {
          question: "Is BMI accurate for everyone?",
          answer: "BMI is a general screening tool and may not be accurate for athletes, pregnant women, elderly, or individuals with high muscle mass."
        },
        {
          question: "What are the BMI categories?",
          answer: "Underweight (under 18.5), Normal weight (18.5-24.9), Overweight (25-29.9), and Obese (30 and above)."
        }
      ]}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">BMI Calculation</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Unit System</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="metric"
                  checked={unit === 'metric'}
                  onChange={(e) => setUnit(e.target.value)}
                  className="mr-2"
                />
                Metric (cm, kg)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="imperial"
                  checked={unit === 'imperial'}
                  onChange={(e) => setUnit(e.target.value)}
                  className="mr-2"
                />
                Imperial (inches, lbs)
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Height ({unit === 'metric' ? 'cm' : 'inches'})
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder={unit === 'metric' ? 'e.g., 170' : 'e.g., 67'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Weight ({unit === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={unit === 'metric' ? 'e.g., 70' : 'e.g., 154'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
          
          <button
            onClick={calculateBMI}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Calculate BMI
          </button>
        </div>
        
        {result && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Your BMI Results</h4>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-bold mb-2" style={{ color: result.color.replace('text-', '') }}>
                {result.bmi}
              </div>
              <div className={`text-xl font-semibold ${result.color}`}>
                {result.category}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <h5 className="font-semibold mb-2">Health Advice</h5>
              <p className="text-gray-700 dark:text-gray-300">{result.advice}</p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Ideal Weight Range</h5>
              <p className="text-blue-700 dark:text-blue-300">
                For your height, the ideal weight range is: <strong>{result.idealWeightMin} - {result.idealWeightMax}</strong>
              </p>
            </div>
            
            <div className="mt-6">
              <h5 className="font-semibold mb-3">BMI Categories</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Underweight</span>
                  <span className="text-blue-600">Under 18.5</span>
                </div>
                <div className="flex justify-between">
                  <span>Normal weight</span>
                  <span className="text-green-600">18.5 - 24.9</span>
                </div>
                <div className="flex justify-between">
                  <span>Overweight</span>
                  <span className="text-yellow-600">25 - 29.9</span>
                </div>
                <div className="flex justify-between">
                  <span>Obese</span>
                  <span className="text-red-600">30 and above</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default BMICalculator;