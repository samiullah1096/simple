import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export default function ImageResizer() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [resizeMethod, setResizeMethod] = useState('pixels');
  const [percentage, setPercentage] = useState(100);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [resizedImage, setResizedImage] = useState(null);
  const canvasRef = useRef(null);

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setError('');
      setResizedImage(null);
      
      // Create preview and get dimensions
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        
        const img = new Image();
        img.onload = () => {
          setOriginalWidth(img.width);
          setOriginalHeight(img.height);
          setWidth(img.width.toString());
          setHeight(img.height.toString());
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setError('Please select a valid image file');
    }
  }, []);

  const handleWidthChange = (newWidth) => {
    setWidth(newWidth);
    if (maintainAspectRatio && originalWidth && originalHeight) {
      const ratio = originalHeight / originalWidth;
      setHeight(Math.round(newWidth * ratio).toString());
    }
  };

  const handleHeightChange = (newHeight) => {
    setHeight(newHeight);
    if (maintainAspectRatio && originalWidth && originalHeight) {
      const ratio = originalWidth / originalHeight;
      setWidth(Math.round(newHeight * ratio).toString());
    }
  };

  const handlePercentageChange = (newPercentage) => {
    setPercentage(newPercentage);
    if (originalWidth && originalHeight) {
      const newWidth = Math.round(originalWidth * (newPercentage / 100));
      const newHeight = Math.round(originalHeight * (newPercentage / 100));
      setWidth(newWidth.toString());
      setHeight(newHeight.toString());
    }
  };

  const downloadImage = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResize = async () => {
    if (!file || !width || !height) {
      setError('Please select an image and specify dimensions');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        const targetWidth = parseInt(width);
        const targetHeight = parseInt(height);
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // Use high-quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        canvas.toBlob((blob) => {
          const originalExtension = file.name.split('.').pop();
          const fileName = file.name.replace(`.${originalExtension}`, `_resized_${targetWidth}x${targetHeight}.${originalExtension}`);
          
          setResizedImage({
            name: fileName,
            blob: blob,
            size: blob.size,
            width: targetWidth,
            height: targetHeight,
            url: URL.createObjectURL(blob)
          });
          
          setProcessing(false);
        }, file.type, 0.9);
      };
      
      img.src = preview;
    } catch (err) {
      setError('Error resizing image');
      setProcessing(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const presetSizes = [
    { name: 'Instagram Square', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Post', width: 1200, height: 630 },
    { name: 'Twitter Header', width: 1500, height: 500 },
    { name: 'LinkedIn Post', width: 1200, height: 627 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'Profile Picture', width: 400, height: 400 },
    { name: 'Email Header', width: 600, height: 200 }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 mb-6">
          <i className="fas fa-expand-arrows-alt text-2xl text-green-400"></i>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
          Image Resizer
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Resize images to specific dimensions or percentages. Maintain aspect ratio for perfect results.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          {/* File Upload */}
          <Card className="glassmorphism">
            <CardContent className="p-6 space-y-4">
              <Label htmlFor="image-file" className="text-base font-medium">
                Select Image
              </Label>
              <Input
                id="image-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              {file && (
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Original: {originalWidth} × {originalHeight} px ({formatFileSize(file.size)})
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resize Method */}
          {file && (
            <Card className="glassmorphism">
              <CardContent className="p-6 space-y-4">
                <Label className="text-base font-medium">Resize Method</Label>
                <Select value={resizeMethod} onValueChange={setResizeMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pixels">Custom Dimensions (pixels)</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="presets">Social Media Presets</SelectItem>
                  </SelectContent>
                </Select>

                {/* Percentage Method */}
                {resizeMethod === 'percentage' && (
                  <div className="space-y-4">
                    <Label htmlFor="percentage">Resize Percentage</Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        id="percentage"
                        type="number"
                        min="1"
                        max="500"
                        value={percentage}
                        onChange={(e) => handlePercentageChange(parseInt(e.target.value) || 100)}
                        className="w-20"
                      />
                      <span className="text-sm text-slate-500">%</span>
                    </div>
                  </div>
                )}

                {/* Presets Method */}
                {resizeMethod === 'presets' && (
                  <div className="space-y-4">
                    <Label>Social Media Presets</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {presetSizes.map((preset, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => {
                            setWidth(preset.width.toString());
                            setHeight(preset.height.toString());
                            setMaintainAspectRatio(false);
                          }}
                          className="justify-between"
                        >
                          <span>{preset.name}</span>
                          <span className="text-sm text-slate-500">
                            {preset.width} × {preset.height}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Dimensions */}
                {resizeMethod === 'pixels' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Maintain Aspect Ratio</Label>
                      <Switch
                        checked={maintainAspectRatio}
                        onCheckedChange={setMaintainAspectRatio}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="width">Width (px)</Label>
                        <Input
                          id="width"
                          type="number"
                          min="1"
                          value={width}
                          onChange={(e) => handleWidthChange(e.target.value)}
                          placeholder="Width"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (px)</Label>
                        <Input
                          id="height"
                          type="number"
                          min="1"
                          value={height}
                          onChange={(e) => handleHeightChange(e.target.value)}
                          placeholder="Height"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <i className="fas fa-exclamation-triangle w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Button */}
          {file && (
            <Button
              onClick={handleResize}
              disabled={processing || !width || !height}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              size="lg"
            >
              {processing ? (
                <>
                  <i className="fas fa-spinner animate-spin mr-2" />
                  Resizing Image...
                </>
              ) : (
                <>
                  <i className="fas fa-expand-arrows-alt mr-2" />
                  Resize Image
                </>
              )}
            </Button>
          )}
        </div>

        {/* Preview */}
        <div className="space-y-6">
          {/* Original Image */}
          {preview && (
            <Card className="glassmorphism">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Original Image</h3>
                <div className="relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={preview}
                    alt="Original"
                    className="max-w-full h-auto max-h-64 mx-auto"
                  />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 text-center">
                  {originalWidth} × {originalHeight} px
                </p>
              </CardContent>
            </Card>
          )}

          {/* Resized Image */}
          {resizedImage && (
            <Card className="glassmorphism">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Resized Image</h3>
                  <Button
                    onClick={() => downloadImage(resizedImage.blob, resizedImage.name)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <i className="fas fa-download mr-2" />
                    Download
                  </Button>
                </div>
                <div className="relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={resizedImage.url}
                    alt="Resized"
                    className="max-w-full h-auto max-h-64 mx-auto"
                  />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300 text-center space-y-1">
                  <p>{resizedImage.width} × {resizedImage.height} px</p>
                  <p>{formatFileSize(resizedImage.size)}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
            <i className="fas fa-shield-alt text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold">Privacy Protected</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            All image processing happens locally in your browser.
          </p>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
            <i className="fas fa-magic text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold">Smart Resizing</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Maintain aspect ratios and use social media presets.
          </p>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
            <i className="fas fa-bolt text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold">Instant Results</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Get resized images immediately with high quality rendering.
          </p>
        </div>
      </div>
    </div>
  );
}