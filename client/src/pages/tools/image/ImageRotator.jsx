import React, { useState, useRef } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const ImageRotator = ({ tool }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [customAngle, setCustomAngle] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);

  const presetRotations = [
    { label: '90° Right', value: 90, icon: 'fas fa-redo' },
    { label: '180°', value: 180, icon: 'fas fa-sync' },
    { label: '270° Left', value: 270, icon: 'fas fa-undo' },
    { label: 'Custom', value: 'custom', icon: 'fas fa-sliders-h' }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      if (processedImageUrl) {
        URL.revokeObjectURL(processedImageUrl);
        setProcessedImageUrl(null);
      }
      
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      
      // Reset transformations
      setRotation(0);
      setCustomAngle(0);
      setFlipHorizontal(false);
      setFlipVertical(false);
    } else {
      alert('Please select a valid image file');
    }
  };

  const applyRotation = (angle) => {
    if (angle === 'custom') {
      setRotation(customAngle);
    } else {
      setRotation(angle);
    }
  };

  const processImage = async () => {
    if (!imageFile || !imageUrl) {
      alert('Please select an image first');
      return;
    }

    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate canvas dimensions based on rotation
        const angle = rotation * Math.PI / 180;
        const cos = Math.abs(Math.cos(angle));
        const sin = Math.abs(Math.sin(angle));
        
        const newWidth = Math.ceil(img.width * cos + img.height * sin);
        const newHeight = Math.ceil(img.width * sin + img.height * cos);
        
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set up transformation matrix
        ctx.save();
        
        // Move to center of canvas
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        // Apply transformations
        if (flipHorizontal) ctx.scale(-1, 1);
        if (flipVertical) ctx.scale(1, -1);
        
        // Rotate
        ctx.rotate(angle);
        
        // Draw image centered
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        ctx.restore();

        // Create processed image URL
        canvas.toBlob((blob) => {
          if (processedImageUrl) {
            URL.revokeObjectURL(processedImageUrl);
          }
          const url = URL.createObjectURL(blob);
          setProcessedImageUrl(url);
          setIsProcessing(false);
        }, 'image/png');
      };

      img.onerror = () => {
        alert('Error loading image');
        setIsProcessing(false);
      };

      img.src = imageUrl;
    } catch (error) {
      console.error('Image processing error:', error);
      alert('Error processing image');
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${imageFile.name.replace(/\.[^/.]+$/, '')}_rotated.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const resetTransformations = () => {
    setRotation(0);
    setCustomAngle(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
    if (processedImageUrl) {
      URL.revokeObjectURL(processedImageUrl);
      setProcessedImageUrl(null);
    }
  };

  // Auto-process when transformations change
  React.useEffect(() => {
    if (imageUrl && (rotation !== 0 || flipHorizontal || flipVertical)) {
      const timeoutId = setTimeout(processImage, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [imageUrl, rotation, flipHorizontal, flipVertical]);

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

        {/* Rotation Controls */}
        {imageUrl && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Rotation Controls</h3>
            
            {/* Preset Rotations */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {presetRotations.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => applyRotation(preset.value)}
                  className={`p-4 rounded-lg transition-colors ${
                    (preset.value === 'custom' && rotation === customAngle) || 
                    (preset.value !== 'custom' && rotation === preset.value)
                      ? 'bg-green-600 text-white' 
                      : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300'
                  }`}
                  data-testid={`preset-rotation-${preset.value}`}
                >
                  <i className={`${preset.icon} text-xl mb-2`}></i>
                  <div className="text-sm font-medium">{preset.label}</div>
                </button>
              ))}
            </div>

            {/* Custom Angle Input */}
            <div className="mb-6">
              <label className="block text-slate-300 mb-2">Custom Angle (degrees)</label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={customAngle}
                  onChange={(e) => setCustomAngle(parseInt(e.target.value))}
                  className="flex-1"
                  data-testid="slider-custom-angle"
                />
                <input
                  type="number"
                  min="-180"
                  max="180"
                  value={customAngle}
                  onChange={(e) => setCustomAngle(parseInt(e.target.value) || 0)}
                  className="w-20 px-2 py-1 bg-slate-800 text-slate-100 rounded border border-slate-600 text-center"
                  data-testid="input-custom-angle"
                />
                <button
                  onClick={() => applyRotation('custom')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                  data-testid="button-apply-custom"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Flip Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flipHorizontal}
                  onChange={(e) => setFlipHorizontal(e.target.checked)}
                  className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
                  data-testid="checkbox-flip-horizontal"
                />
                <span className="text-slate-300">Flip Horizontal</span>
                <i className="fas fa-arrows-alt-h text-slate-400"></i>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flipVertical}
                  onChange={(e) => setFlipVertical(e.target.checked)}
                  className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
                  data-testid="checkbox-flip-vertical"
                />
                <span className="text-slate-300">Flip Vertical</span>
                <i className="fas fa-arrows-alt-v text-slate-400"></i>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={resetTransformations}
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
                data-testid="button-reset"
              >
                <i className="fas fa-undo mr-2"></i>
                Reset
              </button>
              
              <div className="text-slate-400 text-sm">
                Current rotation: {rotation}° 
                {flipHorizontal && ', H-flipped'}
                {flipVertical && ', V-flipped'}
              </div>
            </div>
          </div>
        )}

        {/* Image Preview */}
        {imageUrl && (
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-100">Preview</h3>
              {(rotation !== 0 || flipHorizontal || flipVertical) && (
                <button
                  onClick={downloadImage}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                  data-testid="button-download"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download Result
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original */}
              <div>
                <h4 className="text-slate-300 font-medium mb-2">Original</h4>
                <div className="bg-slate-800/30 rounded-lg p-4 text-center">
                  <img 
                    src={imageUrl} 
                    alt="Original" 
                    className="max-w-full max-h-64 object-contain mx-auto rounded"
                    data-testid="image-original"
                  />
                </div>
              </div>
              
              {/* Processed */}
              <div>
                <h4 className="text-slate-300 font-medium mb-2">Transformed</h4>
                <div className="bg-slate-800/30 rounded-lg p-4 text-center">
                  {processedImageUrl ? (
                    <img 
                      src={processedImageUrl} 
                      alt="Transformed" 
                      className="max-w-full max-h-64 object-contain mx-auto rounded"
                      data-testid="image-transformed"
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center text-slate-400">
                      {isProcessing ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Processing...
                        </>
                      ) : (
                        'Apply transformations to see result'
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hidden canvas for processing */}
            <canvas
              ref={canvasRef}
              className="hidden"
              data-testid="processing-canvas"
            />
          </div>
        )}

        {/* Features */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Features</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Precise rotation with preset angles (90°, 180°, 270°)</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Custom angle rotation with slider and input controls</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Horizontal and vertical flip options</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Real-time preview of transformations</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>High-quality output with automatic canvas sizing</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Combine multiple transformations</span>
            </li>
          </ul>
        </div>
      </div>
    </ToolShell>
  );
};

export default ImageRotator;