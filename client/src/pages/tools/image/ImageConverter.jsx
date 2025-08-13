import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function ImageConverter() {
  const tool = getToolBySlug('image', 'convert');
  const [images, setImages] = useState([]);
  const [converting, setConverting] = useState(false);
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [quality, setQuality] = useState([90]);
  const [compressionLevel, setCompressionLevel] = useState([6]);
  const { toast } = useToast();

  const supportedFormats = {
    'jpeg': { name: 'JPEG', mimeType: 'image/jpeg', extension: 'jpg' },
    'png': { name: 'PNG', mimeType: 'image/png', extension: 'png' },
    'webp': { name: 'WebP', mimeType: 'image/webp', extension: 'webp' },
    'bmp': { name: 'BMP', mimeType: 'image/bmp', extension: 'bmp' },
    'gif': { name: 'GIF', mimeType: 'image/gif', extension: 'gif' }
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
      originalFormat: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      converted: false
    }));

    setImages(prev => [...prev, ...newImages]);
  }, [toast]);

  const removeImage = (id) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return filtered;
    });
  };

  const convertImage = async (imageData) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Handle transparency for JPEG
        if (outputFormat === 'jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        const outputMimeType = supportedFormats[outputFormat].mimeType;
        let qualityValue = 1;

        if (outputFormat === 'jpeg' || outputFormat === 'webp') {
          qualityValue = quality[0] / 100;
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image'));
            }
          },
          outputMimeType,
          qualityValue
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageData.url;
    });
  };

  const convertAllImages = async () => {
    if (images.length === 0) {
      toast({
        title: "No images selected",
        description: "Please add at least one image to convert.",
        variant: "destructive",
      });
      return;
    }

    setConverting(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const image of images) {
        try {
          const convertedBlob = await convertImage(image);
          const filename = image.name.replace(/\.[^/.]+$/, '') + '.' + supportedFormats[outputFormat].extension;
          saveAs(convertedBlob, filename);
          successCount++;
        } catch (error) {
          console.error(`Error converting ${image.name}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: "Conversion completed!",
          description: `Successfully converted ${successCount} image(s) to ${supportedFormats[outputFormat].name}${errorCount > 0 ? `. ${errorCount} failed.` : '.'}`,
        });
      }

      if (errorCount > 0 && successCount === 0) {
        toast({
          title: "Conversion failed",
          description: "Failed to convert all images. Please try again.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion failed",
        description: "An error occurred during conversion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConverting(false);
    }
  };

  const clearAllImages = () => {
    images.forEach(image => URL.revokeObjectURL(image.url));
    setImages([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFormatFromMimeType = (mimeType) => {
    switch (mimeType) {
      case 'image/jpeg': return 'JPEG';
      case 'image/png': return 'PNG';
      case 'image/webp': return 'WebP';
      case 'image/gif': return 'GIF';
      case 'image/bmp': return 'BMP';
      default: return 'Unknown';
    }
  };

  const toolContent = (
    <div className="space-y-8">
      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-exchange-alt text-green-400"></i>
            Upload Images
          </CardTitle>
          <CardDescription>
            Select multiple images to convert between different formats
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
                Supports JPEG, PNG, WebP, GIF, BMP, and other image formats
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Settings */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Conversion Settings</CardTitle>
            <CardDescription>
              Choose output format and quality settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger data-testid="select-output-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(supportedFormats).map(([key, format]) => (
                      <SelectItem key={key} value={key}>
                        {format.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(outputFormat === 'jpeg' || outputFormat === 'webp') && (
                <div>
                  <Label>Quality: {quality[0]}%</Label>
                  <Slider
                    value={quality}
                    onValueChange={setQuality}
                    max={100}
                    min={10}
                    step={5}
                    className="mt-2"
                    data-testid="slider-quality"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>Smaller size</span>
                    <span>Better quality</span>
                  </div>
                </div>
              )}

              {outputFormat === 'png' && (
                <div>
                  <Label>PNG Compression: {compressionLevel[0]}</Label>
                  <Slider
                    value={compressionLevel}
                    onValueChange={setCompressionLevel}
                    max={9}
                    min={0}
                    step={1}
                    className="mt-2"
                    data-testid="slider-compression"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>Faster</span>
                    <span>Smaller size</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Format Information</h4>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                {outputFormat === 'jpeg' && (
                  <p>JPEG: Best for photos. Smaller file sizes but no transparency support.</p>
                )}
                {outputFormat === 'png' && (
                  <p>PNG: Lossless compression with transparency support. Larger file sizes.</p>
                )}
                {outputFormat === 'webp' && (
                  <p>WebP: Modern format with excellent compression and quality. Supports transparency.</p>
                )}
                {outputFormat === 'gif' && (
                  <p>GIF: Supports animation and transparency. Limited to 256 colors.</p>
                )}
                {outputFormat === 'bmp' && (
                  <p>BMP: Uncompressed format. Very large file sizes but maximum quality.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Preview */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Images to Convert ({images.length})</span>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllImages}
                data-testid="button-clear-all"
              >
                <i className="fas fa-trash mr-2"></i>
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800"
                  data-testid={`image-item-${index}`}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{image.name}</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Format: {getFormatFromMimeType(image.originalFormat)} → {supportedFormats[outputFormat].name}</p>
                      <p>Size: {formatFileSize(image.size)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Status</div>
                      <div className="text-sm font-medium text-blue-600">
                        Ready
                      </div>
                    </div>
                    
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
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Convert Button */}
      {images.length > 0 && (
        <div className="flex justify-center gap-4">
          <Button
            onClick={convertAllImages}
            disabled={converting}
            size="lg"
            className="px-8"
            data-testid="button-convert-all"
          >
            {converting ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Converting...
              </>
            ) : (
              <>
                <i className="fas fa-exchange-alt mr-2"></i>
                Convert All to {supportedFormats[outputFormat].name}
              </>
            )}
          </Button>
        </div>
      )}

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How to Convert Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <h4 className="font-medium">Upload Images</h4>
                <p className="text-sm text-muted-foreground">Select one or more images from your device</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <div>
                <h4 className="font-medium">Choose Output Format</h4>
                <p className="text-sm text-muted-foreground">Select the desired format and adjust quality settings</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <div>
                <h4 className="font-medium">Review and Convert</h4>
                <p className="text-sm text-muted-foreground">Check your images and click convert to download the results</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">4</span>
              </div>
              <div>
                <h4 className="font-medium">Download Converted Images</h4>
                <p className="text-sm text-muted-foreground">Each converted image will be automatically downloaded</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Format Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Format Comparison Guide</CardTitle>
          <CardDescription>
            Choose the best format for your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-blue-600 mb-2">JPEG</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Best for photos</li>
                <li>• Small file sizes</li>
                <li>• No transparency</li>
                <li>• Lossy compression</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-green-600 mb-2">PNG</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Best for graphics</li>
                <li>• Transparency support</li>
                <li>• Larger file sizes</li>
                <li>• Lossless compression</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-purple-600 mb-2">WebP</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Modern format</li>
                <li>• Excellent compression</li>
                <li>• Transparency support</li>
                <li>• Smaller than PNG</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const howToSteps = [
    {
      title: 'Upload Images',
      description: 'Select one or multiple images in any format'
    },
    {
      title: 'Choose Format',
      description: 'Pick your desired output format (JPEG, PNG, WebP, etc.)'
    },
    {
      title: 'Adjust Quality',
      description: 'Set quality and compression settings for optimal results'
    },
    {
      title: 'Download Converted',
      description: 'Get your converted images automatically'
    }
  ];

  const benefits = [
    'Convert between all major image formats',
    'Batch processing for multiple images',
    'Quality control and optimization',
    'No format restrictions',
    'Instant conversion results'
  ];

  const useCases = [
    'Format compatibility for different platforms',
    'Optimizing images for web use',
    'Converting legacy formats to modern ones',
    'Preparing images for specific applications',
    'Batch converting photo collections'
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