import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';

export default function ImageWatermark() {
  const [images, setImages] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [watermarkType, setWatermarkType] = useState('text');
  
  // Text watermark settings
  const [watermarkText, setWatermarkText] = useState('© Your Name');
  const [fontSize, setFontSize] = useState([24]);
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState('Arial');
  
  // Image watermark settings
  const [watermarkImage, setWatermarkImage] = useState(null);
  const [imageScale, setImageScale] = useState([50]);
  
  // Common settings
  const [opacity, setOpacity] = useState([70]);
  const [position, setPosition] = useState('bottom-right');
  const [xOffset, setXOffset] = useState([20]);
  const [yOffset, setYOffset] = useState([20]);
  const [rotation, setRotation] = useState([0]);
  
  const canvasRef = useRef(null);
  const { toast } = useToast();

  const positions = {
    'top-left': { x: 0.1, y: 0.1 },
    'top-center': { x: 0.5, y: 0.1 },
    'top-right': { x: 0.9, y: 0.1 },
    'center-left': { x: 0.1, y: 0.5 },
    'center': { x: 0.5, y: 0.5 },
    'center-right': { x: 0.9, y: 0.5 },
    'bottom-left': { x: 0.1, y: 0.9 },
    'bottom-center': { x: 0.5, y: 0.9 },
    'bottom-right': { x: 0.9, y: 0.9 }
  };

  const handleImageUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    const validImages = files.filter(file => file.type.startsWith('image/'));

    if (validImages.length !== files.length) {
      toast({
        title: "Invalid files detected",
        description: "Only image files are allowed.",
        variant: "destructive",
      });
    }

    const newImages = validImages.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      watermarked: null,
      watermarkedBlob: null
    }));

    setImages(prev => [...prev, ...newImages]);
  }, [toast]);

  const handleWatermarkImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file for the watermark.",
        variant: "destructive",
      });
      return;
    }

    setWatermarkImage({
      file,
      url: URL.createObjectURL(file)
    });
  }, [toast]);

  const removeImage = (id) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
        if (imageToRemove.watermarked) {
          URL.revokeObjectURL(imageToRemove.watermarked);
        }
      }
      return filtered;
    });
  };

  const applyWatermark = async (imageData) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Calculate watermark position
        const pos = positions[position];
        const offsetX = xOffset[0];
        const offsetY = yOffset[0];

        ctx.save();
        ctx.globalAlpha = opacity[0] / 100;

        if (watermarkType === 'text') {
          // Apply text watermark
          const font = `${fontSize[0]}px ${fontFamily}`;
          ctx.font = font;
          ctx.fillStyle = textColor;
          ctx.textAlign = pos.x === 0.1 ? 'left' : pos.x === 0.9 ? 'right' : 'center';
          ctx.textBaseline = pos.y === 0.1 ? 'top' : pos.y === 0.9 ? 'bottom' : 'middle';

          // Calculate text position
          let textX = img.width * pos.x + (pos.x === 0.1 ? offsetX : pos.x === 0.9 ? -offsetX : 0);
          let textY = img.height * pos.y + (pos.y === 0.1 ? offsetY : pos.y === 0.9 ? -offsetY : 0);

          // Apply rotation if any
          if (rotation[0] !== 0) {
            ctx.translate(textX, textY);
            ctx.rotate((rotation[0] * Math.PI) / 180);
            textX = 0;
            textY = 0;
          }

          // Add text shadow for better visibility
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 2;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;

          ctx.fillText(watermarkText, textX, textY);

        } else if (watermarkType === 'image' && watermarkImage) {
          // Apply image watermark
          const watermarkImg = new Image();
          watermarkImg.onload = () => {
            const scale = imageScale[0] / 100;
            const watermarkWidth = watermarkImg.width * scale;
            const watermarkHeight = watermarkImg.height * scale;

            // Calculate position
            let watermarkX = img.width * pos.x - (pos.x === 0.9 ? watermarkWidth : pos.x === 0.5 ? watermarkWidth / 2 : 0) + (pos.x === 0.1 ? offsetX : pos.x === 0.9 ? -offsetX : 0);
            let watermarkY = img.height * pos.y - (pos.y === 0.9 ? watermarkHeight : pos.y === 0.5 ? watermarkHeight / 2 : 0) + (pos.y === 0.1 ? offsetY : pos.y === 0.9 ? -offsetY : 0);

            // Apply rotation if any
            if (rotation[0] !== 0) {
              ctx.translate(watermarkX + watermarkWidth / 2, watermarkY + watermarkHeight / 2);
              ctx.rotate((rotation[0] * Math.PI) / 180);
              watermarkX = -watermarkWidth / 2;
              watermarkY = -watermarkHeight / 2;
            }

            ctx.drawImage(watermarkImg, watermarkX, watermarkY, watermarkWidth, watermarkHeight);
            ctx.restore();

            canvas.toBlob((blob) => {
              resolve({
                blob,
                url: URL.createObjectURL(blob)
              });
            }, 'image/png');
          };
          watermarkImg.src = watermarkImage.url;
        } else {
          ctx.restore();
          canvas.toBlob((blob) => {
            resolve({
              blob,
              url: URL.createObjectURL(blob)
            });
          }, 'image/png');
        }

        if (watermarkType === 'text') {
          ctx.restore();
          canvas.toBlob((blob) => {
            resolve({
              blob,
              url: URL.createObjectURL(blob)
            });
          }, 'image/png');
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageData.url;
    });
  };

  const processAllImages = async () => {
    if (images.length === 0) {
      toast({
        title: "No images selected",
        description: "Please add at least one image to watermark.",
        variant: "destructive",
      });
      return;
    }

    if (watermarkType === 'text' && !watermarkText.trim()) {
      toast({
        title: "No watermark text",
        description: "Please enter text for the watermark.",
        variant: "destructive",
      });
      return;
    }

    if (watermarkType === 'image' && !watermarkImage) {
      toast({
        title: "No watermark image",
        description: "Please select an image for the watermark.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const processedImages = [];

      for (const image of images) {
        try {
          const watermarked = await applyWatermark(image);
          processedImages.push({
            ...image,
            watermarked: watermarked.url,
            watermarkedBlob: watermarked.blob
          });
        } catch (error) {
          console.error(`Error watermarking ${image.name}:`, error);
          processedImages.push(image);
        }
      }

      setImages(processedImages);

      const successCount = processedImages.filter(img => img.watermarked).length;
      toast({
        title: "Watermarking completed!",
        description: `Successfully watermarked ${successCount} out of ${images.length} image(s).`,
      });

    } catch (error) {
      console.error('Watermarking error:', error);
      toast({
        title: "Watermarking failed",
        description: "An error occurred during watermarking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const downloadImage = (image) => {
    if (!image.watermarkedBlob) return;

    const filename = image.name.replace(/\.[^/.]+$/, '_watermarked.png');
    saveAs(image.watermarkedBlob, filename);

    toast({
      title: "Download started",
      description: `Downloading ${filename}`,
    });
  };

  const downloadAllWatermarked = async () => {
    const watermarkedImages = images.filter(img => img.watermarkedBlob);
    
    if (watermarkedImages.length === 0) {
      toast({
        title: "No watermarked images",
        description: "Please apply watermarks first before downloading.",
        variant: "destructive",
      });
      return;
    }

    for (const image of watermarkedImages) {
      downloadImage(image);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const clearAllImages = () => {
    images.forEach(image => {
      URL.revokeObjectURL(image.url);
      if (image.watermarked) {
        URL.revokeObjectURL(image.watermarked);
      }
    });
    setImages([]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-stamp text-green-400"></i>
            Upload Images
          </CardTitle>
          <CardDescription>
            Select multiple images to add watermarks for copyright protection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-upload">Choose Images</Label>
              <Input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1"
                data-testid="input-image-upload"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Supports JPEG, PNG, WebP, and other image formats
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Watermark Settings */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Watermark Settings</CardTitle>
            <CardDescription>
              Configure your watermark appearance and positioning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={watermarkType} onValueChange={setWatermarkType} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text" data-testid="tab-text">Text Watermark</TabsTrigger>
                <TabsTrigger value="image" data-testid="tab-image">Image Watermark</TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-6">
                <div>
                  <Label htmlFor="watermark-text">Watermark Text</Label>
                  <Textarea
                    id="watermark-text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="Enter watermark text"
                    className="mt-1"
                    rows={2}
                    data-testid="textarea-watermark-text"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger data-testid="select-font-family">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Verdana">Verdana</SelectItem>
                        <SelectItem value="Impact">Impact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="text-color">Text Color</Label>
                    <Input
                      id="text-color"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="mt-1 h-10"
                      data-testid="input-text-color"
                    />
                  </div>
                </div>

                <div>
                  <Label>Font Size: {fontSize[0]}px</Label>
                  <Slider
                    value={fontSize}
                    onValueChange={setFontSize}
                    max={100}
                    min={8}
                    step={2}
                    className="mt-2"
                    data-testid="slider-font-size"
                  />
                </div>
              </TabsContent>

              <TabsContent value="image" className="space-y-6">
                <div>
                  <Label htmlFor="watermark-image">Watermark Image</Label>
                  <Input
                    id="watermark-image"
                    type="file"
                    accept="image/*"
                    onChange={handleWatermarkImageUpload}
                    className="mt-1"
                    data-testid="input-watermark-image"
                  />
                  {watermarkImage && (
                    <div className="mt-2">
                      <img
                        src={watermarkImage.url}
                        alt="Watermark preview"
                        className="max-w-32 max-h-32 object-contain border rounded"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label>Image Scale: {imageScale[0]}%</Label>
                  <Slider
                    value={imageScale}
                    onValueChange={setImageScale}
                    max={100}
                    min={5}
                    step={5}
                    className="mt-2"
                    data-testid="slider-image-scale"
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Common Settings */}
            <div className="space-y-6 border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Position</Label>
                  <Select value={position} onValueChange={setPosition}>
                    <SelectTrigger data-testid="select-position">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top-left">Top Left</SelectItem>
                      <SelectItem value="top-center">Top Center</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="center-left">Center Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="center-right">Center Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="bottom-center">Bottom Center</SelectItem>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Opacity: {opacity[0]}%</Label>
                  <Slider
                    value={opacity}
                    onValueChange={setOpacity}
                    max={100}
                    min={10}
                    step={5}
                    className="mt-2"
                    data-testid="slider-opacity"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>X Offset: {xOffset[0]}px</Label>
                  <Slider
                    value={xOffset}
                    onValueChange={setXOffset}
                    max={100}
                    min={0}
                    step={5}
                    className="mt-2"
                    data-testid="slider-x-offset"
                  />
                </div>

                <div>
                  <Label>Y Offset: {yOffset[0]}px</Label>
                  <Slider
                    value={yOffset}
                    onValueChange={setYOffset}
                    max={100}
                    min={0}
                    step={5}
                    className="mt-2"
                    data-testid="slider-y-offset"
                  />
                </div>

                <div>
                  <Label>Rotation: {rotation[0]}°</Label>
                  <Slider
                    value={rotation}
                    onValueChange={setRotation}
                    max={360}
                    min={0}
                    step={15}
                    className="mt-2"
                    data-testid="slider-rotation"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Images List */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Images ({images.length})</span>
              <div className="flex gap-2">
                {images.some(img => img.watermarkedBlob) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadAllWatermarked}
                    data-testid="button-download-all"
                  >
                    <i className="fas fa-download mr-2"></i>
                    Download All
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllImages}
                  data-testid="button-clear-all"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Clear All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800"
                  data-testid={`image-item-${index}`}
                >
                  <div className="grid grid-cols-2 gap-2 p-4">
                    <div>
                      <h5 className="text-xs font-medium mb-2">Original</h5>
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded border"
                      />
                    </div>
                    <div>
                      <h5 className="text-xs font-medium mb-2">Watermarked</h5>
                      {image.watermarked ? (
                        <img
                          src={image.watermarked}
                          alt={`${image.name} watermarked`}
                          className="w-full h-24 object-cover rounded border"
                        />
                      ) : (
                        <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded border flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Not processed</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 border-t">
                    <h4 className="font-medium truncate text-sm mb-2">{image.name}</h4>
                    <div className="flex gap-2">
                      {image.watermarkedBlob && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadImage(image)}
                          className="flex-1"
                          data-testid={`button-download-${index}`}
                        >
                          <i className="fas fa-download mr-1"></i>
                          Download
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeImage(image.id)}
                        data-testid={`button-remove-${index}`}
                      >
                        <i className="fas fa-times"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Process Button */}
      {images.length > 0 && (
        <div className="flex justify-center">
          <Button
            onClick={processAllImages}
            disabled={processing || (watermarkType === 'text' && !watermarkText.trim()) || (watermarkType === 'image' && !watermarkImage)}
            size="lg"
            className="px-8"
            data-testid="button-apply-watermarks"
          >
            {processing ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Adding Watermarks...
              </>
            ) : (
              <>
                <i className="fas fa-stamp mr-2"></i>
                Apply Watermarks to All Images
              </>
            )}
          </Button>
        </div>
      )}

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How to Add Image Watermarks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <h4 className="font-medium">Upload Images</h4>
                <p className="text-sm text-muted-foreground">Select multiple images you want to protect with watermarks</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <div>
                <h4 className="font-medium">Choose Watermark Type</h4>
                <p className="text-sm text-muted-foreground">Select between text watermark or image/logo watermark</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <div>
                <h4 className="font-medium">Customize Appearance</h4>
                <p className="text-sm text-muted-foreground">Adjust position, opacity, size, and other visual settings</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">4</span>
              </div>
              <div>
                <h4 className="font-medium">Download Protected Images</h4>
                <p className="text-sm text-muted-foreground">Get your watermarked images with copyright protection</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}