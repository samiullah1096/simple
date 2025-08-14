import React, { useState } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const UnitConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [category, setCategory] = useState('length');
  const [result, setResult] = useState('');

  const conversions = {
    length: {
      meters: { meters: 1, feet: 3.28084, inches: 39.3701, kilometers: 0.001, miles: 0.000621371, yards: 1.09361 },
      feet: { meters: 0.3048, feet: 1, inches: 12, kilometers: 0.0003048, miles: 0.000189394, yards: 0.333333 },
      inches: { meters: 0.0254, feet: 0.0833333, inches: 1, kilometers: 0.0000254, miles: 0.0000157828, yards: 0.0277778 },
      kilometers: { meters: 1000, feet: 3280.84, inches: 39370.1, kilometers: 1, miles: 0.621371, yards: 1093.61 },
      miles: { meters: 1609.34, feet: 5280, inches: 63360, kilometers: 1.60934, miles: 1, yards: 1760 },
      yards: { meters: 0.9144, feet: 3, inches: 36, kilometers: 0.0009144, miles: 0.000568182, yards: 1 }
    },
    weight: {
      kilograms: { kilograms: 1, pounds: 2.20462, ounces: 35.274, grams: 1000, stones: 0.157473 },
      pounds: { kilograms: 0.453592, pounds: 1, ounces: 16, grams: 453.592, stones: 0.0714286 },
      ounces: { kilograms: 0.0283495, pounds: 0.0625, ounces: 1, grams: 28.3495, stones: 0.00446429 },
      grams: { kilograms: 0.001, pounds: 0.00220462, ounces: 0.035274, grams: 1, stones: 0.000157473 },
      stones: { kilograms: 6.35029, pounds: 14, ounces: 224, grams: 6350.29, stones: 1 }
    },
    temperature: {
      celsius: {
        celsius: (val) => val,
        fahrenheit: (val) => (val * 9/5) + 32,
        kelvin: (val) => val + 273.15
      },
      fahrenheit: {
        celsius: (val) => (val - 32) * 5/9,
        fahrenheit: (val) => val,
        kelvin: (val) => (val - 32) * 5/9 + 273.15
      },
      kelvin: {
        celsius: (val) => val - 273.15,
        fahrenheit: (val) => (val - 273.15) * 9/5 + 32,
        kelvin: (val) => val
      }
    }
  };

  const unitOptions = {
    length: ['meters', 'feet', 'inches', 'kilometers', 'miles', 'yards'],
    weight: ['kilograms', 'pounds', 'ounces', 'grams', 'stones'],
    temperature: ['celsius', 'fahrenheit', 'kelvin']
  };

  const convert = () => {
    if (!inputValue || isNaN(inputValue)) {
      setResult('Please enter a valid number');
      return;
    }

    const value = parseFloat(inputValue);
    let convertedValue;

    if (category === 'temperature') {
      convertedValue = conversions[category][fromUnit][toUnit](value);
    } else {
      convertedValue = value * conversions[category][fromUnit][toUnit];
    }

    setResult(`${value} ${fromUnit} = ${convertedValue.toFixed(6)} ${toUnit}`);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setFromUnit(unitOptions[newCategory][0]);
    setToUnit(unitOptions[newCategory][1]);
    setResult('');
  };

  return (
    <ToolShell
      title="Unit Converter"
      description="Convert between different units of measurement including length, weight, and temperature"
      category="Productivity Tools"
      features={[
        "Support for length, weight, and temperature conversions",
        "High precision calculations",
        "Instant conversion results",
        "Wide range of unit options"
      ]}
      faqs={[
        {
          question: "What types of units can I convert?",
          answer: "You can convert length (meters, feet, inches, etc.), weight (kilograms, pounds, ounces, etc.), and temperature (Celsius, Fahrenheit, Kelvin) units."
        },
        {
          question: "How accurate are the conversions?",
          answer: "Our conversions use precise conversion factors and display results with up to 6 decimal places for maximum accuracy."
        },
        {
          question: "Can I convert temperature units?",
          answer: "Yes, you can convert between Celsius, Fahrenheit, and Kelvin temperature scales with precise calculations."
        }
      ]}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Unit Conversion</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="length">Length</option>
                <option value="weight">Weight</option>
                <option value="temperature">Temperature</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">From</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                {unitOptions[category].map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">To</label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                {unitOptions[category].map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Value to Convert</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <button
            onClick={convert}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Convert
          </button>
        </div>
        
        {result && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Conversion Result</h4>
            <p className="text-green-700 dark:text-green-300 font-mono text-lg">{result}</p>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default UnitConverter;