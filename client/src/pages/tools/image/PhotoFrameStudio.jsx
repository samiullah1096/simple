import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function PhotoFrameStudio() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [frameType, setFrameType] = useState('classic');
  const [frameColor, setFrameColor] = useState('#8B4513');
  const [frameWidth, setFrameWidth] = useState([20]);
  const [borderRadius, setBorderRadius] = useState([10]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const { toast } = useToast();

  const tool = getToolBySlug('image', 'frames');

  const frameTypes = {
    classic: 'Classic Border',
    shadow: 'Drop Shadow',
    vintage: 'Vintage Style',
    modern: 'Modern Minimal',
    polaroid: 'Polaroid Style',
    ornate: 'Ornate Frame'
  };

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setError('');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        // Auto-apply preview
        setTimeout(() => applyFramePreview(e.target.result), 100);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setError('Please select a valid image file');
    }
  }, []);

  const applyFramePreview = useCallback((imageSrc) => {
    if (!imageSrc) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const frameWidthPx = frameWidth[0];
      const radiusPx = borderRadius[0];
      
      // Set canvas size
      canvas.width = img.width + (frameWidthPx * 2);
      canvas.height = img.height + (frameWidthPx * 2);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply frame based on type
      switch (frameType) {
        case 'classic':
          applyClassicFrame(ctx, img, frameWidthPx, radiusPx);
          break;
        case 'shadow':
          applyShadowFrame(ctx, img, frameWidthPx, radiusPx);
          break;
        case 'vintage':
          applyVintageFrame(ctx, img, frameWidthPx, radiusPx);
          break;
        case 'modern':
          applyModernFrame(ctx, img, frameWidthPx, radiusPx);
          break;
        case 'polaroid':
          applyPolaroidFrame(ctx, img, frameWidthPx);
          break;
        case 'ornate':
          applyOrnateFrame(ctx, img, frameWidthPx, radiusPx);
          break;
        default:
          applyClassicFrame(ctx, img, frameWidthPx, radiusPx);
      }
    };
    
    img.src = imageSrc;
  }, [frameType, frameColor, frameWidth, borderRadius]);

  const applyClassicFrame = (ctx, img, frameWidthPx, radiusPx) => {
    // Draw frame background
    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw image with rounded corners
    ctx.save();
    roundedRect(ctx, frameWidthPx, frameWidthPx, img.width, img.height, radiusPx);
    ctx.clip();
    ctx.drawImage(img, frameWidthPx, frameWidthPx);
    ctx.restore();
  };

  const applyShadowFrame = (ctx, img, frameWidthPx, radiusPx) => {
    // Draw shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 10;
    
    // Draw white background
    ctx.fillStyle = '#ffffff';
    roundedRect(ctx, frameWidthPx, frameWidthPx, img.width, img.height, radiusPx);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    
    // Draw image
    ctx.save();
    roundedRect(ctx, frameWidthPx, frameWidthPx, img.width, img.height, radiusPx);
    ctx.clip();
    ctx.drawImage(img, frameWidthPx, frameWidthPx);
    ctx.restore();
  };

  const applyVintageFrame = (ctx, img, frameWidthPx, radiusPx) => {
    // Create vintage effect
    ctx.fillStyle = '#D2B48C'; // Tan color
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Add texture pattern
    for (let i = 0; i < ctx.canvas.width; i += 4) {
      for (let j = 0; j < ctx.canvas.height; j += 4) {
        if (Math.random() > 0.8) {
          ctx.fillStyle = 'rgba(139, 69, 19, 0.1)';
          ctx.fillRect(i, j, 2, 2);
        }
      }
    }
    
    // Draw image
    ctx.save();
    roundedRect(ctx, frameWidthPx, frameWidthPx, img.width, img.height, radiusPx);
    ctx.clip();
    ctx.drawImage(img, frameWidthPx, frameWidthPx);
    ctx.restore();
  };

  const applyModernFrame = (ctx, img, frameWidthPx, radiusPx) => {
    // Minimal white frame
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw thin border
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    roundedRect(ctx, frameWidthPx, frameWidthPx, img.width, img.height, radiusPx);
    ctx.stroke();
    
    // Draw image
    ctx.save();
    roundedRect(ctx, frameWidthPx, frameWidthPx, img.width, img.height, radiusPx);
    ctx.clip();
    ctx.drawImage(img, frameWidthPx, frameWidthPx);
    ctx.restore();
  };

  const applyPolaroidFrame = (ctx, img, frameWidthPx) => {
    // White polaroid background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Calculate polaroid proportions
    const polaroidBottom = frameWidthPx * 3; // Larger bottom margin
    
    // Draw image (no rounded corners for polaroid)
    ctx.drawImage(img, frameWidthPx, frameWidthPx, img.width, img.height);
  };

  const applyOrnateFrame = (ctx, img, frameWidthPx, radiusPx) => {
    // Gold ornate frame
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, ctx.canvas.height);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(0.5, '#FFA500');
    gradient.addColorStop(1, '#FF8C00');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Add decorative pattern
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    
    // Draw decorative lines
    for (let i = 10; i < frameWidthPx; i += 8) {
      ctx.strokeRect(i, i, ctx.canvas.width - i * 2, ctx.canvas.height - i * 2);
    }
    
    // Draw image
    ctx.save();
    roundedRect(ctx, frameWidthPx, frameWidthPx, img.width, img.height, radiusPx);
    ctx.clip();
    ctx.drawImage(img, frameWidthPx, frameWidthPx);
    ctx.restore();
  };

  const roundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const downloadFramedImage = async () => {
    if (!canvasRef.current) {
      setError('No preview available to download');
      return;
    }

    setProcessing(true);
    
    try {
      canvasRef.current.toBlob((blob) => {
        const fileName = file.name.replace(/\.[^/.]+$/, `_framed_${frameType}.png`);
        saveAs(blob, fileName);
        
        toast({
          title: "Success!",
          description: "Framed image has been downloaded successfully.",
        });
        setProcessing(false);
      }, 'image/png');
    } catch (err) {
      console.error('Error downloading image:', err);
      setError('Failed to download framed image. Please try again.');
      setProcessing(false);
    }
  };

  // Update preview when settings change
  React.useEffect(() => {
    if (preview) {
      applyFramePreview(preview);
    }
  }, [preview, frameType, frameColor, frameWidth, borderRadius, applyFramePreview]);

  const toolContent = (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload and Settings */}
        <Card className="glassmorphism border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Upload & Customize</CardTitle>
            <CardDescription className="text-slate-400">
              Upload an image and customize your frame
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="image-upload" className="text-slate-300">Choose Image File</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-slate-800 border-slate-600 text-slate-100"
                data-testid="input-image-file"
              />
            </div>

            {file && (
              <>
                <div>
                  <Label className="text-slate-300">Frame Style</Label>
                  <Select value={frameType} onValueChange={setFrameType}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {Object.entries(frameTypes).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {frameType !== 'polaroid' && (
                  <div>
                    <Label htmlFor="frame-color" className="text-slate-300">Frame Color</Label>
                    <Input
                      id="frame-color"
                      type="color"
                      value={frameColor}
                      onChange={(e) => setFrameColor(e.target.value)}
                      className="bg-slate-800 border-slate-600 h-12"
                      data-testid="input-frame-color"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-slate-300">Frame Width: {frameWidth[0]}px</Label>
                  <Slider
                    value={frameWidth}
                    onValueChange={setFrameWidth}
                    max={100}
                    min={5}
                    step={5}
                    className="mt-2"
                    data-testid="slider-frame-width"
                  />
                </div>

                {frameType !== 'polaroid' && (
                  <div>
                    <Label className="text-slate-300">Border Radius: {borderRadius[0]}px</Label>
                    <Slider
                      value={borderRadius}
                      onValueChange={setBorderRadius}
                      max={50}
                      min={0}
                      step={5}
                      className="mt-2"
                      data-testid="slider-border-radius"
                    />
                  </div>
                )}

                <Button
                  onClick={downloadFramedImage}
                  disabled={processing}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  data-testid="button-download-framed"
                >
                  {processing ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-download mr-2"></i>
                      Download Framed Image
                    </>
                  )}
                </Button>
              </>
            )}

            {error && (
              <Alert className="border-red-500 bg-red-500/10">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="glassmorphism border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Preview</CardTitle>
            <CardDescription className="text-slate-400">
              See how your framed image will look
            </CardDescription>
          </CardHeader>
          <CardContent>
            {preview ? (
              <div className="text-center">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto border border-slate-600 rounded-lg"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <i className="fas fa-image text-4xl mb-4"></i>
                <p>Upload an image to see the preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const howToSteps = [
    {
      title: 'Upload Image',
      description: 'Select the image you want to add a frame to'
    },
    {
      title: 'Choose Frame Style',
      description: 'Select from various frame styles like classic, shadow, vintage, etc.'
    },
    {
      title: 'Customize Settings',
      description: 'Adjust frame color, width, and border radius to your preference'
    },
    {
      title: 'Download Result',
      description: 'Save your beautifully framed image'
    }
  ];

  const benefits = [
    'Multiple frame styles available',
    'Customizable colors and dimensions',
    'Real-time preview',
    'High-quality output',
    'Perfect for social media'
  ];

  const useCases = [
    'Creating social media posts',
    'Making photo collages',
    'Preparing images for print',
    'Adding artistic effects',
    'Professional photo presentation'
  ];

  return (
    <ToolShell 
      tool={tool} 
      howToSteps={howToSteps}
      benefits={benefits}
      useCases={useCases}
    >
      {toolContent}
    </ToolShell>
  );
}