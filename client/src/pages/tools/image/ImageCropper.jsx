import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';

export default function ImageCropper() {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropping, setCropping] = useState(false);
  const [cropMode, setCropMode] = useState('freeform');
  
  // Crop area state
  const [cropArea, setCropArea] = useState({
    x: 0,
    y: 0,
    width: 200,
    height: 200
  });
  
  // Aspect ratio presets
  const [aspectRatio, setAspectRatio] = useState('custom');
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const { toast } = useToast();

  const aspectRatios = {
    'custom': { name: 'Custom', ratio: null },
    '1:1': { name: 'Square (1:1)', ratio: 1 },
    '4:3': { name: 'Standard (4:3)', ratio: 4/3 },
    '16:9': { name: 'Widescreen (16:9)', ratio: 16/9 },
    '3:2': { name: 'Photo (3:2)', ratio: 3/2 },
    '5:4': { name: 'Print (5:4)', ratio: 5/4 },
    '9:16': { name: 'Portrait (9:16)', ratio: 9/16 },
    '2:3': { name: 'Portrait Photo (2:3)', ratio: 2/3 }
  };

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage({
          file,
          url: e.target.result,
          naturalWidth: img.width,
          naturalHeight: img.height
        });
        
        // Reset crop area when new image is loaded
        const initialSize = Math.min(img.width, img.height, 200);
        setCropArea({
          x: (img.width - initialSize) / 2,
          y: (img.height - initialSize) / 2,
          width: initialSize,
          height: initialSize
        });
        
        setImageLoaded(true);
        setCroppedImage(null);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const updateCropArea = (newCropArea) => {
    if (!image) return;
    
    // Ensure crop area stays within image bounds
    const boundedArea = {
      x: Math.max(0, Math.min(newCropArea.x, image.naturalWidth - newCropArea.width)),
      y: Math.max(0, Math.min(newCropArea.y, image.naturalHeight - newCropArea.height)),
      width: Math.max(10, Math.min(newCropArea.width, image.naturalWidth - newCropArea.x)),
      height: Math.max(10, Math.min(newCropArea.height, image.naturalHeight - newCropArea.y))
    };
    
    setCropArea(boundedArea);
  };

  const handleAspectRatioChange = (ratio) => {
    setAspectRatio(ratio);
    
    if (ratio !== 'custom' && aspectRatios[ratio].ratio) {
      const targetRatio = aspectRatios[ratio].ratio;
      const currentArea = { ...cropArea };
      
      // Adjust height based on width and aspect ratio
      const newHeight = currentArea.width / targetRatio;
      
      if (newHeight <= image.naturalHeight - currentArea.y) {
        updateCropArea({ ...currentArea, height: newHeight });
      } else {
        // Adjust width based on available height
        const maxHeight = image.naturalHeight - currentArea.y;
        const newWidth = maxHeight * targetRatio;
        updateCropArea({ ...currentArea, width: newWidth, height: maxHeight });
      }
    }
  };

  const handleCustomDimensions = () => {
    const width = parseInt(customWidth);
    const height = parseInt(customHeight);
    
    if (width > 0 && height > 0) {
      const maxWidth = Math.min(width, image.naturalWidth);
      const maxHeight = Math.min(height, image.naturalHeight);
      
      updateCropArea({
        x: Math.max(0, (image.naturalWidth - maxWidth) / 2),
        y: Math.max(0, (image.naturalHeight - maxHeight) / 2),
        width: maxWidth,
        height: maxHeight
      });
    }
  };

  const performCrop = async () => {
    if (!image || !imageLoaded) return;

    setCropping(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;
      
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(
          img,
          cropArea.x,
          cropArea.y,
          cropArea.width,
          cropArea.height,
          0,
          0,
          cropArea.width,
          cropArea.height
        );
        
        canvas.toBlob((blob) => {
          const croppedUrl = URL.createObjectURL(blob);
          setCroppedImage({
            blob,
            url: croppedUrl,
            width: cropArea.width,
            height: cropArea.height
          });
          
          toast({
            title: "Image cropped successfully!",
            description: `Cropped to ${cropArea.width} × ${cropArea.height} pixels.`,
          });
          
          setCropping(false);
        }, 'image/png');
      };
      
      img.src = image.url;
    } catch (error) {
      console.error('Cropping error:', error);
      toast({
        title: "Cropping failed",
        description: "An error occurred while cropping the image.",
        variant: "destructive",
      });
      setCropping(false);
    }
  };

  const downloadCroppedImage = () => {
    if (croppedImage) {
      const filename = image.file.name.replace(/\.[^/.]+$/, '_cropped.png');
      saveAs(croppedImage.blob, filename);
      
      toast({
        title: "Download started",
        description: `Downloading ${filename}`,
      });
    }
  };

  const resetCrop = () => {
    if (image) {
      const initialSize = Math.min(image.naturalWidth, image.naturalHeight, 200);
      setCropArea({
        x: (image.naturalWidth - initialSize) / 2,
        y: (image.naturalHeight - initialSize) / 2,
        width: initialSize,
        height: initialSize
      });
      setCroppedImage(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-crop text-green-400"></i>
            Upload Image
          </CardTitle>
          <CardDescription>
            Select an image to crop with precision tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-upload">Choose Image</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1"
                data-testid="input-image-upload"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crop Settings */}
      {image && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Preview and Crop Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Crop Preview</CardTitle>
                <CardDescription>
                  Adjust the crop area by modifying the values or dragging the selection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative inline-block max-w-full overflow-auto border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="relative">
                    <img
                      ref={imageRef}
                      src={image.url}
                      alt="Original"
                      className="max-w-full h-auto"
                      style={{ maxHeight: '500px' }}
                    />
                    
                    {/* Crop overlay */}
                    <div
                      className="absolute border-2 border-blue-500 bg-blue-500/20"
                      style={{
                        left: `${(cropArea.x / image.naturalWidth) * 100}%`,
                        top: `${(cropArea.y / image.naturalHeight) * 100}%`,
                        width: `${(cropArea.width / image.naturalWidth) * 100}%`,
                        height: `${(cropArea.height / image.naturalHeight) * 100}%`,
                      }}
                    >
                      <div className="absolute inset-0 border border-white border-dashed"></div>
                      {/* Corner handles */}
                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize"></div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize"></div>
                      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize"></div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize"></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Original: {image.naturalWidth} × {image.naturalHeight} pixels</p>
                  <p>Crop Area: {Math.round(cropArea.width)} × {Math.round(cropArea.height)} pixels</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Crop Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Crop Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs value={cropMode} onValueChange={setCropMode}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="freeform" data-testid="tab-freeform">Freeform</TabsTrigger>
                    <TabsTrigger value="aspect" data-testid="tab-aspect">Aspect Ratio</TabsTrigger>
                  </TabsList>

                  <TabsContent value="aspect" className="space-y-4">
                    <div>
                      <Label>Aspect Ratio</Label>
                      <Select value={aspectRatio} onValueChange={handleAspectRatioChange}>
                        <SelectTrigger data-testid="select-aspect-ratio">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(aspectRatios).map(([key, ratio]) => (
                            <SelectItem key={key} value={key}>
                              {ratio.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="freeform" className="space-y-4">
                    <div>
                      <Label>Custom Dimensions</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <Input
                            placeholder="Width"
                            value={customWidth}
                            onChange={(e) => setCustomWidth(e.target.value)}
                            type="number"
                            data-testid="input-custom-width"
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Height"
                            value={customHeight}
                            onChange={(e) => setCustomHeight(e.target.value)}
                            type="number"
                            data-testid="input-custom-height"
                          />
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCustomDimensions}
                        className="mt-2 w-full"
                        data-testid="button-apply-dimensions"
                      >
                        Apply Dimensions
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Precise Crop Controls */}
                <div className="space-y-4 border-t pt-4">
                  <Label>Precise Position</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">X Position</Label>
                      <Input
                        type="number"
                        value={Math.round(cropArea.x)}
                        onChange={(e) => updateCropArea({ ...cropArea, x: parseInt(e.target.value) || 0 })}
                        data-testid="input-crop-x"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Y Position</Label>
                      <Input
                        type="number"
                        value={Math.round(cropArea.y)}
                        onChange={(e) => updateCropArea({ ...cropArea, y: parseInt(e.target.value) || 0 })}
                        data-testid="input-crop-y"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Width</Label>
                      <Input
                        type="number"
                        value={Math.round(cropArea.width)}
                        onChange={(e) => updateCropArea({ ...cropArea, width: parseInt(e.target.value) || 1 })}
                        data-testid="input-crop-width"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Height</Label>
                      <Input
                        type="number"
                        value={Math.round(cropArea.height)}
                        onChange={(e) => updateCropArea({ ...cropArea, height: parseInt(e.target.value) || 1 })}
                        data-testid="input-crop-height"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 border-t pt-4">
                  <Button
                    onClick={performCrop}
                    disabled={cropping}
                    className="w-full"
                    data-testid="button-crop"
                  >
                    {cropping ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Cropping...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-crop mr-2"></i>
                        Crop Image
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={resetCrop}
                    className="w-full"
                    data-testid="button-reset"
                  >
                    <i className="fas fa-undo mr-2"></i>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Cropped Result */}
      {croppedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Cropped Result</CardTitle>
            <CardDescription>
              Preview and download your cropped image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <img
                  src={croppedImage.url}
                  alt="Cropped"
                  className="max-w-full h-auto"
                  style={{ maxHeight: '300px' }}
                />
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Dimensions: {croppedImage.width} × {croppedImage.height} pixels
                </p>
                
                <Button
                  onClick={downloadCroppedImage}
                  size="lg"
                  data-testid="button-download"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download Cropped Image
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How to Crop Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <h4 className="font-medium">Upload Image</h4>
                <p className="text-sm text-muted-foreground">Select an image file from your device</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <div>
                <h4 className="font-medium">Adjust Crop Area</h4>
                <p className="text-sm text-muted-foreground">Use freeform cropping or select an aspect ratio</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <div>
                <h4 className="font-medium">Fine-tune Position</h4>
                <p className="text-sm text-muted-foreground">Use precise controls for exact positioning and sizing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">4</span>
              </div>
              <div>
                <h4 className="font-medium">Download Result</h4>
                <p className="text-sm text-muted-foreground">Crop and download your perfectly sized image</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}