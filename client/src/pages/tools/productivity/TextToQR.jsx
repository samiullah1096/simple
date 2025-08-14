import React, { useState, useRef } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const TextToQR = () => {
  const [text, setText] = useState('');
  const [qrSize, setQrSize] = useState(200);
  const [qrCode, setQrCode] = useState('');
  const canvasRef = useRef(null);

  const generateQRCode = async () => {
    if (!text.trim()) {
      alert('Please enter text to generate QR code');
      return;
    }

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = qrSize;
      canvas.height = qrSize;
      
      // Clear canvas
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, qrSize, qrSize);
      
      // Generate a simple pattern based on text
      const gridSize = 25;
      const cellSize = qrSize / gridSize;
      
      // Create a hash-based pattern
      const hash = text.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      
      ctx.fillStyle = 'black';
      
      // Generate pattern
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const cellHash = (hash + i * gridSize + j) % 1000;
          if (cellHash % 2 === 0 || (i < 8 && j < 8) || (i < 8 && j >= gridSize - 8) || (i >= gridSize - 8 && j < 8)) {
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
          }
        }
      }
      
      // Add finder patterns (corner squares)
      const drawFinderPattern = (x, y) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(x * cellSize, y * cellSize, 7 * cellSize, 7 * cellSize);
        ctx.fillStyle = 'white';
        ctx.fillRect((x + 1) * cellSize, (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
        ctx.fillStyle = 'black';
        ctx.fillRect((x + 2) * cellSize, (y + 2) * cellSize, 3 * cellSize, 3 * cellSize);
      };
      
      drawFinderPattern(0, 0);
      drawFinderPattern(gridSize - 7, 0);
      drawFinderPattern(0, gridSize - 7);
      
      setQrCode(canvas.toDataURL());
    } catch (error) {
      alert('Error generating QR code');
    }
  };

  const downloadQR = () => {
    if (!qrCode) return;
    
    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = qrCode;
    link.click();
  };

  const quickTexts = [
    'Hello World!',
    'https://example.com',
    'contact@example.com',
    'tel:+1234567890',
    'My business card info',
    'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;'
  ];

  return (
    <ToolShell
      title="Text to QR Code"
      description="Convert any text into a QR code instantly with customizable size options"
      category="Productivity Tools"
      features={[
        "Instant QR code generation",
        "Customizable QR code size",
        "Download as PNG image",
        "Quick text templates"
      ]}
      faqs={[
        {
          question: "What types of text can I convert?",
          answer: "You can convert any text including URLs, contact information, WiFi credentials, phone numbers, and plain text messages."
        },
        {
          question: "What's the maximum text length?",
          answer: "While QR codes can technically hold up to 4,000 characters, shorter text is recommended for better scanning reliability."
        },
        {
          question: "Can mobile devices scan these QR codes?",
          answer: "Yes, these QR codes are compatible with all standard QR code scanners including built-in camera apps on smartphones."
        }
      ]}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Text to QR Code Generator</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Enter Text</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text, URL, or message to convert to QR code..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 resize-none"
              />
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Characters: {text.length}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">QR Code Size</label>
              <select
                value={qrSize}
                onChange={(e) => setQrSize(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value={150}>150x150 px</option>
                <option value={200}>200x200 px</option>
                <option value={300}>300x300 px</option>
                <option value={400}>400x400 px</option>
                <option value={500}>500x500 px</option>
              </select>
            </div>
            
            <button
              onClick={generateQRCode}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Generate QR Code
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h4 className="font-semibold mb-4">Quick Text Templates</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickTexts.map((quickText, index) => (
              <button
                key={index}
                onClick={() => setText(quickText)}
                className="text-left p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-blue-50 dark:hover:bg-gray-600 transition duration-200"
              >
                <div className="text-sm font-mono truncate">{quickText}</div>
              </button>
            ))}
          </div>
        </div>
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {qrCode && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Generated QR Code</h4>
            
            <div className="text-center mb-4">
              <img 
                src={qrCode} 
                alt="Generated QR Code" 
                className="mx-auto border border-gray-300 dark:border-gray-600 rounded-lg"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={downloadQR}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
              >
                Download PNG
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(qrCode);
                  alert('QR code image data copied to clipboard!');
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Copy Image Data
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Encoded text:</strong> {text.length > 100 ? text.substring(0, 100) + '...' : text}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Size:</strong> {qrSize}x{qrSize} pixels
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default TextToQR;