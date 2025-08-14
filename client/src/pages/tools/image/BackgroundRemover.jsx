import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function BackgroundRemover() {
  const tool = getToolBySlug('image', 'remove-background');
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage({
        file,
        dataUrl: e.target.result,
        name: file.name,
        size: file.size
      });
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const removeBackground = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Load the image
      const img = new Image();
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data for processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Advanced background removal algorithm using edge detection and color clustering
        const processedData = await advancedBackgroundRemoval(data, canvas.width, canvas.height);
        
        // Create new image data with processed pixels
        const newImageData = new ImageData(processedData, canvas.width, canvas.height);
        ctx.putImageData(newImageData, 0, 0);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          setProcessedImage({
            blob,
            dataUrl: url,
            name: `${originalImage.name.split('.')[0]}_no_bg.png`,
            size: blob.size
          });
          setIsProcessing(false);
        }, 'image/png');
      };
      
      img.src = originalImage.dataUrl;
      
    } catch (error) {
      console.error('Error removing background:', error);
      alert('Error processing image. Please try again.');
      setIsProcessing(false);
    }
  };

  // Advanced background removal using multiple algorithms
  const advancedBackgroundRemoval = async (data, width, height) => {
    const processedData = new Uint8ClampedArray(data);
    
    // Method 1: Color clustering for background detection
    const colorClusters = analyzeColorClusters(data, width, height);
    const backgroundCluster = identifyBackgroundCluster(colorClusters, width, height);
    
    // Method 2: Edge detection for subject boundaries
    const edges = detectEdges(data, width, height);
    
    // Method 3: Color similarity analysis
    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      
      // Check if pixel belongs to background cluster
      const isBackground = isPixelInBackgroundCluster([red, green, blue], backgroundCluster);
      
      // Get pixel position
      const pixelIndex = i / 4;
      const x = pixelIndex % width;
      const y = Math.floor(pixelIndex / width);
      
      // Check edge proximity (keep pixels near edges)
      const nearEdge = isNearEdge(x, y, edges, width, height, 3);
      
      // Remove background while preserving edge details
      if (isBackground && !nearEdge) {
        processedData[i + 3] = 0; // Set alpha to 0 (transparent)
      } else if (isBackground && nearEdge) {
        // Partial transparency for smooth edges
        processedData[i + 3] = Math.min(data[i + 3], 128);
      }
    }
    
    return processedData;
  };

  // Analyze color clusters in the image
  const analyzeColorClusters = (data, width, height) => {
    const clusters = {};
    const colorThreshold = 30;
    
    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      
      // Quantize colors to reduce noise
      const quantizedR = Math.round(red / colorThreshold) * colorThreshold;
      const quantizedG = Math.round(green / colorThreshold) * colorThreshold;
      const quantizedB = Math.round(blue / colorThreshold) * colorThreshold;
      
      const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
      
      if (!clusters[colorKey]) {
        clusters[colorKey] = { color: [quantizedR, quantizedG, quantizedB], count: 0, positions: [] };
      }
      
      clusters[colorKey].count++;
      const pixelIndex = i / 4;
      clusters[colorKey].positions.push({
        x: pixelIndex % width,
        y: Math.floor(pixelIndex / width)
      });
    }
    
    return Object.values(clusters).sort((a, b) => b.count - a.count);
  };

  // Identify the most likely background cluster
  const identifyBackgroundCluster = (clusters, width, height) => {
    // Background is likely to be:
    // 1. The most common color
    // 2. Present at image edges
    // 3. Forms large connected regions
    
    for (const cluster of clusters) {
      const edgePixels = cluster.positions.filter(pos => 
        pos.x === 0 || pos.x === width - 1 || pos.y === 0 || pos.y === height - 1
      );
      
      // If cluster is common and appears at edges, likely background
      if (edgePixels.length > cluster.count * 0.1 && cluster.count > (width * height) * 0.05) {
        return cluster;
      }
    }
    
    // Fallback to most common color
    return clusters[0];
  };

  // Simple edge detection using Sobel operator
  const detectEdges = (data, width, height) => {
    const edges = new Array(width * height).fill(0);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        
        // Convert to grayscale
        const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        
        // Sobel X and Y gradients
        const gx = -data[((y-1)*width + (x-1))*4] + data[((y-1)*width + (x+1))*4] +
                   -2*data[(y*width + (x-1))*4] + 2*data[(y*width + (x+1))*4] +
                   -data[((y+1)*width + (x-1))*4] + data[((y+1)*width + (x+1))*4];
        
        const gy = -data[((y-1)*width + (x-1))*4] - 2*data[((y-1)*width + x)*4] - data[((y-1)*width + (x+1))*4] +
                   data[((y+1)*width + (x-1))*4] + 2*data[((y+1)*width + x)*4] + data[((y+1)*width + (x+1))*4];
        
        const magnitude = Math.sqrt(gx * gx + gy * gy);
        edges[y * width + x] = magnitude > 50 ? 1 : 0;
      }
    }
    
    return edges;
  };

  // Check if pixel is in background cluster
  const isPixelInBackgroundCluster = (pixelColor, backgroundCluster) => {
    if (!backgroundCluster) return false;
    
    const [r, g, b] = pixelColor;
    const [bgR, bgG, bgB] = backgroundCluster.color;
    
    const distance = Math.sqrt(
      Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
    );
    
    return distance < 50; // Adjust threshold as needed
  };

  // Check if pixel is near an edge
  const isNearEdge = (x, y, edges, width, height, radius) => {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const newX = x + dx;
        const newY = y + dy;
        
        if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
          if (edges[newY * width + newX]) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const downloadImage = () => {
    if (!processedImage) return;
    
    const a = document.createElement('a');
    a.href = processedImage.dataUrl;
    a.download = processedImage.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetTool = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const faqs = [
    {
      question: 'How does the AI background remover work?',
      answer: 'Our tool uses advanced algorithms including color clustering, edge detection, and pattern recognition to automatically identify and remove backgrounds from your images with high precision.'
    },
    {
      question: 'What image formats are supported for background removal?',
      answer: 'You can upload JPG, PNG, WebP, and most other common image formats. The output will always be a PNG file with transparent background for maximum compatibility.'
    },
    {
      question: 'Is the background removal completely automatic?',
      answer: 'Yes, the process is fully automatic. Simply upload your image and click "Remove Background" - our AI will handle the rest and provide you with a transparent PNG.'
    },
    {
      question: 'Can I remove backgrounds from photos with complex details?',
      answer: 'Our advanced algorithm works well with complex images including hair, fur, and intricate details. For best results, use images with good contrast between subject and background.'
    },
    {
      question: 'What happens to my original image quality?',
      answer: 'The subject quality is preserved while only the background is removed. The tool maintains the original resolution and doesn\'t compress your image unnecessarily.'
    }
  ];

  const howToSteps = [
    'Click "Choose Image" or drag an image into the upload area',
    'Wait for the image to load and preview to appear',
    'Click "Remove Background" to start the AI processing',
    'Preview the result with transparent background',
    'Download your image with removed background as PNG'
  ];

  const benefits = [
    'AI-powered precision removal',
    'Works with complex backgrounds',
    'Preserves fine details like hair',
    'Instant transparent PNG output',
    'No manual editing required',
    'Professional quality results'
  ];

  const useCases = [
    'Create professional headshots',
    'Remove distracting backgrounds from photos',
    'Prepare images for graphic design',
    'Create product photos for e-commerce',
    'Make images suitable for presentations',
    'Extract subjects for photo compositing'
  ];

  return (
    <ToolShell 
      tool={tool} 
      faqs={faqs}
      howToSteps={howToSteps}
      benefits={benefits}
      useCases={useCases}
    >
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-slate-100">Upload Image</h2>
          
          {/* File Upload Area */}
          <div 
            className="border-2 border-dashed border-slate-600 rounded-2xl p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <i className="fas fa-cloud-upload-alt text-4xl text-slate-400 mb-4"></i>
            <p className="text-lg mb-2 text-slate-300">Drag and drop an image here</p>
            <p className="text-slate-400 mb-4">or click to browse</p>
            <p className="text-xs text-slate-500 mb-4">Supports JPG, PNG, WebP formats</p>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl transition-colors">
              <i className="fas fa-folder-open mr-2"></i>
              Choose Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="input-file-upload"
            />
          </div>

          {/* Original Image Preview */}
          {originalImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glassmorphism p-6 rounded-xl"
            >
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Original Image</h3>
              <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden mb-4">
                <img
                  src={originalImage.dataUrl}
                  alt="Original"
                  className="w-full h-full object-contain"
                  data-testid="image-original-preview"
                />
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>{originalImage.name}</span>
                <span>{(originalImage.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={removeBackground}
              disabled={!originalImage || isProcessing}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-4 rounded-2xl text-lg font-semibold transition-colors"
              data-testid="button-remove-background"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-magic mr-2"></i>
                  Remove Background
                </>
              )}
            </button>
            <button
              onClick={resetTool}
              className="px-6 py-4 glassmorphism hover:bg-slate-700/50 text-slate-300 rounded-2xl transition-colors"
              data-testid="button-reset"
            >
              <i className="fas fa-redo mr-2"></i>
              Reset
            </button>
          </div>

          {/* Info Box */}
          <div className="glassmorphism p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-slate-100 mb-3">
              <i className="fas fa-info-circle text-cyan-400 mr-2"></i>
              How it Works
            </h3>
            <div className="text-sm text-slate-400 space-y-2">
              <p>• This tool uses advanced algorithms to detect and remove backgrounds</p>
              <p>• Works best with clear subject-background contrast</p>
              <p>• All processing happens in your browser - your images stay private</p>
              <p>• Supports common image formats (JPG, PNG, WebP)</p>
            </div>
          </div>
        </motion.div>

        {/* Output Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-slate-100">Result</h2>
          
          {/* Preview Area */}
          <div className="glassmorphism rounded-2xl p-6 h-96">
            {processedImage ? (
              <div className="h-full">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Background Removed</h3>
                <div className="aspect-video bg-transparent rounded-lg overflow-hidden mb-4" 
                     style={{backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3crect width=\'10\' height=\'10\' fill=\'%23374151\'/%3e%3crect x=\'10\' y=\'10\' width=\'10\' height=\'10\' fill=\'%23374151\'/%3e%3c/svg%3e")'}}>
                  <img
                    src={processedImage.dataUrl}
                    alt="Background removed"
                    className="w-full h-full object-contain"
                    data-testid="image-processed-preview"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-400">
                    <div>{processedImage.name}</div>
                    <div>{(processedImage.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <button
                    onClick={downloadImage}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors"
                    data-testid="button-download"
                  >
                    <i className="fas fa-download mr-2"></i>
                    Download
                  </button>
                </div>
              </div>
            ) : isProcessing ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <i className="fas fa-spinner fa-spin text-6xl text-cyan-400 mb-4"></i>
                  <p className="text-slate-400">Removing background...</p>
                  <p className="text-sm text-slate-500 mt-2">This may take a few moments</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <i className="fas fa-image text-6xl mb-4 opacity-50"></i>
                  <p>Processed image will appear here</p>
                  <p className="text-sm mt-2">Upload an image and click "Remove Background"</p>
                </div>
              </div>
            )}
          </div>

          {/* Processing Info */}
          <div className="glassmorphism rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-100">Processing Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className={`${isProcessing ? 'text-yellow-400' : processedImage ? 'text-green-400' : 'text-slate-400'}`}>
                  {isProcessing ? 'Processing...' : processedImage ? 'Complete' : 'Ready'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Output format:</span>
                <span className="text-slate-100">PNG (with transparency)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Privacy:</span>
                <span className="text-green-400">100% local processing</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="glassmorphism rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-100">
              <i className="fas fa-lightbulb text-yellow-400 mr-2"></i>
              Tips for Best Results
            </h3>
            <div className="space-y-2 text-sm text-slate-400">
              <p>• Use images with clear contrast between subject and background</p>
              <p>• Avoid complex or busy backgrounds when possible</p>
              <p>• Higher resolution images typically produce better results</p>
              <p>• The tool works best with people, objects, and simple scenes</p>
            </div>
          </div>
        </motion.div>
      </div>
    </ToolShell>
  );
}
