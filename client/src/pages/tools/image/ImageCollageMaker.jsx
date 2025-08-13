import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function ImageCollageMaker() {
  const [files, setFiles] = useState([]);
  const [layout, setLayout] = useState('grid-2x2');
  const [canvasSize, setCanvasSize] = useState('1080x1080');
  const [spacing, setSpacing] = useState(10);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const { toast } = useToast();

  const tool = getToolBySlug('image', 'collage');

  const layouts = {
    'grid-2x2': '2x2 Grid',
    'grid-3x3': '3x3 Grid',
    'grid-1x4': '1x4 Row',
    'grid-4x1': '4x1 Column',
    'mosaic': 'Mosaic Layout',
    'polaroid': 'Polaroid Style'
  };

  const canvasSizes = {
    '1080x1080': '1080x1080 (Square)',
    '1920x1080': '1920x1080 (Landscape)',
    '1080x1920': '1080x1920 (Portrait)',
    '1200x800': '1200x800 (Wide)',
    '800x1200': '800x1200 (Tall)'
  };

  const handleFilesChange = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
    
    if (selectedFiles.length === 0) {
      setError('Please select at least one image file');
      return;
    }

    if (selectedFiles.length > 9) {
      setError('Maximum 9 images allowed');
      return;
    }

    setFiles(selectedFiles);
    setError('');
    
    // Auto-generate preview
    setTimeout(() => generateCollagePreview(selectedFiles), 100);
  }, []);

  const generateCollagePreview = useCallback(async (imageFiles) => {
    if (!imageFiles || imageFiles.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const [width, height] = canvasSize.split('x').map(Number);
    
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas with background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    
    try {
      const images = await Promise.all(
        imageFiles.map(file => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();
            
            reader.onload = (e) => {
              img.onload = () => resolve(img);
              img.onerror = reject;
              img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );
      
      drawCollageLayout(ctx, images, width, height);
    } catch (err) {
      console.error('Error loading images:', err);
      setError('Failed to load images for preview');
    }
  }, [layout, canvasSize, spacing, backgroundColor]);

  const drawCollageLayout = (ctx, images, width, height) => {
    const margin = spacing;
    
    switch (layout) {
      case 'grid-2x2':
        drawGrid(ctx, images, 2, 2, width, height, margin);
        break;
      case 'grid-3x3':
        drawGrid(ctx, images, 3, 3, width, height, margin);
        break;
      case 'grid-1x4':
        drawGrid(ctx, images, 4, 1, width, height, margin);
        break;
      case 'grid-4x1':
        drawGrid(ctx, images, 1, 4, width, height, margin);
        break;
      case 'mosaic':
        drawMosaicLayout(ctx, images, width, height, margin);
        break;
      case 'polaroid':
        drawPolaroidLayout(ctx, images, width, height, margin);
        break;
    }
  };

  const drawGrid = (ctx, images, cols, rows, width, height, margin) => {
    const totalMarginX = margin * (cols + 1);
    const totalMarginY = margin * (rows + 1);
    const cellWidth = (width - totalMarginX) / cols;
    const cellHeight = (height - totalMarginY) / rows;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const imageIndex = row * cols + col;
        if (imageIndex >= images.length) break;
        
        const x = margin + col * (cellWidth + margin);
        const y = margin + row * (cellHeight + margin);
        
        drawImageToFit(ctx, images[imageIndex], x, y, cellWidth, cellHeight);
      }
    }
  };

  const drawMosaicLayout = (ctx, images, width, height, margin) => {
    if (images.length === 0) return;
    
    if (images.length === 1) {
      drawImageToFit(ctx, images[0], margin, margin, width - 2 * margin, height - 2 * margin);
    } else if (images.length === 2) {
      const halfWidth = (width - 3 * margin) / 2;
      drawImageToFit(ctx, images[0], margin, margin, halfWidth, height - 2 * margin);
      drawImageToFit(ctx, images[1], margin + halfWidth + margin, margin, halfWidth, height - 2 * margin);
    } else {
      const bigSize = (width - 3 * margin) * 0.6;
      const smallSize = (width - 3 * margin) * 0.4;
      
      drawImageToFit(ctx, images[0], margin, margin, bigSize, bigSize);
      
      if (images.length > 1) {
        drawImageToFit(ctx, images[1], margin + bigSize + margin, margin, smallSize, smallSize / 2 - margin / 2);
      }
      if (images.length > 2) {
        drawImageToFit(ctx, images[2], margin + bigSize + margin, margin + smallSize / 2 + margin / 2, smallSize, smallSize / 2 - margin / 2);
      }
    }
  };

  const drawPolaroidLayout = (ctx, images, width, height, margin) => {
    const polaroidWidth = Math.min(200, (width - margin * 4) / 3);
    const polaroidHeight = polaroidWidth * 1.2;
    
    images.slice(0, 6).forEach((img, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      
      const x = margin + col * (polaroidWidth + margin);
      const y = margin + row * (polaroidHeight + margin);
      
      // Draw polaroid background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, y, polaroidWidth, polaroidHeight);
      
      // Draw image area
      const imgHeight = polaroidHeight * 0.8;
      drawImageToFit(ctx, img, x + 10, y + 10, polaroidWidth - 20, imgHeight - 20);
      
      // Add shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
      ctx.strokeStyle = '#ddd';
      ctx.strokeRect(x, y, polaroidWidth, polaroidHeight);
      ctx.shadowColor = 'transparent';
    });
  };

  const drawImageToFit = (ctx, img, x, y, width, height) => {
    const imgAspect = img.width / img.height;
    const boxAspect = width / height;
    
    let drawWidth, drawHeight, drawX, drawY;
    
    if (imgAspect > boxAspect) {
      drawHeight = height;
      drawWidth = height * imgAspect;
      drawX = x - (drawWidth - width) / 2;
      drawY = y;
    } else {
      drawWidth = width;
      drawHeight = width / imgAspect;
      drawX = x;
      drawY = y - (drawHeight - height) / 2;
    }
    
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
  };

  const downloadCollage = async () => {
    if (!canvasRef.current || files.length === 0) {
      setError('No images selected or preview not available');
      return;
    }

    setProcessing(true);
    
    try {
      canvasRef.current.toBlob((blob) => {
        const fileName = `collage_${layout}_${canvasSize.replace('x', '_')}.png`;
        saveAs(blob, fileName);
        
        toast({
          title: "Success!",
          description: "Collage has been downloaded successfully.",
        });
        setProcessing(false);
      }, 'image/png');
    } catch (err) {
      console.error('Error downloading collage:', err);
      setError('Failed to download collage. Please try again.');
      setProcessing(false);
    }
  };

  React.useEffect(() => {
    if (files.length > 0) {
      generateCollagePreview(files);
    }
  }, [files, layout, canvasSize, spacing, backgroundColor, generateCollagePreview]);

  const toolContent = (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glassmorphism border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Upload & Settings</CardTitle>
            <CardDescription className="text-slate-400">
              Upload images and customize your collage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="images-upload" className="text-slate-300">Choose Images (max 9)</Label>
              <Input
                id="images-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                className="bg-slate-800 border-slate-600 text-slate-100"
                data-testid="input-images-files"
              />
              {files.length > 0 && (
                <p className="text-sm text-slate-400 mt-2">{files.length} images selected</p>
              )}
            </div>

            {files.length > 0 && (
              <>
                <div>
                  <Label className="text-slate-300">Layout Style</Label>
                  <Select value={layout} onValueChange={setLayout}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {Object.entries(layouts).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Canvas Size</Label>
                  <Select value={canvasSize} onValueChange={setCanvasSize}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {Object.entries(canvasSizes).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="spacing" className="text-slate-300">Spacing: {spacing}px</Label>
                  <Input
                    id="spacing"
                    type="range"
                    min="0"
                    max="50"
                    value={spacing}
                    onChange={(e) => setSpacing(Number(e.target.value))}
                    className="bg-slate-800 border-slate-600"
                    data-testid="input-spacing"
                  />
                </div>

                <div>
                  <Label htmlFor="bg-color" className="text-slate-300">Background Color</Label>
                  <Input
                    id="bg-color"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="bg-slate-800 border-slate-600 h-12"
                    data-testid="input-background-color"
                  />
                </div>

                <Button
                  onClick={downloadCollage}
                  disabled={processing}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  data-testid="button-download-collage"
                >
                  {processing ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-download mr-2"></i>
                      Download Collage
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

        <Card className="glassmorphism border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Preview</CardTitle>
            <CardDescription className="text-slate-400">
              See how your collage will look
            </CardDescription>
          </CardHeader>
          <CardContent>
            {files.length > 0 ? (
              <div className="text-center">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto border border-slate-600 rounded-lg"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <i className="fas fa-th text-4xl mb-4"></i>
                <p>Upload images to create your collage</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const howToSteps = [
    {
      title: 'Upload Images',
      description: 'Select multiple images (up to 9) for your collage'
    },
    {
      title: 'Choose Layout',
      description: 'Pick from grid, mosaic, or polaroid layouts'
    },
    {
      title: 'Customize Settings',
      description: 'Adjust canvas size, spacing, and background color'
    },
    {
      title: 'Download Collage',
      description: 'Save your beautiful photo collage'
    }
  ];

  const benefits = [
    'Multiple layout options',
    'Customizable spacing and colors',
    'Real-time preview',
    'High-resolution output',
    'Perfect for social media'
  ];

  const useCases = [
    'Creating social media posts',
    'Making photo albums',
    'Travel memories',
    'Event documentation',
    'Family photo displays'
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