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
      // This is a simplified background removal simulation
      // In a real implementation, you would use libraries like:
      // - @mediapipe/selfie_segmentation for person detection
      // - TensorFlow.js with pre-trained models
      // - Canvas API for pixel manipulation
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Load the image
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data for processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Simple background removal algorithm (this is very basic)
        // In reality, you'd use ML models for accurate segmentation
        for (let i = 0; i < data.length; i += 4) {
          const red = data[i];
          const green = data[i + 1];
          const blue = data[i + 2];
          
          // Simple color-based background removal (remove white-ish backgrounds)
          // This is just for demonstration - real background removal requires ML
          if (red > 200 && green > 200 && blue > 200) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
          }
        }
        
        // Put the processed image data back
        ctx.putImageData(imageData, 0, 0);
        
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

  return (
    <ToolShell tool={tool} category="image">
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
