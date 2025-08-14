import React, { useState, useRef, useEffect } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const ColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [colorHistory, setColorHistory] = useState([]);
  const [colorFormat, setColorFormat] = useState('hex');
  const canvasRef = useRef(null);

  useEffect(() => {
    drawColorWheel();
  }, []);

  const drawColorWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Draw color wheel
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = (angle - 1) * Math.PI / 180;
      const endAngle = angle * Math.PI / 180;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineWidth = 2;
      ctx.strokeStyle = `hsl(${angle}, 100%, 50%)`;
      ctx.stroke();
    }
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const getColorFormats = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return {};
    
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    return {
      hex: hex.toUpperCase(),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`
    };
  };

  const addToHistory = (color) => {
    if (!colorHistory.includes(color)) {
      setColorHistory(prev => [color, ...prev.slice(0, 9)]);
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    addToHistory(color);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied ${text} to clipboard!`);
  };

  const colorFormats = getColorFormats(selectedColor);

  const presetColors = [
    '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80',
    '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080',
    '#000000', '#404040', '#808080', '#C0C0C0', '#FFFFFF', '#8B4513',
    '#FFA500', '#FFD700', '#ADFF2F', '#00CED1', '#4169E1', '#DA70D6'
  ];

  return (
    <ToolShell
      title="Color Picker"
      description="Pick colors and get hex, RGB, HSL values with color wheel and preset palettes"
      category="Productivity Tools"
      features={[
        "Interactive color wheel picker",
        "Multiple color format outputs",
        "Color history tracking",
        "Preset color palettes"
      ]}
      faqs={[
        {
          question: "What color formats are supported?",
          answer: "The tool provides colors in HEX, RGB, RGBA, HSL, and HSLA formats for use in web development and design."
        },
        {
          question: "How do I use the color wheel?",
          answer: "Click anywhere on the color wheel to select a color, or use the color input field to enter a specific color value."
        },
        {
          question: "Can I save my favorite colors?",
          answer: "Yes, the tool automatically saves your recently used colors in the history section for quick access."
        }
      ]}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Color Picker</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Color Wheel</h4>
              <canvas
                ref={canvasRef}
                width={200}
                height={200}
                className="border border-gray-300 dark:border-gray-600 rounded-lg cursor-crosshair"
                onClick={(e) => {
                  const rect = e.target.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const centerX = 100;
                  const centerY = 100;
                  const angle = Math.atan2(y - centerY, x - centerX) * 180 / Math.PI;
                  const hue = (angle + 360) % 360;
                  const newColor = `hsl(${hue}, 100%, 50%)`;
                  // Convert HSL to HEX for consistency
                  const tempDiv = document.createElement('div');
                  tempDiv.style.color = newColor;
                  document.body.appendChild(tempDiv);
                  const computedColor = window.getComputedStyle(tempDiv).color;
                  document.body.removeChild(tempDiv);
                  
                  // Simple conversion - you'd use a proper color library in production
                  const rgb = computedColor.match(/\d+/g);
                  if (rgb) {
                    const hex = '#' + rgb.map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
                    handleColorChange(hex);
                  }
                }}
              />
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Color Input</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Direct Color Input</label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-16 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      placeholder="#3b82f6"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
                
                <div
                  className="w-full h-20 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: selectedColor }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Color Formats</h4>
          
          <div className="space-y-3">
            {Object.entries(colorFormats).map(([format, value]) => (
              <div key={format} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <span className="font-medium text-sm uppercase">{format}:</span>
                  <span className="ml-2 font-mono">{value}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(value)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h4 className="font-semibold mb-4">Preset Colors</h4>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {presetColors.map((color, index) => (
              <button
                key={index}
                onClick={() => handleColorChange(color)}
                className="w-8 h-8 rounded-md border-2 border-gray-300 dark:border-gray-600 hover:border-gray-500 transition duration-200"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
        
        {colorHistory.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h4 className="font-semibold mb-4">Recent Colors</h4>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {colorHistory.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(color)}
                  className="w-8 h-8 rounded-md border-2 border-gray-300 dark:border-gray-600 hover:border-gray-500 transition duration-200"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default ColorPicker;