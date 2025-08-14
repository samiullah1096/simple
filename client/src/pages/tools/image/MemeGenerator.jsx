import React, { useState, useRef } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const MemeGenerator = ({ tool }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [fontSize, setFontSize] = useState(48);
  const [fontFamily, setFontFamily] = useState('Impact');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);

  const fontOptions = [
    'Impact',
    'Arial Black',
    'Arial',
    'Helvetica',
    'Comic Sans MS',
    'Times New Roman',
    'Courier New'
  ];

  const memeTemplates = [
    { name: 'Drake Pointing', top: 'Drake rejecting something', bottom: 'Drake approving something' },
    { name: 'Distracted Boyfriend', top: 'Boyfriend', bottom: 'New thing he wants' },
    { name: 'Woman Yelling at Cat', top: 'Angry woman pointing', bottom: 'Confused cat' },
    { name: 'Change My Mind', top: '', bottom: 'Change my mind' },
    { name: 'This is Fine', top: 'Everything is burning', bottom: 'This is fine' },
    { name: 'Expanding Brain', top: 'Small brain idea', bottom: 'Big brain idea' }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    } else {
      alert('Please select a valid image file');
    }
  };

  const useTemplate = (template) => {
    setTopText(template.top);
    setBottomText(template.bottom);
  };

  const generateMeme = async () => {
    if (!imageFile || !imageUrl) {
      alert('Please select an image first');
      return;
    }

    if (!topText.trim() && !bottomText.trim()) {
      alert('Please enter some text for your meme');
      return;
    }

    setIsGenerating(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Set canvas size to image size
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image
        ctx.drawImage(img, 0, 0);

        // Configure text style
        ctx.font = `bold ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = textColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Enable text shadow for better readability
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        const centerX = canvas.width / 2;
        const padding = 20;

        // Draw top text
        if (topText.trim()) {
          const topLines = wrapText(ctx, topText.toUpperCase(), canvas.width - padding * 2);
          let topY = padding;
          
          topLines.forEach(line => {
            ctx.strokeText(line, centerX, topY);
            ctx.fillText(line, centerX, topY);
            topY += fontSize * 1.1;
          });
        }

        // Draw bottom text
        if (bottomText.trim()) {
          const bottomLines = wrapText(ctx, bottomText.toUpperCase(), canvas.width - padding * 2);
          let bottomY = canvas.height - padding - (bottomLines.length * fontSize * 1.1);
          
          bottomLines.forEach(line => {
            ctx.strokeText(line, centerX, bottomY);
            ctx.fillText(line, centerX, bottomY);
            bottomY += fontSize * 1.1;
          });
        }

        setIsGenerating(false);
      };

      img.onerror = () => {
        alert('Error loading image');
        setIsGenerating(false);
      };

      img.src = imageUrl;
    } catch (error) {
      console.error('Meme generation error:', error);
      alert('Error generating meme');
      setIsGenerating(false);
    }
  };

  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const downloadMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create download link
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meme_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const clearTexts = () => {
    setTopText('');
    setBottomText('');
  };

  // Auto-generate preview when text changes
  React.useEffect(() => {
    if (imageUrl && (topText || bottomText)) {
      const timeoutId = setTimeout(generateMeme, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [imageUrl, topText, bottomText, fontSize, fontFamily, textColor, strokeColor, strokeWidth]);

  return (
    <ToolShell tool={tool}>
      <div className="space-y-6">
        {/* File Upload */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Upload Image</h3>
          <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="image-upload"
              data-testid="input-image-file"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center space-y-4"
            >
              <i className="fas fa-upload text-4xl text-green-400"></i>
              <div>
                <p className="text-slate-100 font-medium">Choose image file</p>
                <p className="text-slate-400 text-sm">JPG, PNG, GIF, WebP supported</p>
              </div>
            </label>
          </div>
          
          {imageFile && (
            <div className="mt-4 p-4 bg-slate-800/50 rounded-lg">
              <p className="text-slate-300"><strong>File:</strong> {imageFile.name}</p>
            </div>
          )}
        </div>

        {/* Meme Templates */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Popular Templates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {memeTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => useTemplate(template)}
                className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-left transition-colors"
                data-testid={`template-${index}`}
              >
                <div className="font-medium text-slate-100">{template.name}</div>
                <div className="text-sm text-slate-400 mt-1">
                  {template.top && <div>Top: "{template.top}"</div>}
                  {template.bottom && <div>Bottom: "{template.bottom}"</div>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input */}
        {imageUrl && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Meme Text</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-slate-300 mb-2">Top Text</label>
                <input
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="Enter top text..."
                  className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-green-400"
                  data-testid="input-top-text"
                />
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">Bottom Text</label>
                <input
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="Enter bottom text..."
                  className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-green-400"
                  data-testid="input-bottom-text"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={clearTexts}
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm"
                data-testid="button-clear-texts"
              >
                Clear Text
              </button>
            </div>
          </div>
        )}

        {/* Text Styling */}
        {imageUrl && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Text Styling</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 mb-2">Font Size</label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full"
                  data-testid="slider-font-size"
                />
                <div className="text-center text-slate-400 text-sm">{fontSize}px</div>
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">Font Family</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-green-400"
                  data-testid="select-font-family"
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">Text Color</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-600"
                  data-testid="input-text-color"
                />
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">Stroke Color</label>
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-600"
                  data-testid="input-stroke-color"
                />
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">Stroke Width</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                  className="w-full"
                  data-testid="slider-stroke-width"
                />
                <div className="text-center text-slate-400 text-sm">{strokeWidth}px</div>
              </div>
            </div>
          </div>
        )}

        {/* Meme Preview and Canvas */}
        {imageUrl && (
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-100">Meme Preview</h3>
              <button
                onClick={downloadMeme}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                data-testid="button-download-meme"
              >
                <i className="fas fa-download mr-2"></i>
                Download Meme
              </button>
            </div>
            
            <div className="bg-slate-800/30 rounded-lg p-4 text-center">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-96 object-contain mx-auto rounded-lg"
                data-testid="meme-canvas"
              />
              
              {isGenerating && (
                <div className="mt-4 text-slate-400">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Generating meme...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Features</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Real-time meme preview as you type</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Popular meme templates for quick start</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Customizable fonts, colors, and stroke styles</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Automatic text wrapping and positioning</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>High-quality PNG download</span>
            </li>
          </ul>
        </div>
      </div>
    </ToolShell>
  );
};

export default MemeGenerator;