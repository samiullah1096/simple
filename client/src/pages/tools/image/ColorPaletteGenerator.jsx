import React, { useState } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const ColorPaletteGenerator = ({ tool }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [colorPalette, setColorPalette] = useState([]);
  const [numColors, setNumColors] = useState(8);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setColorPalette([]);
    } else {
      alert('Please select a valid image file');
    }
  };

  const extractColors = async () => {
    if (!imageFile || !imageUrl) {
      alert('Please select an image first');
      return;
    }

    setIsProcessing(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Scale down for faster processing
        const maxSize = 200;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Extract dominant colors using quantization
        const colors = quantizeColors(imageData.data, numColors);
        setColorPalette(colors);
        setIsProcessing(false);
      };

      img.onerror = () => {
        alert('Error loading image');
        setIsProcessing(false);
      };

      img.src = imageUrl;
    } catch (error) {
      console.error('Color extraction error:', error);
      alert('Error extracting colors from image');
      setIsProcessing(false);
    }
  };

  const quantizeColors = (data, numColors) => {
    // Simple color quantization using k-means clustering
    const pixels = [];
    
    // Sample pixels (every 4th pixel for performance)
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      
      // Skip transparent pixels
      if (a > 128) {
        pixels.push([r, g, b]);
      }
    }

    if (pixels.length === 0) return [];

    // Initialize centroids randomly
    const centroids = [];
    for (let i = 0; i < numColors; i++) {
      const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
      centroids.push([...randomPixel]);
    }

    // K-means iterations
    for (let iter = 0; iter < 10; iter++) {
      const clusters = Array(numColors).fill().map(() => []);
      
      // Assign pixels to nearest centroid
      pixels.forEach(pixel => {
        let minDistance = Infinity;
        let bestCluster = 0;
        
        centroids.forEach((centroid, i) => {
          const distance = colorDistance(pixel, centroid);
          if (distance < minDistance) {
            minDistance = distance;
            bestCluster = i;
          }
        });
        
        clusters[bestCluster].push(pixel);
      });

      // Update centroids
      centroids.forEach((centroid, i) => {
        if (clusters[i].length > 0) {
          const avgR = clusters[i].reduce((sum, p) => sum + p[0], 0) / clusters[i].length;
          const avgG = clusters[i].reduce((sum, p) => sum + p[1], 0) / clusters[i].length;
          const avgB = clusters[i].reduce((sum, p) => sum + p[2], 0) / clusters[i].length;
          centroids[i] = [Math.round(avgR), Math.round(avgG), Math.round(avgB)];
        }
      });
    }

    // Convert to color objects with additional info
    return centroids.map((color, index) => {
      const [r, g, b] = color;
      const hex = rgbToHex(r, g, b);
      const hsl = rgbToHsl(r, g, b);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      return {
        id: index,
        rgb: { r, g, b },
        hex,
        hsl,
        luminance,
        name: getColorName(r, g, b)
      };
    }).sort((a, b) => b.luminance - a.luminance); // Sort by brightness
  };

  const colorDistance = (color1, color2) => {
    const dr = color1[0] - color2[0];
    const dg = color1[1] - color2[1];
    const db = color1[2] - color2[2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };

  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
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

  const getColorName = (r, g, b) => {
    // Simple color naming based on dominant channel
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    if (diff < 30) {
      if (max < 50) return 'Dark Gray';
      if (max < 150) return 'Gray';
      if (max < 200) return 'Light Gray';
      return 'White';
    }
    
    if (r === max) {
      if (g > b) return g > 150 ? 'Yellow' : 'Orange';
      return 'Red';
    } else if (g === max) {
      if (b > r) return 'Cyan';
      return 'Green';
    } else {
      if (r > g) return 'Purple';
      return 'Blue';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Visual feedback could be added here
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  };

  const exportPalette = () => {
    const paletteData = {
      colors: colorPalette.map(color => ({
        hex: color.hex,
        rgb: color.rgb,
        hsl: color.hsl,
        name: color.name
      })),
      source: imageFile.name,
      extractedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(paletteData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${imageFile.name.replace(/\.[^/.]+$/, '')}_palette.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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

        {/* Image Preview and Settings */}
        {imageUrl && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Image Preview & Settings</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="w-full max-h-64 object-contain rounded-lg bg-slate-800"
                  data-testid="image-preview"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 mb-2">Number of Colors</label>
                  <input
                    type="range"
                    min="3"
                    max="16"
                    value={numColors}
                    onChange={(e) => setNumColors(parseInt(e.target.value))}
                    className="w-full"
                    data-testid="slider-num-colors"
                  />
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>3</span>
                    <span className="text-slate-300 font-medium">{numColors} colors</span>
                    <span>16</span>
                  </div>
                </div>

                <button
                  onClick={extractColors}
                  disabled={isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white py-3 rounded-xl transition-colors"
                  data-testid="button-extract-colors"
                >
                  {isProcessing ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Extracting Colors...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-palette mr-2"></i>
                      Extract Color Palette
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Color Palette Display */}
        {colorPalette.length > 0 && (
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-100">Extracted Color Palette</h3>
              <button
                onClick={exportPalette}
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm"
                data-testid="button-export-palette"
              >
                <i className="fas fa-download mr-2"></i>
                Export Palette
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {colorPalette.map((color) => (
                <div
                  key={color.id}
                  className="bg-slate-800/50 rounded-lg p-4 space-y-3"
                  data-testid={`color-card-${color.id}`}
                >
                  <div
                    className="w-full h-16 rounded-lg cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => copyToClipboard(color.hex)}
                    title="Click to copy HEX"
                  />
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Name:</span>
                      <span className="text-slate-300">{color.name}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">HEX:</span>
                      <button
                        onClick={() => copyToClipboard(color.hex)}
                        className="text-slate-300 hover:text-white font-mono text-xs"
                        data-testid={`copy-hex-${color.id}`}
                      >
                        {color.hex}
                      </button>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">RGB:</span>
                      <button
                        onClick={() => copyToClipboard(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`)}
                        className="text-slate-300 hover:text-white font-mono text-xs"
                        data-testid={`copy-rgb-${color.id}`}
                      >
                        {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                      </button>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">HSL:</span>
                      <button
                        onClick={() => copyToClipboard(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`)}
                        className="text-slate-300 hover:text-white font-mono text-xs"
                        data-testid={`copy-hsl-${color.id}`}
                      >
                        {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-sm">
                <i className="fas fa-info-circle mr-2"></i>
                <strong>Tip:</strong> Click on any color value to copy it to your clipboard for use in design software.
              </p>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Features</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>AI-powered color extraction using K-means clustering</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Multiple color formats: HEX, RGB, HSL</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Automatic color naming and brightness sorting</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>One-click copy to clipboard</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Export palette as JSON for design tools</span>
            </li>
          </ul>
        </div>
      </div>
    </ToolShell>
  );
};

export default ColorPaletteGenerator;