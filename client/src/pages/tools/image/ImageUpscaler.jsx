import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';

export default function ImageUpscaler() {
  const [image, setImage] = useState(null);
  const [upscaling, setUpscaling] = useState(false);
  const [upscaledImage, setUpscaledImage] = useState(null);
  const [scaleFactor, setScaleFactor] = useState('2');
  const [algorithm, setAlgorithm] = useState('bicubic');
  const [imageInfo, setImageInfo] = useState(null);
  const { toast } = useToast();

  const upscaleAlgorithms = {
    'nearest': {
      name: 'Nearest Neighbor',
      description: 'Fast but pixelated, good for pixel art'
    },
    'bilinear': {
      name: 'Bilinear',
      description: 'Smooth but can be blurry'
    },
    'bicubic': {
      name: 'Bicubic',
      description: 'High quality, preserves details well'
    },
    'lanczos': {
      name: 'Lanczos',
      description: 'Sharp details, best for photos'
    }
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

    // Check file size (limit to 10MB for performance)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Check if image is too large to upscale
        const scale = parseInt(scaleFactor);
        const newWidth = img.width * scale;
        const newHeight = img.height * scale;
        
        if (newWidth > 8192 || newHeight > 8192) {
          toast({
            title: "Image too large to upscale",
            description: `Upscaling would result in ${newWidth}x${newHeight} pixels. Please use a smaller scale factor or smaller image.`,
            variant: "destructive",
          });
          return;
        }

        setImage({
          file,
          url: e.target.result,
          width: img.width,
          height: img.height
        });

        setImageInfo({
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2),
          dimensions: `${img.width} × ${img.height}`,
          format: file.type.split('/')[1].toUpperCase()
        });

        setUpscaledImage(null);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [scaleFactor, toast]);

  const upscaleImage = async () => {
    if (!image) return;

    setUpscaling(true);
    try {
      const scale = parseInt(scaleFactor);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set up canvas with new dimensions
      canvas.width = image.width * scale;
      canvas.height = image.height * scale;

      // Configure image smoothing based on algorithm
      switch (algorithm) {
        case 'nearest':
          ctx.imageSmoothingEnabled = false;
          break;
        case 'bilinear':
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'low';
          break;
        case 'bicubic':
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'medium';
          break;
        case 'lanczos':
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          break;
        default:
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
      }

      // Load and draw the image
      const img = new Image();
      img.onload = () => {
        // For better quality with some algorithms, use multi-step upscaling
        if (algorithm === 'lanczos' || algorithm === 'bicubic') {
          performMultiStepUpscale(ctx, img, scale);
        } else {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        // Convert to blob
        canvas.toBlob((blob) => {
          const upscaledUrl = URL.createObjectURL(blob);
          setUpscaledImage({
            blob,
            url: upscaledUrl,
            width: canvas.width,
            height: canvas.height,
            size: blob.size
          });

          toast({
            title: "Image upscaled successfully!",
            description: `Upscaled to ${canvas.width} × ${canvas.height} pixels using ${upscaleAlgorithms[algorithm].name}.`,
          });

          setUpscaling(false);
        }, 'image/png');
      };

      img.src = image.url;
    } catch (error) {
      console.error('Upscaling error:', error);
      toast({
        title: "Upscaling failed",
        description: "An error occurred while upscaling the image. Please try again.",
        variant: "destructive",
      });
      setUpscaling(false);
    }
  };

  const performMultiStepUpscale = (ctx, img, targetScale) => {
    // For large scale factors, perform multi-step upscaling for better quality
    let currentScale = 1;
    let tempCanvas = document.createElement('canvas');
    let tempCtx = tempCanvas.getContext('2d');
    
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    tempCtx.drawImage(img, 0, 0);

    while (currentScale < targetScale) {
      const stepScale = Math.min(2, targetScale / currentScale);
      const newWidth = tempCanvas.width * stepScale;
      const newHeight = tempCanvas.height * stepScale;

      const nextCanvas = document.createElement('canvas');
      const nextCtx = nextCanvas.getContext('2d');
      nextCanvas.width = newWidth;
      nextCanvas.height = newHeight;

      nextCtx.imageSmoothingEnabled = true;
      nextCtx.imageSmoothingQuality = 'high';
      nextCtx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);

      tempCanvas = nextCanvas;
      tempCtx = nextCtx;
      currentScale *= stepScale;
    }

    // Draw final result to main canvas
    ctx.drawImage(tempCanvas, 0, 0);
  };

  const downloadUpscaledImage = () => {
    if (!upscaledImage) return;

    const filename = image.file.name.replace(/\.[^/.]+$/, `_upscaled_${scaleFactor}x.png`);
    saveAs(upscaledImage.blob, filename);

    toast({
      title: "Download started",
      description: `Downloading ${filename}`,
    });
  };

  const resetUpscaling = () => {
    if (upscaledImage) {
      URL.revokeObjectURL(upscaledImage.url);
    }
    setUpscaledImage(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getEstimatedSize = () => {
    if (!image) return null;
    const scale = parseInt(scaleFactor);
    const newPixels = image.width * scale * image.height * scale;
    const estimatedBytes = newPixels * 4; // RGBA
    return formatFileSize(estimatedBytes);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-search-plus text-green-400"></i>
            Upload Image
          </CardTitle>
          <CardDescription>
            Select an image to upscale using AI-powered algorithms
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
              <p className="text-sm text-muted-foreground mt-1">
                Supports JPEG, PNG, WebP. Max file size: 10MB
              </p>
            </div>
            
            <Alert>
              <i className="fas fa-info-circle h-4 w-4"></i>
              <AlertDescription>
                Image upscaling increases resolution while trying to preserve quality. Results work best with clear, high-contrast images.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Image Information */}
      {imageInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Image Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm font-medium">Filename</div>
                <div className="text-sm text-muted-foreground">{imageInfo.name}</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Size</div>
                <div className="text-sm text-muted-foreground">{imageInfo.size} MB</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Dimensions</div>
                <div className="text-sm text-muted-foreground">{imageInfo.dimensions}</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Format</div>
                <div className="text-sm text-muted-foreground">{imageInfo.format}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upscaling Settings */}
      {image && (
        <Card>
          <CardHeader>
            <CardTitle>Upscaling Settings</CardTitle>
            <CardDescription>
              Configure upscaling parameters for optimal results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Scale Factor</Label>
                <Select value={scaleFactor} onValueChange={(value) => {
                  setScaleFactor(value);
                  resetUpscaling();
                }}>
                  <SelectTrigger data-testid="select-scale-factor">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2x (Double size)</SelectItem>
                    <SelectItem value="3">3x (Triple size)</SelectItem>
                    <SelectItem value="4">4x (Quadruple size)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Upscaling Algorithm</Label>
                <Select value={algorithm} onValueChange={(value) => {
                  setAlgorithm(value);
                  resetUpscaling();
                }}>
                  <SelectTrigger data-testid="select-algorithm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(upscaleAlgorithms).map(([key, algo]) => (
                      <SelectItem key={key} value={key}>
                        {algo.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  {upscaleAlgorithms[algorithm].description}
                </p>
              </div>
            </div>

            {/* Preview Information */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Upscaling Preview</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Original:</span>
                  <div className="text-blue-800 dark:text-blue-200">
                    {image.width} × {image.height}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Upscaled:</span>
                  <div className="text-blue-800 dark:text-blue-200">
                    {image.width * parseInt(scaleFactor)} × {image.height * parseInt(scaleFactor)}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Estimated Size:</span>
                  <div className="text-blue-800 dark:text-blue-200">
                    {getEstimatedSize()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Comparison */}
      {image && (
        <Card>
          <CardHeader>
            <CardTitle>Image Comparison</CardTitle>
            <CardDescription>
              Compare original and upscaled images side by side
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Original Image</h4>
                <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                  <img
                    src={image.url}
                    alt="Original"
                    className="w-full h-64 object-contain"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1 text-center">
                  {image.width} × {image.height} pixels
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Upscaled Image</h4>
                <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                  {upscaledImage ? (
                    <img
                      src={upscaledImage.url}
                      alt="Upscaled"
                      className="w-full h-64 object-contain"
                    />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center text-muted-foreground">
                      {upscaling ? (
                        <div className="flex flex-col items-center gap-2">
                          <i className="fas fa-spinner fa-spin text-2xl"></i>
                          <span>Upscaling image...</span>
                        </div>
                      ) : (
                        <span>Click "Upscale Image" to see result</span>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 text-center">
                  {upscaledImage ? (
                    <>
                      {upscaledImage.width} × {upscaledImage.height} pixels
                      <br />
                      {formatFileSize(upscaledImage.size)}
                    </>
                  ) : (
                    `${image.width * parseInt(scaleFactor)} × ${image.height * parseInt(scaleFactor)} pixels (estimated)`
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {image && (
        <div className="flex justify-center gap-4">
          <Button
            onClick={upscaleImage}
            disabled={upscaling}
            size="lg"
            className="px-8"
            data-testid="button-upscale"
          >
            {upscaling ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Upscaling...
              </>
            ) : (
              <>
                <i className="fas fa-search-plus mr-2"></i>
                Upscale Image ({scaleFactor}x)
              </>
            )}
          </Button>

          {upscaledImage && (
            <Button
              onClick={downloadUpscaledImage}
              variant="outline"
              size="lg"
              className="px-8"
              data-testid="button-download"
            >
              <i className="fas fa-download mr-2"></i>
              Download Upscaled Image
            </Button>
          )}
        </div>
      )}

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Image Upscaling Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <h4 className="font-medium">Upload Image</h4>
                <p className="text-sm text-muted-foreground">Select a clear, high-quality image for best upscaling results</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <div>
                <h4 className="font-medium">Choose Settings</h4>
                <p className="text-sm text-muted-foreground">Select scale factor and algorithm based on your image type</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <div>
                <h4 className="font-medium">Upscale Image</h4>
                <p className="text-sm text-muted-foreground">Advanced algorithms increase resolution while preserving details</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">4</span>
              </div>
              <div>
                <h4 className="font-medium">Download Result</h4>
                <p className="text-sm text-muted-foreground">Get your high-resolution image with improved quality</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Algorithm Comparison</CardTitle>
          <CardDescription>
            Choose the best algorithm for your image type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(upscaleAlgorithms).map(([key, algo]) => (
              <div key={key} className="p-4 border rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-2">{algo.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{algo.description}</p>
                <div className="text-xs text-muted-foreground">
                  {key === 'nearest' && 'Best for: Pixel art, retro graphics'}
                  {key === 'bilinear' && 'Best for: Simple graphics, fast processing'}
                  {key === 'bicubic' && 'Best for: General purpose, balanced quality'}
                  {key === 'lanczos' && 'Best for: Photos, detailed images'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}