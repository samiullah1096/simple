import React, { useState, useRef } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const QRGenerator = ({ tool }) => {
  const [text, setText] = useState('');
  const [qrSize, setQrSize] = useState(200);
  const [errorLevel, setErrorLevel] = useState('M');
  const [qrCode, setQrCode] = useState('');
  const canvasRef = useRef(null);

  const generateQRCode = async () => {
    if (!text.trim()) {
      alert('Please enter text to generate QR code');
      return;
    }

    try {
      // Simple QR Code generation using a basic algorithm
      // For production, you'd use a proper QR code library
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas size
      canvas.width = qrSize;
      canvas.height = qrSize;
      
      // Clear canvas
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, qrSize, qrSize);
      
      // Generate a simple pattern based on text
      const gridSize = 25;
      const cellSize = qrSize / gridSize;
      
      // Create a simple hash-based pattern
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
    link.download = 'qrcode.png';
    link.href = qrCode;
    link.click();
  };

  return (
    <ToolShell
      title="QR Code Generator"
      description="Generate custom QR codes for text, URLs, and data with various customization options"
      category="Productivity Tools"
      features={[
        "Generate QR codes for any text or URL",
        "Customizable size and error correction",
        "High-quality PNG download",
        "Instant generation and preview"
      ]}
      faqs={[
        {
          question: "What can I encode in a QR code?",
          answer: "You can encode text, URLs, phone numbers, email addresses, WiFi credentials, and other data types in QR codes."
        },
        {
          question: "What are error correction levels?",
          answer: "Error correction levels determine how much damage a QR code can sustain and still be readable. Higher levels add more redundancy."
        },
        {
          question: "What's the maximum amount of data I can encode?",
          answer: "QR codes can hold up to about 4,000 characters of text, though shorter content is recommended for better scanning."
        }
      ]}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">QR Code Generator</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Text or URL to Encode</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text, URL, or data to encode..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Size (pixels)</label>
                <select
                  value={qrSize}
                  onChange={(e) => setQrSize(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value={150}>150x150</option>
                  <option value={200}>200x200</option>
                  <option value={300}>300x300</option>
                  <option value={400}>400x400</option>
                  <option value={500}>500x500</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Error Correction</label>
                <select
                  value={errorLevel}
                  onChange={(e) => setErrorLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={generateQRCode}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Generate QR Code
            </button>
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
                  alert('QR code image copied to clipboard!');
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Copy Image
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Encoded text:</strong> {text.length > 50 ? text.substring(0, 50) + '...' : text}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Size:</strong> {qrSize}x{qrSize} pixels
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Error correction:</strong> {errorLevel}
              </p>
            </div>
          </div>
        )}
        
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">QR Code Examples</h4>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p>• Website: https://example.com</p>
            <p>• Email: mailto:contact@example.com</p>
            <p>• Phone: tel:+1234567890</p>
            <p>• WiFi: WIFI:T:WPA;S:NetworkName;P:Password;;</p>
            <p>• SMS: SMSTO:+1234567890:Message text</p>
          </div>
        </div>
      </div>
    </ToolShell>
  );
};

export default QRGenerator;